import client from "../client";
import {
	default as store,
	TOKEN
} from "../store";
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
			store.save(TOKEN, token);
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
	const token = store.load(TOKEN);
	if (token) {
		/* Try to login with the token */
		try {
			await client.login({
				token
			});
			store.save(TOKEN, token);
			return true;
		}
		catch (e) {
			/* Network error, token expiration, etc. */
			store.remove(TOKEN);
			throw new Error("There was a token error.");
		}
	}
	else if (accountName && email || accountName && password) {
		const isTokenReceived = await getToken(data);
		if (isTokenReceived) {
			return true;
		}
		else {
			throw new Error("There was a login data error.");
		}
	}
	else {
		/* `data` is empty, so don't contact the server */
		throw new Error("No login data has been provided.");
	}
}
/**
* Logs a user out by removing the JWT token from the store.
* Note that JWT tokens are not designed to be invalidated; the token might still work for a third party that tries to session-hijack the user session.
* The general approach to this issue is to choose relatively short token expiration times.
*/
export function logout() {
	store.remove(TOKEN);
}