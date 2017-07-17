const mockFetch = require('./mocks/fetch.js');
// const mockXHR = require('./mocks/xhr.js');
// const mockSendBeacon = require('./mocks/sendBeacon.js');

let featherMockRequest = {
    _origFetch: window.fetch,
    _origXHR: window.XMLHttpRequest,
    _origSendBeacon: navigator.sendBeacon,

    install: function () {
        if (window) {
            window.fetch = mockFetch;
        }
    },

    uninstall: function () {

    },

    mock: function (url, response) {

    },

    calls: function (url) {

    },

    clearCalls: function () {

    },

}

module.exports = featherMockRequest;
