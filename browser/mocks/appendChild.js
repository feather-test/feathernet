
function createMockAppendChild (origAppendChild, config) {
    function mockAppendChild (elem) {
        if (!elem) { return; }
        let targetElem = this;
        let url = elem.src;
        if (url) {
            elem.src = `http://${config.hostOverride}/${url}`;
            mockAppendChild.calls.push({
                url: url,
            });
        }
        origAppendChild.call(targetElem, elem);
    }

    mockAppendChild.calls = [];

    return mockAppendChild;
}



module.exports = createMockAppendChild;
