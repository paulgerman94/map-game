import "babel-polyfill";
import { log } from "./util";
import { getNode, Node, find, execute, km } from "./api/overpass/Query";
for (let event of ["unhandledRejection", "uncaughtException"]) {
	process.on(event, e => {
		console.error(e);
	});
}
(async () => {
	try {
		const darmstadt = new Node({
			name: "Darmstadt"
		});
		const frankfurt = new Node({
			name: "Frankfurt"
		});
		const query = find(darmstadt).around(frankfurt, 50 * km);
		const results = await execute(query);
		log(results);
	}
	catch (e) {
		console.error(e);
		process.exit(1);
	};
})();