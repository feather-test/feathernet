const createMockFetch = require('./mocks/fetch.js');
// const mockXHR = require('./mocks/xhr.js');
// const mockSendBeacon = require('./mocks/sendBeacon.js');

const _origFetch = window.fetch;
const _origXHR = window.XMLHttpRequest;
const _origSendBeacon = navigator.sendBeacon;

let mocks = [];

let featherMockRequest = {

    install: function () {
        if (window) {
            window.fetch = createMockFetch(mocks);
        }
    },

    uninstall: function () {
        if (window) {
            window.fetch = _origFetch;
        }
    },

    mock: function (request, response) {
        mocks.push({
            request: request || {},
            response: response || {},
        });
    },

    clearMocks: function () {
        mocks.splice(0);
    },

    calls: function (url) {

    },

    clearCalls: function () {

    },

}

module.exports = featherMockRequest;
