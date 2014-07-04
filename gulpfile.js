var gulp = require('gulp');
// optionals
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');

gulp.task('lint', function() {
  return gulp.src('./js/*.js')
    .pipe(concat('linted.js'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('.'));
});
