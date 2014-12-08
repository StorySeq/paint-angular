'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('dist-concat', ['wiredep', 'injector:css', 'injector:js', 'partials'], function () {
  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src('src/*.html')
  .pipe($.inject(gulp.src('.tmp/inject/templateCacheHtml.js', {read: false}), {
    starttag: '<!-- inject:partials -->',
    ignorePath: '.tmp',
    addRootSlash: false
  }))
  .pipe(assets = $.useref.assets())
  // .pipe($.rev())
  .pipe(jsFilter)
  .pipe($.ngAnnotate())
  // .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
  .pipe(jsFilter.restore())
  .pipe(cssFilter)
  .pipe($.replace('bower_components/bootstrap-sass-official/assets/fonts/bootstrap','fonts'))
  // .pipe($.csso())
  .pipe(cssFilter.restore())
  .pipe(assets.restore())
  .pipe($.useref())
  .pipe($.revReplace())
  .pipe(htmlFilter)
  .pipe($.minifyHtml({
    empty: true,
    spare: true,
    quotes: true
  }))
  .pipe(htmlFilter.restore())
  .pipe(gulp.dest('dist_concat/'))
  .pipe($.size({ title: 'dist_concat/', showFiles: true }));
});

gulp.task('copy-del-dist-files', ['dist-concat'], function() {
  return gulp.src(['dist_concat/scripts/app.js', 'dist_concat/styles/app.css'])
  .pipe($.flatten())
  .pipe(gulp.dest('dist_concat/'));
});

gulp.task('cleanup', ['copy-del-dist-files'], function (done) {
  $.del(['dist_concat/*.html', 'dist_concat/scripts', 'dist_concat/styles'], done);
});

gulp.task('dist', ['cleanup']);
