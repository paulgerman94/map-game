import dispatcher from "../Dispatcher";
import { LOGIN_SUCCESSFUL } from "../actions/LoginActions";
import { EventEmitter } from "crystal-event-emitter";
export const LOGIN = Symbol("Login");
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
		this.emit(LOGIN, user);
	}
	/**
	* Handles a flux action and manipulates the store depending on the action
	* @param {string} action
	* 	The name of the action that the store should invoke
	*/
	handleActions(action) {
		switch (action.type) {
			case LOGIN_SUCCESSFUL: {
				this.login(action.username);
				break;
			}
			default:
				break;
		}
	}
}
const userStore = new UserStore();
dispatcher.register(::userStore.handleActions);
export default userStore;