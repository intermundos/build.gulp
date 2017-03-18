const gulp = require('gulp');
const paths = require('./config/paths');

//Server and tunneling
const bsync = require('browser-sync').create();
const serverConfig = require('./config/server/server.dev').development;
const ngrok = require('ngrok');

//Utilities
const gutil = require('gulp-util');
const del = require('del');
const plumb = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const pp = require('gulp-preprocess');
const concat = require('gulp-concat');
const size = require('gulp-size');

//Styles processing
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const nano = require('gulp-cssnano');
const csscomb = require('gulp-csscomb');
const csscombConfig = require('./config/css/csscomb.config');

//Scripts processing
const babel = require('gulp-babel');

//Image processing
const imagemin = require('gulp-imagemin');


/*
 *      -= DEVELOPMENT CONFIG =-
 */
// Build:development
gulp.task('build', gulp.series(clean, gulp.parallel(html, images, fonts, video, styles, vendorStyles, scripts, vendorScripts))
);


// Default
gulp.task('default', gulp.series('build', gulp.parallel(watch, serve)));


//Clean
function clean() {
	return del(['dist']);
}

// Process html
function html() {
	return gulp.src(paths.html.src)
		.pipe(plumb())
		.pipe(pp())
		.pipe(gulp.dest(paths.html.dist))
}

// Pipe fonts
function fonts() {
	return gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dist))
}

// Pipe video
function video() {
	return gulp.src(paths.video.src).pipe(gulp.dest(paths.video.dist))
}

// Pipe images
function images() {
	return gulp.src(paths.images.src).pipe(gulp.dest(paths.images.dist))
}


// Process JS
function scripts() {
	return gulp.src(paths.scripts.src)
		.pipe(plumb())
		.pipe(sourcemaps.init())
		.pipe(pp())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.scripts.dist))
}

// Vendor JS
function vendorScripts() {
	return gulp.src(paths.scripts.vendors)
		.pipe(plumb())
		.pipe(pp())
		.pipe(gulp.dest(paths.scripts.dist))
}

// Process CSS
function styles() {
	const plugins = [
		require('css-mqpacker'),
		require('autoprefixer')({browsers: ['last 2 versions', '>5%']})
	];
	const sassConfig = {
		outputStyle: 'compact'
	};
	return gulp.src(paths.styles.src)
		.pipe(plumb())
		.pipe(sourcemaps.init())
		.pipe(pp())
		.pipe(sass.sync(sassConfig).on('error', sass.logError))
		.pipe(postcss(plugins))
		.pipe(csscomb(csscombConfig))
		.pipe(sourcemaps.write('/'))
		.pipe(gulp.dest(paths.styles.dist))
		.pipe(bsync.stream({match: '**/*.css'}))
}

// Vendor CSS
function vendorStyles() {
	return gulp.src(paths.styles.vendors, {since: gulp.lastRun(vendorStyles)})
		.pipe(plumb())
		.pipe(pp())
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(nano({
			convertValues: {
				length: false
			},
			discardComments: {
				removeAll: true
			}
		}))
		.pipe(gulp.dest(paths.styles.dist))
		.pipe(bsync.stream({match: '**/*.css'}))
}

// Serve development
function serve() {
	bsync.init(serverConfig, function (err, bs) {
		ngrok.connect(bs.options.get('port'), function (err, url) {
			console.log(gutil.colors.white(`...Tunnel open at: ${ gutil.colors.magenta(url) }`));
		})
	});
	gulp.watch(['dist/**/*.*', '!dist/styles/**/*.*']).on('change', bsync.reload);
}

// Watch for changes
function watch() {
	gulp.watch(paths.html.watch, gulp.series(html));
	gulp.watch([paths.styles.watch, `!${ paths.styles.vendors }`], gulp.series(styles));
	gulp.watch([paths.styles.vendors], gulp.parallel(vendorStyles));
	gulp.watch(paths.images.watch, gulp.series(images));
	gulp.watch(paths.fonts.watch, gulp.series(fonts));
	gulp.watch(paths.video.watch, gulp.series(video));
	gulp.watch(paths.scripts.watch, gulp.series(scripts));
	gulp.watch(paths.scripts.vendors, gulp.series(vendorScripts));
}



