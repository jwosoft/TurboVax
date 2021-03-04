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
var countdown = 10;

var baseInterval = setInterval(function() {
    var loading = $("div:contains('Loading...')");
    if (loading.is(":hidden")) {
        var sorryVisible = $("span:contains('Sorry, we couldn\\'t find any open appointments.')");
        sorryVisible = sorryVisible.length > 0 && sorryVisible.is(":visible");

        // if we find appointment times, send a notification
        if ($(".subslotslist").length > 0) {
            log("iframe sees open appointments");
            chrome.runtime.sendMessage({sendBack: true, data: {apptsFound: true}});
        }
        // if we don't see any appointments
        else if (sorryVisible || countdown-- == 0) {
            log("iframe sees no open appointments");
            // Send message to top frame, for example:
            chrome.runtime.sendMessage({sendBack: true, data: {apptsFound: false}});
        }
    }
}, 500);