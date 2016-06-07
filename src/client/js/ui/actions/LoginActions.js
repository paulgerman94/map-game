import dispatcher from "../Dispatcher";
/**
* This action fires an event when the menu is toggled.
*/
export function login() {
	dispatcher.dispatch({
		type: "LOGIN_SUCCESSFUL"
	});
}