
describe('xhr', () => {

    describe('overrides in all environments', (expect) => {
        expect(window.XMLHttpRequest.name).toBe('MockXhr', 'browser');
        expect(XMLHttpRequest.name).toBe('MockXhr', 'node');
    });

    describe('intercepts xhr when installed', () => {

        describe('has a default response', (expect, done) => {
            let testUrl = 'http://noresponse.com';

            let r = new window.XMLHttpRequest();
            r.onreadystatechange = function () {
                if (r.readyState === 4) {
                    expect(r.responseUrl).toBe(testUrl, 'responseUrl');
                    expect(r.status).toBe(200, 'status');
                    expect(r.statusText).toBe('OK', 'statusText');
                    expect(r.getAllResponseHeaders()).toBe('', 'headers');
                    expect(r.response).toBe('', 'response');
                    expect(r.responseText).toBe('', 'responseText');
                    expect(r.responseType).toBe('', 'responseType');
                    done();
                }
            };
            r.open('GET', testUrl, true);
            r.send();
        });

        describe('responds with json', (expect, done) => {
            let testUrl = 'https://sub.example.com:3000/cars/ford?model=fusion&doors=4#hash';
            let r = new XMLHttpRequest();
            r.onreadystatechange = function () {
                if (r.readyState === 4) {
                    expect(r.status).toBe(200, 'status');
                    expect(JSON.parse(r.responseText)).toBe({ name:'fusion' }, 'json');
                    done();
                }
            };
            r.open('GET', testUrl, true);
            r.send();
        });

        describe('responds with text', (expect, done) => {
            let testUrl = 'https://greetings.com/say/hello/?a=2&b=3';
            let r = new XMLHttpRequest();
            r.onreadystatechange = function () {
                if (r.readyState === 4) {
                    expect(r.status).toBe(200, 'status');
                    expect(r.responseText).toBe('HELLO', 'text');
                    done();
                }
            };
            r.open('GET', testUrl, true);
            r.send();
        });

        describe('responds with complex response mock', (expect, done) => {
            let testUrl = 'http://complex.com/response';
            let r = new XMLHttpRequest();
            r.onreadystatechange = function () {
                if (r.readyState === 4) {
                    expect(r.status).toBe(418);
                    expect(r.statusText).toBe("I'm a teapot");
                    expect(r.getAllResponseHeaders()).toBe('Allow-Access-Control-Origin: *\nContent-Encoding: gzip');
                    expect(r.getResponseHeader('Content-Encoding')).toBe('gzip');
                    expect(JSON.parse(r.responseText)).toBe({ name: 'fusion' });
                    done();
                }
            };
            r.open('GET', testUrl, true);
            r.send();
        });

        describe('handles onerror', (expect, done) => {
            let testUrl = 'http://errors.com';
            let r = new XMLHttpRequest();
            r.onreadystatechange = function () {
                if (r.readyState === 4) {
                    if (r.status === 200) {
                        expect('success handler').toBe('skipped');
                    }
                }
            };
            r.open('GET', testUrl, true);
            r.onerror = function (e) {
                expect(e).toBe('Ooops sorry');
                done();
            };
            r.send();
        });

        describe('handles ontimeout', (expect, done) => {
            let testUrl = 'http://timesup.com';
            let r = new XMLHttpRequest();
            r.onreadystatechange = function () {
                if (r.readyState === 4) {
                    if (r.status === 200) {
                        expect('success handler').toBe('skipped');
                    }
                }
            };
            r.open('GET', testUrl, true);
            r.ontimeout = function () {
                expect(r.status).toBe(0);
                done();
            };
            r.send();
        });

        describe('handles loading events', (expect, done) => {
            let testUrl = 'https://greetings.com/say/hello/?a=2&b=3';
            let eventOrderActual = [];
            let eventOrderExpected = ['rdy1','rdy2','rdy3','progress','rdy4','load'];

            let r = new XMLHttpRequest();
            r.onreadystatechange = function () {
                eventOrderActual.push('rdy' + r.readyState);
            };
            r.open('GET', testUrl, true);
            r.onprogress = function () {
                eventOrderActual.push('progress');
            };
            r.onload = function () {
                eventOrderActual.push('load');
                expect(eventOrderActual).toBe(eventOrderExpected);
                done();
            };
            r.send();
        });

    });

});
