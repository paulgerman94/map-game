import dispatcher from "../Dispatcher";
/**
* A symbol that denotes that the browser registers that the location permission has been granted
*/
export const LOCATION_GRANTED = Symbol("Location granted");
/**
* A symbol that denotes that the browser tries to request the user's GeoLocation
*/
export const LOCATION_REQUESTED = Symbol("Location requested");
/**
* A symbol that denotes that the browser tries to ask the user to unblock GeoLocation
*/
export const LOCATION_SETUP_REQUESTED = Symbol("Location setup requested");
/**
* This action fires an event if the user's location is located.
*/
export function signalLocationGranted() {
	dispatcher.dispatch({
		type: LOCATION_GRANTED
	});
}
/**
* This action fires an event if the user's location is requested.
*/
export function signalLocationRequested() {
	dispatcher.dispatch({
		type: LOCATION_REQUESTED
	});
}
/**
* This action fires an event if unblocking the user's location is requested.
*/
export function signalLocationSetupRequested() {
	dispatcher.dispatch({
		type: LOCATION_SETUP_REQUESTED
	});
}