/**
 * The name of the project
 */
export const PROJECT_NAME = "map-game";
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
