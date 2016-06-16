import Flag from "./Flag";
/**
* This class is a flag that will be displayed for schools
*/
export class School extends Flag {
	/**
	* @property {string} icon
	* 	The flag icon
	*/
	icon = "university";
	/**
	* @property {string} color
	* 	The flag color
	*/
	color = "green";
	/**
	* Creates a new School {@link Flag}.
	* @param {object} element
	* 	An OSM primitive (node, way, area, relation)
	*/
	constructor(element) {
		super(element);
	}
}
export default School;