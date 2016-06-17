import L from "../LeafletWrapper";
/**
* This class models a flag on the dashboard map. All flags have a latitude and a longitude; specialized flags (e. g. Restaurant flags) can set an icon and a color property.
*/
export class Flag {
	/**
	* Creates a new {@link Flag} instance
	* @param {object} element
	* 	An OSM primitive (node, way, area, relation)
	*/
	constructor(element) {
		this.element = element;
		/**
		* @property {number} latitude
		* 	The flag's latitude
		*/
		this.latitude = element.lat;
		/**
		* @property {number} longitude
		* 	The flag's longitude
		*/
		this.longitude = element.lon;
		/**
		* @property {String} name
		* 	The flag's name
		*/
		this.name = element.tags.name;
	}
	/**
	* Retrieves a marker to draw on the dashboard
	* @return {Marker}
	* 	A Leaflet marker with a color and an icon
	*/
	get marker() {
		return L.marker([this.latitude, this.longitude], {
			icon: L.AwesomeMarkers.icon({
				icon: this.icon,
				markerColor: this.color,
				prefix: "fa"
			})
		}).bindPopup(this.name);
	}
}
export default Flag;