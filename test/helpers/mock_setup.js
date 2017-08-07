const Feathernet = require('../../index.js');
const feathernet = new Feathernet({ debug: true });

feathernet.install();

feathernet.mock('http://noresponse.com');

feathernet.mockScript('/someJavascript.js', __dirname + '/../fixtures/someJavascript.js');

feathernet.mock('http://errors.com', { error: 'Ooops sorry' });

feathernet.mock('http://timesup.com', { timeout: 1000 });

feathernet.mock('https://greetings.com', 'HELLO');

feathernet.mock('http://complex.com/response', {
    status: 418,
    headers: {
        'Allow-Access-Control-Origin': '*',
        'Content-Encoding': 'gzip',
    },
    body: { name: 'fusion' },
});

feathernet.mock({
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
