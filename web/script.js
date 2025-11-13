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

    clear_tables();
    let jsondata = event.target.result;
    process_saved_data(jsondata);

}

function process_saved_data(jsondata){

    // jsondata = '{"slotData":{"A":{"courseNo":"asas","name":"aaa","venue":"aaa"}},"overrideData":{}}'

    data = JSON.parse(jsondata);
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

function download_data(){
    jsondata = save_data();
    const blob = new Blob([jsondata], { type: "text/json;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calendar_save.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function save_data(){
    data = {slotData: slotData, overrideData: overrideData};
    return JSON.stringify(data);
}


function save_to_cookie(){
    jsondata = save_data();
    // Build the expiration date string:
    var expiration_date = new Date();
    var cookie_string = '';
    expiration_date.setFullYear(expiration_date.getFullYear() + 1);
    // Build the set-cookie string:
    cookie_string = "save_data=" + jsondata +"; path=/; expires=" + expiration_date.toUTCString();
    // Create or update the cookie:
    document.cookie = "";
    document.cookie = cookie_string;
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

    save_to_cookie();
    
}

function clear_element(id){
    const ele = document.getElementById(id);
    ele.innerHTML = "";
}

function clearSlotRows(){
    clear_element("slotInputs");
}

function clearOverrideRows(){
    clear_element("overrideInputs");
}

function clear_tables(){
    clearSlotRows();
    clearOverrideRows();
}

function load_from_cookie(){
    if (document.cookie.slice(0,9)=="save_data"){
        console.log((document.cookie.split(";")[0]).slice(10));
        process_saved_data((document.cookie.split(";")[0]).slice(10));
        
    }
}


document.addEventListener("DOMContentLoaded", function() {
  load_from_cookie();
});