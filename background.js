// set initial notification type
if (typeof browser !== "undefined") {
    let getArnoldAlerts = browser.storage.sync.get(["arnoldAlerts"]);
    getArnoldAlerts.then(
        function(item){
            if (typeof item.arnoldAlerts === "undefined") {
                browser.storage.sync.set({"arnoldAlerts": true});
            }
        },
        function(error){
            console.log(error);
        });

} else {
    chrome.storage.sync.get(["arnoldAlerts"], function(item) {
        if (typeof item.arnoldAlerts === "undefined") {
            chrome.storage.sync.set({"arnoldAlerts": true}, function(){});
        }
    });
}