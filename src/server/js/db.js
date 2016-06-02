import config from "map-game/config.json";
import pgTools from "pgtools";
import pgp from "pg-promise";
import { log, err } from "./util";
import { getSQL } from "./fs";
import { checkPassword, hash } from "./crypto";
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
		await db.connect();
		log("Database connection established.");
		if (retry > 0) {
			/* On our first try, there was no database */
			await createTable(db, "users");
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
* @param {object} db
* 	A `pg-promise` database instance
* @param {string} accountName
* 	The user's account name to login with
* @param {string} email
* 	The user's email address
* @param {string} displayName
* 	The user's display name
* @param {string} password
* 	The user's password
* @param {number} permissions
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
* Transforms a underscore-cased string to camelcase
* @param {string} string
* 	The string to be transformed
* @return {string}
* 	The string in camelcase
*/
export function toCamelCase(string) {
	return string.replace(/_\w/g, match => match.charAt(1).toUpperCase());
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
		value: selected,
		success: false
	};
	try {
		await db.none(`SELECT * FROM users WHERE ${type} = $[selected]`, {
			selected
		});
		result.success = true;
	}
	finally {
		return result;
	}
}
/**
* Logs in a user by checking his password
* @param {object} user
* 	The user object to be logged in
* @param {string} accountName
* 	The user's account name
* @param {object} db
* 	The `pg-promise` database instance
* @param {string} password
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