const createMockAppendChild = require('./mocks/append_child.js');
const createMockFetch = require('./mocks/fetch.js');
const createMockXhr = require('./mocks/xhr.js');
const createMockSendBeacon = require('./mocks/send_beacon.js');

const _window = window || {};
const _origWindowFetch = _window.fetch;
const _origWindowXhr = _window.XMLHttpRequest;
const _origWindowSendBeacon = _window.navigator && _window.navigator.sendBeacon;
const _origAppendChild = Node.prototype.appendChild;
const _global = global || {};
const _origNodeFetch = _global.fetch;
const _origNodeXhr = _global.XMLHttpRequest;
const _origNodeSendBeacon = _global.navigator && _global.navigator.sendBeacon;

/* Exposed for debugging while in Chrome */
_window._origWindowFetch = _origWindowFetch;
_window._origWindowXhr = _origWindowXhr;
_window._origAppendChild = _origAppendChild;

let debugMode = false;
let mocks = [];

let featherMockRequest = {

    install: function () {
        if (window) {
            window.fetch = createMockFetch.call(this, mocks);
            window.XMLHttpRequest = createMockXhr.call(this, mocks);
            if (window.navigator) {
                window.navigator.sendBeacon = createMockSendBeacon.call(this, mocks);
            }
        }
        if (global) {
            global.fetch = createMockFetch.call(this, mocks);
            global.XMLHttpRequest = createMockXhr.call(this, mocks);
            if (global.navigator) {
                global.navigator.sendBeacon = createMockSendBeacon.call(this, mocks);
            }
        }

        Node.prototype.appendChild = createMockAppendChild.call(this, _origAppendChild, mocks);
    },

    uninstall: function () {
        if (window) {
            window.fetch = _origWindowFetch;
            window.XMLHttpRequest = _origWindowXhr;
            if (window.navigator) {
                window.navigator = _origWindowSendBeacon;
            }
        }
        if (global) {
            global.fetch = _origNodeFetch;
            global.XMLHttpRequest = _origNodeXhr;
            if (global.navigator) {
                global.navigator = _origNodeSendBeacon;
            }
        }

        Node.prototype.appendChild = _origAppendChild;
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

    mockDirectory: function (request) {

    },

    mockScript: function (request, fileLocation) {
        mocks.push({
            request: request || {},
            response: { file: fileLocation }
        });
    },

    debug: function () {
        debugMode = true;
    },

    _debug: function (msg) {
        if (debugMode) {
            // console.log(typeof msg === 'string' ? msg : JSON.stringify(msg, null, 4));
        }
    },

}

module.exports = featherMockRequest;
