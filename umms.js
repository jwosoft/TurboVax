// This should be injected into the following site:
// https://www.umms.org/coronavirus/covid-vaccine/get-vaccine/mtb-stadium/verification

// This script works in conjunction with umms-iframe.js to check for open vaccination
// appointments.  This script is listening for a message that will be sent from umms-iframe.js
// which has been injected into the iframe running on this page with URL
// https://signupandschedule.umm.edu/mychart/SignUpAndSchedule/EmbeddedSchedule?id=RES^84002860&VT=22759)
// If the content script running in the iframe finds a message indicating that no appointments
// are available, then it will send a message which will be routed to this script, which
// tells us that it's time to refresh the iframe and check for new appointments.

// If we do not receive that message within a specified number of retries, we will alert
// the user to let them know that an appointment may be available.

var debug = true;
log = function(message) {
    if (debug) {
        console.log(message);
    }
};

var alertTitle = null;
var origTitle = null;
var alertInterval = null;
var alertTab = function(alertMsg) {
    alertTitle = alertMsg;
    origTitle = document.title;

    alertInterval = setInterval(function() {
        document.title = (document.title == alertTitle) ? origTitle : alertTitle;
    }, 1000);
};

$(document).mousemove(function(event){
    if (alertInterval != null) {
        clearInterval(alertInterval);
        alertInterval = null;
        document.title = origTitle;
        alertTitle = null;
        origTitle = null;
    }
});

log("content script injected");

var turboTimeAudio = new Audio(chrome.runtime.getURL("audio/turbo-time.mp3"));
var motionTrackerAudio = new Audio(chrome.runtime.getURL("audio/motion-tracker.mp3"));
var arnoldAlerts = true;

let updateAlertType = function() {
    if (typeof browser !== "undefined") {
        let getArnoldAlerts = browser.storage.sync.get(["arnoldAlerts"]);
        getArnoldAlerts.then(
            function(item){
                arnoldAlerts = item.arnoldAlerts;
            },
            function(error){
                log(error);
            });
    } else {
        chrome.storage.sync.get(["arnoldAlerts"], function(item) {
            arnoldAlerts = item.arnoldAlerts;
        });
    }
}

var audioAlert = function() {
    if (arnoldAlerts) {
        turboTimeAudio.play();
    } else {
        motionTrackerAudio.play();
    }
}

var msgReceived = false;
var apptsFound = false;

chrome.runtime.onMessage.addListener(function(message) {
    if (message.sendBack) {
        msgReceived = true;
        apptsFound = message.data.apptsFound;
    }
});

var isRunning = false;

var turboHtml = "<div><h3>TurboVax Appointment Checker</h3>";
turboHtml += "<button id='start' type='button' style='background-color: #4CAF50; border: none; color: white; padding: 10px 15px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;'>Start</button> ";
turboHtml += "<button id='stop' type='button' style='background-color: #AF4C50; border: none; color: white; padding: 10px 15px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;'>Stop</button> ";
turboHtml += "</div>";
$(turboHtml).insertBefore($("#scheduleContainer"));

$("#start").click(function() {isRunning = true;});
$("#stop").click(function() {isRunning = false;});

var baseInterval = setInterval(function() {
    // check the notification alerts
    updateAlertType();

    if ($("#choice-dollar").is(":checked") && isRunning) {
        if (msgReceived) {
            msgReceived = false;
            if (apptsFound){
                isRunning = false;
                log("found appointments");
                audioAlert();
                alertTab("TurboVax Alert");
            } else {
                log("no appointments found");
                $('#openSchedulingFrame').attr('src', function (i, val){return val;});
            }
        }
    }
}, 500);