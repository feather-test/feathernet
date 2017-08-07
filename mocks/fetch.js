const createResponse = require('./create_response');

function createMockFetch (mocks) {
    let feathernet = this;

    function mockFetch (url, options) {
        options = options || {};
        mockFetch.calls.push({
            url: url,
        });

        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                let mockResponse = createResponse(feathernet, 'fetch', url, mocks, options);
                if (mockResponse.success) {
                    resolve(mockResponse.success);
                } else {
                    reject(mockResponse.error || mockResponse.timeout);
                }
            }, 1);
        });
    };

    mockFetch.calls = [];

    return mockFetch;
}

module.exports = createMockFetch;
