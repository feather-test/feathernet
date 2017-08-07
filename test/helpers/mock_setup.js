const FeatherMockRequest = require('../../index.js');
const featherMockRequest = new FeatherMockRequest({ debug: true });

featherMockRequest.install();

featherMockRequest.mock('http://noresponse.com');

featherMockRequest.mock('http://errors.com', { error: 'Ooops sorry' });

featherMockRequest.mock('http://timesup.com', { timeout: 1000 });

featherMockRequest.mock('https://greetings.com', 'HELLO');

featherMockRequest.mock('http://complex.com/response', {
    status: 418,
    headers: {
        'Allow-Access-Control-Origin': '*',
        'Content-Encoding': 'gzip',
    },
    body: { name: 'fusion' },
});

featherMockRequest.mock({
    exact: {
        method: 'GET',
        credentials: 'omit',
        headers: {},
        url: {
            protocol: 'https:',
            host: 'sub.example.com:3000',
            hostname: 'sub.example.com',
            port: '3000',
            pathname: '/cars/ford',
            hash: '#hash',
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
    body: { name: 'fusion' },
});
