const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const webshot = require('webshot');
const resize = require('gulp-image-resize');

gulp.task('default', done => {
    gulp.src([
            'assets/js/javascript.min.js',
            'assets/js/modernizr.js',
            'assets/js/gauge.min.js',
            'assets/js/slick.min.js',
            'assets/js/prettify.js',
            'assets/js/code-sample.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('assets/js'))
        .on('end', () => done());
});

gulp.task('shot', done => {
    webshot(
        'http://localhost:4000/',
        'images/thumbnail.png',
        {
            windowSize: {
                width: 1600,
                height: 1200
            },
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
                '(KHTML, like Gecko) Chrome/53.0.2785.101 Safari/537.36'
        },
        () => {
            gulp.src('images/thumbnail.png')
                .pipe(resize({
                    width : 400,
                    height : 300,
                    crop : true,
                    upscale : false
                }))
                .pipe(gulp.dest('images'))
                .on('end', () => done());
        });
});
