const URL = require('../utils/url.js');

function normalizeRequest (url, options) {
    return {
        method: (options.method && options.method.toUppercase()) || 'GET',
        url: new URL(url),
        headers: options.headers || {},
        body: options.body,
        mode: options.mode || 'cors',
        credentials: options.credentials || 'omit',
        referrer: options.referrer || 'client',
    };
}

function getResponse (url, options, mocks) {

    /*
    {
        request: {
            url: {
                exact: {
                    host: 'example.com',
                },
                contains: {
                    params: {
                        model: 'fusion',
                    }
                },
            },
        },
        response: {
            status: 200,
            headers: {},
            data: responseData,
        }
    }
    */

    let request = normalizeRequest(url, options);

    let response = {
        ok: true,
        status: 200,
        json: function () {
            return Promise.resolve({
                name: 'fusion',
            });
        }
    };

    mocks.forEach(function (mock) {
        if (matchesRequest(mock, request)) {

            return false; // drop out of loop
        }
    });

    return {
        ok: true,
        status: 200,
        json: function () {
            return Promise.resolve({
                name: 'fusion',
            });
        }
    };
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
