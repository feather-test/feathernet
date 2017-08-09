
function createMockXhr (origXhr, config) {

    let origXhrOpen = new origXhr().open;
    origXhr.prototype.open = function mockOpen (method, url, async) {
        let urlToOpen = url;
        if (!this._urlMocked) {
            this._urlMocked = true;
            urlToOpen = `http://${config.hostOverride}/${url}`;
        }
        origXhrOpen.call(this, method, urlToOpen, async);
    };

    return origXhr;
}

module.exports = createMockXhr;
