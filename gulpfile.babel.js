import "babel-polyfill";
import ava from "gulp-ava";
import babel from "gulp-babel";
import cleanCSS from "gulp-clean-css";
import concat from "gulp-concat";
import del from "del";
import esDoc from "gulp-esdoc";
import esLint from "gulp-eslint";
import fs from "fs";
import getUser from "passwd-user";
import getUsername from "username";
import googleWebFonts from "gulp-google-webfonts";
import gif from "gulp-if";
import gulp from "gulp";
import gutil from "gulp-util";
import htmlMin from "gulp-htmlmin";
import liveReload from "gulp-livereload";
import merge from "merge2";
import minifyJSON from "gulp-jsonminify";
import nodemon from "gulp-nodemon";
import replace from "gulp-replace";
import shell from "gulp-shell";
import sourceMaps from "gulp-sourcemaps";
import tap from "gulp-tap";
import uglify from "gulp-uglify";
import path from "path";
// import sass from "gulp-sass";
let unixUsername = null;
/**
* Transpiles JavaScript files
* @param {Array|string} source
* 	A glob or an array of globs that will be transpiled
* @param {string} destination
* 	The destination folder
* @return {Stream}
* 	A stream of the virtual files being transpiled
*/
function transpileJS(source, destination) {
	return gulp.src(source)
		.pipe(sourceMaps.init())
		.pipe(replace(/<%[^%]+%>/g, match => {
			const literal = match.substring(2, match.length - 2);
			switch (literal) {
				case "LINUX_USERNAME":
					return unixUsername;
				default:
					return literal;
			}
		}))
		.pipe(babel())
		.pipe(uglify())
		.pipe(sourceMaps.write(".", {
			includeContent: true,
			sourceRoot(e) {
				if (e.dirname.includes("server")) {
					return e.dirname;
				}
				else {
					return undefined;
				}
			}
		}))
		.pipe(gulp.dest(destination));
}
const paths = {
	client: {
		css: {
			src: "src/client/scss",
			dest: "dist/client/css"
		},
		js: {
			src: "src/client/js",
			dest: "dist/client/js"
		},
		json: {
			src: "src/client/json",
			dest: "dist/client/json"
		},
		sw: {
			src: "src/client/js/sw",
			dest: "./"
		}
	},
	server: {
		js: {
			src: "src/server/js",
			dest: "dist/server/js"
		}
	}
};
const globs = {
	client: {
		js: [`${paths.client.js.src}/**/*.js`, `!${paths.client.js.src}/sw/**/*.js`],
		json: `${paths.client.json.src}/**/*.json`,
		sw: `${paths.client.sw.src}/**/*.js`
	},
	server: {
		js: `${paths.server.js.src}/**/*.js`
	}
};
process.env.FORCE_COLOR = true;
gulp.task("run-server", done => {
	nodemon({
		script: `${paths.server.js.dest}/polyfill.js`,
		exec: "node",
// 		env: {
// 			NODE_ENV: "development"
// 		},
// 		watch: ["dist/server", "config.js"]
		ignore: [".tmp", "img", "packages", ".babelrc", "*.kate-swp", "gulpfile.*", "*.html", "package.json", "src", "dist/elements", "dist/client"]
	});
	done();
});
gulp.task("html", () => {
	return gulp.src("src/client/html/*.html")
		.pipe(htmlMin({
			collapseWhitespace: true,
			removeComments: true,
			removeAttributeQuotes: true,
			removeRedundantAttributes: true
		}))
		.pipe(gulp.dest("."));
});
gulp.task("js", () => {
	const client = transpileJS(globs.client.js, paths.client.js.dest);
	const server = transpileJS(globs.server.js, paths.server.js.dest);
	return merge(client, server);
});
gulp.task("sw", () => {
	return transpileJS(globs.client.sw, paths.client.sw.dest);
});
gulp.task("json", () => {
	return gulp.src(globs.client.json)
		.pipe(minifyJSON())
		.pipe(gulp.dest(paths.client.json.dest));
});
gulp.task("css", () => {
// 	const scssFiles = gulp.src(`${paths.client.css.src}/main.scss`)
// 		.pipe(sourceMaps.init())
// 		.pipe(sass())
	const fontConfiguration = gulp.src(`${paths.client.css.dest}/fonts.css`);
	return merge(fontConfiguration)
		.pipe(concat("style.css"))
		.pipe(cleanCSS({
			keepSpecialComments: false
		}))
// 		.pipe(sourceMaps.write("."))
		.pipe(gulp.dest(paths.client.css.dest));
});
gulp.task("fonts", () => {
	return gulp.src(`${paths.client.css.src}/fonts.list`)
		.pipe(googleWebFonts())
		.pipe(gulp.dest(paths.client.css.dest));
});
gulp.task("watch", async done => {
	const user = await getUser(unixUsername);
	const port = 2000 + user.uid;
	liveReload.listen({
		port,
		key: fs.readFileSync(process.env.NGINX_PRIVATE_KEY, "utf-8"),
		cert: fs.readFileSync(process.env.NGINX_CERTIFICATE, "utf-8")
	});
	/**
	* Reloads the browser. Usually, this function should be called whenever a client-related file changes.
	* @param {string} cause
	* 	The file that has caused the reload
	* @return {Stream}
	* 	A stream containing `cause`
	*/
	function reload(cause) {
		return gulp.src(cause)
			.pipe(liveReload());
	}
	/**
	* Re-transpiles JavaScript when a filesystem change is detected.
	* @param {string} type
	* 	Chokidar's or the operating system's filesystem event type
	* @param {string} srcPath
	* 	The path that is associated with the event `type`
	*/
	function retranspileJS(type, srcPath) {
		let srcDirectory, destDirectory;
		if (srcPath.includes(paths.client.js.src)) {
			srcDirectory = paths.client.js.src;
			destDirectory = paths.client.js.dest;
		}
		else if (srcPath.includes(paths.server.js.src)) {
			srcDirectory = paths.server.js.src;
			destDirectory = paths.server.js.dest;
		}
		const basePath = `${__dirname}/${srcDirectory}`;
		const relativePath = path.relative(basePath, srcPath);
		const destFile = `${__dirname}/${destDirectory}/${relativePath}`;
		const destPath = path.dirname(destFile);
		if (type === "unlink" || type === "unlinkDir") {
			/* Deleted files should be deleted in the dist directory, too */
			del([destFile]);
		}
		else {
			if (path.extname(srcPath) === ".js") {
				if (type === "add" || type === "change") {
					/* New/modified/renamed JS files should be transpiled */
					gutil.log(gutil.colors.yellow(`Retranspiling: ${srcPath}`));
					transpileJS(srcPath, destPath);
					reload(destFile);
				}
			}
		}
	}
	const watcherOptions = {
		usePolling: true
	};
	/* Retranspile and client JS files and lint them */
	const clientJSWatcher = gulp.watch(globs.client.js, watcherOptions, gulp.parallel(
		"lint"
	));
	clientJSWatcher.on("all", (...args) => {
		retranspileJS(...args);
	});
	/* Retranspile server JS files and line them */
	const serverJSWatcher = gulp.watch(paths.server.js.src, watcherOptions, gulp.parallel(
		"lint"
	));
	serverJSWatcher.on("all", (...args) => {
		retranspileJS(...args);
	});
	/* Retranspile SW JS files and lint them */
	const serviceWorkerWatcher = gulp.watch(globs.client.sw, watcherOptions, gulp.parallel(
		"sw",
		"lint"
	));
	/* Re-lint the gulpfile */
	gulp.watch("gulpfile.babel.js", watcherOptions, gulp.parallel(
		"lint"
	));
	serviceWorkerWatcher.on("all", (...args) => {
		retranspileJS(...args);
	});
	/* Re-split the config file */
	const configWatcher = gulp.watch("config.json", watcherOptions);
	configWatcher.on("change", () => {
		return splitConfig();
	});
// 	gulp.watch("src/scss/main.scss", ["css"]);
// 	gulp.watch("src/index.html", ["html"]);
	done();
});
/**
* Splits the configuration file `config.json`.
* The configuration file is used for both public and private data (like initial seeds, database options, etc.).
* This function splits the public part and stores it in a separate file named `public.json`.
* @return {Stream} A stream that contains `config.json` and transforms it into `public.json`
*/
function splitConfig() {
	return gulp.src("config.json")
		.pipe(tap(file => {
			const json = JSON.parse(file.contents.toString("utf-8"));
			const pub = {
				client: json.client,
				server: {
					connection: json.server.connection
				}
			};
			file.contents = new Buffer(JSON.stringify(pub));
		}))
		.pipe(concat("public.json"))
		.pipe(gulp.dest(".tmp"));
}
gulp.task("split-config", () => {
	return splitConfig();
});
gulp.task("test", shell.task(`nyc --require babel-register --all gulp test-server`));
gulp.task("test-server", () => {
	return gulp.src("test/server/**/*.js")
		.pipe(ava());
});
gulp.task("lint", () => {
	return gulp.src(["gulpfile.babel.js", globs.server.js, `${paths.client.js.src}/**/*.js`])
		.pipe(esLint())
		.pipe(esLint.format());
});
gulp.task("doc", () => {
	return gulp.src("src")
		.pipe(esDoc({
			title: "map-game",
			destination: "doc",
			plugins: [{
				name: "esdoc-es7-plugin"
			}]
		}));
});
(async () => {
	unixUsername = await getUsername();
	gulp.task("default",
		gulp.parallel(
			"watch",
			"json",
			"sw",
			"lint",
			gulp.series(
				gulp.parallel(
					"js",
					"html",
					gulp.series(
						"fonts",
						"css"
					)
				),
				"run-server"
			)
		)
	);
})();