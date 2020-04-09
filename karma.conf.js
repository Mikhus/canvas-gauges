const istanbul = require('browserify-istanbul');

// Karma configuration
// Generated on Wed Aug 17 2016 15:31:14 GMT+0300 (EEST)
module.exports = config => {
    let options = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['browserify', 'mocha'],

        // list of files / patterns to load in the browser
        files: [
            'test/globals.js',
            'lib/**/*.js',
            'test/spec/**/*.js'
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'lib/**/*.js': ['browserify'],
            'test/spec/**/*.js': ['browserify']
        },

        browserify: {
            debug: true,
            transform: [
                ['babelify', {
                    presets: ['es2015'],
                    plugins: ['transform-object-assign']
                }],
                istanbul({
                    ignore: ['**/node_modules/**', '**/test/**'],
                    instrumenterConfig: {
                        embedSource: true
                    }
                })
            ],
            extensions: ['js']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage', 'threshold'],

        coverageReporter: {
            reporters: [
                { type: 'html' },
                {
                    type: 'text-summary',
                    dir: 'coverage/',
                    subdir: 'report/',
                    file: 'coverage.txt'
                },
                { type: 'text' }
            ],
            instrumenterOptions: {
                istanbul: {
                    noCompact: true
                }
            },
            instrumenter: {
                'test/**/*.spec.js': 'istanbul'
            },
            includeAllSources: true
        },

        thresholdReporter: {
            statements: 80,
            branches: 60,
            functions: 80,
            lines: 80
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'Chrome',
            // 'Firefox',
        ],

        customLaunchers: {
            ChromeTravis: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    };

    if (process.env.TRAVIS) {
        options.browsers = [
            'ChromeTravis',
            // 'Firefox',
        ];
    }

    config.set(options);
};
