import "babel-polyfill";
import "source-map-support/register";
import Server from "./Server";
import getUsername from "username";
import getUser from "passwd-user";
import { err } from "./util";
import { s } from "./units";
for (const event of ["unhandledRejection", "uncaughtException"]) {
	process.on(event, error => {
		err(error);
	});
}
(async () => {
	try {
		const name = await getUsername();
		const user = await getUser(name);
		/* Listen */
		new Server({
			port: 3444 + user.uid,
			rpcOptions: {
				timeout: 20 * s
			}
		});
	}
	catch (error) {
		err(error);
		process.exit(1);
	}
})();