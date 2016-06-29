import "babel-core/register";
import "babel-polyfill";
import "source-map-support/register";
import Server from "./Server";
import getUsername from "username";
import getUser from "passwd-user";
import { connect } from "./db";
import { err } from "./util";
import { s } from "./units";
/* Register event handlers for debugging */
for (const event of ["unhandledRejection", "uncaughtException"]) {
	process.on(event, error => {
		err(error);
	});
}
(async () => {
	try {
		/* Connect to the database */
		const db = await connect();
		/* Create a new server */
		const name = await getUsername();
		const user = await getUser(name);
		/* Listen */
		new Server(db, {
			port: 3444 + user.uid,
			rpcOptions: {
				timeout: 2 * s
			}
		});
	}
	catch (error) {
		err(error);
		process.exit(1);
	}
})();