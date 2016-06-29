import client from "../client";
import {
	default as cache,
	TOKEN
} from "../cache";
import {
	LOGIN,
	LOGOUT,
	LOGIN_FAILED,
	TEAM_RECEIVED
} from "client/ui/stores/ConnectionStore";
import { publish } from "client/ui/Dispatcher";
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
			publish(LOGIN);
		}
		catch (e) {
			/* Network error, token expiration, etc. */
			cache.remove(TOKEN);
			publish(LOGIN_FAILED);
			throw new Error("There was a token error.");
		}
	}
	else if (accountName && email || accountName && password) {
		const isTokenReceived = await getToken(data);
		if (isTokenReceived) {
			publish(LOGIN, {
				accountName
			});
		}
		else {
			publish(LOGIN_FAILED);
			throw new Error("There was a login data error.");
		}
	}
	else {
		/* `data` is empty, so don't even contact the server */
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
	publish(LOGOUT);
}
/**
* Performs an API call that updates the client's notification ID on the server, given a subscription
* @param {PushSubscription} subscription
* 	The PushSubscription that determines the client's notification ID
*/
export function updateSubscription(subscription) {
	client.updateSubscription({
		subscription
	});
}
/**
* Performs an API call that removes the client's notification ID on the server
*/
export function removeSubscription() {
	client.updateSubscription({
		subscription: null
	});
}
/**
* Performs an API call that captures a flag
* @param {Flag} flag
* 	The flag to capture
* @return {Promise}
* 	A promise that resolves to whether or not the capture was successful
*/
export async function capture(flag) {
	const id = flag.id;
	return await client.capture({
		id
	});
}
/**
* Performs an API call that gets the team
* @param {string} accountName
* 	The name of the account whose team to retrieve
* @return {Promise}
* 	A promise that resolves to the team of accountName
*/
export async function getTeam(accountName) {
	const [team] = await client.getTeam({
		accountName
	});
	publish(TEAM_RECEIVED, {
		team
	});
	return team;
}
export default from "./getPOIs";