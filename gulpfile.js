var gulp = require('gulp');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');

var del = require("del");
var tsc = require("gulp-typescript");
var tsProject = tsc.createProject("tsconfig.json");
var tslint = require('gulp-tslint');

gulp.task('sass', function() {
  return gulp.src('src/css/main.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulpif(argv.production, csso()))
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload());
});

/**
 * Remove build directory.
 */
gulp.task('clean', function(cb) {
  return del(["dist"], cb);
});

/**
 * Compile TypeScript sources and create sourcemaps in build directory.
 */
gulp.task("compile", function() {
  var tsResult = gulp.src("src/**/*.ts")
    .pipe(sourcemaps.init())
    .pipe(tsProject());
  return tsResult.js
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"))
    .pipe(livereload());
});

/**
 * Copy all resources that are not TypeScript files into build directory.
 */
gulp.task("resources", function() {
  return gulp.src(["src/**/*", "!**/*.ts", "!**/*.js"])
    .pipe(gulp.dest("dist"))
    .pipe(livereload());
});


/**
 * Copy all required Front End libraries into build directory.
 */
gulp.task("libs", function() {
  return gulp.src([
      'core-js/client/shim.min.js',
      'core-js/client/shim.min.js.map',
      'es6-shim/es6-shim.min.js',
      'systemjs/dist/**',
      // 'systemjs/dist/system-polyfills.js',
      // 'systemjs/dist/system.src.js',
      'reflect-metadata/**',
      // 'reflect-metadata/Reflect.js',
      // 'reflect-metadata/Reflect.js.map',
      'angular2-in-memory-web-api/**',
      'rxjs/**',
      'zone.js/dist/**',
      '@angular/**',
      'bootstrap/dist/**/*',
      'jasny-bootstrap/dist/**/*'
    ], {
      cwd: "node_modules/**"
    }) /* Glob required here. */
    .pipe(gulp.dest("dist/lib"));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('src/css/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['resources']);
  gulp.watch('src/**/*.ts', ['compile']);
});

gulp.task('build', ['compile', 'resources', 'libs', 'sass']);
gulp.task('default', ['build', 'watch']);
