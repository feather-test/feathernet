// const createMockAppendChild = require('./mocks/appendChild');
const createMockFetch = require('./mocks/fetch');
// const createMockXhr = require('./mocks/xhr');
// const createMockSendBeacon = require('./mocks/sendBeacon');

const _window = typeof window === 'undefined' ? {} : window;
const _origWindowFetch = _window.fetch;
const _origWindowXhr = _window.XMLHttpRequest;
const _origWindowSendBeacon = _window.navigator && _window.navigator.sendBeacon;
const _origAppendChild = Node.prototype.appendChild;
const _global = typeof global === 'undefined' ? {} : global;
const _origNodeFetch = _global.fetch;
const _origNodeXhr = _global.XMLHttpRequest;
const _origNodeSendBeacon = _global.navigator && _global.navigator.sendBeacon;

/* Exposed for debugging while in Chrome */
_window._origWindowFetch = _origWindowFetch;
_window._origWindowXhr = _origWindowXhr;
_window._origAppendChild = _origAppendChild;

function FeatherNetBrowser (config) {

    this.install = function () {
        // Node.prototype.appendChild = createMockAppendChild.call(this, _origAppendChild, mocks, config);
        if (window) {
            window.fetch = createMockFetch(_origWindowFetch, config);
            // window.XMLHttpRequest = createMockXhr.call(this, mocks, config);
            // if (window.navigator) {
            //     window.navigator.sendBeacon = createMockSendBeacon.call(this, mocks, config);
            // }
        }
        if (global) {
            global.fetch = createMockFetch(_origNodeFetch, config);
            // global.XMLHttpRequest = createMockXhr.call(this, mocks, config);
            // if (global.navigator) {
            //     global.navigator.sendBeacon = createMockSendBeacon.call(this, mocks, config);
            // }
        }
    };

    this.uninstall = function () {
        // Node.prototype.appendChild = _origAppendChild;
        if (window) {
            window.fetch = _origWindowFetch;
            // window.XMLHttpRequest = _origWindowXhr;
            // if (window.navigator) {
            //     window.navigator = _origWindowSendBeacon;
            // }
        }
        if (global) {
            global.fetch = _origNodeFetch;
            // global.XMLHttpRequest = _origNodeXhr;
            // if (global.navigator) {
            //     global.navigator = _origNodeSendBeacon;
            // }
        }
    };

    this.mock = function (request, response) {
        (_origWindowFetch || _origNodeFetch)('http://localhost:9877/feathernet-mock', { method: 'post' });
    };

    this.clearMocks = function () {
        (_origWindowFetch || _origNodeFetch)('http://localhost:9877/feathernet-clearMocks', { method: 'post' });
    };

    this.clearMocks();
}

module.exports = FeatherNetBrowser;
