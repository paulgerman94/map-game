import L from "./LeafletWrapper";
/**
* This class models a flag on the dashboard map. All flags have a latitude and a longitude; specialized flags (e. g. Restaurant flags) can set an icon and a color property.
*/
export class Flag {
	/**
	* @property {string} icon
	* 	The flag icon
	*/
	icon = "question";
	/**
	* @property {string} color
	* 	The flag color
	*/
	color = "blue";
	/**
	* Creates a new {@link Flag} sub-instance
	* @param {object} element
	* 	An OSM primitive (node, way, area, relation)
	*/
	constructor(element) {
		this.element = element;
		/**
		* @property {number} latitude
		* 	The flag's latitude
		*/
		this.latitude = NaN;
		/**
		* @property {number} longitude
		* 	The flag's longitude
		*/
		this.longitude = NaN;
		/**
		* @property {String} name
		* 	The flag's name
		*/
		this.name = element.tags.name;
		/**
		* @property {number} id
		* 	The flag's id
		*/
		this.id = element.id;
		switch (element.type) {
			case "node": {
				this.latitude = element.lat;
				this.longitude = element.lon;
				break;
			}
			case "way": {
				this.latitude = element.center.lat;
				this.longitude = element.center.lon;
				break;
			}
			case "area": {
				break;
			}
			default:
				break;
		}
	}
	/**
	* Creates a non-generic, specialized flag, based on the properties of the OSM element
	* @return {Flag}
	* 	A specialized instance of a subclass of {@link Flag}
	*/
	get specialized() {
		const element = this.element;
		if (element.tags.amenity === "restaurant") {
			return new Restaurant(element);
		}
		if (element.tags.amenity === "music_school" ||
			element.tags.amenity === "dancing_school" ||
			element.tags.amenity === "driving_school" ||
			element.tags.amenity === "language_school" ||
			element.tags.amenity === "school" ||
			element.tags.amenity === "university"
		) {
			return new School(element);
		}
		else {
			return this;
		}
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
	* Creates a new Restaurant {@link Flag}
	* @param {object} element
	* 	An OSM primitive (node, way, area, relation)
	*/
	constructor(element) {
		super(element);
	}
}
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
	* Creates a new School {@link Flag}
	* @param {object} element
	* 	An OSM primitive (node, way, area, relation)
	*/
	constructor(element) {
		super(element);
	}
}
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
export default Flag;