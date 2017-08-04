const Body = require('../mocks/body.js');
const createHeaders = require('../mocks/create_headers.js');
const Json = require('../mocks/json.js');

function Request (url, options) {
    options = options || {};

    this.url = url;
    this.method = (options.method && options.method.toUpperCase()) || 'GET';
    this.headers = createHeaders(options.headers);
    this.body = options.body;
    this.mode = options.mode || 'cors';
    this.credentials = options.credentials || 'omit';
    this.referrer = options.referrer || 'client';

    Body.call(this, options.body);
    Json.call(this);
}

module.exports = Request;
