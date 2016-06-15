import dispatcher from "../Dispatcher";
import EventEmitter from "crystal-event-emitter";
import { MENU_TOGGLED } from "../actions/LayoutActions";
export { MENU_TOGGLED } from "../actions/LayoutActions";
/**
* This class is a flux store that keeps a global view of the layout state.
*/
class LayoutStore extends EventEmitter {
	/**
	* @type {boolean}
	* 	Whether or not the menu is visible
	*/
	isMenuVisible = false;
	/**
	* Handles a flux action and manipulates the store depending on the action
	* @param {string} action
	* 	The name of the action that the store should invoke
	*/
	handleActions(action) {
		switch (action.type) {
			case MENU_TOGGLED:
				this.isMenuVisible = !this.isMenuVisible;
				this.emit(action.type, this.isMenuVisible);
				break;
			default:
				break;
		}
	}
}
const layoutStore = new LayoutStore();
dispatcher.register(::layoutStore.handleActions);
export default layoutStore;