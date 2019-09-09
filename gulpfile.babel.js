import gulp from 'gulp';
import eslint from 'gulp-eslint';
import del from 'del';

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
