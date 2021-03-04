chrome.runtime.onMessage.addListener(function(message, sender) {
    if (message.sendBack) {
        console.log("refresh message received");
        chrome.tabs.sendMessage(sender.tab.id, message.data);
    }
});