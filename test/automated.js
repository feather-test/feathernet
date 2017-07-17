const FeatherTestBrowser = require('../../feather-test-browser');

let mockTest = new FeatherTestBrowser({
    specs: './specs',
});

mockTest.run();
