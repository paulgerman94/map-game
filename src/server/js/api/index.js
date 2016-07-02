import Point from "../Point";
import {
	register as registerUser,
	login as loginUser,
	isFree as isDataFree,
	isCapturable,
	getFlagInfo,
	captureFlag,
	retrievePOIs,
	getTeam as getPlayerTeam
} from "../db";
import { log, err } from "../util";
import { createToken } from "../crypto";
import { POI_RADIUS } from "../constants";
import POI from "../types/POI";
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
	client,
	db,
	message
}) {
	try {
		const [, coordinates] = args;
		const {
			latitude,
			longitude
		} = coordinates;
		client.properties.coordinates = coordinates;
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
			log(`Successfully registered "${user.accountName}".`);
		}
		else {
			log(`Failed to register "${user.accountName}".`);
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
* Updates the subscription of a client needed for push notifications
* @param {object} options
* 	An object
* @param {object} options.args
* 	An object containing the subscription
* @param {string} options.client
* 	The socket that sent the request
* @param {Message} options.message
* 	A message object to reply to
*/
export async function updateSubscription({
	args,
	client,
	message
}) {
	const [, data] = args;
	const {
		subscription
	} = data;
	client.properties.subscription = subscription;
	message.reply({});
}
/**
* Captures a flag
* @param {object} options
* 	An object
* @param {object} options.args
* 	An object containing the account name of whoever captures the flag
* @param {string} options.client
* 	The socket that sent the request
* @param {object} options.db
* 	A `pg-promise` instance of a database connection
* @param {Message} options.message
* 	A message object to reply to
*/
export async function capture({
	args,
	client,
	db,
	message,
	server
}) {
	const [, data] = args;
	const {
		id
	} = data;
	const { accountName } = client.properties;
	(async () => {
		const flagInfo = await getFlagInfo({
			db,
			id
		});
		const isFlagCapturable = await isCapturable({
			accountName,
			db,
			flagInfo
		});
		if (isFlagCapturable) {
			log(`${accountName} can capture the flag ${id}.`);
			const result = await captureFlag({
				accountName,
				db,
				client,
				id
			});
			if (result) {
				log(`${accountName} has captured the flag ${id}.`);
				message.reply(result);
				/* Tell the loser that his flag was stolen */
				const lastOwnerClient = Array.from(server.clients).find(c => c.properties.accountName === flagInfo.owner);
				if (lastOwnerClient) {
					log(`Notifying ${lastOwnerClient.properties.accountName} of his flag loss by ${accountName}…`);
					server.notifier.notify([lastOwnerClient], {
						subject: `You've lost a flag`,
						body: `A flag of yours has been captured by ${accountName}!`
					});
				}
				/* Search for online players around the capturer */
				const [descriptor] = await retrievePOIs({
					db,
					pois: [new POI(id, flagInfo.osmType)]
				});
				/* TODO: Map the descriptor to the virtual position */
				let flagPosition;
				const { metadata } = descriptor;
				if (metadata.type === "node") {
					flagPosition = {
						latitude: metadata.lat,
						longitude: metadata.lon
					};
				}
				else if (metadata.type === "way") {
					flagPosition = {
						latitude: metadata.center.lat,
						longitude: metadata.center.lon
					};
				}
				else {
					err("Unhandled POI type.");
				}
				const newFlagInfo = await getFlagInfo({
					db,
					id
				});
				const newTeam = await getPlayerTeam({
					db,
					accountName
				});
				newFlagInfo.team = newTeam;
				for (const bystander of server.clients) {
					/* Skip self */
					if (bystander === client) {
						continue;
					}
					const clientCoordinates = bystander.properties.coordinates;
					if (clientCoordinates) {
						const clientPoint = new Point({
							latitude: clientCoordinates.latitude,
							longitude: clientCoordinates.longitude
						});
						const flagPoint = new Point({
							latitude: flagPosition.latitude,
							longitude: flagPosition.longitude
						});
						if (flagPoint.measureDistance(clientPoint) <= POI_RADIUS) {
							bystander.registerCapture({
								id,
								newFlagInfo
							});
						}
					}
				}
			}
			else {
				err(`${accountName} failed to capture the flag ${id}.`);
				message.reply(false);
			}
		}
		else {
			log(`${accountName} can't capture the flag ${id}.`);
			message.reply(isFlagCapturable);
		}
	})();
}
/**
* Retrieves the team of a user
* @param {object} options
* 	An object
* @param {object} options.args
* 	An object containing the account name of whoever's team should be determined
* @param {string} options.client
* 	The socket that sent the request
* @param {object} options.db
* 	A `pg-promise` instance of a database connection
* @param {Message} options.message
* 	A message object to reply to
*/
export async function getTeam({
	args,
	client,
	db,
	message
}) {
	const [, data] = args;
	const {
		accountName
	} = data;
	(async () => {
		const team = await getPlayerTeam({
			db,
			accountName
		});
		client.properties.team = team;
		message.reply(team);
	})();
}