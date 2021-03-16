$(document).ready(function () {
    $("#massvax").click(function () {
        chrome.tabs.create({ url: 'https://massvax.maryland.gov/' });
    });
    $("#beer").click(function () {
        chrome.tabs.create({ url: 'https://www.paypal.com/paypalme/jwomeara' });
    });
    $("#github").click(function () {
        chrome.tabs.create({ url: 'https://github.com/jwosoft/TurboVax' });
    });
    $("#settings").click(function () {
        updateNotificationSelect();
    });
    $("#saveSettings").click(function () {
        setNotificationType($("#notificationSelect").val());
    });
    $("#playNotification").click(function () {
        if ($("#notificationSelect").val() == "Turbo Man") {
            new Audio("audio/turbo-time.wav").play();
        } else {
            new Audio("audio/motion-tracker.wav").play();
        }
    });

    var setNotificationType = function(selection) {
        if (typeof browser !== "undefined") {
            browser.storage.sync.set({"arnoldAlerts": (selection == "Turbo Man")});
        } else {
            chrome.storage.sync.set({"arnoldAlerts": (selection == "Turbo Man")}, function(){});
        }
    }

    // set the notification type based on the selection
    var setNotificationSelect = function(arnoldAlerts) {
        if (arnoldAlerts) {
            $("#notificationSelect").val("Turbo Man");
        } else {
            $("#notificationSelect").val("Motion Tracker");
        }
    }

    // get the value from storage, and set the select
    var updateNotificationSelect = function() {
        if (typeof browser !== "undefined") {
            let getArnoldAlerts = browser.storage.sync.get(["arnoldAlerts"]);
            getArnoldAlerts.then(
                function(item){
                    setNotificationSelect(item.arnoldAlerts);
                },
                function(error){
                    log(error);
                });
        } else {
            chrome.storage.sync.get(["arnoldAlerts"], function(item) {
                setNotificationSelect(item.arnoldAlerts);
            });
        }
    }
});