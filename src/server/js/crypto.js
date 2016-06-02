import config from "./config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { defer } from "./fs";
/**
* Generates a cryptographically secure salt
* @param {number} rounds
* 	The number of rounds spend on salt generation
* @return {Promise}
* 	A {@link Promise} that resolves to a string which represents a cryptographically secure salt
*/
function generateSalt(rounds) {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(rounds, defer(resolve, reject));
	});
}
/**
* Hashes a password
* @param {string} password
* 	The password that was provided by the user
* @param {string} salt
* 	A cryptographically secure salt
* @return {Promise}
* 	A {@link Promise} that resolves to a string which represents a salted password hash
*/
function generateHash(password, salt) {
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, salt, defer(resolve, reject));
	});
}
/**
* Checks if a password matches a hash
* @param {string} password
* 	The password that was provided by the user
* @param {string} hash
* 	A salted hash
* @return {Promise}
* 	A {@link Promise} that resolves to a boolean which represents whether or not the match was successful
*/
function checkHash(password, hash) {
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, hash, defer(resolve, reject));
	});
}
/**
* Checks if a token is valid
* @param {string} token
* 	The JWT token
* @return {Promise}
* 	A {@link Promise} that resolves to a boolean which represents whether or not the token is valid
*/
function verifyToken(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.server.crypto.tokenSecret, defer(resolve, reject));
	});
}
/**
* Checks if a password matches a hash
* @param {string} password
* 	The password that was provided by the user
* @param {string} hash
* 	A salted hash
* @return {Promise}
* 	A {@link Promise} that resolves to a boolean which represents whether or not the match was successful
*/
export async function checkPassword(password, hash) {
	try {
		return await checkHash(password, hash);
	}
	catch (e) {
		throw e;
	}
}
/**
* Checks if a token is valid
* @param {string} token
* 	The JWT token
* @return {Promise}
* 	A {@link Promise} that resolves to a boolean which represents whether or not the token is valid
*/
export async function checkToken(token) {
	try {
		return await verifyToken(token);
	}
	catch (e) {
		return false;
	}
}
/**
* Creates a JWT session token
* @param {object|string} data
* 	The token's payload
* @return {Promise}
* 	A {@link Promise} that resolves to a new JWT token string
*/
export function createToken(data) {
	return jwt.sign(data, config.server.crypto.tokenSecret, {
		expiresIn: config.server.crypto.tokenExpirationMinutes * 60
	});
}
/**
* Hashes a password
* @param {string} password
* 	The password that was provided by the user
* @return {Promise}
* 	A {@link Promise} that resolves to a string which represents a salted password hash
*/
export async function hash(password) {
	try {
		const salt = await generateSalt(config.server.crypto.saltRounds);
		return generateHash(password, salt);
	}
	catch (e) {
		throw e;
	}
}