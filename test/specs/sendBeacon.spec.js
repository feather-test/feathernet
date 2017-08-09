
describe('sendBeacon', () => {

    describe('overrides in all environments', (expect) => {
        expect(window.navigator.sendBeacon.name).toBe('mockSendBeacon', 'browser');
        expect(navigator.sendBeacon.name).toBe('mockSendBeacon', 'node');
    });

    describe('sends a beacon without errors', (expect) => {
        window.navigator.sendBeacon('http://greetings.com/sendbeacon-success');
    });

    describe('errors when mocked to error', (expect) => {
        window.navigator.sendBeacon('http://errors.com/sendbeacon-error');
    });

});
