
function createMockFetch (origFetch, config) {
    function mockFetch (url, options) {
        let mockedUrl = '';
        if (url) {
            mockedUrl = `http://${config.hostOverride}/${url}`;
            mockFetch.calls.push({
                url: url
            });
        }

        return origFetch.call(this, mockedUrl, options);
    };

    mockFetch.calls = [];

    return mockFetch;
}

module.exports = createMockFetch;
