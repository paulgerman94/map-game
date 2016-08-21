import {
	m,
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
export const OWNERSHIP_PROTECTION_TIME = "10 s";
/**
 * The amount of points to add when capturing a flag
 * @type {number}
 */
export const CAPTURE_FLAG_POINTS = 100;
/**
 * The minimum distance that should lie between two POIs (so that they don't clutter in big cities)
 * @type {number}
 */
export const MINIMUM_POI_DISTANCE = 100 * m;
/**
 * The list of amenities that the game recognizes; check out http://wiki.openstreetmap.org/wiki/Key:amenity for more information.
 */
export const amenities = [{
	typeName: "school",
	typeIcon: "university",
	list: [
		"dancing_school",
		"driving_school",
		"language_school",
		"music_school",
		"school",
		"university"
	]
}, {
	typeName: "foods and drinks",
	typeIcon: "cutlery",
	list: [
		"bar",
		"cafe",
		"drinking_water",
		"fast_food",
		"food_court",
		"pub",
		"restaurant"
	]
}, {
	typeName: "culture and entertainment",
	typeIcon: "map-o",
	list: [
		"arts_centre",
		"cinema",
		"community_centre",
		"courthouse",
		"embassy",
		"fire_station",
		"gym",
		"library",
		"marketplace",
		"planetarium",
		"police",
		"post_office",
		"prison",
		"public_building",
		"theatre",
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
 * This is a list of amenties, ordered from most important to least important.
 * If an amenity is not is the list, it will be have the least priority.
 */
export const prioritizedAmenities = [
	"school",
	"university",
	"restaurant"
];