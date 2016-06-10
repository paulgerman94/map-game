import dispatcher from "../Dispatcher";
/**
* A symbol that denotes a successful login
*/
export const LOGIN_SUCCESSFUL = Symbol("Login successful");
export const LOGOUT_SUCCESSFUL = Symbol("Login successful");
/**
* This action fires an event when the user is logged in.
* @param {object} user
* 	The user information about the user that has logged in
*/
export function login(user) {
	dispatcher.dispatch({
		type: LOGIN_SUCCESSFUL,
		user
	});
}
/**
* This action fires an event when the user logs out.
*/
export function logout() {
	dispatcher.dispatch({
		type: LOGOUT_SUCCESSFUL
	});
}