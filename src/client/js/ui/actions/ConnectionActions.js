import dispatcher from "../Dispatcher";
/**
* A symbol that denotes a successful login
*/
export const LOGIN = Symbol("Login");
export const LOGIN_FAILED = Symbol("Login failed");
export const LOGOUT = Symbol("Logout");
export const CONNECTION_DISRUPTED = Symbol("Connection disrupted");
export const CONNECTION_ESTABLISHED = Symbol("Connection established");
/**
* This action fires an event when the user is logged in.
* @param {object} user
* 	The user information about the user that has logged in
*/
export function signalLogin(user) {
	dispatcher.dispatch({
		type: LOGIN,
		user
	});
}
/**
* This action fires an event when the user logs out.
*/
export function signalLogout() {
	dispatcher.dispatch({
		type: LOGOUT
	});
}
/**
* This action fires an event the connection is disrupted.
*/
export function signalConnectionDisruption() {
	dispatcher.dispatch({
		type: CONNECTION_DISRUPTED
	});
}
export function signalConnectionEstablished() {
	dispatcher.dispatch({
		type: CONNECTION_ESTABLISHED
	});
}
export function signalLoginFailed() {
	dispatcher.dispatch({
		type: LOGIN_FAILED
	});
}