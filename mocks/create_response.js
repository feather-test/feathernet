const Body = require('./body.js');
const createHeaders = require('./create_headers.js');
const each = require('seebigs-each');
const Json = require('./json.js');
const matchesRequest = require('../lib/matches_request.js');
const Request = require('../lib/request.js');
const statusCodes = require('./status_codes.js');
const URL = require('../utils/url.js');

function AppendChildResponse (url, mock) {
    this.url = url;
    this.file = mock.response.file;
    this.newSrc = 'http://localhost:9005' + this.file;
}

function FetchResponse (url, options, response) {
    this.url = url;
    this.ok = options.ok || true;
    this.status = response.status || options.status || 200;
    this.type = response.type || options.type || 'basic';
    this.headers = createHeaders(response.headers || options.headers);

    Object.defineProperty(this, 'statusText', {
        get: function () { return statusCodes[this.status]; },
        enumerable: true
    });

    Body.call(this, typeof response === 'object' ? response.body : response);
    Json.call(this);
}

function XhrResponse (options, response) {
    this.status = response.status || options.status || 200;
    this.headers = response.headers || options.headers || {};
    this.body = typeof response === 'object' ? response.body : response;
}

function createResponse (feathernet, responseType, url, mocks, options) {
    let parsedUrl = new URL(url);
    let request = new Request(parsedUrl, options);
    let mockResponse = {};

    let debug = feathernet._debug;
    let matchFound = false;
    let unmatchedMocks = [];

    each(mocks, function (mock) {
        if (typeof mock.request === 'string') {
            mock.request = {
                contains: {
                    url: {
                        href: mock.request,
                    },
                },
            };
        }

        if (matchesRequest(mock.request || {}, request)) {
            if (mock.response && mock.response.timeout) {
                mockResponse.timeout = mock.response.timeout;
            } else if (mock.response && mock.response.error) {
                mockResponse.error = mock.response.error;
            } else {
                if (responseType === 'fetch') {
                    mockResponse.success = new FetchResponse(url, options, mock.response);
                } else if (responseType === 'xhr') {
                    mockResponse.success = new XhrResponse(options, mock.response || {});
                } else if (responseType === 'file') {
                    mockResponse.success = new AppendChildResponse(url, mock);
                }
            }
            matchFound = true;
            return false; // drop out of loop
        } else {
            unmatchedMocks.push(mock.request);
        }
    });

    if (!matchFound && unmatchedMocks.length) {
        debug('\n===\nRequest');
        debug(request);
        unmatchedMocks.forEach(function (unMock) {
            debug('\nDoes not match');
            debug(unMock);
        });
    }

    return mockResponse;
}

module.exports = createResponse;
