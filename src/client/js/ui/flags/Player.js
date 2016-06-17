import Flag from "./Flag";
/**
* This class is a flag that will be displayed for players
*/
export class Player extends Flag {
	/**
	* @property {string} icon
	* 	The flag icon
	*/
	icon = "male";
	/**
	* @property {string} color
	* 	The flag color
	*/
	color = "red";
	/**
	* Creates a new Restaurant {@link Flag}.
	* @param {object} element
	* 	An OSM primitive (node, way, area, relation)
	*/
	constructor(element) {
		super(element);
	}
}
export default Player;