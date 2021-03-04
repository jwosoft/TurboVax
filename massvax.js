// This should be injected into the following site:
// https://massvax.maryland.gov/appointment-select

// This script works in two phases.
// For the first phase, when the user reaches the location search/select pages, if the user
// has checked the box to automatically retry, we will continue to use the address entered
// by the user to check for an available vaccination site.  Once one is found, we will stop
// retrying, disable the retry flag, and send an alert to the user letting them know that 
// an appointment site is available.

// For the second phase, when the user reaces the appointment select page, if the user clicks
// start, we will begin checking toggling between the current and next month by clicking the 
// calendar switching buttons on the page.  When an appointment is found, we will stop retrying, 
// and alert the user to let them know that an appointment is available.  

var debug = false;
log = function(message) {
    if (debug) {
        console.log(message);
    }
}

log("content script injected");

numToMonth = function(monthNum) {
    var monthName;
    switch(monthNum) {
        case 0:
            monthName = "January";
            break;
        case 1:
            monthName = "February";
            break;
        case 2:
            monthName = "March";
            break;
        case 3:
            monthName = "April";
            break;
        case 4:
            monthName = "May"; 
            break;
        case 5:
            monthName = "June";
            break;
        case 6:
            monthName = "July";
            break;
        case 7:
            monthName = "August";
            break;
        case 8:
            monthName = "September";
            break;
        case 9:
            monthName = "October";
            break;
        case 10:
            monthName = "November";
            break;
        case 11:
            monthName = "December";
            break;
    }
    return monthName;
}

monthToNum = function(monthName) {
    switch(monthName) {
        case "January":
            monthNum = 0;
            break;
        case "February":
            monthNum = 1;
            break;
        case "March":
            monthNum = 2;
            break;
        case "April":
            monthNum = 3;
            break;
        case "May":
            monthNum = 4; 
            break;
        case "June":
            monthNum = 5;
            break;
        case "July":
            monthNum = 6;
            break;
        case "August":
            monthNum = 7;
            break;
        case "September":
            monthNum = 8;
            break;
        case "October":
            monthNum = 9;
            break;
        case "November":
            monthNum = 10;
            break;
        case "December":
            monthNum = 11;
            break;
    }
    return monthNum;
}

var curMonthName = numToMonth(new Date().getMonth());
var curMonthNum = monthToNum(curMonthName);
var curYearNum = new Date().getFullYear();

var nextMonthNum = (curMonthNum + 1) % 12;
var nextMonthName = numToMonth(nextMonthNum);
var nextYearNum = (curYearNum == 11) ? curYearNum+1 : curYearNum;

var interval = 500;

var myInterval;

stop = function() {
    log("stop");
    if (myInterval != null) {
        clearInterval(myInterval);
        myInterval = null;
    }
}

var turboTimeAudio = new Audio(chrome.runtime.getURL("audio/turbo-time.mp3"));
var cookieDownAudio = new Audio(chrome.runtime.getURL("audio/put-cookie-down.mp3"));
check = function(){
    log("check");
    if ($(".calendar").parent().children().length > 1) {
        log("appointments found");
        stop();
        turboTimeAudio.play();
        alert("Pick your appointment time!");
    }

    var direction = getDirection();
    if (direction != null) {
        log("Direction: " + direction);
        $(direction).click();
    }
}

getDirection = function() {
    var query = $(".CalendarMonth[data-visible=true] div.CalendarMonth_caption");
    if (query != null && query != undefined) {
        if (query.text() != null && query.text() != undefined && query.text() != ""){
            var displayDate = query.text();
            var displayMonthYear = displayDate.split(' ');
            var displayMonthName = displayMonthYear[0];
            var displayMonthNum = monthToNum(displayMonthName);
            var displayYearNum = parseInt(displayMonthYear[1]);

            var displayMonthYear = displayYearNum * 12 + displayMonthNum;
            var curMonthYear = curYearNum * 12 + curMonthNum;
            var nextMonthYear = nextYearNum * 12 + nextMonthNum;

            var prev = ".calendar__prev";
            var next = ".calendar__next";

            if (displayMonthYear > nextMonthYear) {
                return prev;
            } else if (displayMonthYear < curMonthYear) {
                return next;
            } else if (displayMonthYear == curMonthYear) {
                return next;
            } else if (displayMonthYear == nextMonthYear) {
                return prev;
            } else {
                return null;
            }
        }
    }
    return null;
}

start = function() {
    log("start")
    if (myInterval == null) {
        myInterval = setInterval(check, interval);
    }
}

// <div class="tw-sr-only" role="alert" data-testid="loading-indicator">Loading...</div>
isLoading = function() {
    return $("div[data-testid='loading-indicator']") > 0;
}

var autoRetry = false;
var lastUrl = "";
setInterval(function() {
    log("URL: " + location.href);
    if (location.href.endsWith("appointment-select") && !lastUrl.endsWith("appointment-select")){
        var appSelInterval = setInterval(function() {
            log("is it time to add buttons to appointment-select yet?");
            if ($("h1") != null) {
                log("adding buttons");

                var origHtml = $("h1").parent().html();
                var newHtml = origHtml + " <div class=\"tw-pb-6\">";
                newHtml += "<h2 class='tw-text-xl tw-font-bold'>TurboVax Appointment Checker</h2>"
                newHtml += "<button id='start' type='button' style='background-color: #4CAF50; border: none; color: white; padding: 10px 15px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;'>Start</button> ";
                newHtml += "<button id='stop' type='button' style='background-color: #AF4C50; border: none; color: white; padding: 10px 15px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;'>Stop</button> ";
                newHtml += "</div>";
                $("h1").parent().html(newHtml);

                $("#start").click(start);
                $("#stop").click(stop);

                clearInterval(appSelInterval);
            }
        }, 100);
    } else if (location.href.endsWith("location-search") && (lastUrl.endsWith("location-select") || lastUrl.endsWith("screening"))) {
        var shouldRetry = lastUrl.endsWith("location-select") && autoRetry == true;
        var locSrchInterval = setInterval(function() {
            log("is it time to add the checkbox to location-search yet?");
            if ($("h1") != null) {
                log("adding checkbox");

                var newHtml = " <div class=\"tw-pb-6\">";
                newHtml += "<h2 class='tw-text-xl tw-font-bold'>TurboVax Appointment Checker</h2>"
                if (autoRetry == true) {
                    newHtml += "<input type='checkbox' id='autoRetry' checked> Auto retry";
                } else {
                    newHtml += "<input type='checkbox' id='autoRetry'> Auto retry";
                }
                newHtml += "</div>";
                $(newHtml).insertAfter($("p:contains('Good news')"));

                $("#autoRetry").change(function() {
                    if (this.checked) {
                        log("auto retry enabled");
                        autoRetry = true;
                    } else {
                        log("auto retry disabled");
                        autoRetry = false;
                    }
                });

                log("auto retry: " + autoRetry);
                // if we got here from location-select and autoRetry is true, try again
                if (shouldRetry) {
                    // don't click the button unless it's there
                    if ($("button[data-testid='location-search-page-continue']").length > 0) {
                        clearInterval(locSrchInterval);
                        var continueInterval = setInterval(function() {
                            log("try again");
                            $("button[data-testid='location-search-page-continue']").click();
                            clearInterval(continueInterval);
                        }, 400);
                    }
                } else {
                    log("not trying again");
                    clearInterval(locSrchInterval);
                }
            }
        }, 100);
    } else if (location.href.endsWith("location-select") && lastUrl.endsWith("location-search") && autoRetry == true) {
        var locSelInterval = setInterval(function() {
            log("is it time to select?");

            if ($("h1") != null && !isLoading()) {
                if ($("div[data-testid='location-select-location']").length > 0){
                    clearInterval(locSelInterval);
                    log("sites found");
                    autoRetry = false;
                    cookieDownAudio.play();
                    alert("Pick your appointment site!")
                } else if ($("p:contains('There are no locations nearby that have availability.')").length == 1) {
                    clearInterval(locSelInterval);
                    log("Going back!");
                    $("button[data-testid='back-button-header']").click();
                }
            }
        }, 500);
    }
    lastUrl = location.href;
}, 250);
