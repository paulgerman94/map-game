import config from "./config";
import pgTools from "pgtools";
import pgp from "pg-promise";
import { log, err, warn } from "./util";
import { getSQL } from "./fs";
import { checkPassword, hash } from "./crypto";
import { km } from "./units";
import humps from "humps";
import { OWNERSHIP_PROTECTION_TIME } from "./constants";
import POI from "./types/POI";
/**
* Denotes a uniqueness violation in the database
* @type {symbol}
*/
export const UNIQUENESS_VIOLATION = "23505";
const NO_DATABASE = "3D000";
const pgpDB = pgp();
/**
* Creates a new database honoring the settings in `config.json`
* @return {Promise}
* 	A Promise that resolves if the database is successfully created and rejects if its creation fails
*/
export function createDB() {
	return new Promise((resolve, reject) => {
		log(`Creating database "${config.server.psql.database}"…`);
		pgTools.createdb({
			user: config.server.psql.username,
			password: config.server.psql.password,
			port: config.server.psql.port || 5432,
			host: config.server.psql.host || "localhost"
		}, config.server.psql.database, (e, res) => {
			if (e) {
				reject(e);
			}
			else {
				resolve(res);
			}
		});
	});
}
/**
* Inserts a new table in a database from an SQL file
* @param {object} db
* 	The `pg-promise` database instance to insert the table in
* @param {string} file
* 	The basename of the SQL file to be run
* @return {Promise}
* 	A Promise that resolves if the table is successfully created and rejects if its creation fails
*/
export async function runSQL(db, file) {
	log(`Running "${file}.sql"…`);
	try {
		const sql = await getSQL(file);
		await db.query(sql);
		log(`"${file}.sql" has been successfully executed.`);
		return true;
	}
	catch (e) {
		throw e;
	}
}
/**
* Connects to the database honoring the settings in `config.json`.
* The function will make three attempts to establish a database connection in case of a failure, then give up.
* If the database doesn't exist yet, it will be automatically created whereafter the connection is established.
* @param {number} [retry=0]
* 	A counter that lets recursive function invocations know how many retries there have been so far
* @return {object}
* 	The `pg-promise` database instance that the function connected to
*/
export async function connect(retry = 0) {
	const db = pgpDB(config.server.psql);
	try {
		const connection = await db.connect();
		log("Database connection established.");
		connection.done();
		if (retry > 0) {
			/* On our first try, there was no database */
			for (const file of [
				"postgis-extensions",
				"types",
				"users",
				"flag-associations",
				"pois"
			]) {
				await runSQL(db, file);
			}
		}
		return db;
	}
	catch (e) {
		if (e.code === NO_DATABASE) {
			err("No database found.");
			try {
				if (retry < 2) {
					await createDB();
					return await connect(retry + 1);
				}
				else {
					throw new Error("Unable to connect to database.");
				}
			}
			catch (e) {
				throw e;
			}
		}
		else {
			throw e;
		}
	}
}
/**
* Registers a new user and adds him to the database.
* @param {object} user
* 	The user object to be added
* @param {object} user.db
* 	A `pg-promise` database instance
* @param {string} user.accountName
* 	The user's account name to login with
* @param {string} user.email
* 	The user's email address
* @param {string} user.displayName
* 	The user's display name
* @param {string} user.password
* 	The user's password
* @return {Promise}
* 	A {@link Promise} that resolves to whether or not the registration was successful
*/
export async function register({
	db,
	accountName,
	email,
	displayName,
	password
} = {}) {
	try {
		await db.query(`
		INSERT INTO users (
			account_name,
			email,
			hash,
			display_name,
			team
		)
		VALUES (
			$[accountName],
			$[email],
			$[hash],
			$[displayName],
			$[team]
		)`, {
			accountName,
			email,
			displayName,
			hash: await hash(password),
			team: Math.random() > 0.5 ? "red" : "blue"
		});
		return true;
	}
	catch (e) {
		err(e);
		return false;
	}
}
/**
* This function adds a point to the `flags` table in the database.
* The table maps coordinates to OSM element IDs.
* @param {object} row
* 	The row to be added
* @param {object} row.db
* 	A `pg-promise` database instance
* @param {number} row.latitude
* 	The latitude of the point that the flag IDs belong to
* @param {number} row.longitude
* 	The longitude of the point that the flag IDs belong to
* @param {number} row.radius
* 	The radius around the point where the flags were found
* @param {Array.<POI>} row.pois
* 	An array of POIs
* @return {Promise}
* 	A {@link Promise} that resolves to whether or not the insertion was successful
*/
export async function addPoint({
	db,
	latitude,
	longitude,
	radius,
	pois
} = {}) {
	try {
		await db.query(`
		INSERT INTO "flag-associations" (
			location,
			radius,
			pois
		)
		VALUES (
			ST_MakePoint($[longitude], $[latitude]),
			$[radius],
			ARRAY[$[pois]]::poi[]
		) ON CONFLICT DO NOTHING`, {
			longitude,
			latitude,
			radius,
			pois
		});
		/* If there were any POIs, we'll also have to add them to the `pois` table */
		if (pois.length) {
			const insertQuery = `${pgpDB.helpers.insert(pois.map(poi => ({
				poi,
				metadata: poi.element
			})), ["poi", "metadata"], "pois")} ON CONFLICT DO NOTHING`;
			await db.query(insertQuery);
		}
		return true;
	}
	catch (e) {
		err(e);
		return false;
	}
}
/**
* This function checks if a point has already cached and retrieves its IDs if so.
* @param {object} options
* 	An option object
* @param {object} options.db
* 	A `pg-promise` database instance
* @param {number} options.latitude
* 	The latitude of the point to check
* @param {number} options.longitude
* 	The longitude of the point to check
* @param {number} options.radius
* 	The POI radius that the game currently uses
* @return {Promise}
* 	A {@link Promise} that resolves to a list of POIs if successful or `null` if the Promise is rejected
*/
export async function checkPoint({
	db,
	latitude,
	longitude,
	radius
} = {}) {
	try {
		const result = await db.query(`
		SELECT *
		FROM "flag-associations"
		WHERE "location" = ST_MakePoint($[longitude], $[latitude]) AND "radius" <= $[radius]
		`, {
			longitude,
			latitude,
			radius
		});
		if (!result.length) {
			return null;
		}
		else {
			return POI.parseArray(result[0].pois);
		}
	}
	catch (e) {
		err(e);
		return null;
	}
}
/**
* Determines the entire area that has been analyzed (cached) so far. This is especially useful for debugging purposes, as these areas may be visualized on a map.
* @param {object} options
* 	An option object
* @param {object} row.db
* 	A `pg-promise` database instance
* @return {Promise}
* 	A {@link Promise} that resolves to an array of cached center center points with their radii
*/
export async function getArea({
	db
} = {}) {
	try {
		return await db.query(`
		SELECT ST_X(location) AS longitude, ST_Y(location) AS latitude, radius FROM "flag-associations"
		`, {});
	}
	catch (e) {
		err(e);
		return null;
	}
}
/**
* Determines the latitude, longitude, radius and associated flags of cached positions in a 2 km radius of the provided point.
* This is helpful for determining if a new point should be stored in the database, since it gives information about the database coverage of a certain geographical area.
* The value `2 km` was chosen as radial Overpass queries take a very long time with growing radii. In fact, the value `2 km` took so much time in testing that it seemed very unrealistic to make it the default POI radius, as it has devastating implications on user experience. Thus, this lets us safely assume that `2 km` is an extreme upper bound for radial searches.
* @param {object} options
* 	An option object
* @param {object} row.db
* 	A `pg-promise` database instance
* @param {number} row.latitude
* 	The latitude of the point around which to search for other flag associations
* @param {number} row.longitude
* 	The longitude of the point around which to search for other flag associations
* @param {Array.<number>} row.flags
* 	An array of OSM element IDs
* @return {Promise}
* 	A {@link Promise} that resolves to an array of associated flags if successful, `null` if Promise is rejected
*/
export async function searchAround({
	db,
	latitude,
	longitude
} = {}) {
	try {
		return await db.query(`
		SELECT ST_X(location) AS longitude, ST_Y(location) AS latitude, radius, pois
		FROM "flag-associations"
		WHERE ST_Distance_Sphere(location, ST_MakePoint($[longitude], $[latitude])) <= ${2 * km}
		`, {
			longitude,
			latitude
		});
	}
	catch (e) {
		err(e);
		return null;
	}
}
/**
* This function retrieves OSM elements from the database given a list of their IDs.
* @param {object} options
* 	An option object
* @param {object} options.db
* 	A `pg-promise` database instance
* @param {Array.<POI>} options.pois
* 	The list of POI objects for which to look up the element data
* @return {Promise}
* 	A {@link Promise} that resolves to a list of POIs if successful or `null` if the Promise is rejected
*/
export async function retrievePOIs({
	db,
	pois
} = {}) {
	try {
		if (pois.length) {
			const result = await db.query(`
			SELECT metadata, owner, captured_at, locked_until, team
			FROM "pois" p
			LEFT JOIN users u
			ON p.owner = u.account_name
			WHERE "poi" = ANY($[pois]::poi[]);
			`, {
				pois
			});
			return humps.camelizeKeys(result);
		}
		else {
			return [];
		}
	}
	catch (e) {
		err(e);
		return null;
	}
}
/**
* Determines whether or not a flag is capturable right now.
* Currently, a flag is only capturable if it is either free or if it has been captured for at least `OWNERSHIP_PROTECTION_TIME`.
* Also, the capturer must be of the opposite team.
* @param {object} options
* 	An option object
* @param {object} options.db
* 	A `pg-promise` database instance
* @param {string} options.id
* 	The OSM id of the flag to query
* @return {Promise}
* 	A {@link Promise} that resolves to whether or not the flag is capturable right now
*/
export async function isCapturable({
	db,
	id,
	flagInfo,
	accountName
} = {}) {
	try {
		const info = flagInfo || await getFlagInfo({
			db,
			id
		});
		if (!info.capturedAt) {
			/* Flag has never been captured before */
			return true;
		}
		else {
			if (new Date() > new Date(info.lockedUntil)) {
				/* Ownership protection has expired */
				const newTeam = await getTeam({
					db,
					accountName
				});
				const oldTeam = await getTeam({
					db,
					accountName: info.owner
				});
				if (newTeam !== oldTeam) {
					/* Allow the flag to be captured */
					return true;
				}
				else {
					/* The same team can't steal from each other */
					warn(`"${accountName}" tried to capture the flag of an own team member.`);
					return false;
				}
			}
			else {
				/* Ownership protection is still active */
				warn(`"${accountName}" tried to capture an ownership-protected flag ${info.lockedUntil}.`);
				return false;
			}
		}
	}
	catch (e) {
		err(`Couldn't determine if flag ${id} is capturable.`, e);
		return null;
	}
}
/**
* Retrieves an object with some ownership information about a flag
* @param {object} options
* 	An option object
* @param {object} options.db
* 	A `pg-promise` database instance
* @param {string} options.id
* 	The OSM id of the flag to query
* @return {Promise}
* 	A {@link Promise} that resolves to an object that contains ownership information about a flag
*/
export async function getFlagInfo({
	db,
	id
} = {}) {
	try {
		const result = await db.one(`
		SELECT captured_at, locked_until, owner, (poi).element AS osm_type
		FROM pois
		WHERE (poi).id = $[id];
		`, {
			id
		});
		return humps.camelizeKeys(result);
	}
	catch (e) {
		err(e);
		return null;
	}
}
/**
* Add points to user score
* @param {object} options
* 	An option object
* @param {object} options.db
* 	A `pg-promise` database instance
* @param {string} options.accountName
* 	The account name whose team to look up
* @param {number} options.pointsToAdd
* 	How many points to add
* @return {Promise}
* 	A {@link Promise} that resolves to whether or not the points were added
*/
export async function addScore({
	db,
	accountName,
	pointsToAdd
} = {}) {
	try {
		await db.query(`
		UPDATE users
		SET
			score = score + $[pointsToAdd]
		WHERE account_name = $[accountName];
		`, {
			pointsToAdd,
			accountName
		});
		log(`Added ${pointsToAdd} points to score of user "${accountName}".`);
		return true;
	}
	catch (e) {
		err(e);
		return null;
	}
}
/**
* Registers that a users has captured a flag
* @param {object} options
* 	An option object
* @param {object} options.db
* 	A `pg-promise` database instance
* @param {string} options.id
* 	The OSM id of the flag to capture
* @param {string} options.accountName
* 	The account name whose team to look up
* @param {string} options.lockFor
* 	An SQL interval string that denotes how long the flag should be locked
* @return {Promise}
* 	A {@link Promise} that resolves to whether or not the capture was successful
*/
export async function captureFlag({
	db,
	id,
	accountName,
	lockFor = OWNERSHIP_PROTECTION_TIME
} = {}) {
	try {
		await db.query(`
		UPDATE pois
		SET
			captured_at = CURRENT_TIMESTAMP,
			locked_until = CURRENT_TIMESTAMP + interval $[lockFor],
			owner = $[accountName]
		WHERE (poi).id = $[id];
		`, {
			id,
			accountName,
			lockFor
		});
		return true;
	}
	catch (e) {
		err(e);
		return null;
	}
}
/**
* Sets a user account's Telegram "chat_id" property so that the back end can send messages via Telegram
* @param {object} options
* 	An option object
* @param {object} options.db
* 	A `pg-promise` database instance
* @param {string} options.accountName
* 	The user's account name in our database
* @param {string} options.telegramChatId
* 	The "chat_id" property that Telegram reports
* @return {Promise}
* 	A {@link Promise} that resolves to whether or not the configuration was successful
*/
export async function setTelegramChatID({
	db,
	accountName,
	telegramChatID
} = {}) {
	console.log(telegramChatID, accountName);
	try {
		await db.query(`
		UPDATE users
		SET telegram_chat_id = $[telegramChatID]
		WHERE account_name = $[accountName];
		`, {
			accountName,
			telegramChatID
		});
		return true;
	}
	catch (e) {
		err(e);
		return null;
	}
}
/**
* Retrieves the team for a given account name
* @param {object} options
* 	An option object
* @param {object} options.db
* 	A `pg-promise` database instance
* @param {string} options.accountName
* 	The account name whose team to look up
* @return {Promise}
* 	A {@link Promise} that resolves to a the team name
*/
export async function getTeam({
	db,
	accountName
} = {}) {
	try {
		const result = await db.one(`
		SELECT team
		FROM users
		WHERE account_name = $[accountName];
		`, {
			accountName
		});
		return result.team;
	}
	catch (e) {
		err(`Couldn't retrieve team for account "${accountName}".`);
		return null;
	}
}
/**
* Queries for a user's user information
* @param {object} options
* 	An option object
* @param {object} options.db
* 	A `pg-promise` database instance
* @param {string} options.accountName
* 	The account name whose team to look up
* @return {Promise}
* 	A {@link Promise} that resolves to a the team name
*/
export async function queryUserInformation({
	db,
	accountName
} = {}) {
	try {
		const result = await db.one(`
		SELECT account_name, display_name, team, score, telegram_chat_id
		FROM users
		WHERE account_name = $[accountName];
		`, {
			accountName
		});
		const object = humps.camelizeKeys(result);
		object.telegramChatID = object.telegramChatId;
		Reflect.deleteProperty(object, "telegramChatId");
		return object;
	}
	catch (e) {
		err(`Couldn't retrieve user information for account "${accountName}".`);
		return null;
	}
}
/**
* Transforms a underscore-cased string to camelcase
* @param {string} string
* 	The string to be transformed
* @return {string}
* 	The string in camelcase
*/
export function toCamelCase(string) {
	return pgpDB.utils.camelize(string);
}
/**
* Transforms a camelcase-cased string to underscore-case
* @param {string} string
* 	The string to be transformed
* @return {string}
* 	The string in underscore case
*/
export function toUnderscoreCase(string) {
	return string.replace(/[a-z][A-Z]+/g, match => `${match.charAt(0)}_${match.substr(1).toLowerCase()}`);
}
/**
* Determines if a unique property is still free in the database
* @param {object} obj
* 	An object that contains the property to be checked for uniqueness
* @param {object} obj.accountName
* 	The user's account name
* @param {object} obj.displayName
* 	The user's email address
* @param {object} obj.email
* 	The user's email address
* @return {Promise}
* 	A {@link Promise} that resolves to an object containing the values `property`, `value` and `success` signaling the property checked, the property's value and the property's availability
*/
export async function isFree(obj) {
	const { db } = obj;
	let type = null;
	let selected = null;
	for (const field of ["accountName", "displayName", "email"]) {
		if (obj[field]) {
			type = toUnderscoreCase(field);
			selected = obj[field];
			break;
		}
	}
	const result = {
		property: toCamelCase(type),
		value: selected
	};
	try {
		await db.none(`SELECT * FROM users WHERE ${type} = $[selected]`, {
			selected
		});
		result.success = true;
		return result;
	}
	catch (e) {
		result.success = false;
		return result;
	}
}
/**
* Logs in a user by checking his password
* @param {object} user
* 	The user object to be logged in
* @param {string} user.accountName
* 	The user's account name
* @param {object} user.db
* 	The `pg-promise` database instance
* @param {string} user.password
* 	The user's password
* @return {Promise}
* 	A {@link Promise} that resolves to whether the user can be logged in using the provided data or not
*/
export async function login({
	accountName,
	db,
	password
}) {
	try {
		const result = await db.one(`SELECT hash FROM users WHERE account_name = $[accountName]`, {
			accountName
		});
		const valid = await checkPassword(password, result.hash);
		if (valid) {
			return true;
		}
		else {
			throw new Error("Password mismatch");
		}
	}
	catch (e) {
		return false;
	}
}