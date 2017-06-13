const gulp = require('gulp');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const gulpif = require('gulp-if');
const sass = require('gulp-ruby-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const pump = require('pump');
let environment = 'dev';

var browserifyOpts = {
  entries: ['./js/index.jsx'],
  extensions: ['.jsx', '.js'],
  paths: ['./js']
};
var opts = Object.assign({}, watchify.args, browserifyOpts);

var b = watchify(browserify(opts));
b.transform(babelify.configure({
  presets: ['react', 'stage-2', 'stage-0']
}));

gulp.task('build', bundle);

function bundle(cb) {
  let isProd = environment === 'prod';

  pump([
    b.bundle(),
    source('app.js'),
    gulpif(isProd, buffer()),
    gulpif(isProd, uglify()),
    gulp.dest('build'),
    notify('Gulp done')
  ], cb);
}


gulp.task('watch', () => {
  b.on('update', bundle);
  gulp.watch('styles/**/*.scss', ['styles']);
});

gulp.task('default', () => {
  gulp.start('build', 'styles', 'watch');
});

gulp.task('styles', function() {
  return sass('styles/index.scss')
    .pipe(plumber())
    .pipe(concat('app.css'))
    .pipe(autoprefixer())
    .pipe(gulpif(environment === 'prod', cssnano({
      zindex: false
    })))
    .pipe(gulp.dest('build', {
      overwrite: true
    }));
});

gulp.task('prod', function() {
  environment = 'prod';
  gulp.start('build', 'styles');
});
