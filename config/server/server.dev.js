const server = {
	development: {
		server: {
			baseDir: 'dist'
		},
		watchOptions: {
			ignoreInitial: true,
			ignored: ['*.txt', '.DS_Store', '.git', '.idea', 'dist/js/vendors.js']
		},
		tunnel: false,
		host: 'localhost',
		port: 3333,
		logPrefix: "development",
		open: false,
		injectChanges: true
	}
};

module.exports = server;