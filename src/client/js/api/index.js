import client from "../client";
import * as connectionActions from "client/ui/actions/ConnectionActions";
import {
	default as cache,
	TOKEN
} from "../cache";
/**
* Tries to login the client and caches the resulting session token if successful
* @param {object} data
* 	The login data
* @param {string} data.accountName
* 	The user account to log into
* @param {string} data.email
* 	The user email to log into
* @param {string} data.password
* 	The user's password
* @return {boolean}
* 	Whether or not the token could be received
*/
async function getToken(data) {
	try {
		const value = await client.login(data);
		const [token] = value;
		if (token) {
			cache.save(TOKEN, token);
			return true;
		}
		else {
			return false;
		}
	}
	catch (e) {
		return false;
	}
}
/**
* Tries to log in a user based on the data provided.
* If the client finds a session token, the `data` argument will be ignored.
* @throws
* 	Will throw an error if the user couldn't be logged in due to an error. Some of these errors might be related to the network, the token expiration or wrong credentials.
* @param {object} [data={}]
* 	The login data
* @param {string} data.accountName
* 	The user account to log into
* @param {string} data.email
* 	The user email to log into
* @param {string} data.password
* 	The user's password
* @return {boolean}
* 	True if login was successful, throws otherwise
*/
export async function login(data = {}) {
	const {
		accountName,
		email,
		password
	} = data;
	const token = cache.load(TOKEN);
	if (token) {
		/* Try to login with the token */
		try {
			await client.login({
				token
			});
			cache.save(TOKEN, token);
			return true;
		}
		catch (e) {
			/* Network error, token expiration, etc. */
			cache.remove(TOKEN);
			throw new Error("There was a token error.");
		}
	}
	else if (accountName && email || accountName && password) {
		const isTokenReceived = await getToken(data);
		if (isTokenReceived) {
			return true;
		}
		else {
			connectionActions.signalLoginFailed();
			throw new Error("There was a login data error.");
		}
	}
	else {
		/* `data` is empty, so don't contact the server */
		throw new Error("No login data has been provided.");
	}
}
/**
* Determines if the user is logged in without checking the token expiration. This can be useful if the intent is to synchronously render certain elements depending on whether the user is logged in or not, without contacting the server at all.
* @return {boolean}
* 	Whether or not the user is logged in judging by a (non-validated!) token
*/
export function isLoggedIn() {
	return cache.has(TOKEN);
}
/**
* Determines if the WebSocket connection to the server is open
* @return {boolean}
* 	Whether or not the WebSocket connection to the server is open
*/
export function isConnectionOpen() {
	return client.ws && client.ws.readyState === WebSocket.OPEN;
}
/**
* Logs a user out by removing the JWT token from cache.
* Note that JWT tokens are not designed to be invalidated; the token might still work for a third party that tries to session-hijack the user session.
* The general approach to this issue is to choose relatively short token expiration times.
*/
export function logout() {
	cache.remove(TOKEN);
	setTimeout(() => {
		connectionActions.signalLogout();
	}, 0);
}
export default from "./getPOIs";