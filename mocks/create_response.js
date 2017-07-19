const deepEqual = require('deep-equal');
const each = require('seebigs-each');
const statusCodes = require('./status_codes.js');
const URL = require('../utils/url.js');

function Body (body) {
    let bodyText = '';

    if (typeof body === 'string') {
        bodyText = body;
    } else {
        bodyText = JSON.stringify(body);
    }

    this.bodyUsed = false;
    this.text = function () {
        if (!this.bodyUsed) {
            this.bodyUsed = true;
            return Promise.resolve(bodyText);
        }
    }
}

function Json () {
    this.json = function() {
        return this.text().then(function (text) {
            return JSON.parse(text);
        }).catch(function (e) {
            return;
        });
    }
}

function Request (url, options) {
    this.url = url;
    this.method = (options.method && options.method.toUppercase()) || 'GET';
    this.headers = options.headers || {};
    this.body = options.body;
    this.mode = options.mode || 'cors';
    this.credentials = options.credentials || 'omit';
    this.referrer = options.referrer || 'client';

    Body.call(this, options.body);
    Json.call(this);
}

function FetchResponse (url, options, response) {
    this.url = url;
    this.ok = options.ok || true;
    this.status = options.status || 200;
    this.statusText = options.statusText || statusCodes[this.status];
    this.type = options.type || 'basic';
    this.headers = options.headers || {};

    Body.call(this, typeof response === 'object' ? response.body : response);
    Json.call(this);
}

function XhrResponse (url, options, response) {
    this.url = url;
    this.ok = options.ok || true;
    this.status = options.status || 200;
    this.statusText = options.statusText || statusCodes[this.status];
    this.type = options.type || 'basic';
    this.headers = options.headers || {};

    Body.call(this, typeof response === 'object' ? response.body : response);
    Json.call(this);
}

function contains (obj, value) {
    if (typeof obj.indexOf === 'function') {
        return obj.indexOf(value) !== -1;
    } else if (typeof value === 'object') {
        let hasAll = true;
        each(value, function (v, k) {
            if (obj[k] !== v) {
                hasAll = false;
            }
        });
        return hasAll;
    }
}

function matchesRequest (mock, request) {
    let matches = true;

    each(mock.exact, function (value, predicate) {
        if (typeof value === 'object') {
            each(value, function (v, k) {
                if (!request[predicate] || !deepEqual(request[predicate][k], v)) {
                    matches = false;
                    return false; // drop out of loop
                }
            });
        } else {
            if (request[predicate] !== value) {
                matches = false;
                return false; // drop out of loop
            }
        }
    });

    each(mock.contains, function (value, predicate) {
        if (typeof value === 'object') {
            each(value, function (v, k) {
                if (!request[predicate] || !contains(request[predicate][k], v)) {
                    matches = false;
                    return false; // drop out of loop
                }
            });
        } else {
            if (request[predicate].indexOf(value) === -1) {
                matches = false;
                return false; // drop out of loop
            }
        }
    });

    return matches;
}

function buildResponseObject () {

}

function createResponse (featherMockRequest, responseType, url, mocks, options) {
    let parsedUrl = new URL(url);
    let request = new Request(parsedUrl, options);
    let mockResponse = {};

    let debug = featherMockRequest._debug;
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
            if (mock.response.timeout) {
                mockResponse.timeout = mock.response.timeout;
            } else if (mock.response.error) {
                mockResponse.error = mock.response.error;
            } else {
                if (responseType === 'fetch') {
                    mockResponse.success = new FetchResponse(parsedUrl, options, mock.response);
                } else if (responseType === 'xhr') {
                    mockResponse.success = new XhrResponse(parsedUrl, options, mock.response);
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
