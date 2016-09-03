const expect = require('chai').expect;
const LinearGauge = require('../../lib/LinearGauge');
const Animation = require('../../lib/Animation');
const SmartCanvas = require('../../lib/SmartCanvas');

describe('LinearGauge', () => {
    it('should be a class', () => {
        expect(LinearGauge).is.a('function');
        expect(() => new LinearGauge).to.throw(TypeError);
        expect(() => new LinearGauge({})).to.throw(TypeError);
        expect(() =>
            new LinearGauge({
                renderTo: document.createElement('canvas')
            })
        ).to.not.throw(Error);
    });

    describe('constructor()', () => {
        let gauge;

        beforeEach(() => {
            gauge = new LinearGauge({
                renderTo: document.createElement('canvas')
            });
        });

        it('should define options property', () => {
            //noinspection BadExpressionStatementJS
            expect(gauge.options).not.to.be.undefined;
        });
        it('should define animation property', () => {
            //noinspection BadExpressionStatementJS
            expect(gauge.animation).not.to.be.undefined;
            expect(gauge.animation).to.be.instanceOf(Animation);
        });
        it('should define canvas property', () => {
            //noinspection BadExpressionStatementJS
            expect(gauge.canvas).not.to.be.undefined;
            expect(gauge.canvas).to.be.instanceOf(SmartCanvas);
        });
    });
});
