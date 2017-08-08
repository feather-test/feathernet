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

const logLevels = {
    'QUIET': 0,
    'ERROR': 1,
    'WARN': 2,
    'INFO': 3,
};

/* Exposed for debugging while in Chrome */
_window._origWindowFetch = _origWindowFetch;
_window._origWindowXhr = _origWindowXhr;
_window._origAppendChild = _origAppendChild;

function constructConfig (config) {
    config = config || {};

    var defaultConfig = {
        server: 'http://localhost:9005',
        debug: false
    };

    return Object.assign({}, defaultConfig, config);
}

function Feathernet (config) {
    var mocks = [];
    config = constructConfig(config);

    this.install = function () {
        if (window) {
            window.fetch = createMockFetch.call(this, mocks, config);
            window.XMLHttpRequest = createMockXhr.call(this, mocks, config);
            if (window.navigator) {
                window.navigator.sendBeacon = createMockSendBeacon.call(this, mocks, config);
            }
        }
        if (global) {
            global.fetch = createMockFetch.call(this, mocks, config);
            global.XMLHttpRequest = createMockXhr.call(this, mocks, config);
            if (global.navigator) {
                global.navigator.sendBeacon = createMockSendBeacon.call(this, mocks, config);
            }
        }

        Node.prototype.appendChild = createMockAppendChild.call(this, _origAppendChild, mocks, config);
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
        mocks.push({
            request: request || {},
            response: response || {}
        });
    };

    this.clearMocks = function () {
        mocks.splice(0);
    };

    this.mockScript = function (request, fileLocation) {
        mocks.push({
            request: request || {},
            response: { file: fileLocation }
        });
    };

    this._log = function (type, msg) {
        let logLevel = logLevels[config.log];
        if (typeof logLevel === 'undefined') {
            logLevel = 1;
        }

        let msgLevel = logLevels[type];
        if (msgLevel <= logLevel) {
            console.log(typeof msg === 'string' ? msg : JSON.stringify(msg, null, 4));
        }
    };
}

module.exports = Feathernet;
