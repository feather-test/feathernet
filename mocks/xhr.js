const createResponse = require('./create_response.js');
const statusCodes = require('./status_codes.js');
const each = require('seebigs-each');

function createMockXhr (mocks) {
    let featherMockRequest = this;

    return function MockXhr () {
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

            this.readyState = 2; // HEADERS_RECEIVED
            this.onreadystatechange();

            this.readyState = 3; // LOADING
            this.onreadystatechange();
            this.onprogress();

            options.credentials = this.withCredentials;
            let mockResponse = createResponse(featherMockRequest, 'xhr', this.responseUrl, mocks, options);
            let mockSuccess = mockResponse.success;
            if (mockSuccess) {
                responseHeaders = mockSuccess.headers;
                this.status = mockSuccess.status;
                this.response = mockSuccess.body ? (typeof mockSuccess.body === 'string' ? mockSuccess.body : JSON.stringify(mockSuccess.body)) : '';
            }

            this.readyState = 4; // DONE
            this.onreadystatechange();

            if (mockSuccess) {
                this.onload();
            } else if (mockResponse.error) {
                this.status = 400;
                this.onerror(mockResponse.error);
            } else if (mockResponse.timeout) {
                this.ontimeout();
            }
        };
    };
}

module.exports = createMockXhr;
