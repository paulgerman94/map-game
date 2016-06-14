import dispatcher from "../Dispatcher";
/**
* A symbol that denotes that the browser registers that the location permission has been granted
*/
export const GRANT_LOCATION = Symbol("Grant location");
/**
* This action fires an event if the user's location is located.
*/
export function grantLocation() {
	dispatcher.dispatch({
		type: GRANT_LOCATION
	});
}