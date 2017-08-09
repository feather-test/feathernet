
function createMockXhr (origXhr, config) {

    let origXhrOpen = new origXhr().open;
    origXhr.prototype.open = function mockOpen (method, url, async) {
        let urlToOpen = url;
        if (!this._urlMocked) {
            this._urlMocked = true;
            origXhr.calls.push({
                url: url,
            });
            urlToOpen = `http://${config.hostOverride}/${url}`;
        }
        origXhrOpen.call(this, method, urlToOpen, async);
    };

    origXhr.calls = [];

    return origXhr;
}

module.exports = createMockXhr;
