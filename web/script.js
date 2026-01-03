const slotLayout = {
    "Monday": ["A", "B", "C", "D", "PG", "G", "P", "H", "J", "M"],
    "Tuesday": ["A", "B", "C", "D", "PG", "F", "Q", "H", "M", "E"],
    "Wednesday": ["E", "B", "C", "D", "PG", "F", "R", "G", "J", "K"],
    "Thursday": ["E", "F", "G", "A", "PG", "D", "S", "H", "L", "J"],
    "Friday": ["F", "G", "A", "B", "C", "PG", "T", "E", "K", "L"]
};

const colorList = {
    "A": "lite_green",
    "B": "lavender",
    "C": "sky",
    "D": "orange",
    "E": "red",
    "F": "yellow",
    "G": "mossgreen",
    "H": "green",
    "J": "pink",
    "K": "blue",
    "L": "gray",
    "M": "lite_blue",
    "P": "sandal",
    "Q": "sandal",
    "R": "sandal",
    "S": "sandal",
    "T": "sandal",
    "PG": "gray_light",
}

var slotData = {}; // { slot: { courseNo, name, venue } }
var overrideData = {}; // { "Monday-A": { courseNo, name, venue } }
var MtechData = {}

ACADS_COURSES = {}; // Add courses after pulling from file

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
                    <select class="row_slot">
                        <option ${get_selected_slot('')}>Slot</option>
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
                    <input placeholder="Course No." class="row_course_number" value = "${course_num}">
                    <input placeholder="Course Name" class="row_course_name" value = "${course_name}">
                    <input placeholder="Venue" class="row_venue"  value = "${venue}">
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
                    <select class="row_day">
                        <option ${get_selected_day('')} disabled>Day</option>
                        <option ${get_selected_day('Monday')}>Monday</option>
                        <option ${get_selected_day('Tuesday')}>Tuesday</option>
                        <option ${get_selected_day('Wednesday')}>Wednesday</option>
                        <option ${get_selected_day('Thursday')}>Thursday</option>
                        <option ${get_selected_day('Friday')}>Friday</option>
                    </select>
                    <select class="row_slot">
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
                    <input placeholder="Course No." class="row_course_number" value = "${course_num}">
                    <input placeholder="Course Name" class="row_course_name" value = "${course_name}">
                    <input placeholder="Venue" class="row_venue"  value = "${venue}">
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
    
    return data;
}

function download_gcal(){
    data = gen_gcal();
    downloadICS(data, MtechData);
}


async function import_gcal(){
    message_field = document.getElementById('gcal_import_mesg');
    data = gen_gcal();
    message_field.innerHTML = `<b>Status:</b> Running import. Please wait ... <br>`
    let result = await importICSgcal(data, MtechData);
    if (result == true){
        message_field.innerHTML = `<b>Status:</b> Successfully imported! <br>`
    }
    else if (result == false) {
        message_field.innerHTML = `<b>Status:</b> Failed to import! <br>`
    }
}

function setMtechInputs() {
    document.getElementById("use_mtech_slot")
    .querySelectorAll('input[type="checkbox"]')
    .forEach(cb => {
    const day = cb.value;
    if (MtechData[day]) {
        cb.checked = !!MtechData[day].value;
    }
    });
}

function readMtechInputs() {
    MtechData = {"Monday": {"slot": "G", value: false}, "Tuesday": {"slot": "A", value: false}, "Wednesday": {"slot": "B", value: false}, "Thursday": {"slot": "D", value: false}, "Friday": {"slot": "C", value: false}};
    document.getElementById("use_mtech_slot")
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach(cb => {
    const day = cb.value;
    if (MtechData[day]) {
        MtechData[day].value = true;
    }
    });
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

    readMtechInputs();
}

async function fetch_courses_json(){
    data = await fetch('./courses.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => console.error('Failed to course data:', error)); 

    return data
}

function getCourseDataAcads(courseNo){

    let course = {
        slot: "Slot",
        name: "",
        venue: ""
    }
    course = Object.assign(course, ACADS_COURSES[courseNo]);

    course.courseNo = courseNo.toUpperCase();
    return course
}

function populateData(){
    slotData = {}
    overrideData = {}
    document.querySelectorAll("#slotInputs .tt-data").forEach(row => {
    courseNo = row.getElementsByClassName("row_course_number")[0].value.toUpperCase();
    if (courseNo) {
        course_data = getCourseDataAcads(courseNo);
        elements = {slot: row.getElementsByClassName("row_slot")[0], courseNo: row.getElementsByClassName("row_course_number")[0], name: row.getElementsByClassName("row_course_name")[0], venue: row.getElementsByClassName("row_venue")[0]};
        if (elements.slot.value == "Slot"){
            elements.slot.value = "";
        }
        for (let [key, element] of Object.entries(elements)){
            if (!element.value) {
                element.value = course_data[key];
            }
        }
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
    MtechData = data.MtechData;
    
    Object.keys(slotData).forEach(slot => {
        addSlotRow(slot, slotData[slot].courseNo, slotData[slot].name, slotData[slot].venue);
    })

    Object.keys(overrideData).forEach(override => {
        [day, slot] = override.split("-");
        console.log(day, slot);
        addOverrideRow(day, slot, overrideData[override].courseNo, overrideData[override].name, overrideData[override].venue);
    })

    setMtechInputs();

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
    data = {slotData: slotData, overrideData: overrideData, MtechData: MtechData};
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
    document.cookie = cookie_string;
}

function RunMtechCheck(key) {
    [day, slot] = key.split("-")
    if (slot == "PG") {
        if (MtechData[day]["value"] == true){
            return `${day}-${MtechData[day]["slot"]}-B`;
        } else if (MtechData[day]["value"] == false){
            return `${day}-${MtechData[day]["slot"]}-M`;
        }
    }

    if (MtechData[day]["slot"] == slot && MtechData[day]["value"] == true){
        return `${key}-M`;
    } else if (MtechData[day]["slot"] == slot && MtechData[day]["value"] == false){
        return `${key}-B`;
    } else {
        return key;
    }
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

        element = document.getElementById(`${RunMtechCheck(key)}`);

        if (data == null){
            element.innerHTML = `<br>`;
        } else {
            element.innerHTML = `(${slot}) <br> <strong> ${data.courseNo} </strong><br>${data.name}<br> <span style="font-size: x-small">${data.venue}</span>`;
        }
        element.classList.replace(element.classList.item(0), colorList[slot]);


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
    cookies = document.cookie.split(";");

    if (cookies.length == 0){
        return;
    }

    for (let i = 0; i < cookies.length; i++){
        let cookie = cookies[i].replace(/^\s+|\s+$/g, "");
        if (cookie.slice(0,9)=="save_data"){
            console.log((cookie).slice(10));
            process_saved_data((cookie).slice(10));
        }
    }
}


document.addEventListener("DOMContentLoaded", async function() {
  load_from_cookie();
  ACADS_COURSES = await fetch_courses_json();
});