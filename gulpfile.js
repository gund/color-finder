/**
 * Created by alex on 11/30/15.
 */

var gulp = require('gulp')
    , jshint = require('gulp-jshint')
    , uglify = require('gulp-uglify')
    , rename = require('gulp-rename')
    , notify = require('gulp-notify')
    , concat = require('gulp-concat')
    , gulpif = require("gulp-if");

var BUILD_NAME = 'color-finder.js';
var BUILD_PATH = 'dist';
var BUILD_SOURCE = [
    'lib/color-thief/src/color-thief.js'
    , 'src/*.js'
];

gulp.task('scripts', function () {
    return gulp.src(BUILD_SOURCE)
        .pipe(jshint('.jshintrc'))
        .pipe(gulpif(['*', '!color-thief.js'], jshint.reporter('default')))
        .pipe(concat(BUILD_NAME))
        .pipe(gulp.dest(BUILD_PATH))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(BUILD_PATH))
        .pipe(notify({message: 'Scripts task completed'}));
});


gulp.task('default', ['scripts']);
gulp.task('watch', function () {
    gulp.watch(BUILD_SOURCE, ['scripts']);
});