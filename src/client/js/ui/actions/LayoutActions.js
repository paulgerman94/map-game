import dispatcher from "../Dispatcher";
/**
* A symbol that denotes that the menu was toggled
*/
export const TOGGLE_MENU = Symbol("Toggle menu");
/**
* This action fires an event when the menu is toggled.
*/
export function toggleMenu() {
	dispatcher.dispatch({
		type: TOGGLE_MENU
	});
}