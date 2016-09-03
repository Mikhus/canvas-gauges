const sinon = require('sinon');
const expect = require('chai').expect;
const RadialGauge = require('../../lib/RadialGauge');
const SmartCanvas = require('../../lib/SmartCanvas');
const Animation = require('../../lib/Animation');

sinon.spy(RadialGauge.prototype, 'draw');

describe('RadialGauge', () => {
    beforeEach(() => {
        RadialGauge.prototype.draw.reset();
    });

    it('should be a class', () => {
        expect(RadialGauge).is.a('function');
        expect(() => new RadialGauge()).to.throw(TypeError);
        expect(() => new RadialGauge({})).to.throw(TypeError);
        expect(() =>
            new RadialGauge({
                renderTo: document.createElement('canvas')
            })
        ).to.not.throw(Error);
    });

    describe('constructor()', () => {
        let gauge;

        beforeEach(() => {
            gauge = new RadialGauge({
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
