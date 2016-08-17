exports.config = {
    specs: [
        './test/e2e/spec/**/*.js'
    ],
    exclude: [],
    maxInstances: 10,
    capabilities: [{ browserName: 'chrome' }],
    sync: true,
    logLevel: 'error',
    coloredLogs: true,
    screenshotPath: './errorShots/',
    baseUrl: 'file://' + __dirname + '/test',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd'
    },
    reporters: ['spec']
};

if (process.env.TRAVIS) {
    exports.config.capabilities = [{ browserName: 'firefox' }];
}
