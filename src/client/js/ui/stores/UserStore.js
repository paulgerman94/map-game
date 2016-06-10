import dispatcher from "../Dispatcher";
import { EventEmitter } from "crystal-event-emitter";
import { LOGIN_SUCCESSFUL, LOGOUT_SUCCESSFUL } from "../actions/LoginActions";
export { LOGIN_SUCCESSFUL, LOGOUT_SUCCESSFUL } from "../actions/LoginActions";
/**
* This class is a flux store that keeps a global view of the user identification state.
* It encompasses information about when the user registers, logs in, etc.
*/
class UserStore extends EventEmitter {
	/**
	* The user that is logged in
	* @property {object} [user=null]
	*/
	user = null;
	/**
	* Adds a user to the store
	* @param {string} user
	* 	The user's user
	*/
	login(user) {
		this.user = user;
		this.emit(LOGIN_SUCCESSFUL, user);
	}
	/**
	* Removes a user from the store
	* @param {string} user
	* 	The user's user
	*/
	logout() {
		this.user = null;
		this.emit(LOGOUT_SUCCESSFUL);
	}
	/**
	* Whether or not the user is currently logged in
	* @return {boolean}
	* 	Whether or not the user is currently logged in
	*/
	get isLoggedIn() {
		return this.user !== null;
	}
	/**
	* Handles a flux action and manipulates the store depending on the action
	* @param {string} action
	* 	The name of the action that the store should invoke
	*/
	handleActions(action) {
		switch (action.type) {
			case LOGIN_SUCCESSFUL:
				this.login(action.username);
				break;
			case LOGOUT_SUCCESSFUL:
				this.logout();
				break;
			default:
				break;
		}
	}
}
const userStore = new UserStore();
dispatcher.register(::userStore.handleActions);
export default userStore;