import dispatcher from "../Dispatcher";
import { EventEmitter } from "crystal-event-emitter";
import { GRANT_LOCATION } from "../actions/GPSActions";
export { GRANT_LOCATION } from "../actions/GPSActions";
/**
* This class is a flux store that keeps a global view of the user identification state.
* It encompasses information about when the user registers, logs in, etc.
*/
class DashboardStore extends EventEmitter {
	/**
	* Fired when the browser registers that it has permission to request the user's location
	*/
	grantLocation() {
		this.emit(GRANT_LOCATION);
	}
	/**
	* Handles a flux action and manipulates the store depending on the action
	* @param {string} action
	* 	The name of the action that the store should invoke
	*/
	handleActions(action) {
		switch (action.type) {
			case GRANT_LOCATION:
				this.grantLocation();
				break;
			default:
				break;
		}
	}
}
const dashboardStore = new DashboardStore();
dispatcher.register(::dashboardStore.handleActions);
export default dashboardStore;