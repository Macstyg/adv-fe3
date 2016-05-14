var gulp     = require('gulp'),
    bower    = require('gulp-bower'),
    less     = require('gulp-less'),
    cssnano  = require('gulp-cssnano'),
    htmlmin  = require('gulp-htmlmin'),
    uglify   = require('gulp-uglify'),
    gulpif   = require('gulp-if'),
    csscomb  = require('gulp-csscomb'),
    clean    = require('gulp-clean'),
    jscs     = require('gulp-jscs'),
    htmlhint = require("gulp-htmlhint"),
    jshint   = require('gulp-jshint'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    argv     = require('yargs').argv,
    concat   = require('gulp-concat');

gulp.task('bower', function() {
  return bower('./libs');
});

gulp.task('build', ['copy-static', 'css']);

gulp.task('libs', function() {
  return gulp.src('libs/**/*.min.js')
        .pipe(gulp.dest('bin/libs/'));
});

gulp.task('images', function() {
  return gulp.src([ '!node_modules/**/*.*', '!libs/**/*.*', '**/*.{png,jpg,svg}'])
        .pipe(gulp.dest('bin/'));
});

gulp.task('html', function() {
  return gulp.src('!node_modules/**/*.*', '!libs/**/*.*', '**/*.html')
        .pipe(gulpif(argv.prod, (htmlmin({collapseWhitespace: true}))))
        .pipe(gulp.dest('bin/'))
        .pipe(livereload());
});

gulp.task('css', function() {
  return gulp.src('styles/**.less')
        .pipe(concat('styles.css'))
        .pipe(less())
        .pipe(autoprefixer({ browsers: ['last 4 versions'] }))
        .pipe(cssnano())
        .pipe(gulpif(argv.prod, sourcemaps()))
        .pipe(gulp.dest('bin/static/'))
        .pipe(livereload());
});

gulp.task('js', function() {
  return gulp.src('js/**.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulpif(argv.prod, sourcemaps()))
        .pipe(gulp.dest('bin/static/'))
        .pipe(livereload());
});

gulp.task('clean', function() {
  return gulp.src('bin/*', { read: false })
        .pipe( clean( { force: true }))
});

// CODE STYLES
gulp.task('styles', function() {
  return gulp.src('styles/*.less')
    .pipe(csscomb())
    .pipe(gulp.dest(function(file) {
      return file.base;
    }));
});

gulp.task('jscs', function () {
  return gulp.src('js/*.js')
        .pipe(jscs({ fix: true }))
        .pipe(gulp.dest(function(file){
          return file.base;
        }));
});

gulp.task('jshint', function () {
  return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
gulp.task('htmlhint', function() {
  gulp.src("*.html")
  .pipe(htmlhint())
  .pipe(htmlhint.reporter("htmlhint-stylish"))
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('**/*.{png,jpg,svg}', ['images']);
  gulp.watch('**/*.less', ['css']);
  gulp.watch('**/*.html', ['html']);
  gulp.watch('**/*.js', ['js']);
});

// gulp.task('default', ['libs', 'build']);
gulp.task('default', ['css', 'js', 'html', 'images']);
gulp.task('style', ['styles', 'jscs', 'jshint', 'htmlhint']);
