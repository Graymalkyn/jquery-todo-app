var gulp = require('gulp');
var sass = require('gulp-sass');
var exec = require('child_process').exec;

gulp.task('default', ['scss', 'scss:watch', 'server']);


gulp.task('server', function(cb) {
  exec('node app.js', function (err, stdout, stderr) {
    cb(err);
  });
  console.log('default task run');
});

gulp.task('scss', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public'));
});

gulp.task('scss:watch', function () {
  gulp.watch('./scss/**/*.scss', ['scss']);
});
