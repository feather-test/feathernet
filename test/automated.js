const FeatherTestBrowser = require('../../feather-test-browser');

let mockTest = new FeatherTestBrowser({
    helpers: [
        './helpers/mock_setup.js',
    ],
    specs: './specs',
});

mockTest.run();
