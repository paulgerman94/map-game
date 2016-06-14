import L from "../LeafletWrapper";
export class Flag {
	/**
	* Creates a new {@link Flag} instance
	* @param {object} element
	* 	An OSM primitive (node, way, area, relation)
	*/
	constructor(element) {
		this.element = element;
		this.latitude = element.lat;
		this.longitude = element.lon;
	}
	get marker() {
		return L.marker([this.latitude, this.longitude], {
			icon: L.AwesomeMarkers.icon({
				icon: this.icon,
				markerColor: this.color,
				prefix: "fa"
			})
		});
	}
}
export default Flag;