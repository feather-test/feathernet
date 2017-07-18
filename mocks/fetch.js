const deepEqual = require('deep-equal');
const each = require('seebigs-each');
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

function Response (url, options, body) {
    this.url = url;
    this.ok = options.ok || true;
    this.status = options.status || 200;
    this.statusText = options.statusText || 'OK';
    this.type = options.type || 'basic';
    this.headers = options.headers || {};

    Body.call(this, body);
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

function getResponse (url, options, mocks) {

    let parsedUrl = new URL(url);

    let request = new Request(parsedUrl, options);

    let response = '';

    each(mocks, function (mock) {
        if (matchesRequest(mock.request || {}, request)) {
            response = new Response(parsedUrl, options, mock.response.body);
            return false; // drop out of loop
        }
    });

    return response;
}

function createMockFetch (mocks) {
    return function mockFetch (url, options) {
        options = options || {};
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(getResponse(url, options, mocks));
            }, 1);
        });
    };
}

module.exports = createMockFetch;
