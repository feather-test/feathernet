
const FeatherNetBrowser = require('../../browser');
const featherNet = new FeatherNetBrowser({
    hostOverride: 'localhost:9876',
});

featherNet.mock('http://example.com', 'BLAH');

featherNet.install();

describe('responds with text', (expect, done) => {
    let testUrl = 'http://greetings.com/say/hello/?a=2&b=3';
    window.fetch(testUrl)
        .then((response) => {
            if (response && response.ok) {
                response.text().then(function (text) {
                    expect(response.status).toBe(200, 'status');
                    expect(text).toBe('hello');
                    done();
                });
            } else {
                expect('response from ' + testUrl).toBe('ok');
                done();
            }
        });
});
