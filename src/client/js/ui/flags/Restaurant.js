import Flag from "./Flag";
/**
* This class is a flag that will be displayed for restaurants
*/
export class Restaurant extends Flag {
	/**
	* @property {string} icon
	* 	The flag icon
	*/
	icon = "cutlery";
	/**
	* @property {string} color
	* 	The flag color
	*/
	color = "orange";
	/**
	* Creates a new Restaurant {@link Flag}.
	* @param {object} element
	* 	An OSM primitive (node, way, area, relation)
	*/
	constructor(element) {
		super(element);
	}
}
export default Restaurant;