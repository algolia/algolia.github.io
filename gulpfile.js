const gulp = require('gulp');
const path = require('path');
const del = require('del');
const rename = require("gulp-rename");
const runSequence = require('run-sequence');
const glob = require('glob');

//dev
const webserver = require('gulp-webserver');
const livereload = require('gulp-livereload');

//deploy
const ghPages = require('gulp-gh-pages');
const awspublish = require('gulp-awspublish');

//css
const sass = require('gulp-sass');
const scsslint = require('gulp-scss-lint');
const scssLintStylish = require('gulp-scss-lint-stylish');
const autoprefixer = require('gulp-autoprefixer');
const critical = require('critical').stream;

//html
const haml = require('gulp-haml');

//serviceworker
const sww = require('gulp-sww');

//SVG
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');

//js
const webpack = require('webpack-stream');
const webpackConfig = require("./webpack.config.js");
const jshint = require('gulp-jshint');

//prod
const rev = require('gulp-rev');
const revNapkin = require('gulp-rev-napkin');
const revReplace = require('gulp-rev-replace');

const minifyCss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant')
  // const favicons = require("gulp-favicons");

//debug utils
var gutil = require('gulp-util');

const algolia = require('algoliasearch');
const config = require('./config.json');
const async = require('async');
const _ = require('lodash');
const fs = require('fs');

// *************************************
//
// Available tasks:
//   `gulp dev`
//   `gulp build`
//   `gulp deploy`
//
// *************************************


// -------------------------------------
//   Task: Clean build directory
// -------------------------------------
gulp.task('clean', function() {
  return del("build");
});

// -------------------------------------
//   Task: Haml
// -------------------------------------
gulp.task('haml', function() {
  return gulp.src('src/*.haml')
    .pipe(haml())
    .pipe(gulp.dest('build'));
});


// -------------------------------------
//   Task: SCSS
// -------------------------------------
gulp.task('scss', function() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('build'))
    .pipe(livereload());
});

gulp.task('critical-css', function() {
  const cssFiles = glob.sync('build/*.css');
  const htmlFiles = glob.sync('build/*.html');

  return gulp.src(htmlFiles)
    .pipe(critical({ 
      base: 'build/',
      inline: true, 
      minify: true,
      css: [ ...cssFiles ],
      extract: true
    }))
    .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
    .pipe(gulp.dest('build'));
});

// -------------------------------------
//   Task: Lint SCSS
// -------------------------------------
// gulp.task('lint:scss', function() {
//   return gulp.src('src/scss/*.scss')
//     .pipe(scsslint({
//       customReport: scssLintStylish,
//       config: 'scss-lint.yml'
//     }));
// });

// -------------------------------------
//   Task: Minify CSS
// -------------------------------------
gulp.task('css:min', ['scss'], function() {
  return gulp.src('build/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('build'));
});

// -------------------------------------
//   Task: Javascript
// -------------------------------------
gulp.task('js', function() {
  return gulp.src('src/js/app.js')
    .pipe(webpack(webpackConfig))
    .on('error', function(e) {
      this.emit('end'); // Recover from errors
    })
    .pipe(gulp.dest('build/js'))
    .pipe(livereload());
});

// -------------------------------------
//   Task: Lint Javascript
// -------------------------------------
gulp.task('lint:js', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// -------------------------------------
//   Task: Minify JS
// -------------------------------------
gulp.task('js:min', ['js'], function() {
  return gulp.src('build/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

// -------------------------------------
//   Task: Initialise ServiceWorker 
// -------------------------------------
gulp.task('offline', function() {
  return gulp.src('**/*', { cwd: 'build' })
    .pipe(sww())
    .pipe(gulp.dest('build'));
});

// -------------------------------------
//   Task: Images & Optmizations
// -------------------------------------
gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('build/img'))
    .pipe(livereload());
});

gulp.task('images:optim', function() {
  return gulp.src('src/img/**/*')
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest('build/img'));
});

// -------------------------------------
//   Task: Copy files
// -------------------------------------
gulp.task('copy', function() {
  return gulp.src(['CNAME'])
    .pipe(gulp.dest('build'));
});

// // -------------------------------------
// //   Task: Favicons
// // -------------------------------------
// gulp.task("favicons", function () {
//   return gulp.src("src/favicon.png")
//     .pipe(favicons({
//       icons: {
//         android: false,
//         appleIcon: false,
//         appleStartup: false,
//         coast: false,
//         favicons: true,
//         firefox: false,
//         opengraph: false,
//         twitter: false,
//         windows: false,
//         yandex: false
//       }
//     }))
//     .pipe(gulp.dest("build/"));
// });

// -------------------------------------
//   Task: Watch
// -------------------------------------
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('src/*.haml', ['build:haml']);
  gulp.watch('src/scss/**/*.scss', ['scss']);
  gulp.watch('src/js/**/*.js', ['js', 'lint:js']);
  gulp.watch('src/img/**/*', ['images']);
});

// -------------------------------------
//   Task: Web Server
// -------------------------------------
gulp.task('webserver', function() {
  gulp.src('build')
    .pipe(webserver({
      host: '0.0.0.0',
      port: 1337,
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

// -------------------------------------
//   Task: Revision
// -------------------------------------
gulp.task('revision', function() {
  return gulp.src(['build/**/**/*.{css,js,png,svg,html}'])
    .pipe(rev())
    .pipe(gulp.dest('build'))
    .pipe(revNapkin())
    .pipe(rev.manifest())
    .pipe(gulp.dest('build'))
});

gulp.task('revreplace', ['revision'], () => {
  const manifest = gulp.src("build/rev-manifest.json");
  const htmlFiles = glob.sync('build/**/*')

  return gulp.src(['build/*.html', 'build/js/*.js','build/*.js', 'build/*.css', 'build/manifest.json'],{ base: 'build' })
    .pipe(revReplace({ 
      manifest: manifest 
    }))
    .pipe(gulp.dest('build'))
})

// -------------------------------------
//   Task: Build DEV - PROD - HAML
// -------------------------------------
gulp.task('build:dev', ['clean'], function(callback) {
  runSequence('scss', 'images', 'haml', 'js', callback);
});

gulp.task('build:prod', ['clean'], function(callback) {
  runSequence('scss', 'css:min', 'copy', 'images:optim', 'haml', 'js:min', 'revreplace', 'critical-css', callback);
});

gulp.task('build:haml', function(callback) {
  runSequence('haml', callback);
});

// -------------------------------------
//   Task: Developement
// -------------------------------------
gulp.task('dev', function(callback) {
  runSequence('build:dev', 'watch', 'webserver', callback);
});

gulp.task('s3-deploy', function() {
  var publisher = awspublish.create({
    region: 'us-east-1',
    params: {
      Bucket: 'community.algolia.com'
    }
  });

  return gulp.src('build/**/*')
    // .pipe(awspublish.gzip({ ext: '.gz'}))
    .pipe(publisher.publish())
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});

// -------------------------------------
//   Task: Algolia
// -------------------------------------

gulp.task('export:algolia-index', function() {
  var client = algolia(config.algolia.appID, config.algolia.apiKey);
  var index = client.initIndex(config.algolia.index);
  fs.readFile('src/algolia-projects.json', 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    var data = _.chunk(JSON.parse(data), [size = 100]);
    return index.clearIndex(function(err, content) {
      index.waitTask(content.taskID, function() {
        async.each(data, function(batch, callback) {
          index.addObjects(batch, function(err, result) {
            index.waitTask(result.taskID, function() {
              console.log('Indexed ' + batch.length + ' objects');
              callback();
            });
          });
        }, function(err) {
          console.log(err);
        });
      });
    });
  });
});

gulp.task('export:algolia-settings', function() {
  var client = algolia(config.algolia.appID, config.algolia.apiKey);
  var index = client.initIndex(config.algolia.index);
  index.setSettings(config.algolia.settings, function(err, content) {});
});

// -------------------------------------
//   Task: Deploy Github Page
// -------------------------------------
gulp.task('deploy', function(callback) {
  return gulp.src('build/**/*')
    .pipe(ghPages({ branch: "master" }));
});