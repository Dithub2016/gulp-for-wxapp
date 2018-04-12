const
    gulp = require('gulp'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename');

const
    sassOpts = { rename: 'wxss', target: 'scss' },
    src = 'src',
    dist = 'dist';

gulp.task('clean', function () {
    return gulp
    .src(dist)
    .pipe(clean());
});

gulp.task('move', moveTask());
function moveTask(_src = [`${src}/**/*`, `!${src}/**/*.${sassOpts.target}`]) {
    return function () {
        console.log(`move: ${_src}`)
        return gulp
        .src(_src)
        .pipe(gulp.dest(dist));
    };
}

gulp.task('sass', sassTask());
function sassTask(_src = `${src}/**/*.${sassOpts.target}`) {
    return function () {
        console.log(`sass: ${_src}`)
        return gulp
        .src(_src)
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({ extname: `.${sassOpts.rename}` }))
        .pipe(gulp.dest(dist));
    }
}
   

gulp.task('dev', ['sass', 'move'], function () {

    watch(`${src}/**/*.${sassOpts.target}`)
    .on('add', _src => sassTask(_src)())
    .on('change', _src => sassTask(_src)())
    .on('unlink', function (_src) {
        const _file = _src.replace(src, dist).replace(sassOpts.target, sassOpts.rename);
        console.log(`delete: ${_file}`);
        return gulp.src(_file).pipe(clean());
    });

    watch([`${src}/**/*`, `!${src}/**/*.${sassOpts.target}`])
    .on('add', _src => moveTask(_src)())
    .on('change', _src => moveTask(_src)())
    .on('unlink', function (_src) {
        const _file = _src.replace(src, dist);
        console.log(`delete: ${_file}`);
        return gulp.src(_src.replace(src, dist)).pipe(clean());
    });
});

gulp.task('default', ['sass', 'move']);
