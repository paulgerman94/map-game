/**
* The property under which the session token is saved in the store
*/
export const TOKEN = "token";
/**
* This class models a store, i. e. an object that simplifies cache access. Since cookies are dead, this project makes heavy use of WebStorage. This class offers a simple API to load, save, and remove properties or assign them to values.
*/
class Store {
	/**
	* Creates a new store if no store exists yet
	*/
	create() {
		if (!localStorage.data) {
			localStorage.data = JSON.stringify({});
		}
	}
	/**
	* Updates the store to a new store object
	* @param {object} object
	* 	The new store object
	*/
	update(object) {
		localStorage.data = JSON.stringify(object);
	}
	/**
	* Parses the store and returns it as an object.
	* If no store exists, a store will be created.
	* @return {object}
	* 	An object that contains the store
	*/
	get data() {
		this.create();
		return JSON.parse(localStorage.data);
	}
	/**
	* Removes a property from the store
	* @param {string} property
	* 	The property to remove
	*/
	remove(property) {
		const currentValue = this.data;
		currentValue[property] = undefined;
		this.update(currentValue);
	}
	/**
	* Saves a property in the store
	* @param {string} property
	* 	The property to save
	* @param {*} value
	* 	The value to save
	*/
	save(property, value) {
		const currentValue = this.data;
		currentValue[property] = value;
		console.log(`Overwriting ${property} with value ${value}.`);
		this.update(currentValue);
	}
	/**
	* Loads a value from the store
	* @param {string} property
	* 	The property under which the value is saved
	* @return {*}
	* 	The value that was saved under the property name
	*/
	load(property) {
		return this.data[property];
	}
}
export default new Store();