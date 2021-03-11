chrome.runtime.onMessage.addListener(function (message, sender) {
    if (message.sendBack) {
        console.log("refresh message received");
        chrome.tabs.sendMessage(sender.tab.id, message);
    }
});

var arnoldAlerts = false;
if (typeof browser !== "undefined") {
    browser.storage.sync.set({"arnoldAlerts": arnoldAlerts});
} else {
    console.log("setting alert type");
    chrome.storage.sync.set({"arnoldAlerts": arnoldAlerts}, function(){});
}