
function createMockSendBeacon () {
    let featherMockRequest = this;

    function mockSendBeacon (url, data) {
        mockSendBeacon.calls.push({
            url: url,
        });
    };

    mockSendBeacon.calls = [];

    return mockSendBeacon;
}

module.exports = createMockSendBeacon;
