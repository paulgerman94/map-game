import dispatcher from "../Dispatcher";
/**
* A symbol that denotes that the browser tries to request the user's GeoLocation
*/
export const REQUEST_LOCATION = Symbol("Request location");
/**
* A symbol that denotes that the browser tries to ask the user to unblock GeoLocation
*/
export const REQUEST_LOCATION_SETUP = Symbol("Request location setup");
/**
* This action fires an event if the user's location is requested.
*/
export function requestLocation() {
	dispatcher.dispatch({
		type: REQUEST_LOCATION
	});
}
/**
* This action fires an event if unblocking the user's location is requested.
*/
export function requestLocationSetup() {
	dispatcher.dispatch({
		type: REQUEST_LOCATION_SETUP
	});
}