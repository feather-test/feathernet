
describe('sendBeacon', () => {

    describe('overrides in all environments', (expect) => {
        expect(window.navigator.sendBeacon.name).toBe('mockSendBeacon', 'browser');
        expect(navigator.sendBeacon.name).toBe('mockSendBeacon', 'node');
    });

});
