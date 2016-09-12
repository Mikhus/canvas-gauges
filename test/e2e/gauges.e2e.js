const expect = require('chai').expect;
const webdriver = require('webdriverio');
const fs = require('fs');
const chalk = require('chalk');
const TIMEOUT = 5000;

describe('Gauges UI', function() {
    this.timeout(TIMEOUT);

    let client;
    let url = 'file://' + fs.realpathSync('.') + '/test/gauges.html';

    console.log(chalk.cyan('  Loading UI from "' + url + '"'));

    before(() => {
        client = webdriver.remote({
            desiredCapabilities: {
                browserName: 'chrome',
                chromeOptions: {
                    args: ['no-sandbox']
                }
            }
        });

        return client.init();
    });

    it('it should have 2 gauges drawn', done => {
        client
            .url(url)
            .execute(() => {
                let customGauge = document.gauges[0];
                let defaultGauge = document.gauges[1];

                return customGauge instanceof RadialGauge &&
                        defaultGauge instanceof RadialGauge;
            })
            .then(result => {
                expect(result.value).equals(true);
                done();
            });
    });

    it('should have title properly drawn', done => {
        client
            .execute(() => {
                let gauge = document.gauges[0];
                let w = gauge.canvas.element.width;
                let h = gauge.canvas.element.height;
                let max = w > h ? h / 2 : w / 2;
                let textDelta = max / 4.25;
                let textHeight = 24 * (max / 200);
                let textWidth = 70;
                let centerX = w / 2;
                let centerY = h / 2;
                let x = centerX - textWidth / 2;
                let y = centerY - textDelta - textHeight + textHeight / 4;
                let bg = [33, 33, 33]; // #222 - 1 each for alpha-blending
                let fg = [103, 103, 103]; // #666 + 1 each for alpha-blending

                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');

                canvas.width  = textWidth;
                canvas.height = textHeight;

                ctx.drawImage(gauge.canvas.element,
                    x, y, textWidth, textHeight,
                    0, 0, textWidth, textHeight);

                let pixels = ctx.getImageData(0, 0, textWidth, textHeight);
                let i = 0;
                let s = pixels.data.length;

                for (; i < s; i += 4) {
                    if (!(
                        pixels.data[i] >= bg[0] &&
                        pixels.data[i] <= fg[0] &&
                        pixels.data[i + 1] === pixels.data[i] &&
                        pixels.data[i + 2] === pixels.data[i] &&
                        pixels.data[i + 3] === 255))
                    {
                        return false;
                    }
                }

                return true;
            })
            .then(result => {
                expect(result.value).equals(true);
                done();
            });
    });

    after(() => {
        return client.end();
    });
});
