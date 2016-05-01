"use strict";
import "babel-polyfill";
import gulp from "gulp";
import googleWebFonts from "gulp-google-webfonts";
import { spawn } from "child_process";
import ava from "gulp-ava";
import nodemon from "gulp-nodemon";
import liveReload from "gulp-livereload";
import fs from "fs";
import del from "del";
import shell from "gulp-shell";
// import sass from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import sourceMaps from "gulp-sourcemaps";
import concat from "gulp-concat";
import merge from "merge2";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import htmlMin from "gulp-htmlmin";
import replace from "gulp-replace";
import tap from "gulp-tap";
import modularizeStyles from "gulp-style-modules";
import path from "path";
import minifyJSON from "gulp-jsonminify";
function transpileJS(source, destination) {
	return gulp.src(source)
		.pipe(babel(babelOptions))
		.pipe(uglify({
			mangle: true
		}))
		.pipe(gulp.dest(destination));
}
const babelOptionsPlugins = ["transform-es2015-modules-umd"];
const babelOptionsPresets = ["es2015", "stage-0"];
const babelOptions = {
	plugins: babelOptionsPlugins,
	presets: babelOptionsPresets
};
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
const config = require("./config.json");
gulp.task("run-server", done => {
	nodemon({
		script: `${paths.server.js.dest}/index.js`,
// 		env: {
// 			NODE_ENV: "development"
// 		},
// 		watch: ["dist/server", "config.js"]
		ignore: [".tmp", "img", "packages", ".babelrc", "*.kate-swp", "gulpfile.*", "*.html", "package.json", "src", "dist/elements", "dist/client"]
	});
	done();
});
gulp.task("bundle-dependencies", done => {
	// "rm dist/client/js/lib.js && jspm build -wid 'dist/client/js/**/*.js - [dist/client/js/**/*.js]' dist/client/js/lib.js"
//
	del("dist/client/js/lib.js*");
	spawn("jspm", "build -wid 'dist/client/js/**/*.js - [dist/client/js/**/*.js]' dist/client/js/lib.js".split(" "));
	jspm.on("data", data => {
		console.log(data);
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
	return merge(fontConfiguration, /*scssFiles*/)
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
gulp.task("watch", done => {
	liveReload.listen({
		key: fs.readFileSync("/etc/ssl/nginx/privkey.pem", "utf-8"),
		cert: fs.readFileSync("/etc/ssl/nginx/fullchain.pem", "utf-8")
	});
	function reload(cause) {
		gulp.src(cause)
			.pipe(liveReload());
	}
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
			return del([destFile]);
		}
		else {
			if (path.extname(srcPath) === ".js") {
				if (type === "add" || type === "change") {
					/* New/modified/renamed JS files should be transpiled */
					transpileJS(srcPath, destPath);
					reload(destPath);
				}
			}
		};
	}
	const watcherOptions = {
		usePolling: true
	};
	/* Retranspile client JS files */
	const clientJSWatcher = gulp.watch(globs.client.js, watcherOptions);
	clientJSWatcher.on("all", (...args) => {
		retranspileJS(...args);
	});
	/* Retranspile server JS files */
	const serverJSWatcher = gulp.watch(paths.server.js.src, watcherOptions);
	serverJSWatcher.on("all", (...args) => {
		retranspileJS(...args);
	});
	/* Retranspile SW JS files */
	const clientSWWatcher = gulp.watch(globs.client.sw, watcherOptions, gulp.parallel("sw"));
	/* Re-split the config file */
	const configWatcher = gulp.watch("config.json", watcherOptions);
	configWatcher.on("change", srcPath => {
		return splitConfig();
	});
// 	gulp.watch("src/scss/main.scss", ["css"]);
// 	gulp.watch("src/index.html", ["html"]);
	done();
});
function splitConfig() {
	return gulp.src("config.json")
		.pipe(tap((file, t) => {
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
		.pipe(gulp.dest(".tmp"))
}
gulp.task("split-config", () => {
	return splitConfig();
});
gulp.task("test", shell.task(`nyc --require babel-register --all gulp test-server`));
gulp.task("test-server", () => {
	return gulp.src("test/server/**/*.js")
		.pipe(ava());
});
gulp.task("default",
	gulp.parallel(
		"watch",
		"json",
		"sw",
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