import dispatcher from "../Dispatcher";
import { EventEmitter } from "crystal-event-emitter";
import cache from "client/cache";
import Flag from "../Flag";
export const FLAG_CACHE_UPDATED = Symbol("Flag cache updated");
export const FLAG_SELECTED = Symbol("Flag selected");
export const AREA_UPDATED = Symbol("Area updated");
/**
* This class is a flux store that keeps a global view of the user location and its associated permissions.
*/
class LocationStore extends EventEmitter {
	flags;
	centers;
	/**
	* Instantiates a new {@link LocationStore} and sets up the flag cache
	*/
	constructor() {
		super();
		this.coordinates = cache.load("coordinates");
		const flags = cache.load("flags");
		this.flags = flags ? flags.map(flag => new Flag(flag).specialized) : [];
	}
	/**
	* Updates the internal area cache and fires an event to redraw the area
	* @param {Array.<object>} centers
	* 	The circle centers that define the known area
	*/
	updateArea(centers) {
		this.centers = centers;
		this.emit(AREA_UPDATED, this.centers);
	}
	/**
	* Updates the player coordinates in the cache
	* @param {object} coordinates
	* 	The `coords` object returned from the GeoLocation API
	*/
	updateCoordinates(coordinates) {
		this.coordinates = coordinates;
		cache.save("coordinates", {
			accuracy: coordinates.accuracy,
			latitude: coordinates.latitude,
			longitude: coordinates.longitude
		});
	}
	/**
	* Handles a flux action and manipulates the store depending on the action
	* @param {string} action
	* 	The name of the action that the store should invoke
	*/
	handleActions(action) {
		switch (action.type) {
			case FLAG_SELECTED: {
				this.emit(action.type, action.flag);
				break;
			}
			case FLAG_CACHE_UPDATED: {
				for (const flag of action.flags) {
					if (!this.flags.some(cachedFlag => cachedFlag.id === flag.id)) {
						/* The flag is not in the cache, so add it */
						if (flag instanceof Flag) {
							/* Never push a partial update (object) in the flag array */
							this.flags.push(flag);
						}
					}
					else {
						/* It's in the cache, so update it */
						const index = this.flags.findIndex(f => f.id === flag.id);
						let foundFlag = this.flags[index];
						if (flag instanceof Flag) {
							/* Just exchange the flag */
							foundFlag = flag;
						}
						else {
							/* Perform a partial update */
							const partial = [
								"capturedAt",
								"lockedUntil",
								"owner",
								"team"
							];
							for (const property of partial) {
								foundFlag.updateDescriptor(property, flag[property]);
							}
						}
					}
				}
				/* Cache the flags permanently */
				cache.save("flags", this.flags.map(flag => flag.descriptor));
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