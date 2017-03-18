const gulp = require('gulp');
const paths = require('./config/paths');

//Server and tunneling
const bsync = require('browser-sync').create();
const serverConfig = require('./config/server/server.dev').production;
const ngrok = require('ngrok');

//Utilities
const gutil = require('gulp-util');
const del = require('del');
const plumb = require('gulp-plumber');
const pp = require('gulp-preprocess');
const concat = require('gulp-concat');
const size = require('gulp-size');
const purgeMaps = require('gulp-purge-sourcemaps');

//Styles processing
const nano = require('gulp-cssnano');

//Scripts processing
const uglify = require('gulp-uglify');

//Image processing
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');


/*
 *       -= PRODUCTION CONFIG =-
 */


// Build:production
gulp.task('build:prod', gulp.series(clean, gulp.parallel(html, styles, scripts,fonts, images)));

// Default task
gulp.task('default', gulp.series('build:prod', serve));

// Serve production
function serve() {
	bsync.init(serverConfig, function (err, bs) {
		ngrok.connect(bs.options.get('port'), function (err, url) {
			console.log(gutil.colors.white(`...Tunnel open at: ${ gutil.colors.magenta(url) }`));
		})
	});
}

// Clean WWW folder
function clean() {
	return del(['www']);
}


// HTML
function html() {
	return gulp.src(paths.html.src)
		.pipe(plumb())
		.pipe(pp())
		.pipe(size())
		.pipe(gulp.dest(paths.html.www))
}

// Styles
function styles() {
	return gulp.src([`${paths.styles.dist}/vendors.css`, `${paths.styles.dist}/main.css`])
		.pipe(plumb())
		.pipe(concat('main.css'))
		.pipe(nano({
			convertValues: true,
			discardComments: {
				removeAll: true
			}
		}))
		.pipe(size())
		.pipe(gulp.dest(paths.styles.www))
}

// Pipe fonts
function fonts() {
	return gulp.src(`${paths.fonts.dist}/**/*.*`)
		.pipe(size())
		.pipe(gulp.dest(paths.fonts.www))
}

// Pipe video
function video() {
	return gulp.src(`${paths.video.dist}/**/*.*`)
		.pipe(size())
		.pipe(gulp.dest(paths.video.www))
}

// Process images
function images() {
	return gulp.src(paths.images.src)
		.pipe(plumb())
		.pipe(imagemin({
			progressive: true,
			optimizationLevel: 7,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(paths.images.www))
}

// Process JS
function scripts() {
	return gulp.src([`${paths.scripts.dist}/vendors.js`, `${paths.scripts.dist}/main.js`])
		.pipe(plumb())
		.pipe(uglify())
		.pipe(purgeMaps())
		.pipe(concat('main.js'))
		.pipe(size())
		.pipe(gulp.dest(paths.scripts.www))
}



