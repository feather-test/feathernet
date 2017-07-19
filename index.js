const createMockFetch = require('./mocks/fetch.js');
const createMockXhr = require('./mocks/xhr.js');
// const createMockSendBeacon = require('./mocks/sendBeacon.js');

const _window = window || {};
const _origWindowFetch = _window.fetch;
const _origWindowXhr = _window.XMLHttpRequest;
const _origWindowSendBeacon = _window.navigator && _window.navigator.sendBeacon;
const _global = global || {};
const _origNodeFetch = _global.fetch;
const _origNodeXhr = _global.XMLHttpRequest;
const _origNodeSendBeacon = _global.navigator && _global.navigator.sendBeacon;

let debugMode = false;
let mocks = [];

let featherMockRequest = {

    install: function () {
        if (window) {
            window.fetch = createMockFetch.call(this, mocks);
            window.XMLHttpRequest = createMockXhr.call(this, mocks);
        }
        if (global) {
            global.fetch = createMockFetch.call(this, mocks);
            global.XMLHttpRequest = createMockXhr.call(this, mocks);
        }
    },

    uninstall: function () {
        if (window) {
            window.fetch = _origFetch;
            window.XMLHttpRequest = _origXhr;
        }
        if (global) {
            global.fetch = _origFetch;
            global.XMLHttpRequest = _origXhr;
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
