const express = require('express');
const http = require('http');
const path = require('path');
const url = require('url');

function allowCors (app) {
    app.all('*', function(req, res, next) {
        let ref = req.get('Referrer');
        let allowOrigin = '*';
        if (ref) {
            let parsedUrl = url.parse(ref);
            allowOrigin = parsedUrl.protocol + '//' + parsedUrl.host;
        }
        res.header('Access-Control-Allow-Origin', allowOrigin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        next();
    });
}

function createAdmin (featherServer, serverOptions) {
    featherServer.admin = express();
    let admin = featherServer.admin;

    admin.set('port', serverOptions.adminPort || 9877);

    allowCors(admin);

    admin.post('/feathernet-mock', function (req, res, next) {
        featherServer.mocks.push({
            request: 'abc',
            response: 'def',
        });
        res.send('');
    });

    admin.post('/feathernet-clearMocks', function (req, res, next) {
        featherServer.mocks = [];
        res.send('');
    });
}

function createApp (featherServer, serverOptions) {
    featherServer.app = express();
    let app = featherServer.app;

    app.set('port', serverOptions.port || 9876);
    app.set('rootPath', serverOptions.rootPath ? path.resolve(serverOptions.rootPath) : '/');

    allowCors(app);

    app.all('*', function (req, res, next) {
        let featherResponse = featherServer.request();
        console.log(featherServer.mocks);
        res.send('hello');
        // res.sendFile(path.resolve(__dirname + '/../test/fixtures/someJavascript.js'));
        // or next()
    });

    // else respond with error code
    app.use(function (req, res) {
        res.statusCode = 404;
        res.send('');
    });
}

function create (featherServer, serverOptions) {
    serverOptions = serverOptions || {};
    createAdmin(featherServer, serverOptions);
    createApp(featherServer, serverOptions);
}

function start (featherServer) {
    let admin = featherServer.admin;
    featherServer.adminConnection = http.createServer(admin).listen(admin.get('port'));
    let app = featherServer.app;
    featherServer.appConnection = http.createServer(app).listen(app.get('port'));
    console.log(`Feathernet started at localhost:${app.get('port')} => ${app.get('rootPath')}`);
    console.log('Press Ctrl+C to terminate');
}

function stop (featherServer) {
    if (featherServer.appConnection) {
        featherServer.appConnection.close()
    }
    featherServer.appConnection = null;
    featherServer.app = null;

    if (featherServer.adminConnection) {
        featherServer.adminConnection.close()
    }
    featherServer.adminConnection = null;
    featherServer.admin = null;
}

module.exports = {
    create,
    start,
    stop,
};
