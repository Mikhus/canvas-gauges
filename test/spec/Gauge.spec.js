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

    describe('get value()', () => {
        it('should return current gauge value', () => {
            let gauge = new Gauge({
                renderTo: document.createElement('canvas'),
                value: 10
            });

            expect(gauge.value).equals(10);
        });
    });

    describe('set value()', () => {
        it('should properly set current gauge value when animated', done => {
            let gauge = new Gauge({
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
            let gauge = new Gauge({
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
            let gauge = new Gauge({
                renderTo: document.createElement('canvas'),
                value: 10
            });

            gauge.value = 10;

            expect(gauge.value).equals(10);
            //noinspection BadExpressionStatementJS
            expect(gauge.draw.called).not.to.be.ok;
        });
        it('should return upset value even if updateValueOnAnimation is ' +
            'true', done =>
        {
            let gauge = new Gauge({
                renderTo: document.createElement('canvas'),
                value: 0,
                updateValueOnAnimation: true
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
            let gauge = new Gauge({
                renderTo: document.createElement('canvas')
            });

            gauge.destroy();

            expect(Gauge.Collection).not.includes(gauge);
        });
        it('should properly dereference all bound items', () => {
            let gauge = new Gauge({
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
            let gauge = new Gauge({
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
            let gauge = new Gauge({
                renderTo: document.createElement('canvas')
            });

            expect(gauge.update()).equals(gauge);
            //noinspection BadExpressionStatementJS
            expect(gauge.draw.called).to.be.ok;
        });
    });
});

describe('Gauge.Collection', () => {
    it('should be an array', () => {
        expect(Gauge.Collection).to.be.an('array');
    });

    describe('get()', () => {
        let g1, g2, g3;

        beforeEach(() => {
            Gauge.Collection.splice(0, Gauge.Collection.length);

            let c1 = document.createElement('canvas');
            let c2 = document.createElement('canvas');
            let c3 = document.createElement('canvas');

            c1.setAttribute('id', 'gauge-1');
            c2.setAttribute('id', 'gauge-2');
            c3.setAttribute('id', 'gauge-3');

            g1 = new Gauge({ renderTo: c1 });
            g2 = new Gauge({ renderTo: c2 });
            g3 = new Gauge({ renderTo: c3 });
        });

        it('should find gauge by a given id', () => {
            expect(Gauge.Collection.get('gauge-1')).equals(g1);
        });
        it('should find gauge by index', () => {
            expect(Gauge.Collection.get(1)).equals(g2);
        });
        it('should return null if nothing found', () => {
            expect(Gauge.Collection.get('gauge-4')).equals(null);
        });
        it('should return null if invalod locator given', () => {
            expect(Gauge.Collection.get({})).equals(null);
        });
    });
});
