import Point from "../Point";
import {
	register as registerUser,
	login as loginUser
} from "../db";
import { km } from "../units";
import { log, err } from "../util";
import { createToken } from "../crypto";
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
		const [, coordinates] = args;
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
	const [, user] = args;
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
		if (isSuccessful) {
			log("Successfully registered", user);
		}
		else {
			log("Failed to register", user);
		}
		message.reply(isSuccessful);
	})();
}
/**
* Logs in a user by checking if his password matches the salted hash in the database. If it does, this function returns a JWT session token.
* @param {object} options
* 	An object
* @param {object} args
* 	A description of a user object
* @param {string} args.accountName
* 	The user's account name
* @param {string} args.email
* 	The user's email address
* @param {string} args.token
* 	The user's session token
* @param {string} args.password
* 	The user's password
* @param {object} db
* 	A `pg-promise` instance of a database connection
* @param {Message} message
* 	A message object to reply to
*/
export async function login({
	args,
	db,
	message
}) {
	const [, data] = args;
	const {
		accountName,
		email,
		password
	} = data;
	if (!password) {
		message.reply("Neither token nor password is present");
	}
	/* Due to a babel bug, `register`'s await is not correctly resolved. Thus, we have to use an anonymous `async` block here. Sorry about that. */
	(async () => {
		const isSuccessful = await loginUser({
			accountName,
			db,
			email,
			password
		});
		if (isSuccessful) {
			log(`"${accountName}" has logged in.`);
			const token = await createToken({
				accountName
			});
			message.reply(token);
		}
		else {
			err(`A user tried to login "${accountName}" but failed.`);
			message.reply(false);
		}
	})();
}