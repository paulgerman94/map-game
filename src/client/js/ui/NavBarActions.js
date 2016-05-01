import dispatcher from "./Dispatcher";
export function toggleMenu() {
	dispatcher.dispatch({
		type: "TOGGLE_MENU"
	});
}