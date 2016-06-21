import dispatcher from "../Dispatcher";
import { EventEmitter } from "crystal-event-emitter";
import cache from "client/cache";
import Flag from "../Flag";
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
* A symbol that denotes that the browser tries to ask the user to unblock GeoLocation
*/
export const FLAG_CACHE_UPDATED = Symbol("Flag cache updated");
/**
* This class is a flux store that keeps a global view of the user location and its associated permissions.
*/
class LocationStore extends EventEmitter {
	flags;
	/** Instantiates a new {@link LocationStore} and sets up the flag cache */
	constructor() {
		super();
		const flags = cache.load("flags");
		this.flags = flags ? flags.map(element => new Flag(element).specialized) : [];
	}
	/**
	* Handles a flux action and manipulates the store depending on the action
	* @param {string} action
	* 	The name of the action that the store should invoke
	*/
	handleActions(action) {
		switch (action.type) {
			case FLAG_CACHE_UPDATED: {
				for (const flag of action.flags) {
					if (!this.flags.some(cachedFlag => cachedFlag.id === flag.id)) {
						/* The flag is not in the cache, so add it */
						this.flags.push(flag);
					}
				}
				/* Cache the flags permanently */
				cache.save("flags", this.flags.map(flag => flag.element));
				this.emit(action.type);
				break;
			}
			case LOCATION_GRANTED: {
				this.emit(action.type);
				break;
			}
			case LOCATION_REQUESTED: {
				this.emit(action.type);
				break;
			}
			case LOCATION_SETUP_REQUESTED: {
				this.emit(action.type);
				break;
			}
			default: {
				break;
			}
		}
	}
}
const locationStore = new LocationStore();
dispatcher.register(::locationStore.handleActions);
export default locationStore;