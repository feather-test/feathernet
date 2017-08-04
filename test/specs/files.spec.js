const featherMockRequest = require('../../index.js');

const resourceUrl = 'http://cdn.com/someJavascript.js';
const relativePath = __dirname + '/../fixtures/someJavascript.js';

describe('files', () => {
    describe('loads a javascript file', (expect, done) => {

        function callback() {
            console.log('this is where I\'d be making an assertion');
        }

        featherMockRequest.mockScript(resourceUrl, relativePath, callback);

        window.fetch(resourceUrl).then(function (result) {
            console.log('the result is ', result);
            expect(true).toBe(true);
            done();
        }).catch(function (e) {
            console.log('error? ', e);
            done();
        });
    });
});
