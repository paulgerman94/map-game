import dispatcher from "../Dispatcher";
import { EventEmitter } from "crystal-event-emitter";
import cache from "client/cache";
/**
* A symbol that denotes a login
* @type {symbol}
*/
export const LOGIN = Symbol("Login");
/**
* A symbol that denotes a failed login
* @type {symbol}
*/
export const LOGIN_FAILED = Symbol("Login failed");
/**
* A symbol that denotes a logout
* @type {symbol}
*/
export const LOGOUT = Symbol("Logout");
/**
* A symbol that denotes a disrupted connection
* @type {symbol}
*/
export const CONNECTION_DISRUPTED = Symbol("Connection disrupted");
/**
* A symbol that denotes an established connection
* @type {symbol}
*/
export const CONNECTION_ESTABLISHED = Symbol("Connection established");
/**
* A symbol that denotes that a service worker has been registered
* @type {symbol}
*/
export const SERVICE_WORKER_REGISTERED = Symbol("Service worker registered");
/**
* A symbol that denotes that player information has been received
* @type {symbol}
*/
export const USER_RECEIVED = Symbol("User received");
/**
* A symbol that denotes that player's score has been updated
* @type {symbol}
*/
export const SCORE_UPDATED = Symbol("Score updated");
/**
* This class is a flux store that keeps a global view of the connection state.
* It encompasses information about when the user registers, logs in, etc.
*/
class ConnectionStore extends EventEmitter {
	/**
	* Instantiates a new {@link ConnectionStore}
	*/
	constructor() {
		super();
		/**
		* The user that is logged in
		* @type {object}
		*/
		this.user = null;
		/**
		* States whether the client is connected to the server or not
		* @type {boolean}
		*/
		this.isConnected = false;
		/**
		* The service worker registration that is created upon starting the app
		* @type {ServiceWorkerRegistration}
		*/
		this.serviceWorkerRegistration = null;
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
			case CONNECTION_DISRUPTED: {
				if (this.isConnected !== false) {
					this.isConnected = false;
					this.emit(action.type);
				}
				break;
			}
			case CONNECTION_ESTABLISHED: {
				if (this.isConnected !== true) {
					this.isConnected = true;
					this.emit(action.type);
				}
				break;
			}
			case LOGIN: {
				this.user = action.user;
				cache.save("user", this.user);
				this.emit(action.type, this.user);
				break;
			}
			case LOGIN_FAILED: {
				this.user = null;
				this.emit(action.type);
				break;
			}
			case LOGOUT: {
				this.user = null;
				this.emit(action.type);
				break;
			}
			case SERVICE_WORKER_REGISTERED: {
				this.serviceWorkerRegistration = action.registration;
				break;
			}
			case USER_RECEIVED: {
				const { user, type } = action;
				this.user = user;
				cache.save("user", user);
				this.emit(type, this.user);
				break;
			}
			case SCORE_UPDATED: {
				const { score, type } = action;
				this.user.score = score;
				cache.save("user", this.user);
				this.emit(type, score);
				break;
			}
			default: {
				break;
			}
		}
	}
}
const connectionStore = new ConnectionStore();
dispatcher.register(::connectionStore.handleActions);
/**
* The {@link ConnectionStore} singleton instance
*/
export default connectionStore;
