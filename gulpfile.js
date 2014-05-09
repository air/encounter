var gulp = require('gulp');
// optionals
var bump = require('gulp-bump');
var git = require('gulp-git');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');

gulp.task('test', function() {
  // TODO
});

gulp.task('lint', function() {
  return gulp.src('./js/*.js')
    .pipe(concat('linted.js'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('.'));
});

// update package.json version
gulp.task('bump-version', ['test'], function() {
  return gulp.src('package.json')
    .pipe(bump())
    .pipe(gulp.dest('.'));
});

// commit package.json and push it
// FIXME push is broken
gulp.task('release', ['bump-version'], function() {
  var version = require('./package.json').version;

  return gulp.src('.')
    .pipe(git.commit('released version ' + version))
    .pipe(git.push('origin', 'master'))
    .end();
});

// merge master into gh-pages and push it
// FIXME merge fails, seems to happen before checkout is complete
gulp.task('publish', ['test'], function() {
  var version = require('./package.json').version;

  return gulp.src('.')
    .pipe(git.checkout('gh-pages'))
    .pipe(git.merge('master'))
    .pipe(git.commit('merged master ' + version + ' to gh-pages'))
    .pipe(git.push('origin', 'gh-pages'))
    .pipe(git.checkout('master'))
    .end();
});

// a minimal gulp plugin at https://github.com/sindresorhus/gulp-size/blob/master/index.js