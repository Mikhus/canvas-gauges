const sinon = require('sinon');
const expect = require('chai').expect;
const Gauge = require('../../lib/Gauge');
const SmartCanvas = require('../../lib/SmartCanvas');
const Animation = require('../../lib/Animation');

sinon.spy(Gauge.prototype, 'draw');

describe('Gauge', () => {
    beforeEach(() => {
        Gauge.prototype.draw.reset();
    });

    it('should be a class', () => {
        expect(Gauge).is.a('function');
        expect(() => new Gauge()).to.throw(TypeError);
        expect(() => new Gauge({})).to.throw(TypeError);
        expect(() =>
            new Gauge({
                renderTo: document.createElement('canvas')
            })
        ).to.not.throw(Error);
    });

    describe('constructor()', () => {
        let gauge;

        beforeEach(() => {
            gauge = new Gauge({
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
