const createMockFetch = require('./mocks/fetch.js');
const createMockXhr = require('./mocks/xhr.js');
// const createMockSendBeacon = require('./mocks/sendBeacon.js');

const _origFetch = window.fetch;
const _origXhr = window.XMLHttpRequest;
const _origSendBeacon = navigator.sendBeacon;

let debugMode = false;
let mocks = [];

let featherMockRequest = {

    install: function () {
        if (window) {
            window.fetch = createMockFetch.call(this, mocks);
            window.XMLHttpRequest = createMockXhr.call(this, mocks);
        }
    },

    uninstall: function () {
        if (window) {
            window.fetch = _origFetch;
            window.XMLHttpRequest = _origXhr;
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

    debug: function () {
        debugMode = true;
    },

    _debug: function (msg) {
        if (debugMode) {
            console.log(typeof msg === 'string' ? msg : JSON.stringify(msg, null, 4));
        }
    },

}

module.exports = featherMockRequest;
