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
        .pipe(esdoc({ destination: './docs' }));
});

/**
 * Transpiles, combines and minifies JavaScript code.
 *
 * @task {build}
 */
gulp.task('build', ['clean'], () => {
    //noinspection JSCheckFunctionSignatures
    return browserify('lib/Gauge.js')
        .transform(babelify, { presets: ['es2015'] })
        .bundle()
        //.on('error', e => gutil.log(e))
        .pipe(source('gauge.js'))
        .pipe(buffer())
        .pipe(rename('gauge.min.js'))
        .pipe(sourcemaps.init({ loadMaps: true }))
        // capture sourcemaps from transforms
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
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
 * Performs JavaScript syntax linting checks.
 *
 * @task {lint}
 */
gulp.task('lint', () => {
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
gulp.task('test:spec', ['lint'], done => {
    let server = new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, () => {
        server.stop();
        done();
    }).start();
});

/**
 * Runs all tests including end-to-end tests.
 *
 * @task {test}
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
gulp.task('test', ['test:spec'], () => {

});

gulp.task('default', ['help']);
