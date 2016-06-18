import config from "map-game/config.json";
import pgTools from "pgtools";
import pgp from "pg-promise";
import { log, err } from "./util";
import { getSQL } from "./fs";
import { checkPassword, hash } from "./crypto";
import { km } from "./units";
export const UNIQUENESS_VIOLATION = "23505";
const pgpDB = pgp();
const NO_DATABASE = "3D000";
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
* Extends a database with extensions needed for storing GeoLocations (specifically, this will add PostGIS support)
* @param {object} db
* 	The `pg-promise` database instance
* @returns {Promise}
* 	A Promise that resolves to whether or not the extension succeeded
*/
export async function extendDB(db) {
	try {
		log(`Extending database with "PostGIS" extensions…`);
		await db.query(`
			CREATE EXTENSION postgis;
			CREATE EXTENSION postgis_topology;
			CREATE EXTENSION fuzzystrmatch;
			CREATE EXTENSION postgis_tiger_geocoder;
		`);
		return true;
	}
	catch (e) {
		err(e);
		return false;
	}
}
/**
* Inserts a new table in a database from an SQL file
* @param {object} db
* 	The `pg-promise` database instance to insert the table in
* @param {string} table
* 	The basename of the SQL file to be run
* @return {Promise}
* 	A Promise that resolves if the table is successfully created and rejects if its creation fails
*/
export async function createTable(db, table) {
	log(`Creating table "${table}"…`);
	try {
		const sql = await getSQL(table);
		await db.query(sql);
		log(`Table "${table}" has been created.`);
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
			/* Register PostGIS extensions */
			await extendDB(db);
			/* On our first try, there was no database */
			for (const table of ["users", "flag-associations", "pois"]) {
				await createTable(db, table);
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
* @param {number} user.permissions
* 	The user's permission mask
* @return {Promise}
* 	A {@link Promise} that resolves to whether or not the registration was successful
*/
export async function register({
	db,
	accountName,
	email,
	displayName,
	password,
	permissions = 0x100
} = {}) {
	try {
		await db.query(`
		INSERT INTO users (
			account_name,
			email,
			hash,
			display_name,
			permissions
		)
		VALUES (
			$[accountName],
			$[email],
			$[hash],
			$[displayName],
			$[permissions]
		)`, {
			accountName,
			email,
			displayName,
			permissions,
			hash: await hash(password)
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
* @param {Array.<number>} row.flags
* 	An array of OSM element IDs
* @return {Promise}
* 	A {@link Promise} that resolves to whether or not the registration was successful
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
			flags
		)
		VALUES (
			ST_MakePoint($[longitude], $[latitude]),
			$[radius],
			$[flags]
		)`, {
			longitude,
			latitude,
			radius,
			flags: pois.map(element => element.id)
		});
		const insertQuery = `${pgpDB.helpers.insert(pois.map(poi => ({
			id: poi.id,
			metadata: poi
		})), ["id", "metadata"], "pois")} ON CONFLICT DO NOTHING`;
		await db.query(insertQuery);
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
			return result[0].flags.map(id => Number(id));
		}
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
		SELECT ST_X(location) AS longitude, ST_Y(location) AS latitude, radius, flags
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
* @param {Array.<number>} options.ids
* 	The ids of the OSM elements to retrieve
* @return {Promise}
* 	A {@link Promise} that resolves to a list of POIs if successful or `null` if the Promise is rejected
*/
export async function retrievePOIs({
	db,
	ids
} = {}) {
	try {
		const result = await db.query(`
		SELECT metadata
		FROM "pois"
		WHERE "id" in (${ids.join(",")})
		`);
		return result.map(poi => poi.metadata);
	}
	catch (e) {
		err(e);
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
	}
	catch (e) {
		result.success = false;
	}
	finally {
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
