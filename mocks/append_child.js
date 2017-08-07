const createResponse = require('./create_response.js');

function createMockAppendChild (origAppendChild, mocks, config) {
    let feathernet = this;

    function mockAppendChild (elem) {
        if (!elem) { return; }
        let url = elem.src;

        if (url) {
            mockAppendChild.calls.push({
                url: url,
            });

            let targetElem = this;

            let mockResponse = createResponse(feathernet, 'file', url, mocks, null, config);
            if (mockResponse.success) {
                elem.src = mockResponse.success.newSrc;
                origAppendChild.call(targetElem, elem);
            } else {
                if (typeof elem.onerror === 'function') {
                    elem.onerror();
                }
            }

        } else {
            origAppendChild.call(targetElem, elem);
        }
    }

    mockAppendChild.calls = [];

    return mockAppendChild;
}



module.exports = createMockAppendChild;
