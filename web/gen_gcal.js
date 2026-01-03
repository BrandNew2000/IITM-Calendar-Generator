// const schedule = {
//   "Monday-A": ["MA101", "Calculus", "LH203"],
//   "Tuesday-B": ["PH101", "Physics", "LH105"],
// };

const startDate = new Date("2026-01-17T00:00:00.000+05:30");

const slotTimes = {
  "Monday": {
    "A": { start: "08:00", end: "08:50" },
    "B": { start: "09:00", end: "09:50" },
    "C": { start: "10:00", end: "10:50" },
    "D": { start: "11:00", end: "11:50" },
    "PG": { start: "12:00", end: "12:50" },
    "G": { start: "13:00", end: "13:50" },
    "P": { start: "14:00", end: "16:45" },
    "J": { start: "17:00", end: "17:50" },
    "H": { start: "14:00", end: "15:15" },
    "M": { start: "15:30", end: "16:45" }
  },
  "Tuesday": {
    "B": { start: "08:00", end: "08:50" },
    "C": { start: "09:00", end: "09:50" },
    "D": { start: "10:00", end: "10:50" },
    "E": { start: "11:00", end: "11:50" },
    "PG": { start: "12:00", end: "12:50" },
    "A": { start: "13:00", end: "13:50" },
    "Q": { start: "14:00", end: "16:45" },
    "F": { start: "17:00", end: "17:50" },
    "M": { start: "14:00", end: "15:15" },
    "H": { start: "15:30", end: "16:45" }
  },
  "Wednesday": {
    "C": { start: "08:00", end: "08:50" },
    "D": { start: "09:00", end: "09:50" },
    "E": { start: "10:00", end: "10:50" },
    "F": { start: "11:00", end: "11:50" },
    "PG": { start: "12:00", end: "12:50" },
    "B": { start: "13:00", end: "13:50" },
    "R": { start: "14:00", end: "16:45" },
    "G": { start: "17:00", end: "17:50" },
    "J": { start: "14:00", end: "15:15" },
    "K": { start: "15:30", end: "16:45" }
  },
  "Thursday": {
    "E": { start: "08:00", end: "08:50" },
    "F": { start: "09:00", end: "09:50" },
    "G": { start: "10:00", end: "10:50" },
    "A": { start: "11:00", end: "11:50" },
    "PG": { start: "12:00", end: "12:50" },
    "D": { start: "13:00", end: "13:50" },
    "S": { start: "14:00", end: "16:45" },
    "H": { start: "17:00", end: "17:50" },
    "L": { start: "14:00", end: "15:15" },
    "J": { start: "15:30", end: "16:45" }
  },
  "Friday": {
    "F": { start: "08:00", end: "08:50" },
    "G": { start: "09:00", end: "09:50" },
    "A": { start: "10:00", end: "10:50" },
    "B": { start: "11:00", end: "11:50" },
    "PG": { start: "12:00", end: "12:50" },
    "C": { start: "13:00", end: "13:50" },
    "T": { start: "14:00", end: "16:45" },
    "E": { start: "17:00", end: "17:50" },
    "K": { start: "14:00", end: "15:15" },
    "L": { start: "15:30", end: "16:45" }
  }
};

const slotTimes_PG = {
  "Monday": {
    "A": { start: "08:00", end: "08:50" },
    "B": { start: "09:00", end: "09:50" },
    "C": { start: "10:00", end: "10:50" },
    "D": { start: "11:00", end: "11:50" },
    "G": { start: "12:00", end: "12:50" },
    "PG": { start: "13:00", end: "13:50" },
    "P": { start: "14:00", end: "16:45" },
    "J": { start: "17:00", end: "17:50" },
    "H": { start: "14:00", end: "15:15" },
    "M": { start: "15:30", end: "16:45" }
  },
  "Tuesday": {
    "B": { start: "08:00", end: "08:50" },
    "C": { start: "09:00", end: "09:50" },
    "D": { start: "10:00", end: "10:50" },
    "E": { start: "11:00", end: "11:50" },
    "A": { start: "12:00", end: "12:50" },
    "PG": { start: "13:00", end: "13:50" },
    "Q": { start: "14:00", end: "16:45" },
    "F": { start: "17:00", end: "17:50" },
    "M": { start: "14:00", end: "15:15" },
    "H": { start: "15:30", end: "16:45" }
  },
  "Wednesday": {
    "C": { start: "08:00", end: "08:50" },
    "D": { start: "09:00", end: "09:50" },
    "E": { start: "10:00", end: "10:50" },
    "F": { start: "11:00", end: "11:50" },
    "B": { start: "12:00", end: "12:50" },
    "PG": { start: "13:00", end: "13:50" },
    "R": { start: "14:00", end: "16:45" },
    "G": { start: "17:00", end: "17:50" },
    "J": { start: "14:00", end: "15:15" },
    "K": { start: "15:30", end: "16:45" }
  },
  "Thursday": {
    "E": { start: "08:00", end: "08:50" },
    "F": { start: "09:00", end: "09:50" },
    "G": { start: "10:00", end: "10:50" },
    "A": { start: "11:00", end: "11:50" },
    "D": { start: "12:00", end: "12:50" },
    "PG": { start: "13:00", end: "13:50" },
    "S": { start: "14:00", end: "16:45" },
    "H": { start: "17:00", end: "17:50" },
    "L": { start: "14:00", end: "15:15" },
    "J": { start: "15:30", end: "16:45" }
  },
  "Friday": {
    "F": { start: "08:00", end: "08:50" },
    "G": { start: "09:00", end: "09:50" },
    "A": { start: "10:00", end: "10:50" },
    "B": { start: "11:00", end: "11:50" },
    "C": { start: "12:00", end: "12:50" },
    "PG": { start: "13:00", end: "13:50" },
    "T": { start: "14:00", end: "16:45" },
    "E": { start: "17:00", end: "17:50" },
    "K": { start: "14:00", end: "15:15" },
    "L": { start: "15:30", end: "16:45" }
  }
};

const dayToWeekday = {
  "Sunday": 0,
  "Monday": 1,
  "Tuesday": 2,
  "Wednesday": 3,
  "Thursday": 4,
  "Friday": 5,
  "Saturday": 6,
};

function pad(n) {
  return n.toString().padStart(2, '0');
}

function formatICSDate(date, time) {
  const [hour, minute] = time.split(":").map(Number);
  date.setHours(hour, minute, 0);

  //   let utcDate = new Date(date.toLocaleString('en-US', { timeZone: "UTC" }));
  //   let tzDate = new Date(date.toLocaleString('en-US', { timeZone: "Asia/Kolkata" }));
  //   let offset = utcDate.getTime() - tzDate.getTime();
  //   date.setTime( date.getTime() - offset );

  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function getNextDate(dayName) {
  const today = new Date();
  const resultDate = new Date();
  const dayDiff = (dayToWeekday[dayName] + 7 - today.getDay()) % 7;
  resultDate.setDate(today.getDate() + dayDiff);
  return resultDate;
}

function generateICS(schedule, MtechData) {
  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

  for (const key in schedule) {
    if (schedule[key] == null) {
      continue;
    }
    const [day, slot] = key.split("-");
    const [code, name, venue] = [schedule[key].courseNo, schedule[key].name, schedule[key].venue];
    var times;
    if (MtechData[day]["slot"] == slot && MtechData[day]["value"] == true) {
      times = slotTimes_PG[day][slot];
    } else {
      times = slotTimes[day][slot];
    }
    if (!times) continue;

    // const startDate = getNextDate(day);
    const dtStart = formatICSDate(new Date(startDate), times.start);
    const dtEnd = formatICSDate(new Date(startDate), times.end);

    const uid = `${code}-${day}-${slot}-${Math.random().toString(36).slice(2)}@example.com`;

    icsContent += `BEGIN:VEVENT
SUMMARY: (${slot}) ${code} - ${name}
DTSTART:${dtStart}
DTEND:${dtEnd}
RRULE:FREQ=WEEKLY;BYDAY=${day.slice(0, 2).toUpperCase()}
LOCATION:${venue}
UID:${uid}
DESCRIPTION:${code} - ${name} at ${venue}
END:VEVENT
`;
  }

  icsContent += "END:VCALENDAR";

  return icsContent;

}


function downloadICS(schedule, MtechData) {

  icsContent = generateICS(schedule, MtechData);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "schedule.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function importICSgcal(schedule, MtechData) {
  icsContent = generateICS(schedule, MtechData);
  return importICS(icsContent);
}