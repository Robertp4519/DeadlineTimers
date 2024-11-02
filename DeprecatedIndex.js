let timerNum = 0;
let startDates = []
let endDates = []
const newTimerForm = document.getElementById("newTimerForm");

function main() {
    //calls the function that ticks timers down each second, may want to make faster since may not be able to sync with actual seconds, could potentially use while loop to wait to start it till date returns millis that equate to a new second starting so wouldn't have to run fast but could be in sync
    setInterval(tickTimers, 1000);
    //let started = false;
    //while (started != true) {
    //    let now = Date.now().toString();
    //    if (now.at(-3) == "0") {
    //        setInterval(tickTimers, 1000);
    //        started = true;
    //        console.log("STARTED!");
    //    }
    //}
}

function newTimer() {
    //works, Date and time setting seem to work now with the replace, hyphens ruin dates so use slashes in future
    console.log("Firefox Filler");
    //gets current date, entered date and time, and determines amount of time in milliseconds till end date and time is reached
    const currentDateTime = new Date(Date.now());
    let endDate = newTimerForm.elements["date"].value;
    
    //sets date to current date + one day if user doesn't enter date, else uses input
    if (endDate == NaN || endDate == null || endDate == "") {
        endDate = new Date(Date.now());
    } else {
        endDate = new Date(endDate.replace(/-/g, '\/'));
    }

    let endTime = newTimerForm.elements["time"].value;

    //sets time to midnight if user doesn't enter a time
    console.log(endTime)
    if (endTime == NaN || endTime == null || endTime == "") {
        endTime = "00:00";
    }

    //sets hours and minutes using first two and last two digits of endTime
    endDate.setHours(parseInt(endTime.slice(0, 3)), parseInt(endTime.slice(4)));
    endDates[timerNum] = endDate.getTime();
    let timeTillOver = endDate.getTime() - currentDateTime;

    //takes a rounded down amount of time from the total time to generate an accurate picture of how long in days, hours, mins, and secs
    timeTillOver = divideUpTime(timeTillOver)
    console.log(formatDate(timeTillOver[0], timeTillOver[1], timeTillOver[2], timeTillOver[3]));

    //creates a new table row and gives it an id based on how many timer rows already exist
    const displayTable = document.getElementById("timersTable");
    const newTimerRow = document.createElement("tr");
    newTimerRow.id = "timer" + timerNum.toString();
    displayTable.appendChild(newTimerRow);
    document.getElementById("timer" + timerNum.toString()).innerHTML = "<td id='timeDisplay" + timerNum.toString() + "'>" + formatDate(timeTillOver[0], timeTillOver[1], timeTillOver[2], timeTillOver[3]) + "</td><td>" + newTimerForm.elements["text"].value + "</td>";

    timerNum++;
    return false;
}

function tickTimers() {
    // console.log("AHHHHH");
    // console.log(Date.now());
    for (let i = 0; i < timerNum; i++) {
        let display = document.getElementById("timeDisplay" + i.toString()).innerHTML
        displayIndex = display.indexOf("") //use a regular expression here to get the number before the s for seconds then tick that
    }
}

function formatDate(day, hr, min, s) {
    return day.toString() + "days, " + hr.toString() + "hrs, " + min.toString() + "min, " + s.toString() + "s"
}

function divideUpTime(millisecondTime) {
    //this section could likely be condensed with an array holding time numbers and a for or foreach loop
    let tempDays = Math.floor(millisecondTime / 1000 / 3600 / 24);
    millisecondTime -= tempDays * 1000 * 3600 * 24;
    let tempHours = Math.floor(millisecondTime / 1000 / 3600);
    millisecondTime -= tempHours * 1000 * 3600;
    let tempMinutes = Math.floor(millisecondTime / 1000 / 60);
    millisecondTime -= tempMinutes * 1000 * 60;
    let tempSeconds = Math.floor(millisecondTime / 1000);
    //millisecondTime -= tempSeconds * 1000; Incase I want to use milliseconds
    return [tempDays, tempHours, tempMinutes, tempSeconds]
}