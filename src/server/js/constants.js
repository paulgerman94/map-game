import { km } from "./units";
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
* How many points to add when capturing a flag
* @type {number}
*/
export const CAPTURE_FLAG_POINTS = 100;
