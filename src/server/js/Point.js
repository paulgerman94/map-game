import { execute } from "./Query";
import { EARTH_RADIUS } from "./constants";
import { addPoint, searchAround, retrievePOIs, checkPoint } from "./db";
import { log } from "./util";
import POI from "./types/POI";
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
	* @param {object} db
	* 	The `pg-promise` database instance where query results may be cached
	* @param {number} [object.latitude=0]
	* 	The point's latitude on the globe
	* @param {number} [object.longitude=0]
	* 	The point's longitude on the globe
	*/
	constructor({
		db,
		latitude = 0,
		longitude = 0
	} = {}) {
		/**
		* The `pg-promise` database instance where query results may be cached
		* @type {object}
		*/
		this.db = db;
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
	* Converts a number to radians
	* @param {number} number
	* 	The number to convert
	* @returns {number}
	* 	The number in radians
	*/
	toRadians(number) {
		return number * Math.PI / 180;
	}
	/**
	* Converts a number to degrees
	* @param {number} number
	* 	The number to convert
	* @returns {number}
	* 	The number in degrees
	*/
	toDegrees(number) {
		return number * 180 / Math.PI;
	}
	/**
	* Creates a new point that is `distance` away from this point, with an angle of `α` degrees.
	* The mathematics behind this function are taken from https://stackoverflow.com/questions/2637023/how-to-calculate-the-latlng-of-a-point-a-certain-distance-away-from-another.
	* @param {number} α
	* 	The angle at which the new point should be created. The angles are measured clockwise with an angle of `0` meaning "north" and an angle of `π` meaning "south".
	* @param {number} distance
	* 	The distance in meters where the new point will be created
	* @return {Point}
	* 	A point that is `distance` away with an angle of `α`
	*/
	shift(α, distance) {
		const φ = distance / EARTH_RADIUS;
		const { sin, cos, asin, atan2 } = Math;
		const lat1 = this.toRadians(this.latitude);
		const lon1 = this.toRadians(this.longitude);
		const lat2 = asin(sin(lat1) * cos(φ) + cos(lat1) * sin(φ) * cos(α));
		const lon2 = lon1 + atan2(sin(α) * sin(φ) * cos(lat1), cos(φ) - sin(lat1) * sin(lat2));
		if (isNaN(lat2) || isNaN(lon2)) {
			return null;
		}
		return new Point({
			latitude: this.toDegrees(lat2),
			longitude: this.toDegrees(lon2)
		});
	}
	/**
	* Computes the "great circle" distance based on the Haversine formula
	* @param {Point} point
	* 	The point to measure the distance to
	* @return {number}
	* 	The distance between this point and `point` in meters
	*/
	measureDistance(point) {
		const { sin, cos, sqrt, atan2 } = Math;
		const Δlat = this.toRadians(point.latitude - this.latitude);
		const Δlon = this.toRadians(point.longitude - this.longitude);
		const a = sin(Δlat / 2) * sin(Δlat / 2) + cos(this.toRadians(this.latitude)) * cos(this.toRadians(point.latitude)) * sin(Δlon / 2) * sin(Δlon / 2);
		const c = 2 * atan2(sqrt(a), sqrt(1 - a));
		const d = EARTH_RADIUS * c;
		return d;
	}
	/**
	* Determines if a location is already known (i.e. cached in the database).
	* This is done by constructing a regular n-gon around this point, and performing a containment check for each vertex.
	* In this containment check, if every vertex can be found in an already known circle (we call this a `flag association`), then the n-gon is assumed to be contained in an already known flag association.
	* @param {number} radius
	* 	The radius of the circle that will be approximated by the n-gon
	* @return {Promise}
	* 	A promise that resolves to a list of OSM element IDs if the location is known and null if the location is unknown
	*/
	async checkLocation(radius) {
		const pois = await checkPoint({
			db: this.db,
			latitude: this.latitude,
			longitude: this.longitude,
			radius
		});
		if (pois) {
			/* Exact point already in database */
			return pois;
		}
		/* Retrieve stored data around this point */
		const centers = await searchAround({
			db: this.db,
			latitude: this.latitude,
			longitude: this.longitude
		});
		/* Create a map that maps a point to its radius */
		const map = new Map();
		for (const center of centers) {
			map.set(new Point({
				latitude: center.latitude,
				longitude: center.longitude
			}), center.radius);
		}
		/* Check containment */
		const vertices = 20;
		for (let i = 0; i < vertices; ++i) {
			/* Approximate the POI radius around this point with an n-gon */
			const angle = (i / vertices) * (2 * Math.PI);
			const vertex = this.shift(angle, radius);
			/* Check if the n-gon corner is contained in a known circle from the database */
			let isContained = false;
			for (const [center, radius] of map) {
				if (center.measureDistance(vertex) <= radius) {
					isContained = true;
					break;
				}
			}
			if (!isContained) {
				/* The vertex wasn't contained in any circle */
				return null;
			}
		}
		/* All points are contained in some circle's POI radius */
		const uniquePOIs = new Map();
		const centerPOIs = centers.map(center => POI.parseArray(center.pois)).reduce((a, b) => a.concat(b));
		for (const poi of centerPOIs) {
			uniquePOIs.set(poi.id, poi);
		}
		return Array.from(uniquePOIs.values());
	}
	/**
	* Queries an Overpass server for nearby POI seeds. On a successful query, the results will be stored in our database.
	* @param {Array.<string>} [amenities=[]]
	* 	A list of amenities to filter for
	* @param {number} radius
	* 	The radius around the point, in kilometers, to limit the query to
	* @return {Promise<object, Error>}
	* 	An promise that resolves to the nodes, lines and polygons with their corresponding descriptions from OSM if successful
	*/
	async generatePOIs(amenities, radius) {
		const disjunction = amenities.map(x => `(${x})`).join("|");
		const collection = await execute(`
			node(around:${radius}, ${this.latitude}, ${this.longitude})["amenity"~"${disjunction}"];
			out center;
			way(around:${radius}, ${this.latitude}, ${this.longitude})["amenity"~"${disjunction}"];
			out center;
			area(around:${radius}, ${this.latitude}, ${this.longitude})["amenity"~"${disjunction}"];
			out center;
		`);
		const cleanCollection = collection.elements.filter(element => element.tags.name);
		const pois = cleanCollection.map(element => new POI(element.id, element.type, element));
		/* Cache the results in the database */
		await addPoint({
			db: this.db,
			latitude: this.latitude,
			longitude: this.longitude,
			radius,
			pois
		});
		/* Some of the POIs might already be in the database; if so, they might have an owner. Fetch! */
		return await retrievePOIs({
			db: this.db,
			pois
		});
	}
	/**
	* Checks whether or not the a list of POIs is contained around a radius
	* @param {Array.<object>} pois
	* 	An array of POIs whose containment to check
	* @param {number} radius
	* 	The radius of containment
	* @return {Array.<object>}
	* 	A filtered array of POIs that are contained within a radius of `radius`
	*/
	checkContainment(pois, radius) {
		/* Only the inner POIs will be contained in the player's POI radius */
		const contained = pois.map(poi => poi.metadata).filter(metadata => {
			let point = null;
			switch (metadata.type) {
				default:
				case "node": {
					point = new Point({
						latitude: metadata.lat,
						longitude: metadata.lon
					});
					break;
				}
				case "way": {
					point = new Point({
						latitude: metadata.center.lat,
						longitude: metadata.center.lon
					});
					break;
				}
				case "area": {
					/* TODO: Where to map areas? */
					point = new Point({
						latitude: metadata.center.lat,
						longitude: metadata.center.lon
					});
				}
			}
			return point.measureDistance(this) <= radius;
		});
		return pois.filter(poi => contained.includes(poi.metadata));
	}
	/**
	* Queries an Overpass server for nearby POI seeds
	* @param {Array.<string>} [amenities=[]]
	* 	A list of amenities to filter for
	* @param {number} radius
	* 	The radius around the point, in kilometers, to limit the query to
	* @return {Promise<object, Error>}
	* 	An promise that resolves to the nodes, lines and polygons with their corresponding descriptions from OSM if successful
	*/
	async closest(amenities = [], radius) {
		try {
			const locationPOIs = await this.checkLocation(radius);
			if (locationPOIs) {
				const pois = await retrievePOIs({
					db: this.db,
					pois: locationPOIs
				});
				return this.checkContainment(pois, radius);
			}
			else {
				log("Found new location.");
				/* Overpass's `around` filter doesn't respect `out center` coordinates; check containment */
				const pois = await this.generatePOIs(amenities, radius);
				return this.checkContainment(pois, radius);
			}
		}
		catch (e) {
			throw new Error(e);
		}
	}
}