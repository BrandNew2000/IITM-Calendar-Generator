// All hail the ChatGPT code. We tortured it until it provided functioning code.


const CLIENT_ID = "845664180848-d8gkb8lfbmkol12ccpg6imt66darmcsj.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/calendar";
// -------------------------------
// CONFIG
// -------------------------------
let gapiReady = false;
let token = null;
/* ===========================================
   MAIN ENTRY
=========================================== */

async function importICS(icsText) {
    try{
      await loadGapi();
      await authenticate();

      const events = parseICS(icsText);

      const calendarId = await createCalendar("Time Table");

      await insertEvents(calendarId, events);
      return true
    } 
    catch(err) {
      console.error(err);
      return false
    }
}

/* ===========================================
   GOOGLE API INIT
=========================================== */

function loadGapi() {
  return new Promise((resolve) => {
    gapi.load("client", async () => {
      await gapi.client.init({
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
        ]
      });
      resolve();
    });
  });
}

/* ===========================================
   AUTH
=========================================== */

async function authenticate() {
    return new Promise((resolve, reject) => {
        const client = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (resp) => {
                if (resp.error) return reject(resp);
                gapi.client.setToken({ access_token: resp.access_token });
                resolve();
            }
        });

        client.requestAccessToken();
    });
}

/* ===========================================
   CREATE CALENDAR
=========================================== */

async function createCalendar(name) {
    const res = await gapi.client.calendar.calendars.insert({
        summary: name
    });
    return res.result.id;
}

// /* ===========================================
//    INSERT EVENTS
// =========================================== */

// async function insertEvents(calendarId, events) {
//     for (const ev of events) {
//         await gapi.client.calendar.events.insert({
//             calendarId,
//             resource: ev
//         });
//     }
// }

/* ===========================================
   INSERT EVENTS (BATCHED + CHUNKED)
=========================================== */

function slimEvent(ev) {
    return {
        summary: ev.summary,
        start: ev.start,
        end: ev.end,
        location: ev.location,
        description: ev.description,
        recurrence: ev.recurrence
    };
}

async function insertEvents(calendarId, events) {
    const BATCH_SIZE = 800;

    // Sort for better backend performance
    events.sort((a, b) =>
        new Date(a.start.dateTime || a.start.date) -
        new Date(b.start.dateTime || b.start.date)
    );

    for (let i = 0; i < events.length; i += BATCH_SIZE) {
        const batch = gapi.client.newBatch();
        const chunk = events.slice(i, i + BATCH_SIZE);

        chunk.forEach((ev, idx) => {
            batch.add(
                gapi.client.calendar.events.insert({
                    calendarId,
                    resource: slimEvent(ev),
                    sendUpdates: "none",
                    supportsAttachments: false
                }),
                { id: `event-${i + idx}` }
            );
        });

        await batch;
    }
}


/* ===========================================
   ICS PARSER
=========================================== */

function parseICS(icsText) {
  const events = [];
  const blocks = icsText.split("BEGIN:VEVENT").slice(1);

  for (let block of blocks) {
    const lines = unfoldLines(block.split(/\r?\n/));

    let summary = "";
    let dtStart = null;
    let dtEnd = null;
    let tzStart = null;
    let tzEnd = null;
    let location = "";
    let rrule = null;
    let exdates = [];

    for (const line of lines) {
      
      // SUMMARY
      if (line.startsWith("SUMMARY:"))
        summary = line.substring(8).trim();

      // LOCATION
      if (line.startsWith("LOCATION:"))
        location = line.substring(9).trim();

      // DTSTART (with or without TZID)
      if (line.startsWith("DTSTART")) {
        const { time, tz } = parseICSTimestamp(line);
        dtStart = time;
        tzStart = tz;
      }

      // DTEND
      if (line.startsWith("DTEND")) {
        const { time, tz } = parseICSTimestamp(line);
        dtEnd = time;
        tzEnd = tz;
      }

      // RRULE
      if (line.startsWith("RRULE:"))
        rrule = line.trim();

      // EXDATE
      if (line.startsWith("EXDATE")) {
        const { time } = parseICSTimestamp(line);
        exdates.push(convertToGoogleDate(time));
      }
    }

    /* ===============================
       BUILD EVENT FOR GOOGLE API
    =============================== */

    const event = {
      summary,
      location,
      start: buildGoogleTime(dtStart, tzStart),
      end:   buildGoogleTime(dtEnd, tzEnd)
    };

    // Recurrence
    if (rrule || exdates.length > 0) {
      event.recurrence = [];
      if (rrule) event.recurrence.push(rrule);

      for (const ex of exdates) {
        event.recurrence.push("EXDATE:" + ex);
      }
    }

    events.push(event);
  }

  return events;
}

/* ===========================================
   HELPERS
=========================================== */

function unfoldLines(lines) {
  const out = [];
  for (let l of lines) {
    if (l.startsWith(" ")) out[out.length - 1] += l.slice(1);
    else out.push(l);
  }
  return out;
}

function parseICSTimestamp(line) {
  // Examples:
  // DTSTART:20250101T120000Z
  // DTSTART;TZID=Asia/Kolkata:20250101T120000
  // DTSTART;VALUE=DATE:20250101

  let tz = null;

  if (line.includes("TZID=")) {
    tz = line.match(/TZID=([^:;]+)/)[1];
  }

  const raw = line.split(":")[1].trim();

  const isDateOnly = raw.length === 8; // YYYYMMDD
  if (isDateOnly) {
    return { time: raw, tz };
  }

  return { time: raw, tz };
}
/* ======================================================
   FULLY SAFE ICS TIME PARSER (never returns invalid date)
====================================================== */

function buildGoogleTime(raw, tz) {
  if (!raw) return null;

  // All-day event (YYYYMMDD)
  if (/^\d{8}$/.test(raw)) {
    const y = raw.slice(0, 4);
    const m = raw.slice(4, 6);
    const d = raw.slice(6, 8);
    return { date: `${y}-${m}-${d}` };
  }

  // Try converting datetime
  const iso = convertToISO(raw, tz);
  if (!iso) {
    console.error("Invalid ICS date:", raw);
    throw new RangeError("Invalid datetime in ICS: " + raw);
  }

  return {
    dateTime: iso,
    timeZone: tz || "UTC"
  };
}

function convertToISO(raw, tz) {
  /*
      Acceptable variants:
      - 20250101T130000Z
      - 20250101T130000
      - 20250101T130000+0530 (rare)
  */

  let work = raw.trim();

  // If ends with timezone offset like +0530, trust it
  if (/^.*T\d{6}([+-]\d{2}\d{2})$/.test(work)) {
    const dt = Date.parse(
      work.replace(
        /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})([+-]\d{4})$/,
        "$1-$2-$3T$4:$5:$6$7"
      )
    );
    return !isNaN(dt) ? new Date(dt).toISOString() : null;
  }

  // No Z and no offset → assume floating time → assign given TZ or UTC
  if (!/Z$/.test(work)) work += "Z";

  const parsed = Date.parse(
    work.replace(
      /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
      "$1-$2-$3T$4:$5:$6Z"
    )
  );

  return !isNaN(parsed) ? new Date(parsed).toISOString() : null;
}

/* ======================================================
   EXDATE conversion
====================================================== */

function convertToGoogleDate(isoLike) {
  // Accepts YYYYMMDDThhmmssZ or missing Z
  let iso = isoLike.trim();
  if (!iso.endsWith("Z")) iso += "Z";

  const d = new Date(iso);
  if (isNaN(d)) {
    console.error("Invalid EXDATE:", isoLike);
    return null;
  }

  return d.toISOString().replace(/[-:]/g, "").replace(".000", "");
}
