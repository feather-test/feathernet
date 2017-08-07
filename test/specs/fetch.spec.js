
describe('fetch', () => {

    describe('overrides in all environments', (expect) => {
        expect(window.fetch.name).toBe('mockFetch', 'browser');
        expect(fetch.name).toBe('mockFetch', 'node');
    });

    describe('intercepts fetch when installed', () => {

        describe('has a default response', (expect, done) => {
            let testUrl = 'http://noresponse.com';
            fetch(testUrl)
                .then((response) => {
                    if (response && response.ok) {
                        response.text().then(function (text) {
                            expect(response.url).toBe(testUrl, 'url');
                            expect(response.status).toBe(200, 'status');
                            expect(response.statusText).toBe('OK', 'statusText');
                            expect(text).toBe(void 0, 'text');
                            done();
                        });
                    } else {
                        expect('response from ' + testUrl).toBe('ok');
                        done();
                    }
                });
        });

        describe('responds with json', (expect, done) => {
            let testUrl = 'https://sub.example.com:3000/cars/ford?model=fusion&doors=4#hash';
            window.fetch(testUrl)
                .then((response) => {
                    if (response && response.ok) {
                        response.json().then(function (json) {
                            expect(response.status).toBe(200, 'status');
                            expect(json).toBe({ name: 'fusion' });
                            done();
                        });
                    } else {
                        expect('response from ' + testUrl).toBe('ok with valid json');
                        done();
                    }
                });
        });

        describe('responds with text', (expect, done) => {
            let testUrl = 'https://greetings.com/say/hello/?a=2&b=3';
            window.fetch(testUrl)
                .then((response) => {
                    if (response && response.ok) {
                        response.text().then(function (text) {
                            expect(response.status).toBe(200, 'status');
                            expect(text).toBe('HELLO');
                            done();
                        });
                    } else {
                        expect('response from ' + testUrl).toBe('ok');
                        done();
                    }
                });
        });

        describe('responds with complex response mock', (expect, done) => {
            let testUrl = 'http://complex.com/response';
            window.fetch(testUrl)
                .then((response) => {
                    if (response && response.ok) {
                        response.json().then(function (json) {
                            expect(response.status).toBe(418, 'status');
                            expect(response.statusText).toBe("I'm a teapot", 'statusText');
                            expect(response.headers.get('Allow-Access-Control-Origin')).toBe('*');
                            expect(response.headers.get('Content-Encoding')).toBe('gzip');
                            expect(json).toBe({ name: 'fusion' });
                            done();
                        });
                    } else {
                        expect('response from ' + testUrl).toBe('ok with valid json');
                        done();
                    }
                });
        });

        describe('handles error', (expect, done) => {
            let testUrl = 'http://errors.com';
            window.fetch(testUrl)
                .then((response) => {
                    expect('response from ' + testUrl).toBe('an error');
                    done();
                })
                .catch(function (err) {
                    expect(err).toBe('Ooops sorry');
                    done();
                });
        });

        describe('handles timeout', (expect, done) => {
            let testUrl = 'http://timesup.com';
            window.fetch(testUrl)
                .then((response) => {
                    expect('response from ' + testUrl).toBe('a timeout');
                    done();
                })
                .catch(function (timeout) {
                    expect(timeout).toBe(1000);
                    done();
                });
        });

    });

});
