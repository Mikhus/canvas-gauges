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
            desiredCapabilities: { browserName: 'chrome' }});

        return client.init();
    });

    it('checking gauges ui', done => {
        client
            .url(url)
            .execute(function () {
                return document.title;
            })
            .then(result => {
                // console.log(result.value);
                expect(result.value).to.be.a('string');
                done();
            });
    });

    after(() => {
        return client.end();
    });
});
