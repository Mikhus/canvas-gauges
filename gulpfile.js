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

/**
 * Displays this usage information.
 *
 * @task {help}
 */
gulp.task('help', () => usage(gulp));

/**
 * Clean-ups files from previous build
 *
 * @task {clean}
 */
gulp.task('clean', (done) => {
    rimraf('gauge.js', () =>
    rimraf('gauge.min.js', () =>
    rimraf('gauge.min.js.map', done)));
});

/**
 * Automatically generates API documentation for this project
 * from a source code
 *
 * @task {doc}
 */
gulp.task('doc', () => {
    gulp.src('./lib')
        .pipe(esdoc({ destination: './docs' }));
});

/**
 * Transpiles, combines and minifies gauge code
 *
 * @task {build}
 */
gulp.task('build', ['clean'], () => {
    //noinspection JSCheckFunctionSignatures
    browserify('lib/Gauge.js')
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
 * Performs JavaScript syntax linting checks
 *
 * @task {lint}
 */
gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**', '!docs/**', '!**.min.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('default', ['help']);
