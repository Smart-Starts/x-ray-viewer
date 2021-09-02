"use strict";

var gulp = require("gulp");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var del = require("del");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');

gulp.task('scripts', function() {
  return gulp.src('source/js/*.js')
    .pipe(concat('script.js'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('fs/js'));
});

gulp.task("css", function () {
  return gulp.src("source/css/style.css")
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("fs/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "fs/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("fs/css/*.css", gulp.series("css", "refresh"));
  gulp.watch("fs/*.html", gulp.series("html", "refresh"));
  gulp.watch("fs/js/*.js", gulp.series("js", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("fs"));
});

gulp.task("js", function () {
  return gulp.src("source/js/script.js")
    .pipe(gulp.dest("fs/js"))
    .pipe(server.stream());
});


gulp.task("clean", function () {
  return del("fs");
});

gulp.task("build", gulp.series("clean", "scripts", "css", "html"));
gulp.task("start", gulp.series("build", "server"));
