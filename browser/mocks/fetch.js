const URL = require('../../utils/url');

function createMockFetch (origFetch, config) {
    function mockFetch (url, options) {
        options = options || {};
        url = new URL(url);

        mockFetch.calls.push(url);

        url.host = config.hostOverride;

        return origFetch.call(this, url.href, options);
    };

    mockFetch.calls = [];

    return mockFetch;
}

module.exports = createMockFetch;
