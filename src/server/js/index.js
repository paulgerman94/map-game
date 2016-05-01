import "babel-polyfill";
for (let event of ["unhandledRejection", "uncaughtException"]) {
	process.on(event, e => {
		console.error(e);
	});
}
(async () => {
	try {
		/* Listen */
	}
	catch (e) {
		console.error(e);
		process.exit(1);
	};
})();