import gulp from 'gulp';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import del from 'del';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

const ALL_SOURCES = [
    '*.js',
    'src/*.js',
];

exports.lint = (cb) => {
    gulp.src(ALL_SOURCES)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());

    cb();
};

exports.clean = (cb) => {
    Promise.all([del('lib/'), del('coverage/')])
        .then(() => {
            cb();
        });
};

const bundled_config = {
    debug: true,
    entries: 'src/index.js',
    standalone: 'cypress-mailtrap',
};

const external_config = {
    debug: true,
    entries: 'src/index.js',
    standalone: 'cypress-mailtrap',
    external: [
        '@xedi/mailtrap',
    ],
    bundleExternal: true,
};

function build_bundle_min(cb) {
    buildBundle(bundled_config, '.bundle.min.js', true);
    cb();
}

function build_external_min(cb) {
    buildBundle(external_config, '.min.js', true);
    cb();
}

function build_bundled_debug(cb) {
    buildBundle(bundled_config, '.bundle.js', false);
    cb();
}

function build_external_debug(cb) {
    buildBundle(external_config, '.js', false);
    cb();
}

function build_components(cb) {
    gulp.src('src/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('lib'));

    cb();
}

exports.build = gulp.series(
    build_bundle_min,
    build_external_min,
    build_bundled_debug,
    build_external_debug,
    build_components,
);

function buildBundle(options, extname, minify) {
    let stream = browserify(options)
        .transform('babelify')
        .bundle()
        .pipe(source('cypress-mailtrap.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true,
        }));

    if (minify) {
        stream = stream.pipe(uglify());
    }

    return stream.pipe(rename({extname}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('lib'));
}
