const server = require('./server.js');

function FeatherNetServer (inputConfig) {
    const defaultConfig = {
        server: {
            port: '9876',
            rootPath: '/',
            serveIndex: true,
        },
    };

    let config = Object.assign({}, defaultConfig, inputConfig);

    let mocks = [];
    let featherServer = {
        admin: null,
        adminConnection: null,
        app: null,
        appConnection: null,
        mocks: [],
        request: function () {

        },
    };

    server.create(featherServer, config.server);

    this.mock = function (request, response) {
        mocks.push({
            request: request || {},
            response: response || {},
        });
    };

    this.clearMocks = function () {
        mocks.splice(0);
    };

    this.start = function () {
        server.start(featherServer);
    };

    this.stop = function () {
        server.stop(featherServer);
    };
}

module.exports = FeatherNetServer;
