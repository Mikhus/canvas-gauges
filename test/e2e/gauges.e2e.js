const expect = require('chai').expect;
const webdriver = require('webdriverio');
const fs = require('fs');
const chalk = require('chalk');
const TIMEOUT = 90000;

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

    it('checking gauges ui', done => {
        client
            .url(url)
            .execute(function () {
                let result = true;
                let customGauge = Gauge.Collection[0];
                let defaultGauge = Gauge.Collection[1];

                return result;
            })
            .then(result => {
                //noinspection BadExpressionStatementJS
                expect(result.value).to.be.ok;
                done();
            });
    });

    after(() => {
        return client.end();
    });
});
