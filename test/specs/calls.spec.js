
describe('calls', () => {

    describe('fetch collects calls', (expect) => {
        fetch('http://noresponse.com');
        fetch('http://noresponse.com');
        fetch('https://greetings.com');

        expect(fetch.calls[2].url).toBe('https://greetings.com');
    });

    describe('xhr collects calls', (expect) => {
        let a = new XMLHttpRequest();
        a.open('GET', 'http://noresponse.com', true);
        a.send();

        let b = new XMLHttpRequest();
        b.open('GET', 'http://noresponse.com', true);
        b.send();

        let c = new XMLHttpRequest();
        c.open('GET', 'https://greetings.com', true);
        c.send();

        expect(XMLHttpRequest.calls[2].url).toBe('https://greetings.com');
    });

    describe('sendBeacon collects calls', (expect) => {
        navigator.sendBeacon('http://noresponse.com');
        navigator.sendBeacon('http://noresponse.com');
        navigator.sendBeacon('https://greetings.com');

        expect(navigator.sendBeacon.calls[2].url).toBe('https://greetings.com');
    });

});
