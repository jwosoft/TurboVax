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
}

log("content script injected");

var turboTimeAudio = new Audio(chrome.runtime.getURL("audio/turbo-time.mp3"));
var cookieDownAudio = new Audio(chrome.runtime.getURL("audio/put-cookie-down.mp3"));

var msgReceived = false;
var apptsFound = false;

chrome.runtime.onMessage.addListener(function(message) {
    msgReceived = true;
    apptsFound = message.apptsFound;
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
    if ($("#choice-dollar").is(":checked") && isRunning) {
        if (msgReceived) {
            msgReceived = false;
            if (apptsFound){
                isRunning = false;
                log("found appointments");
                turboTimeAudio.play();
                alert("Pick your appointment time!");
            } else {
                log("no appointments found");
                $('#openSchedulingFrame').attr('src', function (i, val){return val;});
            }
        }
    }
}, 500);