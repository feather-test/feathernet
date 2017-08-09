const FeatherNetBrowser = require('../../browser');
const featherNet = new FeatherNetBrowser({
    hostOverride: 'localhost:9876',
});

featherNet.addMocks([
    {
        request: 'http://noresponse.com'
    },
    {
        request: 'http://errors.com',
        response: {
            status: 500,
        }
    },
    {
        request: 'http://greetings.com',
        response: 'hello',
    },
    {
        request: 'http://complex.com/response',
        response: {
            status: 202,
            headers: {
                'X-Custom-Header-Stuff': 'foobar',
            },
            body: { name: 'fusion' },
        },
    },
    {
        request: {
            exact: {
                method: 'GET',
                headers: {},
                url: {
                    protocol: 'http:',
                    host: 'sub.example.com:3000',
                    hostname: 'sub.example.com',
                    port: '3000',
                    pathname: '/cars/ford',
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
        },
        response: {
            body: { name: 'fusion' },
        },
    },
    {
        request: '/javascripts/somefile.js',
        response: {
            file: __dirname + '/../fixtures/somefile.js',
        }
    },
]);

featherNet.install();
