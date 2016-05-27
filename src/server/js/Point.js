import { execute } from "./Query";
import { km } from "./units";
export default class Point {
	constructor({
		latitude = 0,
		longitude = 0
	} = {}) {
		this.latitude = latitude;
		this.longitude = longitude;
	}
	async closest(amenities = [], radius = 1 * km) {
		const disjunction = amenities.map(x => `(${x})`).join("|");
		return await execute(`
			node(around:${radius}, ${this.latitude}, ${this.longitude})["amenity"~"${disjunction}"];
		`);
	}
}