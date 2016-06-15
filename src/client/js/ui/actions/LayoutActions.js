import dispatcher from "../Dispatcher";
/**
* A symbol that denotes that the menu was toggled
*/
export const MENU_TOGGLED = Symbol("Menu toggled");
/**
* This action fires an event when the menu is toggled.
*/
export function signalMenuToggled() {
	dispatcher.dispatch({
		type: MENU_TOGGLED
	});
}