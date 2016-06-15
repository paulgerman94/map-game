import dispatcher from "../Dispatcher";
import { EventEmitter } from "crystal-event-emitter";
/**
* A symbol that denotes that the browser registers that the location permission has been granted
*/
export const LOCATION_GRANTED = Symbol("Location granted");
/**
* A symbol that denotes that the browser tries to request the user's GeoLocation
*/
export const LOCATION_REQUESTED = Symbol("Location requested");
/**
* A symbol that denotes that the browser tries to ask the user to unblock GeoLocation
*/
export const LOCATION_SETUP_REQUESTED = Symbol("Location setup requested");
/**
* This class is a flux store that keeps a global view of the user location and its associated permissions.
*/
class LocationStore extends EventEmitter {
	/**
	* Handles a flux action and manipulates the store depending on the action
	* @param {string} action
	* 	The name of the action that the store should invoke
	*/
	handleActions(action) {
		switch (action.type) {
			case LOCATION_GRANTED:
				this.emit(action.type);
				break;
			case LOCATION_REQUESTED:
				this.emit(action.type);
				break;
			case LOCATION_SETUP_REQUESTED:
				this.emit(action.type);
				break;
			default:
				break;
		}
	}
}
const locationStore = new LocationStore();
dispatcher.register(::locationStore.handleActions);
export default locationStore;