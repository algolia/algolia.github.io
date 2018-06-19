const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');
const glob = require('glob');
const path = require('path');

// dev
const webserver = require('gulp-webserver');
const livereload = require('gulp-livereload');

// deploy
const ghPages = require('gh-pages');

// css
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const critical = require('critical').stream;

// html
const haml = require('gulp-haml');

// js
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

// prod
const filter = require('gulp-filter');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');

const minifyCss = require('gulp-minify-css');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

// debug utils
const gutil = require('gulp-util');

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
gulp.task('clean', () => del('build'));

// -------------------------------------
//   Task: Haml
// -------------------------------------
gulp.task('haml', () =>
  gulp
    .src('src/*.haml')
    .pipe(haml())
    .pipe(gulp.dest('build'))
);

// -------------------------------------
//   Task: SCSS
// -------------------------------------
gulp.task('scss', () =>
  gulp
    .src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
      })
    )
    .pipe(gulp.dest('build'))
    .pipe(livereload())
);

gulp.task('critical-css', () => {
  const cssFiles = glob.sync('build/*.css');
  const htmlFiles = glob.sync('build/*.html');

  return gulp
    .src(htmlFiles)
    .pipe(
      critical({
        base: 'build/',
        inline: true,
        minify: true,
        css: [...cssFiles],
        extract: true,
      })
    )
    .on('error', err => {
      gutil.log(gutil.colors.red(err.message));
    })
    .pipe(gulp.dest('build'));
});

// -------------------------------------
//   Task: Minify CSS
// -------------------------------------
gulp.task('css:min', ['scss'], () =>
  gulp
    .src('build/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('build'))
);

// -------------------------------------
//   Task: Javascript
// -------------------------------------
gulp.task('js', () =>
  gulp
    .src(['src/js/app.js', 'src/serviceWorker.js'])
    .pipe(webpack(webpackConfig, require('webpack')))
    .on('error', function() {
      this.emit('end'); // Recover from errors
    })
    .pipe(gulp.dest('build/js'))
    .pipe(livereload())
);

// -------------------------------------
//   Task: Minify JS
// -------------------------------------
gulp.task('js:min', ['js'], () =>
  gulp
    .src('build/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
);

// -------------------------------------
//   Task: Initialise ServiceWorker
// -------------------------------------
// gulp.task('offline', function() {
//   return gulp.src('**/*', { cwd: 'build' })
//     .pipe(sww())
//     .pipe(gulp.dest('build'));
// });

// -------------------------------------
//   Task: Images & Optmizations
// -------------------------------------
gulp.task('images', () =>
  gulp
    .src('src/img/**/*')
    .pipe(gulp.dest('build/img'))
    .pipe(livereload())
);

gulp.task('images:optim', () =>
  gulp
    .src('src/img/**/*')
    .pipe(
      imagemin({
        progressive: true,
        use: [pngquant()],
      })
    )
    .pipe(gulp.dest('build/img'))
);

// -------------------------------------
//   Task: Copy files
// -------------------------------------
gulp.task('copy', () => gulp.src(['CNAME']).pipe(gulp.dest('build')));

gulp.task('copyRedirects', () =>
  gulp.src(['_redirects']).pipe(gulp.dest('build'))
);

gulp.task('copyWorker', () =>
  gulp.src(['build/js/serviceWorker.js']).pipe(gulp.dest('build'))
);

// -------------------------------------
//   Task: Watch
// -------------------------------------
gulp.task('watch', () => {
  livereload.listen();
  gulp.watch('src/*.haml', ['build:haml']);
  gulp.watch('src/scss/**/*.scss', ['scss']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/img/**/*', ['images']);
});

// -------------------------------------
//   Task: Web Server
// -------------------------------------
gulp.task('webserver', () => {
  gulp.src('build').pipe(
    webserver({
      host: 'localhost',
      port: 1337,
      livereload: true,
      directoryListing: false,
      open: true,
    })
  );
});

// -------------------------------------
//   Task: Revision
// -------------------------------------
gulp.task('rev', () => {
  const assetFilter = filter(
    ['**/*', '!**/index.html', '!favicon.ico', '!robots.txt'],
    {
      restore: true,
    }
  );

  return gulp
    .src('src/**')
    .pipe(assetFilter)
    .pipe(rev()) // Rename all files except index.html
    .pipe(assetFilter.restore)
    .pipe(revRewrite()) // Substitute in new filenames
    .pipe(gulp.dest('build'));
});

// -------------------------------------
//   Task: Build DEV - PROD - HAML
// -------------------------------------
gulp.task('build:dev', ['clean'], callback => {
  runSequence(
    'scss',
    'images',
    'haml',
    'js',
    'copyRedirects',
    'copyWorker',
    callback
  );
});

gulp.task('build:prod', ['clean'], callback => {
  runSequence(
    'scss',
    'css:min',
    'copy',
    'images:optim',
    'haml',
    'js:min',
    'rev',
    'critical-css',
    'copyRedirects',
    'copyWorker',
    callback
  );
});

gulp.task('build:haml', callback => {
  runSequence('haml', callback);
});

// -------------------------------------
//   Task: Developement
// -------------------------------------
gulp.task('dev', callback => {
  runSequence('build:dev', 'watch', 'webserver', callback);
});

// -------------------------------------
//   Task: Algolia
// -------------------------------------

gulp.task('export:algolia-index', () => {
  /* eslint-disable */
  const client = algolia(process.env.appId, process.env.adminApiKey);
  const index = client.initIndex(config.algolia.index);
  fs.readFile('src/algolia-projects.json', 'utf8', (err, data) => {
    if (err) {
      return console.log(err); // eslint-disable-line no-console
    }
    const parsedData = _.chunk(JSON.parse(data), [(size = 100)]);
    return index.clearIndex((err, content) => {
      if (err) {
        return console.log(err); // eslint-disable-line no-console
      }
      index.waitTask(content.taskID, err => {
        if (err) {
          return console.log(err); // eslint-disable-line no-console
        }
        async.each(
          parsedData,
          (batch, callback) => {
            index.addObjects(batch, (err, result) => {
              if (err) {
                return console.log(err); // eslint-disable-line no-console
              }
              index.waitTask(result.taskID, err => {
                if (err) {
                  return console.log(err); // eslint-disable-line no-console
                }
                console.log(`Indexed ${batch.length} objects`); // eslint-disable-line no-console
                callback();
              });
            });
          },
          err => {
            if (err) {
              console.log(err); // eslint-disable-line no-console
              throw err;
            }
          }
        );
      });
    });
  });
});

gulp.task('export:algolia-settings', () => {
  const client = algolia(process.env.appId, process.env.adminApiKey);
  const index = client.initIndex(config.algolia.index);
  index.setSettings(config.algolia.settings, (err, content) => {
    if (err) {
      console.log(err);
      throw err;
    }
  });
});

// -------------------------------------
//   Task: Deploy Github Page
// -------------------------------------
gulp.task('deploy', cb => {
  ghPages.publish(path.join(process.cwd(), 'build'), {branch: 'master'}, cb);
});
