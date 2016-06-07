import dispatcher from "../Dispatcher";
/**
* A symbol that denotes a successful login
*/
export const LOGIN_SUCCESSFUL = Symbol("Login successful");
/**
* This action fires an event when the menu is toggled.
* @param {object} user
* 	The user information to save in the the {@link UserStore}
*/
export function login(user) {
	dispatcher.dispatch({
		type: LOGIN_SUCCESSFUL,
		user
	});
}