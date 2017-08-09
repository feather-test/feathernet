
function createMockSendBeacon (origSendBeacon, config) {
    function mockSendBeacon (url, data) {
        let mockedUrl = '';
        if (url) {
            mockedUrl = `http://${config.hostOverride}/${url}`;
            mockSendBeacon.calls.push({
                url: url,
            });
        }
        return origSendBeacon.call(this, mockedUrl, data);
    };

    mockSendBeacon.calls = [];

    return mockSendBeacon;
}

module.exports = createMockSendBeacon;
