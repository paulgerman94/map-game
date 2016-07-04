/**
* The property under which the session token is saved in the cache (WebStorage API)
*/
export const TOKEN = "token";
/**
* This class models a cache, i.e. an object that simplifies cache access. Since cookies are dead, this project makes heavy use of WebStorage. This class offers a simple API to load, save, and remove properties or assign values to them.
*/
class Cache {
	/**
	* Creates a new cache if no cache exists yet
	*/
	create() {
		if (!localStorage.data) {
			localStorage.data = JSON.stringify({});
		}
	}
	/**
	* Updates the cache to a new cache object
	* @param {object} object
	* 	The new cache object
	*/
	update(object) {
		localStorage.data = JSON.stringify(object);
	}
	/**
	* Parses the cache and returns it as an object.
	* If no cache exists, a cache will be created.
	* @return {object}
	* 	An object that contains the cache
	*/
	get data() {
		this.create();
		return JSON.parse(localStorage.data);
	}
	/**
	* Removes a property from the cache
	* @param {string} property
	* 	The property to remove
	*/
	remove(property) {
		const currentValue = this.data;
		currentValue[property] = undefined;
		this.update(currentValue);
	}
	/**
	* Saves a property in the cache
	* @param {string} property
	* 	The property to save
	* @param {*} value
	* 	The value to save
	*/
	save(property, value) {
		const currentValue = this.data;
		currentValue[property] = value;
		this.update(currentValue);
	}
	/**
	* Loads a value from the cache
	* @param {string} property
	* 	The property under which the value is saved
	* @return {*}
	* 	The value that was saved under the property name
	*/
	load(property) {
		return this.data[property];
	}
	/**
	* Determines if the cache has a property or not
	* @param {string} property
	* 	The property name to look up
	* @return {boolean}
	* 	Whether the property is in the cache or not
	*/
	has(property) {
		return this.data.hasOwnProperty(property);
	}
}
/**
* The {@link Cache} singleton instance
*/
export default new Cache();