import Point from "../Point";
import {
	register as registerUser,
	login as loginUser,
	isFree as isDataFree,
	isCapturable as isFlagCapturable,
	captureFlag
} from "../db";
import { log, err } from "../util";
import { createToken } from "../crypto";
import { POI_RADIUS } from "../constants";
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
	db,
	message
}) {
	try {
		const [, coordinates] = args;
		const {
			latitude,
			longitude
		} = coordinates;
		const point = new Point({
			db,
			latitude,
			longitude
		});
		const results = await point.closest([
			"driving_school",
			"language_school",
			"music_school",
			"restaurant",
			"school",
			"university"
		], POI_RADIUS);
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
* @param {object} options.args
* 	A description of a user object
* @param {string} options.args.accountName
* 	The user's account name
* @param {string} options.args.displayName
* 	The user's display name
* @param {string} options.args.email
* 	The user's email address
* @param {string} options.args.password
* 	The user's password
* @param {object} options.db
* 	A `pg-promise` instance of a database connection
* @param {Message} options.message
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
* @param {object} options.args
* 	A description of a user object
* @param {string} options.args.accountName
* 	The user's account name
* @param {string} options.args.email
* 	The user's email address
* @param {string} options.args.token
* 	The user's session token
* @param {string} options.args.password
* 	The user's password
* @param {object} options.db
* 	A `pg-promise` instance of a database connection
* @param {Message} options.message
* 	A message object to reply to
*/
export async function login({
	args,
	client,
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
			client.properties.token = token;
			client.properties.accountName = accountName;
			message.reply(token);
		}
		else {
			err(`A user tried to login "${accountName}" but failed.`);
			message.reply(false);
		}
	})();
}
/**
* Checks if certain information is still available for registration in the database
* @param {object} options
* 	An object
* @param {object} options.args
* 	A description of a user object
* @param {string} options.args.accountName
* 	The user's account name
* @param {string} options.args.email
* 	The user's email address
* @param {object} options.db
* 	A `pg-promise` instance of a database connection
* @param {Message} options.message
* 	A message object to reply to
*/
export async function isFree({
	args,
	db,
	message
}) {
	const [, data] = args;
	const {
		accountName,
		email
	} = data;
	(async () => {
		const isFree = await isDataFree({
			accountName,
			db,
			email
		});
		message.reply(isFree);
	})();
}
/**
* Updates the notification ID of a client
* @param {object} options
* 	An object
* @param {object} options.args
* 	An object containing the notification ID
* @param {string} options.client
* 	The socket that sent the request
* @param {Message} options.message
* 	A message object to reply to
*/
export async function updateNotificationID({
	args,
	client,
	message
}) {
	const [, data] = args;
	const {
		notificationID
	} = data;
	client.properties.notificationID = notificationID;
	message.reply({});
}
export async function capture({
	args,
	client,
	db,
	message
}) {
	const [, data] = args;
	const {
		id
	} = data;
	(async () => {
		const canCapture = await isFlagCapturable({
			db,
			id
		});
		if (canCapture) {
			log(`${client.properties.accountName} can capture the flag ${id}.`);
			const result = await captureFlag({
				db,
				id,
				accountName: client.properties.accountName
			});
			if (result) {
				log(`${client.properties.accountName} has capture the flag ${id}.`);
				message.reply(result);
			}
			else {
				err(`${client.properties.accountName} failed to capture the flag ${id}.`);
				message.reply(false);
			}
		}
		else {
			log(`${client.properties.accountName} can't capture the flag ${id}.`);
			message.reply(canCapture);
		}
	})();
}