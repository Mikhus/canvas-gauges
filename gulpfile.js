/**
 * Canv-Gauge Dev Tasks Runner
 *
 * @author Mykhailo Stadnyk <mikhus@gmail.com>
 */
const gulp = require('gulp');
const usage = require('gulp-help-doc');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const minify = require('gulp-uglify/minifier');
const uglify6 = require('uglify-js-harmony');
const rimraf = require('rimraf');
const esdoc = require('gulp-esdoc');
const eslint = require('gulp-eslint');
const gzip = require('gulp-gzip');
const KarmaServer = require('karma').Server;
const gutil = require('gulp-util');
const chalk = require('chalk');
const http = require('https');
const fs = require('fs');
const selenium = require('selenium-standalone');
const mocha = require('gulp-mocha');
const cp = require('child_process');
const concat = require('gulp-concat');
const yargs = require('yargs');
const replace = require('gulp-replace');
const babel = require('gulp-babel');
const fsc = require('fs-cli');
const semver = require('semver');
const inject = require('gulp-inject-string');
const version = require('./package.json').version;
const plato = require('gulp-plato');

/**
 * @typedef {{argv: object}} yargs
 * @typedef {{parse:function, stringify:function}} JSON
 */

let types = ['all', 'radial', 'linear'];

function es6concat(type = 'all', clean = false) {
    let bundle = [
        'lib/polyfill.js',
        'lib/vendorize.js',
        'lib/EventEmitter.js',
        'lib/Animation.js',
        'lib/DomObserver.js',
        'lib/SmartCanvas.js',
        'lib/GenericOptions.js',
        'lib/Collection.js',
        'lib/BaseGauge.js',
        'lib/drawings.js'
    ];

    if (clean) bundle.shift();

    switch (type.toLowerCase()) {
        case 'radial':
        case 'radial-gauge':
        case 'radialgauge':
            bundle.push('lib/RadialGauge.js');
            break;
        case 'linear':
        case 'linear-gauge':
        case 'lineargauge':
            bundle.push('lib/LinearGauge.js');
            break;
        default:
            bundle.push('lib/RadialGauge.js', 'lib/LinearGauge.js');
    }

    return gulp.src(bundle)
        .pipe(concat('gauge.es6.js'))
        .pipe(replace(/((var|const|let)\s+.*?=\s*)?require\(.*?\);?/g, ''))
        .pipe(replace(/(module\.)?exports(.default)?\s+=\s*.*?\r?\n/g, ''))
        .pipe(replace(/export\s+(default\s+)?(GenericOptions;)?/g, ''))
        .pipe(replace(/%VERSION%/g, version));
}

function wrap(stream) {
    return stream.pipe(replace(/^/, license() + '(function(ns) {'))
        .pipe(replace(/$/,
            ';typeof module !== "undefined" && Object.assign(ns, {' +
            'Collection: Collection,' +
            'GenericOptions: GenericOptions,' +
            'Animation: Animation,' +
            'BaseGauge: BaseGauge,' +
            'drawings: drawings,' +
            'SmartCanvas: SmartCanvas,' +
            'DomObserver: DomObserver,' +
            'vendorize: vendorize' +
            '});' +
            '}(typeof module !== "undefined" ? ' +
            'module.exports : window));'));
}

function es5transpile(type = 'all', withSourceMaps = true, resolve = () => {}) {
    let stream = wrap(es6concat(type)
        .pipe(rename('gauge.es5.js'))
        .pipe(babel({
            presets: ['es2015'],
            compact: false
        }))
        .on('error', function(err) {
            gutil.log(err);
            this.emit('end');
            resolve();
        })
        .pipe(rename('gauge.min.js')));

    if (withSourceMaps) {
        stream = stream.pipe(sourcemaps.init({ loadMaps: true }));
    }

    stream = stream.pipe(uglify({
        preserveComments: (node, comment) => comment.line === 1
    }));

    if (withSourceMaps) {
        stream = stream.pipe(sourcemaps.write('.'));
    }

    return stream;
}

function license() {
    let src = fs.readFileSync('./LICENSE')
        .toString()
        .split(/\r?\n/);

    src.pop();

    return '/*!\n * ' + src.join('\n * ') + '\n *\n * @version ' +
        version + '\n */\n';
}

/**
 * Builds code complexity report
 *
 * @task {complexity}
 */
gulp.task('complexity', done => {
    rimraf('complexity', () => gulp.src('lib/**/*.js')
        .pipe(plato('complexity', {
            complexity: { trycatch: true },
            jshint: {
                options: {
                    strict: false,
                    browser: true,
                    browserify: true,
                    devel: true,
                    expr: true,
                    esversion: 6,
                    laxbreak: true,
                    laxcomma: true,
                    sub: true
                }
            }
        }))
        .on('finish', () => done())
    );
});

/**
 * Displays this usage information.
 *
 * @task {help}
 */
gulp.task('help', () => usage(gulp, { emptyLineBetweenTasks: false }));

/**
 * Builds production packages
 *
 * @task {build:prod}
 * @order {5}
 */
gulp.task('build:prod', done => {
    rimraf('dist', () => {
        Promise.all(types.map(type => {
            return new Promise(resolve => {
                es5transpile(type, false, resolve)
                    .pipe(gulp.dest('dist/' + type))
                    .on('end', () => {
                        let pkg = JSON.parse(fs.readFileSync('./package.json'));

                        delete pkg.devDependencies;
                        delete pkg.scripts;
                        delete pkg.directories;

                        if (type !== 'all') {
                            pkg.version += '-' + type;
                            pkg.keywords.push(type + '-gauge');
                        }

                        else {
                            for (let i = 1; i < types.length; i++) {
                                pkg.keywords.push(types[i] + '-gauge');
                            }
                        }

                        fs.writeFileSync('dist/' + type + '/package.json',
                            JSON.stringify(pkg, null, 2));

                        fs.writeFileSync('dist/' + type + '/README.md',
                            fs.readFileSync('README.md'));

                        fs.writeFileSync('dist/' + type + '/LICENSE',
                            fs.readFileSync('LICENSE'));

                        resolve();
                    });
            });
        })).then(() => {
            let cmd = '';

            console.log(chalk.bold.green('Production packages are now ready!'));
            console.log('To publish each production package, please run the ' +
                'following command:');

            types.reverse().forEach(type => {
                let v = version;
                let entry = type === 'linear' ? './' : '../../';

                if (cmd) cmd += ' && ';

                cmd += 'cd ' + entry + 'dist/' + type;

                if (type === 'all') type = 'latest';
                else v += '-' + type;

                cmd += ' && npm publish';

                if (type !== 'latest')
                    cmd += ' && npm dist-tag add canvas-gauges@' + v + ' ' +
                        type;
            });

            console.log(chalk.grey(cmd));

            let dst = '../canvas-gauges-pages/download';

            fsc.rm(dst + '/' + version);
            fsc.cp('dist', dst + '/' + version, true);
            fsc.rm(dst + '/latest');

            let releases = fsc.ls(dst);
            let latest = semver.maxSatisfying(releases, '*');

            fsc.cp(dst + '/' + latest, dst + '/latest');

            let info = {};

            releases.forEach(release => {
                info[release] = {
                    name: release
                };

                types.forEach(type => {
                    info[release][type] = {
                        bytes: fs.statSync(dst + '/' + release + '/' + type +
                            '/gauge.min.js').size
                    };

                    info[release][type].kb = (info[release][type].bytes / 1024)
                        .toFixed(1);

                    info[release][type].mb = (info[release][type].bytes /
                        (1024 * 1024)).toFixed(1);

                    info[release][type].gb = (info[release][type].bytes /
                        (1024 * 1024 * 1024)).toFixed(1);
                });
            });

            info.latest = JSON.parse(JSON.stringify(info[latest]));

            fs.writeFileSync('../canvas-gauges-pages/_data/releases.json',
                JSON.stringify(info, null, 2));

            done();
        });
    });
});

/**
 * Currently there is no way to minify es6 code, so this task is
 * temporally useless. Awaiting for support of es6 in minifiers.
 *
 * @task {build:es6}
 * @arg {type} build type: 'radial' - Gauge object only, 'linear' - LinearGauge object only, 'all' - everything (default)
 * @order {4}
 */
gulp.task('build:es6', done => {
    es6concat(yargs.argv.type || 'all', true)
        // .pipe(minify({
        //     preserveComments: (node, comment) => comment.line === 1
        // }, uglify6))
        .pipe(gulp.dest('.'))
        .on('end', () => done());
});

/**
 * Clean-ups files from previous build.
 *
 * @task {clean}
 * @order {1}
 */
gulp.task('clean', done => {
    rimraf('gauge.js', () =>
        rimraf('gauge.min.js', () =>
            rimraf('gauge.min.js.map', () =>
                rimraf('gauge.min.js.gz', done))));
});

/**
 * Cleans docs directory
 *
 * @task {clean:docs}
 * @order {6}
 */
gulp.task('clean:docs', done => {
    rimraf('docs', done);
});

/**
 * Builds and minifies es5 code
 *
 * @task {build:es5}
 * @arg {type} build type: 'radial' - Gauge object only, 'linear' - LinearGauge object only, 'all' - everything (default)
 * @order {3}
 */
gulp.task('build:es5', gulp.series('clean', done => {
    es5transpile(yargs.argv.type || 'all')
        .pipe(gulp.dest('.'))
        .on('end', () => {
            if (!process.env.TRVIS) {
                fs.writeFileSync(
                    '../canvas-gauges-pages/' +
                    'assets/js/gauge.min.js',
                    fs.readFileSync('gauge.min.js')
                );
                fs.writeFileSync(
                    '../canvas-gauges-pages/' +
                    'assets/js/gauge.min.js.map',
                    fs.readFileSync('gauge.min.js.map')
                );
            }

            done();
        });
}));

/**
 * Automatically generates API documentation for this project
 * from a source code.
 *
 * @task {doc}
 * @order {7}
 */
gulp.task('doc', gulp.series('clean:docs', done => {
    gulp.src('./lib')
        .pipe(esdoc({
            destination: './docs',
            package: './package.json',
            title: 'HTML5 Canvas Gauges API Documentation',
            styles: [
                './assets/styles/docs.css',
            ]
        }))
        .on('finish', () => {
            if (process.env.TRAVIS) {
                return ;
            }

            console.log(chalk.bold.green('Generating badge...'));

            let coverageDataFile = './docs/coverage.json';
            let coverage = require(coverageDataFile).coverage;
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

            //move to pages

            let target = '../canvas-gauges-pages/docs/' + version;

            rimraf(target, () => fs.rename('docs', target, done));
        });
}));

/**
 * Transpiles, combines and minifies JavaScript code.
 *
 * @task {build}
 * @arg {target} compile target, could be 'es5' (default) or 'es6'
 * @arg {type} build type: 'radial' - Gauge object only, 'linear' - LinearGauge object only, 'all' - everything (default)
 * @order {2}
 */
gulp.task('build', gulp.series(
    'build:' + (yargs.argv.target || 'es5'),
    done => done()));

/**
 * Watch for source code changes and automatically re-build
 * when wny of them detected.
 *
 * @task {watch}
 */
gulp.task('watch', () => {
    gulp.watch('lib/**/*.js', gulp.series('build'));
});

/**
 * Runs gzipping for minified file.
 *
 * @task {gzip}
 */
gulp.task('gzip', gulp.series('build:prod', done => {
    Promise.all(types.map(type => new Promise(resolve => {
        gulp.src('dist/' + type + '/gauge.min.js')
            .pipe(gzip({ gzipOptions: { level: 9 } }))
            .pipe(gulp.dest('dist/' + type))
            .on('end', resolve);
    }))).then(() => done());
}));

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
            '!coverage/**',
            '!complexity/**',
            '!dist/**',
            '!test/cjs/**'
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

    new KarmaServer({
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
gulp.task('test:e2e', gulp.series('selenium', done => {
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
}));

/**
 * Runs all tests and checks.
 *
 * @task {test}
 */
gulp.task('test', gulp.series('lint', 'test:spec'/*, 'test:e2e'*/));

gulp.task('default', gulp.series('help'));
