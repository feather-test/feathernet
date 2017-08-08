
const FeatherNetServer = require('../server');

const featherNet = new FeatherNetServer({

});

featherNet.start();

const FeatherTestBrowser = require('../../feather-test-browser');

let mockTest = new FeatherTestBrowser({
    helpers: [
        // './helpers/mock_setup.js',
    ],
    specs: './specs/new.js',
    exitProcessWhenFailing: false,
});

mockTest.run();
