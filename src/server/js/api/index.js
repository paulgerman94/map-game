import Point from "../Point";
import { register as registerUser } from "../db";
import { km } from "../units";
import { err } from "../util";
/**
* Adds an array of numbers and sends the sum back to the client.
* @param {object} options
* 	An object
* @param {Array.<number>} options.args
* 	The arguments provided by the caller. Here, the array is to be expected to be an array of numbers.
* @param {Message} options.message
* 	An RPC message object that can be used to send a reply
* @param {RPCClient} options.client
* 	The RPC client that has called the function
*/
export function add({
	args,
	message
} = {}) {
	const sum = args.reduce((a, b) => a + b, 0);
	message.reply(sum);
}
/**
* @param {object} options An object
* @param {Array.<number>} options.args
* 	The arguments provided by the caller. Here, the arguments are expected to contain at least one object that matches the properties of a {@link Position} (GeoLocation API) object.
* @param {Message} options.message
* 	An RPC message object that can be used to send a reply
* @param {RPCClient} options.client
* 	The RPC client that has called the function
*/
export async function getPOIs({
	args,
	message
}) {
	try {
		const [coordinates] = args;
		const {
			latitude,
			longitude
		} = coordinates;
		const point = new Point({
			latitude,
			longitude
		});
		const results = await point.closest(["restaurant"], km);
		message.reply(results);
	}
	catch (e) {
		err(e);
	}
}
/**
* Registers a user on the server and add him to the database.
* @param {object} options
* 	An object
* @param {object} args
* 	A description of a user object
* @param {string} args.accountName
* 	The user's account name
* @param {string} args.displayName
* 	The user's display name
* @param {string} args.email
* 	The user's email address
* @param {string} args.password
* 	The user's password
* @param {object} db
* 	A `pg-promise` instance of a database connection
* @param {Message} message
* 	A message object to reply to
*/
export async function register({
	args,
	db,
	message
}) {
	const [user] = args;
	const {
		accountName,
		email,
		displayName,
		password
	} = user;
	/* Due to a babel bug, `register`'s await is not correctly resolved. Thus, we have to use an anonymous `async` block here. Sorry about that. */
	(async () => {
		const isSuccessful = await registerUser({
			db,
			accountName,
			email,
			displayName,
			password
		});
		message.reply(isSuccessful);
	})();
}