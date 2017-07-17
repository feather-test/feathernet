
function getResponse (url, options) {
    return {
        ok: true,
        status: 200,
        json: function () {
            return Promise.resolve({
                name: 'fusion',
            });
        }
    };
}

function mockFetch (url, options) {
    options = options || {};
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(getResponse(url, options));
        }, 1);
    });
}

module.exports = mockFetch;
