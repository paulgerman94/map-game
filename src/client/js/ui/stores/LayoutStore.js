import dispatcher from "../Dispatcher";
import EventEmitter from "crystal-event-emitter";
import { TOGGLE_MENU } from "../actions/LayoutActions";
import { LOGIN_SUCCESSFUL, LOGOUT_SUCCESSFUL } from "../actions/LoginActions";
export { LOGIN_SUCCESSFUL, LOGOUT_SUCCESSFUL } from "../actions/LoginActions";
export const MENU_TOGGLED = Symbol("Menu toggled");
/**
* This class is a flux store that keeps a global view of the layout state.
*/
class LayoutStore extends EventEmitter {
	/**
	* @type {boolean}
	* 	Whether or not the user is logged in
	*/
	isLoggedIn = false;
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
			case LOGIN_SUCCESSFUL:
				this.isLoggedIn = true;
				this.emit(LOGIN_SUCCESSFUL);
				break;
			case LOGOUT_SUCCESSFUL:
				this.isLoggedIn = false;
				this.emit(LOGOUT_SUCCESSFUL);
				break;
			default:
				break;
		}
	}
}
const layoutStore = new LayoutStore();
dispatcher.register(::layoutStore.handleActions);
export default layoutStore;