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
    'src/*.js',
    '!src/color-finder-worker.js'
];
var FILES_TO_COPY = [
    'src/_mmcq.js',
    'src/color-finder-worker.js'
];

gulp.task('scripts', function () {
    return gulp.src(BUILD_SOURCE)
        .pipe(jshint('.jshintrc'))
        .pipe(gulpif(['*', '!_mmcq.js'], jshint.reporter('default')))
        .pipe(concat(BUILD_NAME))
        .pipe(gulp.dest(BUILD_PATH))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(BUILD_PATH))
        .pipe(notify({message: 'Scripts task completed'}));
});

gulp.task('copy_files', function () {
    return gulp.src(FILES_TO_COPY)
        .pipe(gulp.dest(BUILD_PATH));
});

gulp.task('build', ['scripts', 'copy_files']);

gulp.task('default', ['build']);
gulp.task('watch', function () {
    return gulp.watch(BUILD_SOURCE, ['scripts']);
});