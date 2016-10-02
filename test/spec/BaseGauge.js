const sinon = require('sinon');
const expect = require('chai').expect;
const BaseGauge = require('../../lib/BaseGauge');
const SmartCanvas = require('../../lib/SmartCanvas');
const Animation = require('../../lib/Animation');
const Collection = require('../../lib/Collection');

class TestGauge extends BaseGauge {
    constructor(options) {
        super(options);
    }
    draw() {
        return this;
    }
}

sinon.spy(TestGauge.prototype, 'draw');

describe('BadseGauge', () => {
    beforeEach(() => {
        TestGauge.prototype.draw.reset();
    });

    it('should be a class', () => {
        expect(BaseGauge).is.a('function');
        expect(() => new BaseGauge()).to.throw(TypeError);
        expect(() =>
            new TestGauge({
                renderTo: document.createElement('canvas')
            })
        ).to.not.throw(Error);
    });

    describe('constructor()', () => {
        let gauge;

        beforeEach(() => {
            gauge = new TestGauge({
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

    describe('get value()', () => {
        it('should return current gauge value', () => {
            let gauge = new TestGauge({
                renderTo: document.createElement('canvas'),
                value: 10
            });

            expect(gauge.value).equals(10);
        });
    });

    describe('set value()', () => {
        it('should properly set current gauge value when animated', done => {
            let gauge = new TestGauge({
                renderTo: document.createElement('canvas'),
                value: 0,
                animation: true,
                animationDuration: 50
            });

            gauge.value = 10;

            expect(gauge.value).equals(10);
            setTimeout(() => {
                //noinspection BadExpressionStatementJS
                expect(gauge.draw.called).to.be.ok;
                done();
            }, 100);
        });
        it('should properly set current gauge value when non-animated', () => {
            let gauge = new TestGauge({
                renderTo: document.createElement('canvas'),
                value: 0,
                animation: false
            });

            gauge.value = 10;

            expect(gauge.value).equals(10);
            //noinspection BadExpressionStatementJS
            expect(gauge.draw.called).to.be.ok;
        });
        it('should not do anything if given value the same as current', () => {
            let gauge = new TestGauge({
                renderTo: document.createElement('canvas'),
                value: 10
            });

            gauge.value = 10;

            expect(gauge.value).equals(10);
            //noinspection BadExpressionStatementJS
            expect(gauge.draw.called).not.to.be.ok;
        });
        it('should return upset value even if animatedValue is true', done => {
            let gauge = new TestGauge({
                renderTo: document.createElement('canvas'),
                value: 0,
                animatedValue: true
            });

            gauge.value = 10;

            expect(gauge.value).equals(10);
            setTimeout(() => {
                //noinspection BadExpressionStatementJS
                expect(gauge.value).equals(10);
                done();
            }, 25);
        });
    });

    describe('destroy()', () => {
        it('should remove current instance from Gauge.Collection', () => {
            let gauge = new TestGauge({
                renderTo: document.createElement('canvas')
            });

            gauge.destroy();

            expect(document.gauges).not.includes(gauge);
        });
        it('should properly dereference all bound items', () => {
            let gauge = new TestGauge({
                renderTo: document.createElement('canvas')
            });

            let animationDestroy = sinon.spy(gauge.animation, 'destroy');
            let canvasDestoy = sinon.spy(gauge.canvas, 'destroy');

            gauge.destroy();

            expect(gauge.canvas).to.be.a('null');
            expect(gauge.animation).to.be.a('null');
            //noinspection BadExpressionStatementJS
            expect(animationDestroy).to.be.ok;
            //noinspection BadExpressionStatementJS
            expect(canvasDestoy).to.be.ok;
        });
    });

    describe('update()', () => {
        it('should update gauge options and re-render', () => {
            let gauge = new TestGauge({
                renderTo: document.createElement('canvas')
            });
            let newOptions = {
                animationDuration: 500,
                width: 500,
                height: 500
            };

            expect(gauge.update(newOptions)).equals(gauge);
            expect(gauge.options.animationDuration).equals(500);
            expect(gauge.options.width).equals(500);
            expect(gauge.options.height).equals(500);
            expect(gauge.canvas.width).equals(500);
            expect(gauge.canvas.height).equals(500);
            //noinspection BadExpressionStatementJS
            expect(gauge.draw.called).to.be.ok;
        });
        it('should allow no options argument', () => {
            let gauge = new TestGauge({
                renderTo: document.createElement('canvas')
            });

            expect(gauge.update()).equals(gauge);
            //noinspection BadExpressionStatementJS
            expect(gauge.draw.called).to.be.ok;
        });
    });
});

describe('document.gauges', () => {
    it('should be an instance of Collection and Array', () => {
        expect(document.gauges).instanceOf(Collection);
        expect(document.gauges).instanceOf(Array);
    });

    describe('get()', () => {
        let g1, g2, g3;

        beforeEach(() => {
            document.gauges.splice(0, document.gauges.length);

            let c1 = document.createElement('canvas');
            let c2 = document.createElement('canvas');
            let c3 = document.createElement('canvas');

            c1.setAttribute('id', 'gauge-1');
            c2.setAttribute('id', 'gauge-2');
            c3.setAttribute('id', 'gauge-3');

            g1 = new TestGauge({ renderTo: c1 });
            g2 = new TestGauge({ renderTo: c2 });
            g3 = new TestGauge({ renderTo: c3 });
        });

        it('should find gauge by a given id', () => {
            expect(document.gauges.get('gauge-1')).equals(g1);
        });
        it('should find gauge by index', () => {
            expect(document.gauges.get(1)).equals(g2);
        });
        it('should return null if nothing found', () => {
            expect(document.gauges.get('gauge-4')).equals(null);
        });
        it('should return null if invalid locator given', () => {
            expect(document.gauges.get({})).equals(null);
        });
    });
});
