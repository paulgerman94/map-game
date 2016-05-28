import { execute } from "./Query";
import { km } from "./units";
/**
* This class models a point somewhere on the globe.
* A point is described by its latitude and its longitude.
* Points can be used to query Overpass for nearby POI seeds.
*/
export default class Point {
	/**
	* Constructs a new point
	* @param {object} options
	* 	An object
	* @param {number} [object.latitude=0]
	* 	The point's latitude on the globe
	* @param {number} [object.longitude=0]
	* 	The point's longitude on the globe
	*/
	constructor({
		latitude = 0,
		longitude = 0
	} = {}) {
		/**
		* The point's latitude on the globe
		* @type {number}
		*/
		this.latitude = latitude;
		/**
		* The point's longitude on the globe
		* @type {number}
		*/
		this.longitude = longitude;
	}
	/**
	* Queries an Overpass server for nearby POI seeds
	* @param {Array.<string>} [amenities=[]]
	* 	A list of amenities to filter for
	* @param {number} [radius=1]
	* 	The radius around the point, in kilometers, to limit the query to
	* @return {Promise<object, Error>}
	* 	An promise that resolves to the nodes, lines and polygons with their corresponding descriptions from OSM if successful
	*/
	async closest(amenities = [], radius = km) {
		const disjunction = amenities.map(x => `(${x})`).join("|");
		return await execute(`
			node(around:${radius}, ${this.latitude}, ${this.longitude})["amenity"~"${disjunction}"];
		`);
	}
}