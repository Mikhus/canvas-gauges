const expect = require('chai').expect;
const GaugesPage = require('../pageobjects/gauges.page');

describe('gauges', () => {
    it('gauge canvases should be present on a page', () => {
        GaugesPage.open();
        expect(GaugesPage.customGauge.state).equals('success');
        expect(GaugesPage.defaultGauge.state).equals('success');
    });
});
