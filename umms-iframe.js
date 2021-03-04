// This should be injected into the following site:
// https://signupandschedule.umm.edu/mychart/SignUpAndSchedule/EmbeddedSchedule?id=RES^84002860&VT=22759

// The site listed above runs as an iframe on the front facing site:
// https://www.umms.org/coronavirus/covid-vaccine/get-vaccine/mtb-stadium/verification
// The front facing site is running a complementary content script: umms.js

// This script checks the appointment signup page and checkes for the absence of the 
// 'Sorry, we couldn't find any open appointments.' message.  If that message is found
// it will send a message to the background page, which in turn routes the message to 
// the foreground page which contains this iframe, and tells it to refresh this iframe
// to check for new appointments.

var debug = true;
log = function(message) {
    if (debug) {
        console.log(message);
    }
}

log("iframe content script injected");

// number of attempts before giving up
var baseInterval = setInterval(function() {
    if ($("div:contains('Loading...')") > 0) {
        log("iframe is loading");
    } else {
        // if we hit on this, nothing was found
        if ($("span:contains('Sorry, we couldn\\'t find any open appointments.')").length > 0) {
            log("iframe sees no open appointments - sending refresh");
            // Send message to top frame, for example:
            chrome.runtime.sendMessage({sendBack:true, data:{refresh: true}});
        } else {
            log("iframe isn't loading, and doesn't say there are no appointments");
        }
    }
}, 1000);