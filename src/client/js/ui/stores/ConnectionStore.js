import dispatcher from "../Dispatcher";
import { EventEmitter } from "crystal-event-emitter";
import {
	LOGIN_SUCCESSFUL,
	LOGIN_FAILED,
	LOGOUT_SUCCESSFUL,
	CONNECTION_DISRUPTED,
	CONNECTION_ESTABLISHED
} from "../actions/LoginActions";
export {
	LOGIN_SUCCESSFUL,
	LOGIN_FAILED,
	LOGOUT_SUCCESSFUL,
	CONNECTION_DISRUPTED,
	CONNECTION_ESTABLISHED
} from "../actions/LoginActions";
/**
* This class is a flux store that keeps a global view of the user identification state.
* It encompasses information about when the user registers, logs in, etc.
*/
class ConnectionStore extends EventEmitter {
	/**
	* The user that is logged in
	* @property {object} [user=null]
	*/
	user = null;
	/**
	* States whether the client is connected to the server or not
	* @property {boolean} isConnected
	*/
	isConnected;
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
			case LOGIN_FAILED:
				this.user = null;
				this.emit(action.type);
				break;
			case LOGOUT_SUCCESSFUL:
				this.logout();
				break;
			case CONNECTION_DISRUPTED:
				if (this.isConnected !== false) {
					this.isConnected = false;
					this.emit(action.type);
				}
				break;
			case CONNECTION_ESTABLISHED:
				if (this.isConnected !== true) {
					this.isConnected = true;
					this.emit(action.type);
				}
				break;
			default:
				break;
		}
	}
}
const connectionStore = new ConnectionStore();
dispatcher.register(::connectionStore.handleActions);
export default connectionStore;