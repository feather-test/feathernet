const featherMockRequest = require('../../index.js');
const url = 'https://example.com/cars/ford?model=fusion&doors=4'
const responseData = { name: 'fusion' };

describe('fetch', () => {

    describe('intercepts fetch when installed', (expect, done) => {
        featherMockRequest.install();

        featherMockRequest.mock({
            exact: {
                url: {
                    host: 'example.com',
                    params: {
                        model: 'fusion',
                        doors: '4',
                    },
                },
            },
            contains: {
                method: 'ET',
                url: {
                    host: 'ample',
                    params: {
                        model: 'fusion',
                    },
                },
            },
        }, {
            body: responseData,
        });

        window.fetch(url)
            .then((response) => {
                if (response && response.ok) {
                    response.json().then(function (json) {
                        expect(response.status).toBe(200, 'status');
                        expect(json).toBe(responseData);
                        done();
                    });
                } else {
                    expect('response from ' + url).toBe('ok with valid json');
                    done();
                }
            });

        featherMockRequest.uninstall();
    });

});
