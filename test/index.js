
const FeatherNetServer = require('../server');

const featherNet = new FeatherNetServer({

});

featherNet.start();

const FeatherTestBrowser = require('feather-test-browser');

let mockTest = new FeatherTestBrowser({
    helpers: [
        './helpers/mock_setup.js',
    ],
    specs: './specs',
    exitProcessWhenFailing: false,
    nodeAsBrowser: {
        url: 'http://localhost:9876/',
    }
});

mockTest.run();
