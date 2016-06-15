import dispatcher from "../Dispatcher";
import { EventEmitter } from "crystal-event-emitter";
import {
	LOGIN,
	LOGIN_FAILED,
	LOGOUT,
	CONNECTION_DISRUPTED,
	CONNECTION_ESTABLISHED
} from "../actions/ConnectionActions";
export * from "../actions/ConnectionActions";
/**
* This class is a flux store that keeps a global view of the connection state.
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
			case LOGIN:
				this.user = action.username;
				this.emit(action.type, this.user);
				break;
			case LOGIN_FAILED:
				this.user = null;
				this.emit(action.type);
				break;
			case LOGOUT:
				this.user = null;
				this.emit(action.type);
				break;
			default:
				break;
		}
	}
}
const connectionStore = new ConnectionStore();
dispatcher.register(::connectionStore.handleActions);
export default connectionStore;