import {
	km
} from "./units";
/**
 * The radius around which users are able to retrieve Points of Interest (POIs)
 * @type {number}
 */
export const POI_RADIUS = 0.8 * km;
/**
 * The Earth's radius
 * @type {number}
 */
export const EARTH_RADIUS = 6371 * km;
/**
 * This string denotes the time that a player that captures a flag will own a flag before anyone else can capture it.
 * Note that internally, this is a SQL `interval` type , which is why it this type should not use a `number` type.
 * @type {string}
 */
export const OWNERSHIP_PROTECTION_TIME = "24 h";
/**
 * The amount of points to add when capturing a flag
 * @type {number}
 */
export const CAPTURE_FLAG_POINTS = 100;
/**
 * The minimum distance between 2 POIs
 * @type {number}
 */
export const POI_MIN_DISTANCE = 100;
/**
 * http://wiki.openstreetmap.org/wiki/Key:amenity
 */
export const amenities = [{
	typeName: "school",
	typeIcon: "university",
	list: [
		"music_school",
		"dancing_school",
		"driving_school",
		"language_school",
		"school",
		"university"
	]
}, {
	typeName: "food / drinks",
	typeIcon: "cutlery",
	list: [
		"restaurant",
		"bar",
		"fast_food",
		"food_court",
		"pub",
		"cafe",
		"drinking_water"
	]
}, {
	typeName: "culture / entertaining",
	typeIcon: "map-o",
	list: [
		"library",
		"arts_centre",
		"cinema",
		"community_centre",
		"planetarium",
		"theatre",
		"courthouse",
		"embassy",
		"fire_station",
		"gym",
		"marketplace",
		"police",
		"post_office",
		"prison",
		"townhall"
	]
}, {
	typeName: "Place of worship",
	typeIcon: "institution",
	list: [
		"place_of_worship"
	]
}];
/**
 * List of amenties in order of importance.
 * If a amenty is not is the list it will be cosidered with the least priority
 */
export const amenitiesOrder = [
	"school",
	"university",
	"restaurant"
];
