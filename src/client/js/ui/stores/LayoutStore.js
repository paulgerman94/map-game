import dispatcher from "../Dispatcher";
import EventEmitter from "crystal-event-emitter";
/**
* A symbol that denotes that the menu was toggled
* @type {symbol}
*/
export const MENU_TOGGLED = Symbol("Menu toggled");
/**
* This class is a flux store that keeps a global view of the layout state.
*/
class LayoutStore extends EventEmitter {
	/**
	* Instantiates a new {@link LayoutStore}
	*/
	constructor() {
		super();
		/**
		* Whether or not the menu is visible
		* @type {boolean}
		*/
		this.isMenuVisible = false;
	}
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
/**
* The {@link LayoutStore} singleton instance
*/
export default layoutStore;