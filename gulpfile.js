const gulp = require('gulp');
const paths = require('./config/paths');

//Server and tunneling
const bsync = require('browser-sync').create();
const serverConfig = require('./config/server/server.dev').development;
const ngrok = require('ngrok');

//Utilities
const del = require('del');
const plumb = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const pp = require('gulp-preprocess');

//Styles processing
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const nano = require('gulp-cssnano');
const csscomb = require('gulp-csscomb');
const csscombConfig = require('./config/css/csscomb.config');

//Image processing
const imagemin = require('gulp-imagemin');



//Clean
function clean() {
	return del('dist');
}

// Process html
function html() {
	return gulp.src(paths.html.src)
		.pipe(plumb())
		.pipe(pp())
		.pipe(gulp.dest(paths.html.dist))
}

// Process fonts
function fonts() {
	return gulp.src(paths.fonts.src)
		.pipe(gulp.dest(paths.fonts.dist))
}

// Process images
function images() {
	return gulp.src(paths.images.src)
		.pipe(plumb())
		.pipe(imagemin())
		.pipe(gulp.dest(paths.images.dist))
}


// Process JS
function scripts() {
	return gulp.src(paths.scripts.src)
		.pipe(plumb())
		.pipe(sourcemaps.init())
		.pipe(pp())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.scripts.dist))
}

// Process CSS
function styles() {
	const plugins = [
		require('css-mqpacker'),
		require('autoprefixer')({ browsers: ['last 2 versions', '>5%']})
	];
	const sassConfig = {
		outputStyle: 'expanded'
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

//Vendor styles
function vendorStyles() {
	return gulp.src(paths.styles.vendors, {since: gulp.lastRun(vendorStyles)})
		.pipe(plumb())
		.pipe(pp())
		.pipe(sass({ outputStyle: 'compress'}))
		.pipe(nano({
			convertValues: {
				length: false
			},
			discardComments: {
				removeAll: true
			}
		}))
		.pipe(gulp.dest(paths.styles.dist))
}

// Build
gulp.task('build', gulp.series(clean, gulp.parallel(html, fonts, images, styles, vendorStyles)));

// Watch for changes
function watch() {
	gulp.watch(paths.html.watch, gulp.series(html));
	gulp.watch(paths.styles.watch, gulp.parallel(styles, vendorStyles));
	gulp.watch(paths.images.watch, gulp.series(images));
	gulp.watch(paths.fonts.watch, gulp.series(fonts));
	gulp.watch(paths.scripts.watch, gulp.series(scripts));
}

// Serve
function serve() {
	bsync.init(serverConfig, function (err, bs) {
		ngrok.connect(bs.options.get('port'), function(err, url) {
			console.log(url);
		})
	});
	gulp.watch(['dist/**/*.*', '!dist/styles/**/*.*']).on('change', bsync.reload);
}

// Default
gulp.task('default', gulp.series('build', gulp.parallel(watch, serve)));
