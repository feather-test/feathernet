const createResponse = require('create_response');

function createMockFetch (mocks) {
    let featherMockRequest = this;
    return function mockFetch (url, options) {
        options = options || {};
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                let mockResponse = createResponse(featherMockRequest, 'fetch', url, mocks, options);
                if (mockResponse.success) {
                    resolve(mockResponse.success);
                } else {
                    reject(mockResponse.error || mockResponse.timeout);
                }
            }, 1);
        });
    };
}

module.exports = createMockFetch;
