const createResponse = require('./create_response.js');

function createMockXhr (mocks) {
    let featherMockRequest = this;
    return function MockXhr () {
        let options = {
            headers: {},
        };

        this.readyState = 0; // UNSENT
        this.response = '';
        this.responseText = null;
        this.responseType = '';
        this.responseUrl = '';
        this.status = 0;
        this.statusText = '';
        this.timeout = 0;
        this.withCredentials = false;

        this.abort = function(){};
        this.onload = function(){};
        this.onprogress = function(){};
        this.onreadystatechange = function(){};

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
            let mockResponse = createResponse(featherMockRequest, 'xhr', this.responseUrl, options, mocks);

            if (mockResponse.success) {
                // this.response =
            } else {

            }

            this.readyState = 4; // DONE
            this.onreadystatechange();
            this.onload();
        };
    };
}

module.exports = createMockXhr;
