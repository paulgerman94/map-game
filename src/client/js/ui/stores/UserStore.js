import dispatcher from "../Dispatcher";
import { EventEmitter } from "events";
/**
* This class is a flux store that keeps a global view of the user identification state.
* It encompasses information about when the user registers, logs in, etc.
*/
class UserStore extends EventEmitter {
	/**
	* Whether or not the user is logged in
	* @property {boolean} [isLoggedIn=false]
	*/
	isLoggedIn = false;
	/**
	* Adds a user to the store
	* @param {string} username
	* 	The user's username
	* @param {string} label
	* 	The label that should be attached to the users
	*/
	login(username) {
		this.isLoggedIn = true;
		this.emit("login");
	}
	/**
	* Handles a flux action and manipulates the store depending on the action
	* @param {string} action
	* 	The name of the action that the store should invoke
	*/
	handleActions(action) {
		console.log("New action received:", action);
		switch (action.type) {
			case "LOGIN_SUCCESSFUL": {
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