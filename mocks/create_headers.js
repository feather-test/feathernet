function createHeaders (headers) {
    headers = headers || {};

    headers.get = function (name) {
        return headers[name];
    };

    return headers;
}

module.exports = createHeaders;
