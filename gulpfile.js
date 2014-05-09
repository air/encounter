var gulp = require('gulp');
// optionals
var bump = require('gulp-bump');

gulp.task('test', function () {
  return gulp.src('./js/*.js')
});

gulp.task('release', function () {
  return gulp.src('package.json').pipe(bump({type:'major'})).pipe(gulp.dest('.'));
});