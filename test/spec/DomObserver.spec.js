const sinon = require('sinon');
const expect = require('chai').expect;
const DomObserver = require('../../lib/DomObserver');

describe('DomObserver', () => {
    it('should be a class', () => {
        expect(DomObserver).is.a('function');
    });

    describe('DomObserver.parse()', () => {
        it('should return true if given value is "true"', () => {
            expect(DomObserver.parse('true')).equals(true);
        });
        it('should return false if given value is "false"', () => {
            expect(DomObserver.parse('false')).equals(false);
        });
        it('should return an array if given comma-separated values', () => {
            let testData = {
                '-40,-30,-20,-10,0,+10,+20,+30,+40,':
                    ['-40','-30','-20','-10','0','+10','+20','+30','+40',''],
                '1,2,3,4,5,6': ['1','2','3','4','5','6'],
                'aa,bb,cc,dd,ee': ['aa','bb','cc','dd','ee'],
                'aa.bb,cc.dd,dd.ee': ['aa.bb','cc.dd','dd.ee'],
                '-1.05,a,+b.45,-d.12': ['-1.05','a','+b.45','-d.12']
            };

            Object.keys(testData).forEach(key => {
                let res = DomObserver.parse(key);

                expect(res).to.be.an('array');
                expect(res).to.eql(testData[key]);
            });

            expect(DomObserver.parse('rgba(0,1,2,0.5)')).not.to.be.an('array');
        });
        it('should properly parse "undefined" and "null"', () => {
            //noinspection BadExpressionStatementJS
            expect(DomObserver.parse('undefined')).to.be.undefined;
            //noinspection BadExpressionStatementJS
            expect(DomObserver.parse('null')).to.be.null;
        });
        it('should properly parse JSON strings and return proper value', () => {
            expect(DomObserver.parse('[1,2,3,4,5]')).to.eql([1,2,3,4,5]);
            expect(DomObserver.parse('{"a":1,"b":[2,3],"c":{"d":4,"e":"5"}}'))
                .to.eql({ a:1, b: [2,3], c: { d: 4, e: '5' }});
        });
    });

    describe('constructor()', () => {
        it('should throw if given element is not a string', () => {
            expect(() => new DomObserver()).to.throw(Error);
        });
    });

    describe('isValidNode()', () => {
        it('should return true if node is valid, false otherwise', () => {
            class TestGauge {
                constructor(options) {}
                draw() {}
            }

            window['TestGauge'] = TestGauge;

            let typeOptions = {};
            let observer = new DomObserver(typeOptions, 'div', 'TestGauge');
            let validElement = document.createElement('div');
            let invalidElement = document.createElement('div');
            let anotherInvalidElement = document.createElement('span');

            validElement.setAttribute('data-type', 'test-gauge');
            invalidElement.setAttribute('data-type', 'not-test-gauge');

            //noinspection BadExpressionStatementJS
            expect(observer.isValidNode(validElement)).to.be.ok;
            //noinspection BadExpressionStatementJS
            expect(observer.isValidNode(invalidElement)).not.to.be.ok;
            //noinspection BadExpressionStatementJS
            expect(observer.isValidNode(anotherInvalidElement)).not.to.be.ok;
        });
    });

    describe('toCamelCase()', () => {
        it('should transform dashed string to CamelCase representation', () => {
            let dashed = 'on-two-three';

            expect(DomObserver.toCamelCase('one-two-three'))
                .to.equal('OneTwoThree');
        });
    });

    describe('process()', () => {
        it('should properly process given node and create associated type ' +
            'instance', () =>
        {
            let created = false;

            class TestGauge {
                constructor(options) { created = true; }
                draw() {}
                destroy() {}
            }

            window['TestGauge'] = TestGauge;

            sinon.spy(TestGauge.prototype, 'draw');

            let typeOptions = {bg: '', color: ''};
            let observer = new DomObserver(typeOptions, 'canvas', 'TestGauge');
            let element = document.createElement('canvas');

            element.setAttribute('data-type', 'test-gauge');
            element.setAttribute('data-bg', '#fff');

            observer.process(element);

            expect(created).equals(true);
            //noinspection BadExpressionStatementJS
            expect(TestGauge.prototype.draw.called).to.be.ok;
        });
    });
});
