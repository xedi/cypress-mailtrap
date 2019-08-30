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

gulp.task('lint', function() {
    return gulp.src(ALL_SOURCES)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());

});

gulp.task('clean', function() {
    return Promise.all([del('lib/'), del('coverage/')]);
});


gulp.task('build', [
    'build:bundled:min',
    'build:external:min',
    'build:bundled:debug',
    'build:external:debug',
    'build:components',
]);

const bundled_config = {
    debug: true,
    entries: 'src/index.js',
    standalone: 'index',
};

const external_config = {
    debug: true,
    entries: 'src/index.js',
    standalone: 'index',
    external: [
        '@xedi/mailtrap',
    ],
    bundleExternal: false,
};

gulp.task('build:bundled:min', function() {
    return buildBundle(bundled_config, '.bundle.min.js', true);
});

gulp.task('build:external:min', function() {
    return buildBundle(external_config, '.min.js', true);
});

gulp.task('build:bundled:debug', function() {
    return buildBundle(bundled_config, '.bundle.js', false);
});

gulp.task('build:external:debug', function() {
    return buildBundle(external_config, '.js', false);
});

gulp.task('build:components', function() {
    return gulp.src('src/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('lib/components'));
});

function buildBundle(options, extname, minify) {
    let stream = browserify(options)
        .transform('babelify')
        .bundle()
        .pipe(source('index.js'))
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
