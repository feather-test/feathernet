const createResponse = require('./create_response.js');
const statusCodes = require('./status_codes.js');
const each = require('seebigs-each');

function createMockXhr (mocks) {
    let feathernet = this;

    function MockXhr () {
        let responseHeaders = {};
        let options = {
            headers: {},
        };

        this.readyState = 0; // UNSENT
        this.response = '';
        this.responseType = '';
        this.responseUrl = '';
        this.status = 0;
        this.timeout = 0;
        this.withCredentials = false;

        Object.defineProperty(this, 'responseText', {
            get: function () {
                if (this.response) {
                    return typeof this.response === 'string' ? this.response : JSON.stringify(this.response);
                }
                return '';
            },
            enumerable: true,
        });

        Object.defineProperty(this, 'statusText', {
            get: function () {
                return statusCodes[this.status] || '';
            },
            enumerable: true,
        });

        this.abort = function(){};
        this.onerror = function(){};
        this.onload = function(){};
        this.onprogress = function(){};
        this.onreadystatechange = function(){};
        this.ontimeout = function(){};

        this.getAllResponseHeaders = function () {
            let ret = [];
            each(responseHeaders, function (v, k) {
                ret.push(k + ': ' + v);
            });
            return ret.join('\n');
        };

        this.getResponseHeader = function (name) {
            return responseHeaders[name] || null;
        };

        this.setRequestHeader = function (name, value) {
            options.headers[name] = value;
        };

        this.open = function (method, url, async) {
            options.method = method;
            this.readyState = 1; // OPENED
            this.onreadystatechange();
            this.responseUrl = url;
        };

        this.send = function (body) {
            options.body = body;

            let mockXhr = this;

            MockXhr.calls.push({ url: mockXhr.responseUrl });

            setTimeout(function () {
                mockXhr.readyState = 2; // HEADERS_RECEIVED
                mockXhr.onreadystatechange();

                mockXhr.readyState = 3; // LOADING
                mockXhr.onreadystatechange();
                mockXhr.onprogress();

                options.credentials = mockXhr.withCredentials;
                let mockResponse = createResponse(feathernet, 'xhr', mockXhr.responseUrl, mocks, options);
                let mockSuccess = mockResponse.success;
                if (mockSuccess) {
                    responseHeaders = mockSuccess.headers;
                    mockXhr.status = mockSuccess.status;
                    mockXhr.response = mockSuccess.body ? (typeof mockSuccess.body === 'string' ? mockSuccess.body : JSON.stringify(mockSuccess.body)) : '';
                }

                mockXhr.readyState = 4; // DONE
                mockXhr.onreadystatechange();

                if (mockSuccess) {
                    mockXhr.onload();
                } else if (mockResponse.error) {
                    mockXhr.status = 400;
                    mockXhr.onerror(mockResponse.error);
                } else if (mockResponse.timeout) {
                    mockXhr.ontimeout();
                }
            }, 1);
        };
    };

    MockXhr.calls = [];

    return MockXhr;
}

module.exports = createMockXhr;
