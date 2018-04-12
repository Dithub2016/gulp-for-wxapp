const
    gulp = require('gulp'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    debug = require('gulp-debug'),
    changed = require('gulp-changed'),
    path = require('path');

const
    src = 'src',
    dist = 'dist',
    sassOpts = { rename: 'wxss', target: 'scss', src: `${src}/**/*.scss` },
    moveOpts = { src: [`${src}/**/*`, `!${src}/**/*.scss`] };

gulp.task('clean', function () {
    return gulp
    .src(dist)
    .pipe(debug({ title: 'clean: ' }))
    .pipe(clean());
});

gulp.task('move', moveTask);
function moveTask() {
    return gulp
    .src(moveOpts.src)
    .pipe(changed(dist))
    .pipe(debug({ title: 'move: ' }))
    .pipe(gulp.dest(dist));
}

gulp.task('sass', sassTask);
function sassTask() {
    return gulp
    .src(sassOpts.src)
    .pipe(changed(dist, {extension: `.${sassOpts.rename}`}))
    .pipe(debug({ title: 'sass: ' }))
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({ extname: `.${sassOpts.rename}` }))
    .pipe(gulp.dest(dist));
}
   

gulp.task('dev', ['sass', 'move'], function () {

    watch(sassOpts.src)
    .on('add', sassTask)
    .on('change', sassTask)
    .on('unlink', function (_src) {
        const _file = _src.replace(src, dist).replace(sassOpts.target, sassOpts.rename);
        return gulp
        .src(_file)
        .pipe(debug({ title: 'clean: ' }))
        .pipe(clean());
    });

    watch(moveOpts.src)
    .on('add', moveTask)
    .on('change', moveTask)
    .on('unlink', function (_src) {
        const _file = _src.replace(src, dist);
        return gulp
        .src(_file)
        .pipe(debug({ title: 'clean: ' }))
        .pipe(clean());
    });
});

gulp.task('default', ['sass', 'move']);
