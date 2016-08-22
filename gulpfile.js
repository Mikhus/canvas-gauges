/**
 * Canv-Gauge Dev Tasks Runner
 *
 * @author Mykhailo Stadnyk <mikhus@gmail.com>
 */
const gulp = require('gulp');
const usage = require('gulp-help-doc');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const merge = require('utils-merge');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rimraf = require('rimraf');
const esdoc = require('gulp-esdoc');
const eslint = require('gulp-eslint');
const gzip = require('gulp-gzip');
const KarmaServer = require('karma').Server;
const wdio = require('gulp-wdio');
const gutil = require('gulp-util');
const chalk = require('chalk');
const http = require('https');
const fs = require('fs');
const selenium = require('selenium-standalone');
const mocha = require('gulp-mocha');
const cp = require('child_process');

/**
 * Displays this usage information.
 *
 * @task {help}
 */
gulp.task('help', () => usage(gulp));

/**
 * Clean-ups files from previous build.
 *
 * @task {clean}
 */
gulp.task('clean', (done) => {
    rimraf('gauge.js', () =>
    rimraf('gauge.min.js', () =>
    rimraf('gauge.min.js.map', () =>
    rimraf('gauge.min.js.gz', done))));
});

/**
 * Automatically generates API documentation for this project
 * from a source code.
 *
 * @task {doc}
 */
gulp.task('doc', () => {
    gulp.src('./lib')
        .pipe(esdoc({ destination: './docs' }))
        .on('finish', () => {
            if (process.env.TRAVIS) {
                return ;
            }

            console.log(chalk.bold.green('Generating badge...'));

            let coverage = require('./docs/coverage.json').coverage;
            let color = 'green';

            if (parseFloat(coverage) < 90) {
                color = 'red';
            }

            let url = 'https://img.shields.io/badge/docs-' +
                coverage.replace(/%/g, '%25') +
                '-' + color + '.svg';

            http.get(url, response => {
                if ((response instanceof Error)) {
                    return console.error(response);
                }

                response.pipe(fs.createWriteStream('docs-coverage.svg'));
            });
        });
});

/**
 * Transpiles, combines and minifies JavaScript code.
 *
 * @task {build}
 */
gulp.task('build', ['clean'], () => {
    //noinspection JSCheckFunctionSignatures
    return browserify(['lib/babelHelpers.js', 'lib/Gauge.js'])
        .transform(babelify, {
            presets: ['es2015'],
            plugins: ['external-helpers-2']
        })
        .bundle()
        .on('error', function(err) {
            gutil.log(err);
            this.emit('end');
        })
        .pipe(source('gauge.js'))
        //.pipe(gulp.dest('.'))
        .pipe(buffer())
        .pipe(rename('gauge.min.js'))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
});

/**
 * Watch for source code changes and automatically re-build
 * when wny of them detected.
 * 
 * @task {watch}
 */
gulp.task('watch', ['build'], () => {
    gulp.watch('lib/**/*.js', () => gulp.start('build'));
});

/**
 * Runs gzipping for minified file.
 *
 * @task {gzip}
 */
gulp.task('gzip', ['build'], () => {
    return gulp.src('gauge.min.js')
        .pipe(gzip({ gzipOptions: { level: 9 } }))
        .pipe(gulp.dest('.'));
});

/**
 * Performs JavaScript syntax check.
 *
 * @task {lint}
 */
gulp.task('lint', () => {
    console.log(chalk.bold.green('\nStarting linting checks...\n'));

    return gulp.src([
            '**/*.js',
            '!node_modules/**',
            '!docs/**',
            '!**.min.js',
            '!coverage/**'
        ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/**
 * Runs unit tests.
 *
 * @task {test:spec}
 */
gulp.task('test:spec', done => {
    console.log(chalk.bold.green('Starting unit tests...'));

    let server = new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, exitCode => {
        if (!exitCode) {
            if (process.env.TRAVIS) {
                return done();
            }

            console.log(chalk.bold.green('Generating badge...'));

            // create badges
            let rx = new RegExp(
                '[\u001b\u009b][[()#;?]*' +
                '(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?' +
                '[0-9A-ORZcf-nqry=><]', 'g');
            let coverage = fs.readFileSync(
                    './coverage/report/coverage.txt',
                    { encoding: 'utf8' }
                )
                .replace(rx, '')
                .split(/\r?\n/)[2]
                .split(':')[1]
                .split('(')[0]
                .trim();
            let color = 'green';

            if (parseFloat(coverage) < 90) {
                color = 'red';
            }

            let url = 'https://img.shields.io/badge/coverage-' +
                coverage.replace(/%/g, '%25') +
                '-' + color + '.svg';

            http.get(url, response => {
                if ((response instanceof Error)) {
                    console.error(response);
                    process.exit(0);
                }

                response
                    .pipe(fs.createWriteStream('test-coverage.svg'))
                    .on('finish', () => process.exit(0));
            });

            return done();
        }

        process.exit(exitCode);
    }).start();
});

/**
 * Installs and starts selenium server
 *
 * @task {selenium}
 */
gulp.task('selenium', done => {
    cp.execSync('pkill -f selenium-standalone');

    selenium.install({ logger: gutil.log }, err => {
        if (err) return done(err);

        selenium.start((err, child) => {
            if (err) return done(err);

            selenium.child = child;

            done();
        });
    });
});

/**
 * Runs end-to-end tests.
 *
 * @task {test:e2e}
 *
 * Testing concept could be following:
 *  1. Create various gauge configuration HTML pages
 *  2. Use protractor to navigate this pages
 *  3. On each page, depending on the gauge config and screen res/dpi
 *     checking the proper pixels on canvas if them matching expected color
 *     This could be checks, for example if highlight area in this pixel is
 *     present or not, if arrow starts/ends at this point, etc.
 *     This would be valuable checks, because if something wrong happen with
 *     drawing, most probably expected pixels won't match the expected specs,
 *     so we can automatically figure something is broken.
 */
gulp.task('test:e2e', ['selenium'], done => {
    console.log(chalk.bold.green('\nStarting end-to-end tests...\n'));

    gulp.src(['test/e2e/**/*.e2e.js'])
        .pipe(mocha({ reporter: 'spec' }))
        .once('error', err => {
            console.error(err);
            cp.execSync('pkill -f selenium-standalone');
            process.exit(1);
        })
        .once('end', () => {
            cp.execSync('pkill -f selenium-standalone');
            done();
        });
});

/**
 * Runs all tests and checks.
 *
 * @task {test}
 */
gulp.task('test', ['lint', 'test:spec', 'test:e2e']);

gulp.task('default', ['help']);
