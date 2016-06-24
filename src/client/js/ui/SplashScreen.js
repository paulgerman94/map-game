import { s } from "server/units";
/**
* This class models the splash screen that is seen while the app loads up.
*/
export default class SplashScreen {
	/**
	* Checks if the splash screen still exists in the DOM, then hides it and deletes it once hidden
	*/
	static hide() {
		const splashScreen = document.querySelector("splash-screen");
		if (splashScreen) {
			splashScreen.setAttribute("invisible", "");
			/* After one second, remove the splash screen from the DOM for easier debugging */
			setTimeout(() => {
				splashScreen.remove();
			}, s);
		}
	}
}