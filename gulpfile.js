var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var smaps  = require('gulp-sourcemaps');
var include = require('./libs/gulp-include');

gulp.task('build-js', function () {
    gulp.src('src/js/as-framework.js')
        .pipe(include())
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename({extname: '.min.js'}))
        .pipe(smaps.init())
        .pipe(uglify())
        .pipe(smaps.write('.'))
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('build-css', function () {
    gulp.src('src/css/styles.css')
        .pipe(include())
        .pipe(gulp.dest('./dist/css'))
});

gulp.task('build', ['build-js', 'build-css']);
gulp.task('dev', ['build', 'connect']);
gulp.task('default', ['dev']);
