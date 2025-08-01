const slotLayout = {
    "Monday": ["A", "B", "C", "D", "PG", "G", "P", "H", "J", "M"],
    "Tuesday": ["A", "B", "C", "D", "PG", "F", "Q", "H", "M", "E"],
    "Wednesday": ["E", "B", "C", "D", "PG", "F", "R", "G", "J", "K"],
    "Thursday": ["E", "F", "G", "A", "PG", "D", "S", "H", "L", "J"],
    "Friday": ["F", "G", "A", "B", "C", "PG", "T", "E", "K", "L"]
};

var slotData = {}; // { slot: { courseNo, name, venue } }
var overrideData = {}; // { "Monday-A": { courseNo, name, venue } }

async function download_tt(){
    var link = document.createElement('a');
    link.download = 'timetable.png';
    canvas = await html2canvas(document.getElementById('timetable'), {scale: 10});
    link.href = canvas.toDataURL();
    link.click();
}

function addSlotRow(slot = "", course_num = "", course_name = "", venue = "") {
    const container = document.getElementById("slotInputs");
    const div = document.createElement("div");
    function get_selected_slot(check_slot){
        if (slot == check_slot){
            return "selected";
        }
        return "";
    }
    div.className = "form-row";
    div.innerHTML = `<span class="tt-data">
                    <select>
                        <option ${get_selected_slot('')} disabled>Slot</option>
                        <option ${get_selected_slot('A')}>A</option>
                        <option ${get_selected_slot('B')}>B</option>
                        <option ${get_selected_slot('C')}>C</option>
                        <option ${get_selected_slot('D')}>D</option>
                        <option ${get_selected_slot('E')}>E</option>
                        <option ${get_selected_slot('F')}>F</option>
                        <option ${get_selected_slot('G')}>G</option>
                        <option ${get_selected_slot('H')}>H</option>
                        <option ${get_selected_slot('J')}>J</option>
                        <option ${get_selected_slot('K')}>K</option>
                        <option ${get_selected_slot('L')}>L</option>
                        <option ${get_selected_slot('M')}>M</option>
                        <option ${get_selected_slot('P')}>P</option>
                        <option ${get_selected_slot('Q')}>Q</option>
                        <option ${get_selected_slot('R')}>R</option>
                        <option ${get_selected_slot('S')}>S</option>
                        <option ${get_selected_slot('T')}>T</option>
                        <option ${get_selected_slot('PG')}>Lunch</option>
                    </select>
                    <input placeholder="Course No." value = "${course_num}">
                    <input placeholder="Course Name" value = "${course_name}">
                    <input placeholder="Venue" value = "${venue}">
                    </span>
                    <span class="close-btn" value="" onclick="this.parentElement.remove()">×</span>`;
    container.appendChild(div);
}

function addOverrideRow(day = "", slot = "", course_num = "", course_name = "", venue = "") {
    const container = document.getElementById("overrideInputs");
    const div = document.createElement("div");
    function get_selected_day(check_day){
        if (day == check_day){
            return "selected";
        }
        return "";
    }
    function get_selected_slot(check_slot){
        if (slot == check_slot){
            return "selected";
        }
        return "";
    }

    console.log(day);
    div.className = "form-row";
    div.innerHTML = ` <span class="tt-data">
                    <select>
                        <option ${get_selected_day('')} disabled>Day</option>
                        <option ${get_selected_day('Monday')}>Monday</option>
                        <option ${get_selected_day('Tuesday')}>Tuesday</option>
                        <option ${get_selected_day('Wednesday')}>Wednesday</option>
                        <option ${get_selected_day('Thursday')}>Thursday</option>
                        <option ${get_selected_day('Friday')}>Friday</option>
                    </select>
                    <select>
                        <option ${get_selected_slot('')} disabled>Slot</option>
                        <option ${get_selected_slot('A')}>A</option>
                        <option ${get_selected_slot('B')}>B</option>
                        <option ${get_selected_slot('C')}>C</option>
                        <option ${get_selected_slot('D')}>D</option>
                        <option ${get_selected_slot('E')}>E</option>
                        <option ${get_selected_slot('F')}>F</option>
                        <option ${get_selected_slot('G')}>G</option>
                        <option ${get_selected_slot('H')}>H</option>
                        <option ${get_selected_slot('J')}>J</option>
                        <option ${get_selected_slot('K')}>K</option>
                        <option ${get_selected_slot('L')}>L</option>
                        <option ${get_selected_slot('M')}>M</option>
                        <option ${get_selected_slot('P')}>P</option>
                        <option ${get_selected_slot('Q')}>Q</option>
                        <option ${get_selected_slot('R')}>R</option>
                        <option ${get_selected_slot('S')}>S</option>
                        <option ${get_selected_slot('T')}>T</option>
                        <option ${get_selected_slot('PG')}>Lunch</option>
                    </select>
                    <input placeholder="Course No." value = "${course_num}">
                    <input placeholder="Course Name" value = "${course_name}">
                    <input placeholder="Venue" value = "${venue}">
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
    slotData = {}
    overrideData = {}
    document.querySelectorAll("#slotInputs .tt-data").forEach(row => {
    var [slot, courseNo, name, venue] = Array.from(row.children).map(el => el.value.trim());
    if (slot == "Lunch"){
        slot = "PG";
    }
    if (slot) {
        slotData[slot] = { courseNo, name, venue };
    }
    });

    // Parse Overrides
    document.querySelectorAll("#overrideInputs .tt-data").forEach(row => {
    const [daySel, slot, courseNo, name, venue] = Array.from(row.children);
    const day = daySel.value;
    var slotVal = slot.value.trim();
    if (slotVal == "Lunch"){
        slotVal = "PG";
    }
    if (day && slotVal) {
        overrideData[`${day}-${slotVal}`] = {
        courseNo: courseNo.value.trim(),
        name: name.value.trim(),
        venue: venue.value.trim()
        };
    }
    });
}

async function upload_saved_data_file(){

    const upload_field = document.getElementById('upload_cal_save');

    // Return a Promise that resolves when the file is selected
    const file = await new Promise((resolve) => {
        // Temporary one-time event listener
        const handler = () => {
            upload_field.removeEventListener('change', handler);
            resolve(upload_field.files[0]);
        };
        upload_field.addEventListener('change', handler);
        upload_field.click();
    });

    if (!file) return; // user may cancel

    const GetFile = new FileReader();
    GetFile.readAsText(file);
    GetFile.onloadend = load_saved_data;
}

function load_saved_data(event){

    let jsondata = event.target.result;

    // jsondata = '{"slotData":{"A":{"courseNo":"asas","name":"aaa","venue":"aaa"}},"overrideData":{}}'

    data = JSON.parse(jsondata)
    slotData = data.slotData;
    overrideData = data.overrideData;
    
    Object.keys(slotData).forEach(slot => {
        addSlotRow(slot, slotData[slot].courseNo, slotData[slot].name, slotData[slot].venue);
    })

    Object.keys(overrideData).forEach(override => {
        [day, slot] = override.split("-");
        console.log(day, slot);
        addOverrideRow(day, slot, overrideData[override].courseNo, overrideData[override].name, overrideData[override].venue);
    })

}

function save_data(){
    data = {slotData: slotData, overrideData: overrideData};
    jsondata = JSON.stringify(data);
    const blob = new Blob([jsondata], { type: "text/json;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calendar_save.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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