import dispatcher from "../Dispatcher";
/**
* This action fires an event when the menu is toggled.
*/
export function toggleMenu() {
	dispatcher.dispatch({
		type: "TOGGLE_MENU"
	});
}