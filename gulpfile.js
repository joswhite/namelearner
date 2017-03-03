const gulp = require('gulp');
const gulpClean = require('gulp-clean');
const gulpTypescript = require('gulp-typescript');
const watch = require('gulp-watch');
const webpackStream = require('webpack-stream');

const tsProject = gulpTypescript.createProject('tsconfig.gulp.json');

// Default task
gulp.task('default', ['watch']);

// Compile typescript to dist/
gulp.task('webpack', function () {
	var webpackConfig = require('./webpack.config.js');
	return gulp.src('./src/client/main.ts')
		.pipe(webpackStream(webpackConfig))
		.pipe(gulp.dest('dist/client/'));
});

gulp.task('watch-webpack', function() {
    var webpackConfig = require('./webpack.config.js');
    webpackConfig.watch = true;
    return gulp.src('./src/client/main.ts')
        .pipe(webpackStream(webpackConfig))
		.on('error', swallowError)
        .pipe(gulp.dest('dist/client/'));
});

gulp.task('ts-server', function () {
    return gulp.src('src/server/**/*.ts')
        .pipe(gulpTypescript())
        .pipe(gulp.dest('dist/server/'));
});

gulp.task('watch-ts-server', function() {
	watch('./src/server/**/*.*', function() {
        gulp.start('ts-server');
    });
});

gulp.task('ts-setup', function () {
    return gulp.src('src/setup/**/*.ts')
        .pipe(gulpTypescript())
        .pipe(gulp.dest('dist/setup/'));
});

gulp.task('watch-ts-setup', function() {
    watch('./src/setup/**/*.*', function() {
        gulp.start('ts-setup');
    });
});

//Copy client assets
gulp.task('copy-favicon', function() {
	return gulp.src('favicon.ico')
		.pipe(gulp.dest('dist/client/'));
});

gulp.task('copy-images', function() {
	return gulp.src('assets/images/**/*')
		.pipe(gulp.dest('dist/client/images/'));
});

gulp.task('watch-copy-images', function() {
    return gulp.src('assets/images/**/*')
        .pipe(watch('assets/images/**/*'))
        .pipe(gulp.dest('dist/client/images/'));
});

gulp.task('copy-vendor', function() {
    return gulp.src('vendor/**/*')
        .pipe(gulp.dest('dist/client/vendor/'));
});

// Clean
gulp.task('clean', function() {
    return gulp.src('dist/')
        .pipe(gulpClean());
});

// Build
gulp.task('build', [
    'webpack', 'ts-server', 'ts-setup',
    'copy-favicon', 'copy-images', 'copy-vendor'
]);

// Watch
gulp.task('watch', [
    'watch-webpack', 'watch-ts-server', 'watch-ts-setup',
	'watch-copy-images'
]);

// Catch errors for watch tasks that don't
function swallowError(error) {
	//Ignore error
	//console.log(error.toString());
}