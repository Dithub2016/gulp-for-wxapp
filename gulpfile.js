const
    gulp = require('gulp'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    path = require('path');

const
    sassOpts = { rename: 'wxss', target: 'scss' },
    src = 'src',
    dist = 'dist';

gulp.task('clean', function () {
    return gulp
    .src(dist)
    .pipe(clean());
});

gulp.task('move', moveTask);
function moveTask() {
    return gulp
    .src([`${src}/**/*`, `!${src}/**/*.${sassOpts.target}`])
    .pipe(gulp.dest(dist));
}

gulp.task('sass', sassTask);
function sassTask() {
    return gulp
    .src(`${src}/**/*.${sassOpts.target}`)
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({ extname: `.${sassOpts.rename}` }))
    .pipe(gulp.dest(dist));
}
   

gulp.task('dev', ['sass', 'move'], function () {

    watch(`${src}/**/*.${sassOpts.target}`)
    .on('add', sassTask)
    .on('change', sassTask)
    .on('unlink', function (_src) {
        const _file = _src.replace(src, dist).replace(sassOpts.target, sassOpts.rename);
        console.log(`delete: ${_file}`);
        return gulp.src(_file).pipe(clean());
    });

    watch([`${src}/**/*`, `!${src}/**/*.${sassOpts.target}`])
    .on('add', moveTask)
    .on('change', moveTask)
    .on('unlink', function (_src) {
        const _file = _src.replace(src, dist);
        console.log(`delete: ${_file}`);
        return gulp.src(_src.replace(src, dist)).pipe(clean());
    });
});

gulp.task('default', ['sass', 'move']);
