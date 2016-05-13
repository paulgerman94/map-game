import "babel-polyfill";
import { log } from "./util";
import { km } from "./units";
import Point from "./Point";
for (let event of ["unhandledRejection", "uncaughtException"]) {
	process.on(event, e => {
		console.error(e);
	});
}
(async () => {
	try {
		const point = new Point({
			latitude: 52.52,
			longitude: 13.405
		});
		const results = await point.closest(["bar", "cafe"], 5 * km);
		log(results);
	}
	catch (e) {
		console.error(e);
		process.exit(1);
	};
})();