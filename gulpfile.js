var gulp = require('gulp'),
    babel = require('gulp-babel'),
    webpack = require('gulp-webpack-stream');

gulp.task('server', function() {
  require('./test/server');
});

gulp.task('babel', function() {
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015', 'stage-0', 'react']
    }))
    .pipe(gulp.dest('lib'));
});

gulp.task('babel:watch', function() {
  gulp.watch('src/**/*.js', ['babel', 'webpack']);
});

gulp.task('webpack', function() {
  return gulp.src('./test/client.js')
  .pipe(webpack(require('./test/webpack.config')))
  .pipe(gulp.dest(__dirname));
});

gulp.task('webpack:watch', function() {
  gulp.watch(['test/**/*.js', '!test/public/**'], ['webpack']);
});

gulp.task('build', ['babel']);
gulp.task('build-test', ['webpack']);
gulp.task('development', ['build', 'build-test', 'babel:watch', 'webpack:watch', 'server']);
