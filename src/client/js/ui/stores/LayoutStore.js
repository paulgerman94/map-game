import dispatcher from "../Dispatcher";
import EventEmitter from "crystal-event-emitter";
import { TOGGLE_MENU } from "../actions/LayoutActions";
export const MENU_TOGGLED = Symbol("Menu toggled");
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
	* Toggles the menu visibility
	*/
	toggleMenu() {
		this.isMenuVisible = !this.isMenuVisible;
		this.emit(MENU_TOGGLED, this.isMenuVisible);
	}
	/**
	* Handles a flux action and manipulates the store depending on the action
	* @param {string} action
	* 	The name of the action that the store should invoke
	*/
	handleActions(action) {
		switch (action.type) {
			case TOGGLE_MENU: {
				this.toggleMenu();
				break;
			}
			default:
				break;
		}
	}
}
const layoutStore = new LayoutStore();
dispatcher.register(::layoutStore.handleActions);
export default layoutStore;