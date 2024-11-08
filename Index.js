// Retrostorm        Started: 10/30/24      Updated: 11/7/24
// Index for DeadlineTimers project, rewritten to use dictionaries/objects for better storage
// of user timers so rearrangement and reloading of timers is easier.
// Also cleaned up the code a lot.

// TODO: May be more efficient to store ticking time of timers in timers object so don't
// have to constantly read in values and convert them.

// TODO: Change back displayTimer() when done debugging. 
// displayTimer() will currently always give a display of 1 second,
// this was for debugging tickTimers(). Change when done debugging.

// TODO: Figure out some way to save and load timers between sessions. 
// TODO: Implement way for user to delete a timer when finished with it.
// TODO: Implement way for user to edit a timer once created.
// Potential TODO: Implement way for user to drag-and-drop rearrange order of timers.

// ______________________________________________________________________________________________________________

// Timers stored as timer#: [startDateTime, endDateTime, timerLabel]
// Note: timerNum is converted to string when used as property, # represents a unique timer number 0, 1, 2, ...
// each timers property name is "timer" + String(timerNum) ie. timer0 or timer1
let timers = {};

// When implement reloading, would want to set timerNum to highest identification number of loaded in timers
let timerNum = 0;

// Form for creating new timer
const newTimerForm = document.getElementById("newTimerForm");

function main() {
    // TODO: Clean up the documentation on this function

    // Calls function that ticks timers each second IE 1000 milliseconds
    setInterval(tickTimers, 1000);

    // Deprecated code, could likely delete

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
    // Function takes in user input from newTimerForm and 
    // creates new property in timers for with values from the form.
    // Finally, calls displayTimer() to display the newly created/stored timer.

    // TODO: Clean up documentation for this function

    // New timer name, will get used often
    let currentTimer = "timer" + String(timerNum);

    // Create new timer property as an empty list
    timers[currentTimer] = [];

    // Gets current date and stores in new timer
    const currentDateTime = new Date(Date.now());
    timers[currentTimer][0] = currentDateTime;

    // Gets end date entered by user
    let endDate = newTimerForm.elements["date"].value;

    // Sets date to current date + one day if user doesn't enter date, else uses input to create a new date
    if (endDate == NaN || endDate == null || endDate == "") {
        endDate = new Date(Date.now());
        endDate.setDate(endDate.getDate() + 1);
    } else {
        // Time selections return dates as mm-dd-yyyy but Date needs mm/dd/yyyy so we replace hyphens with slashes
        endDate = new Date(endDate.replace(/-/g, '\/'));
    }

    // Gets end time entered by user
    let endTime = newTimerForm.elements["time"].value;

    // Sets time to midnight if user doesn't enter a time
    if (endTime == NaN || endTime == null || endTime == "") {
        endTime = "00:00";
    }

    // Sets hours and minutes of endDate using first two and last two digits of endTime
    endDate.setHours(parseInt(endTime.slice(0, 3)), parseInt(endTime.slice(3)));

    // Stores end date in new timer
    timers[currentTimer][1] = endDate;

    // Gets label entered by user and stores in new timer
    label = newTimerForm.elements["text"].value;
    timers[currentTimer][2] = label;

    // Calls displayTimer() so new timer will be displayed in the timer table
    displayTimer(timerNum, currentTimer);

    // Increments timerNum so each timer's number is unique and so we can loop through timers later
    timerNum++;

    // I honestly have no clue why this return false is here but I'm too afraid to remove it.
    // It may be because we call this function directly from html button,
    // and I guess I didn't want it to activate other events? Html button calls it with a return for some reason?
    // I've made a realization. I'm pretty sure we return false so that hitting submit
    // doesn't cause data to get submitted to a nonexistant server, appended to our url, or cached/cookied. 
    // (I need to review storing user data and form submits cuz I only vaguely remember things)
    return false;
}

function getTimerDisplayTime(display) {
    // TODO: Write documentation for this function
    // and clean up code organization. Want to 
    // split by action we're doing rather than by 
    // unit of time.

    let secondsIndex = display.lastIndexOf("s");
    let seconds = display.slice(secondsIndex - 3, secondsIndex);
    if (seconds[1] == " ") {
        // (c #) case where c is any char and # is a number
        seconds = seconds[2];
    } else if (seconds[0] == " ") {
        // ( ##) or ( -#) case where c is any char and # is a number
        seconds = seconds[1] + seconds[2]
    } // Omitted else case where (-##)
    seconds = parseInt(seconds);

    let minutesIndex = display.lastIndexOf("m");
    let minutes = display.slice(minutesIndex - 3, minutesIndex);
    if (minutes[1] == " ") {
        // (c #) case where c is any char and # is a number
        minutes = minutes[2];
    } else if (minutes[0] == " ") {
        // ( ##) or ( -#) case where c is any char and # is a number
        minutes = minutes[1] + minutes[2]
    } // Omitted else case where (-##)
    minutes = parseInt(minutes);

    let hoursIndex = display.lastIndexOf("h");
    let hours = display.slice(hoursIndex - 3, hoursIndex);
    if (hours[1] == " ") {
        // (c #) case where c is any char and # is a number
        hours = hours[2];
    } else if (hours[0] == " ") {
        // ( ##) or ( -#) case where c is any char and # is a number
        hours = hours[1] + hours[2]
    } // Omitted else case where (-##)
    hours = parseInt(hours);

    let daysIndex = display.indexOf("d");
    let days = display.slice(0, daysIndex);
    // Days will always be start of display string up to the index of d
    days = parseInt(days);

    return [days, hours, minutes, seconds]
}

function positiveTickTimer(timeArray) {
    // May be cleaner to flip the way I have these if statements ordered
    // for readability. Putting case where decrement comes first makes it obvious
    // why I care if decrementing gives a negative number

    let days = timeArray[0];
    let hours = timeArray[1];
    let minutes = timeArray[2];
    let seconds = timeArray[3];

    if (seconds - 1 < 0) {
        seconds = 59;
        if (minutes - 1 < 0) {
            minutes = 59;
            if (hours - 1 < 0) {
                hours = 23;
                if (days - 1 < 0) {
                    console.log("Error: Somehow got fed 0days, 0hours, 0mins, 0seconds case.");
                    days = 0;
                    hours = 0;
                    minutes = 0;
                    seconds = -1;
                } else {
                    days--;
                }
            } else {
                hours--;
            }
        } else {
            minutes--;
        }
    } else {
        seconds--;
    }

    return [days, hours, minutes, seconds]
}

function negativeTickTimer(timeArray) {
    // May be cleaner to flip the way I have these if statements ordered
    // for readability. Putting case where decrement comes first makes it obvious
    // why I care if decrementing goes beyond 59 or 24.

    let days = timeArray[0];
    console.log(days)
    let hours = timeArray[1];
    console.log(hours)
    let minutes = timeArray[2];
    console.log(minutes)
    let seconds = timeArray[3];
    console.log(seconds)

    if (seconds - 1 < -59) {
        seconds = 0;
        if (minutes - 1 < -59) {
            minutes = 0;
            if (hours - 1 < -23) {
                hours = 0;
                days--;
            } else {
                hours--;
            }
        } else {
            minutes--;
        }
    } else {
        seconds--;
    }

    return [days, hours, minutes, seconds]
}

function tickTimers() {
    // TODO: Finish to actually tick our timers down

    // console.log("AHHHHH");
    // console.log(Date.now());

    // Could replace with for each loop that goes through timers object.
    // Would need to add element of timers that has timeDisplay#
    for (let i = 0; i < timerNum; i++) {
        let timeDisplay = document.getElementById("timeDisplay" + i.toString());
        let innerDisplay = timeDisplay.innerHTML;
        let timeArray = getTimerDisplayTime(innerDisplay);

        let isPositive = true;

        // Iterate over each item in the array
        for (let j = 0; j < timeArray.length; j++ ) {
            if (timeArray[j] <= 0) {
                isPositive = false;
                break;
            } else {
                continue;
            }
        }

        if (isPositive) {
            timeArray = positiveTickTimer(timeArray);
        } else {
            timeArray = negativeTickTimer(timeArray);
        }
        
        let days = timeArray[0];
        let hours = timeArray[1];
        let minutes = timeArray[2];
        let seconds = timeArray[3];

        timeDisplay.innerHTML = formatDate(days, hours, minutes, seconds);
    }
}

function formatDate(day, hr, min, s) {
    // TODO: Change format for days, hours, and minutes to 
    // be day, hr, min if these == 1 otherwise use plural form

    // Returns #days, #hrs, #min, #s
    return day.toString() + "days, " + hr.toString() + "hrs, " + min.toString() + "min, " + s.toString() + "s"
}

function displayTimer(givenTimerNum, timerName) {
    // TODO: Clean up documentation for this function

    const currentDateTime = new Date(Date.now());
    console.log(currentDateTime);
    // let timeTillOver = timers[timerName][1] - currentDateTime;
    let timeTillOver = 1000;

    // takes a rounded down amount of time from the total time to generate an accurate picture of how long in days, hours, mins, and secs
    timeTillOver = divideUpTime(timeTillOver);
    // console.log(formatDate(timeTillOver[0], timeTillOver[1], timeTillOver[2], timeTillOver[3]));

    //creates a new table row and gives it an id based on how many timer rows already exist
    const displayTable = document.getElementById("timersTable");
    const newTimerRow = document.createElement("tr");
    newTimerRow.id = timerName;
    displayTable.appendChild(newTimerRow);
    document.getElementById(timerName).innerHTML = "<td id='timeDisplay" + String(givenTimerNum) + "'>" + formatDate(timeTillOver[0], timeTillOver[1], timeTillOver[2], timeTillOver[3]) + "</td><td>" + timers[timerName][2] + "</td>";
}

function divideUpTime(millisecondTime) {
    // Function takes in a time given in milliseconds and returns an array 
    // of integers that correspond to the given time expressed as 
    // days, hours, minutes, and seconds in that order.s

    // Check if millisecondTime is negative or not, if it is then we make it positive
    // and record that it was negative so we can output negative values later.
    // This is important because method of dividing up time will act 
    // in unexpected ways when given a negative number.
    isNegative = false;
    if (millisecondTime < 0) {
        millisecondTime = -millisecondTime;
        isNegative = true;
    }
    
    // First turn our milliseconds into seconds then divide up our time into days, hours, mins, and secs
    let time = Math.floor(millisecondTime / 1000);
    let tempDays = Math.floor(time / (3600 * 24));
    let tempHours = Math.floor((time % (3600 * 24)) / 3600);
    let tempMinutes = Math.floor(((time % (3600 * 24)) % 3600) / 60);
    let tempSeconds = Math.floor((((time % (3600 * 24)) % 3600) % 60));

    // If we started with negative millisecondTime then change all outputs to negative
    if (isNegative) {
        tempDays = -tempDays;
        tempHours = -tempHours;
        tempMinutes = -tempMinutes;
        tempSeconds = -tempSeconds;
    }

    // Return array of our divided up time in descending order
    return [tempDays, tempHours, tempMinutes, tempSeconds]
}
