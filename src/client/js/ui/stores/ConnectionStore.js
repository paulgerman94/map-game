import dispatcher from "../Dispatcher";
import { EventEmitter } from "crystal-event-emitter";
import cache from "client/cache";
/**
* A symbol that denotes a login
*/
export const LOGIN = Symbol("Login");
/**
* A symbol that denotes a failed login
*/
export const LOGIN_FAILED = Symbol("Login failed");
/**
* A symbol that denotes a logout
*/
export const LOGOUT = Symbol("Logout");
/**
* A symbol that denotes a disrupted connection
*/
export const CONNECTION_DISRUPTED = Symbol("Connection disrupted");
/**
* A symbol that denotes an established connection
*/
export const CONNECTION_ESTABLISHED = Symbol("Connection established");
/**
* A symbol that denotes that a service worker has been registered
*/
export const SERVICE_WORKER_REGISTERED = Symbol("Service worker registered");
/**
* A symbol that denotes that the player's team has been received
*/
export const TEAM_RECEIVED = Symbol("Team received");
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
	* The service worker registration that is created upon starting the app
	* @property {ServiceWorkerRegistration} serviceWorkerRegistration
	*/
	serviceWorkerRegistration;
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
				let user = cache.load("user");
				if (action.accountName) {
					user = {
						accountName: action.accountName
					};
				}
				this.user = user;
				cache.save("user", user);
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
			case TEAM_RECEIVED: {
				const user = cache.load("user");
				user.team = action.team;
				this.user = user;
				cache.save("user", user);
				this.emit(action.type, this.user);
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
export default connectionStore;