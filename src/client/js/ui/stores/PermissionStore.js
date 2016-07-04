// import dispatcher from "../Dispatcher";
import { EventEmitter } from "crystal-event-emitter";
import cache from "client/cache";
/**
* The `"granted"` permission string that browsers can respond with
*/
export const GRANTED = "granted";
/**
* The `"denied"` permission string that browsers can respond with
*/
export const DENIED = "denied";
/**
* The `"prompt"` permission string that browsers can respond with
*/
export const PROMPT = "prompt";
/**
* Indicates that the user would prefer to have a certain feature enabled
*/
export const ENABLED = true;
/**
* Indicates that the user would prefer to have a certain feature disabled
*/
export const DISABLED = false;
/**
* Indicates that the user hasn't decided on whether or not he'd like a certain feature to be enabled or disabled
* @type {null}
*/
export const UNSET = null;
/**
* A symbol that references the permission to know the user's location (`GeoLocation`)
* @type {symbol}
*/
export const LOCATION = Symbol("Location");
/**
* A symbol that references the permission to send push notifications to the user (`Notification`)
* @type {symbol}
*/
export const NOTIFICATIONS = Symbol("Notifications");
/**
* A symbol that denotes that the player's notification preferences have changed
* @type {symbol}
*/
export const PREFERENCE_CHANGED = Symbol("Preference changed");
/**
* A symbol that denotes that the browsers's notification setup has changed
* @type {symbol}
*/
export const PERMISSION_CHANGED = Symbol("Permission changed");
/**
* A symbol that denotes that a permission request should be displayed with a dialog in the GUI
* @type {symbol}
*/
export const PERMISSION_REQUESTED = Symbol("Permission requested");
/**
* A symbol that denotes that a permission setup request should be displayed with a dialog in the GUI
* @type {symbol}
*/
export const PERMISSION_SETUP_REQUESTED = Symbol("Permission setup requested");
const permissionTypes = [
	[LOCATION, "geolocation"],
	[NOTIFICATIONS, "notifications"]
];
const CACHE_KEY = "permissions";
/**
* This class models a permission that consists of the actual browser permission and the user's preference
*/
class Permission {
	/**
	* Instantiates a new {@link Permission}
	* @param {object} descriptor
	* 	The descriptor used to create a new {@link Permission}
	* @param {symbol} [descriptor.type=PROMPT]
	* 	A type that describes the exact kind of browser permission that we have; can be one of `GRANTED`, `PROMPT` and `DENIED`
	* @param {boolean|null} [descriptor.preference=UNSET]
	* 	The user preference for the given permission; can be one of `UNSET`, `ENABLED` and `DISABLED`
	* @param {string} descriptor.handle
	* 	The handle string that {@link Permissions.query} uses to look up the current permission
	*/
	constructor({
		type,
		permission = PROMPT,
		preference = UNSET,
		handle
	}) {
		this.type = type;
		this.permission = permission;
		this.preference = preference;
		this.handle = handle;
	}
}
/**
* This class models an event where a {@link Permission}'s property changes
*/
class PermissionDeltaEvent {
	/**
	* Instantiates a new {@link PermissionDeltaEvent}
	* @param {Permission} permission
	* 	The permission object that has been changed
	*/
	constructor(permission) {
		this.type = permission.type;
	}
}
/**
* This class models an event where a {@link Permission}'s `permission` property changes
*/
class PermissionChangeEvent extends PermissionDeltaEvent {
	/**
	* Instantiates a new {@link PermissionChangeEvent}
	* @param {Permission} permission
	* 	The permission object that has been changed
	*/
	constructor(permission) {
		super(permission);
		this.permission = permission.permission;
	}
}
/**
* This class models an event where a {@link Permission}'s `preference` property changes
*/
class PreferenceChangeEvent extends PermissionDeltaEvent {
	/**
	* Instantiates a new {@link PreferenceChangeEvent}
	* @param {Permission} permission
	* 	The permission object that has been changed
	*/
	constructor(permission) {
		super(permission);
		this.permission = permission.preference;
	}
}
/**
* This class is a store that keeps a global view of the user permissions.
*/
class PermissionStore extends EventEmitter {
	/**
	* Instantiates a new {@link PermissionStore} and sets the user preferences from cache
	*/
	constructor() {
		super();
		/**
		* Maps permissions to the player's actual preferences
		* @type {Map}
		*/
		this.permissions = new Map();
		/* If we've never saved permissions before, the cache is pretty new */
		if (!cache.has(CACHE_KEY)) {
			cache.save(CACHE_KEY, {});
		}
		for (const [type, handle] of permissionTypes) {
			const cachedPermissions = cache.load(CACHE_KEY);
			this.permissions.set(type, new Permission({
				type,
				handle,
				preference: cachedPermissions[handle]
			}));
		}
	}
	/**
	* Retrieves a {@link Permission} by its type
	* @param {symbol} type
	* 	The {@link Permission} type to look up
	* @return {Permission}
	* 	The browser's current {@link Permission} of type `type`
	*/
	get(type) {
		return this.permissions.get(type);
	}
	/**
	* This method Infers the preference given that the {@link Permission}'s permission property has changed.
	* Note that inferrence is necessary since the user can revoke permissions at any time, which has implications on the app's runtime behavior (e.g. think of in-game user settings that must be changed accordingly).
	* @param {symbol} type
	* 	The {@link Permission} type for which to perform preference inference
	* @param {boolean|null} preference
	* 	The current {@link Permission} preference
	* @return {boolean|null}
	* 	The inferred {@link Permission} preference
	*/
	inferPreference(type, preference) {
		switch (type) {
			case GRANTED: {
				if (preference === UNSET || preference === ENABLED) {
					return ENABLED;
				}
				return DISABLED;
			}
			default:
			case PROMPT: {
				return UNSET;
			}
			case DENIED: {
				return DISABLED;
			}
		}
	}
	/**
	* Initializes all browser permissions and sets up event listeners that listen for permission changes
	*/
	async initialize() {
		const currentPermissions = [];
		for (const permission of this.permissions.values()) {
			currentPermissions.push({
				permission,
				status: navigator.permissions.query({
					name: permission.handle
				})
			});
		}
		await Promise.all(currentPermissions.map(o => o.status));
		for (const currentPermission of currentPermissions) {
			const originalPermission = currentPermission.permission;
			const permissionStatus = await currentPermission.status;
			/* Initialize the permissions properly */
			originalPermission.permission = permissionStatus.state;
			/* Permission change implies preference change */
			originalPermission.preference = this.inferPreference(originalPermission.permission, originalPermission.preference);
			this.emit(PERMISSION_CHANGED, new PermissionChangeEvent(originalPermission));
			permissionStatus.addEventListener("change", e => {
				/* Update the permissions in the future */
				originalPermission.permission = e.target.state;
				originalPermission.preference = this.inferPreference(originalPermission.permission, originalPermission.preference);
				this.emit(PERMISSION_CHANGED, new PermissionChangeEvent(originalPermission));
			});
		}
	}
	/**
	* Sets a user preference for a given {@link Permission} type
	* @param {symbol} type
	* 	The type of the {@link Permission} to change
	* @param {boolean|null} preference
	* 	The new user preference to set
	*/
	setPreference(type, preference) {
		const permission = this.permissions.get(type);
		/* Cache the preference */
		const cachedPermissions = cache.load(CACHE_KEY);
		cachedPermissions[permission.handle] = preference;
		cache.save(CACHE_KEY, cachedPermissions);
		/* Set the preference */
		permission.preference = preference;
		/* Emit the change */
		this.emit(PREFERENCE_CHANGED, new PreferenceChangeEvent(permission));
	}
	/**
	* Requests a user permission using the browser's native APIs and asynchronously returns a normalized result
	* @param {symbol} type
	* 	The {@link Permission} type for which to request the user permission
	* @return {Promise}
	* 	A {@link Promise} that resolves to one of GRANTED, DENIED or PROMPT
	*/
	async requestPermission(type) {
		switch (type) {
			case NOTIFICATIONS: {
				return await Notification.requestPermission();
			}
			case LOCATION: {
				return new Promise(resolve => {
					navigator.geolocation.getCurrentPosition(() => {
						resolve(GRANTED);
					}, error => {
						if (error.code === 1) {
							resolve(DENIED);
						}
						resolve(PROMPT);
					});
				});
			}
			default: {
				return null;
			}
		}
	}
	/**
	* Requests a UI dialog that handles a specific permission grant
	* @param {symbol} type
	* 	The {@link Permission} type for which a dialog should open up
	*/
	request(type) {
		this.emit(PERMISSION_REQUESTED, {
			type
		});
	}
	/**
	* Requests a UI dialog that handles the plea to unblock a specific permission
	* @param {symbol} type
	* 	The {@link Permission} type for which a dialog should open up
	*/
	requestSetup(type) {
		this.emit(PERMISSION_SETUP_REQUESTED, {
			type
		});
	}
}
const permissionStore = new PermissionStore();
// dispatcher.register(::permissionStore.handleActions);
/**
* The {@link PermissionStore} singleton instance
*/
export default permissionStore;