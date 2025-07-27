const slotLayout = {
    "Monday": ["A", "B", "C", "D", "G", "P", "H", "J", "M"],
    "Tuesday": ["A", "B", "C", "D", "F", "Q", "H", "M", "E"],
    "Wednesday": ["E", "B", "C", "D", "F", "R", "G", "J", "K"],
    "Thursday": ["E", "F", "G", "A", "D", "S", "H", "L", "J"],
    "Friday": ["F", "G", "A", "B", "C", "T", "E", "K", "L"]
};

const slotData = {}; // { slot: { courseNo, name, venue } }
const overrideData = {}; // { "Monday-A": { courseNo, name, venue } }

async function download_tt(){
    var link = document.createElement('a');
    link.download = 'timetable.png';
    canvas = await html2canvas(document.getElementById('timetable'), {scale: 10});
    link.href = canvas.toDataURL();
    link.click();
}

function addSlotRow() {
    const container = document.getElementById("slotInputs");
    const div = document.createElement("div");
    div.className = "form-row";
    div.innerHTML = `<span class="tt-data">
                    <select>
                        <option value="" selected disabled>Slot</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                        <option>D</option>
                        <option>E</option>
                        <option>F</option>
                        <option>G</option>
                        <option>H</option>
                        <option>J</option>
                        <option>K</option>
                        <option>L</option>
                        <option>M</option>
                        <option>P</option>
                        <option>Q</option>
                        <option>R</option>
                        <option>S</option>
                        <option>T</option>
                    </select>
                    <input placeholder="Course No.">
                    <input placeholder="Course Name">
                    <input placeholder="Venue">
                    </span>
                    <span class="close-btn" value="" onclick="this.parentElement.remove()">×</span>`;
    container.appendChild(div);
}

function addOverrideRow() {
    const container = document.getElementById("overrideInputs");
    const div = document.createElement("div");
    div.className = "form-row";
    div.innerHTML = ` <span class="tt-data">
                    <select>
                        <option value="" selected disabled>Day</option>
                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednesday</option>
                        <option>Thursday</option>
                        <option>Friday</option>
                    </select>
                    <select>
                        <option value="" selected disabled>Slot</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                        <option>D</option>
                        <option>E</option>
                        <option>F</option>
                        <option>G</option>
                        <option>H</option>
                        <option>J</option>
                        <option>K</option>
                        <option>L</option>
                        <option>M</option>
                        <option>P</option>
                        <option>Q</option>
                        <option>R</option>
                        <option>S</option>
                        <option>T</option>
                    </select>
                    <input placeholder="Course No.">
                    <input placeholder="Course Name">
                    <input placeholder="Venue">
                    </span>
                    <span class="close-btn" value="" onclick="this.parentElement.remove()">×</span>`;
    container.appendChild(div);
}

function gen_gcal() {
    parseInputs();
    let data = {}
    Object.keys(slotLayout).forEach(day => {
    slotLayout[day].forEach(slot => {
        const key = `${day}-${slot}`;
        data[key] = overrideData[key] || slotData[slot];
        if (data[key] != null){
            if (data[key].courseNo == "" && data[key].name == "" && data[key].venue == ""){
                data[key] = null;
            }
        }
    });
    });
    generateICS(data);
}

function parseInputs(){
    // Parse Slots
    document.querySelectorAll("#slotInputs .tt-data").forEach(row => {
    const [slot, courseNo, name, venue] = Array.from(row.children).map(el => el.value.trim());
    if (slot) {
        slotData[slot] = { courseNo, name, venue };
    }
    });

    // Parse Overrides
    document.querySelectorAll("#overrideInputs .tt-data").forEach(row => {
    const [daySel, slot, courseNo, name, venue] = Array.from(row.children);
    const day = daySel.value;
    const slotVal = slot.value.trim();
    if (day && slotVal) {
        overrideData[`${day}-${slotVal}`] = {
        courseNo: courseNo.value.trim(),
        name: name.value.trim(),
        venue: venue.value.trim()
        };
    }
    });
}

function generateTable() {

    parseInputs();
    // Generate Table

    Object.keys(slotLayout).forEach(day => {
    slotLayout[day].forEach(slot => {
        const key = `${day}-${slot}`;
        let data = overrideData[key] || slotData[slot] || null;

        if (data != null){
            if (data.courseNo == "" && data.name == "" && data.venue == ""){
                data = null;
            }
        }

        if (data == null){
        row = `<br>`;
        } else {
        row = `(${slot}) <br> <strong> ${data.courseNo} </strong><br>${data.name}<br> <span style="font-size: x-small">${data.venue}</span>`;
        }
        document.getElementById(`${key}`).innerHTML = row;
    });
    });
}