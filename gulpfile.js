'use strict'

var gulp = require('gulp');
var watch = require('gulp-watch');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var customProperties = require("postcss-custom-properties");
var csslint = require('gulp-csslint');
var del = require('del');
var gulpIf = require('gulp-if');
var htmlhint = require("gulp-htmlhint");
var fileinclude = require('gulp-file-include');
var postcssUnits = require('postcss-units');
var cleanCSS = require('gulp-clean-css');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'dev';

var path = {
    app: {
        html: 'app/*.html',
        js: 'app/js/*.js',
        css: 'app/css/*.css',
        img: 'app/img/**/*.*'
    },
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/'
    },
    watch: {
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        css: 'app/css/**/*.css',
        img: 'app/img/**/*.*',
        assets: 'app/assets/**/*.*'
    },
    clean: './dist'
};

var config = {
    server: {
        baseDir: "./dist"
    },
    host: 'localhost',
    port: 8080,
    logPrefix: "ka6an"
};

gulp.task('html', function() {
    return gulp.src(path.app.html)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlhint())
        .pipe(gulp.dest(path.dist.html))
        .pipe(reload({ stream: true }));
});

gulp.task('js', ['jquery'], function() {
    return gulp.src(path.app.js)
        .pipe(gulp.dest(path.dist.js))
        .pipe(reload({ stream: true }));
});

gulp.task('jquery', function() {
    return gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest(path.dist.js));
});

gulp.task('css', function() {
    var plugins = [
        autoprefixer,
        cssnext,
        customProperties,
        postcssUnits
    ];
    var pluginsDev = [
        postcssUnits
    ];
    return gulp.src(path.app.css)
        .pipe(gulpIf(isDev, postcss(pluginsDev)))
        .pipe(gulpIf(!isDev, postcss(plugins)))
        .pipe(gulpIf(!isDev, csslint()))
        .pipe(gulpIf(!isDev, csslint.formatter()))
        .pipe(gulpIf(!isDev, cleanCSS({ compatibility: 'ie8' })))
        .pipe(gulp.dest(path.dist.css))
        .pipe(reload({ stream: true }));
});

gulp.task('img', function() {
    return gulp.src(path.app.img)
        .pipe(imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img))
        .pipe(reload({ stream: true }));
});

gulp.task('assets', function() {
    return gulp.src(['app/assets/**/*.*', 'app/assets/.*'])
        .pipe(gulp.dest('dist/'))
        .pipe(reload({ stream: true }));
});


// запуск сервера
gulp.task('webserver', function() {
    browserSync(config);
});

// отслеживание изменений
gulp.task('watch', function() {
    watch([path.watch.html], function() {
        gulp.start('html');
    });
    watch([path.watch.css], function() {
        gulp.start('css');
    });
    watch([path.watch.js], function() {
        gulp.start('js');
    });
    watch([path.watch.img], function() {
        gulp.start('img');
    });
    watch([path.watch.assets], function() {
        gulp.start('assets');
    });
});

// очистка папки с финальной сборкой
gulp.task('clean', function() {
    return del(path.clean);
});

// тестовая сборка, отслеживание изменений и запуск сервера
gulp.task('start', ['build', 'webserver', 'watch']);

// финальная сборка
gulp.task('build', ['html', 'js', 'css', 'img', 'assets']);