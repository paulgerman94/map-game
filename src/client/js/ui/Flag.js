import L from "./LeafletWrapper";
import { publish } from "./Dispatcher";
import { FLAG_SELECTED } from "./stores/LocationStore";
import { amenities } from "./constants";
/**
* This class models a flag on the dashboard map. All flags have a latitude and a longitude; specialized flags (e.g. Restaurant flags) can set an icon and a color property.
*/
export class Flag {
	/**
	* Creates a new {@link Flag} instance
	* @param {object} descriptor
	* 	An object containing an OSM primitive and the game information about the flag
	*/
	constructor(descriptor) {
		/**
		* The flag icon, given by a `font-awesome` string
		* @type {string}
		*/
		this.icon = "question";
		/**
		* A descriptor containing all the information about a flag and from which it can be generated
		* @type {object}
		*/
		this.descriptor = descriptor;
		/**
		* An object containing only the OSM portion of the descriptor
		* @type {object}
		*/
		this.metadata = descriptor.metadata;
		for (const property in descriptor) {
			if (!this.hasOwnProperty(property)) {
				this[property] = descriptor[property];
			}
		}
		/**
		* The team color that a flag belongs to or `"purple"` if the flag belongs to no team
		* @type {string}
		*/
		this.team = this.team || "purple";
		/**
		* The flag's latitude
		* @type {number}
		*/
		this.latitude = NaN;
		/**
		* The flag's longitude
		* @type {number}
		*/
		this.longitude = NaN;
		/**
		* The flag's name
		* @type {string}
		*/
		this.name = this.metadata.tags.name;
		/**
		* The flag's type name
		* @type {string}
		*/
		this.typeName = "flag";
		/**
		* A shortcut to access the OSM metadata's `id` property
		* @type {number}
		*/
		this.id = this.metadata.id;
		switch (this.metadata.type) {
			case "node": {
				this.latitude = this.metadata.lat;
				this.longitude = this.metadata.lon;
				break;
			}
			case "way": {
				this.latitude = this.metadata.center.lat;
				this.longitude = this.metadata.center.lon;
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
		const { metadata } = this;
		let found = false;
		for (let i = 0; i < amenities.length; i++){
			for (let j = 0; j < amenities[i].list.length; j++){
				if (amenities[i].list[j] === metadata.tags.amenity) {
					/**
					* The flag icon, given by a `font-awesome` string
					* @type {string}
					*/
					this.icon = amenities[i].typeIcon;
					/**
					* The flag's type name
					* @type {string}
					*/
					this.typeName = amenities[i].typeName;
					found = true;
				}
			}
		}
		if (!found){
			console.log(`Icon not found for ${metadata.tags.amenity}`);
		}
		return this;
	}
	/**
	* Retrieves a marker to draw on the dashboard
	* @return {Marker}
	* 	A Leaflet marker with a color and an icon
	*/
	get marker() {
		const marker = L.marker([this.latitude, this.longitude], {
			icon: L.AwesomeMarkers.icon({
				icon: this.icon,
				markerColor: this.team,
				prefix: "fa"
			})
		});
		marker.on("click", () => {
			publish(FLAG_SELECTED, {
				flag: this
			});
		});
		return marker;
	}
	/**
	* Updates the flag descriptor in a way that can safely be cached *and* rendered
	* @param {string} property
	* 	The name of the property to update
	* @param {*} value
	* 	The value to assign to the property
	*/
	updateDescriptor(property, value) {
		this[property] = value;
		this.descriptor[property] = value;
	}
}
/**
* This class is a flag that will be displayed for players
*/
export class Player extends Flag {
	/**
	* Creates a new Restaurant {@link Flag}
	* @param {object} descriptor
	* 	An object containing an OSM primitive and the game information about the flag
	*/
	constructor({
		latitude,
		longitude,
		user
	}) {
		super({
			metadata: {
				lat: latitude,
				lon: longitude,
				tags: {
					name: user.displayName
				},
				type: "node"
			}
		});
		/**
		* The flag icon
		* @type {string}
		*/
		this.icon = "male";
		/**
		* The team color that a flag belongs to
		* @type {string}
		*/
		this.team = user.team;
		/**
		* The flag's type name
		* @type {string}
		*/
		this.typeName = "player";
	}
}
export default Flag;
