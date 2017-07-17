const featherMockRequest = require('../../index.js');
const url = 'https://example.com/cars/ford?model=fusion&doors=4'
const responseData = { name: 'fusion' };

describe('fetch', () => {

    describe('intercepts fetch when installed', (expect, done) => {
        featherMockRequest.install();

        featherMockRequest.mock({
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
        }, {
            status: 200,
            headers: {},
            data: responseData,
        });

        window.fetch(url)
            .then((response) => {
                if (response && response.ok) {
                    response.json().then(function (json) {
                        expect(json).toBe(responseData);
                        done();
                    });
                }
            });

        featherMockRequest.uninstall();
    });

});
