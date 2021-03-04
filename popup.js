$(document).ready(function () {
    $("#massvax").click(function () {
        chrome.tabs.create({ url: 'https://massvax.maryland.gov/' });
    });
    $("#mtBank").click(function () {
        chrome.tabs.create({ url: 'https://www.umms.org/coronavirus/covid-vaccine/get-vaccine/mtb-stadium/verification' });
    });
    $("#beer").click(function () {
        chrome.tabs.create({ url: 'http://paypal.me/jwomeara' });
    });
    $("#github").click(function () {
        chrome.tabs.create({ url: 'https://github.com/jwosoft/TurboVax' });
    });
});