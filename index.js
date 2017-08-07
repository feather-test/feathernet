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

function constructConfig (config) {
    config = config || {};

    var defaultConfig = {
        server: 'localhost:9005',
        debug: false
    };

    return Object.assign({}, defaultConfig, config);
}

function FeatherMockRequest (config) {
    this.mocks = [];
    this.config = constructConfig(config);

    this.install = function () {
        if (window) {
            window.fetch = createMockFetch.call(this, this.mocks);
            window.XMLHttpRequest = createMockXhr.call(this, this.mocks);
            if (window.navigator) {
                window.navigator.sendBeacon = createMockSendBeacon.call(this, this.mocks);
            }
        }
        if (global) {
            global.fetch = createMockFetch.call(this, this.mocks);
            global.XMLHttpRequest = createMockXhr.call(this, this.mocks);
            if (global.navigator) {
                global.navigator.sendBeacon = createMockSendBeacon.call(this, this.mocks);
            }
        }

        Node.prototype.appendChild = createMockAppendChild.call(this, _origAppendChild, this.mocks);
    };

    this.uninstall = function () {
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
    };

    this.mock = function (request, response) {
        this.mocks.push({
            request: request || {},
            response: response || {}
        });
    };

    this.clearMocks = function () {
        this.mocks.splice(0);
    };

    this.mockScript = function (request, fileLocation) {
        this.mocks.push({
            request: request || {},
            response: { file: fileLocation }
        });
    };

    this._debug = function (msg) {
        if (this.config.debug) {
            // console.log(typeof msg === 'string' ? msg : JSON.stringify(msg, null, 4));
        }
    };
}

module.exports = FeatherMockRequest;
