import React from "react";
import cache from "client/cache";
import { Toggle } from "material-ui";
import { CAMERA_FOLLOW_CONFIGURED } from "../stores/SettingsStore";
import { publish } from "../Dispatcher";
/**
* This component contains the home view that the user should see when entering the app.
* It should a simple login/registration menu if the user isn't logged in.
* Otherwise, it should display the general game UI.
*/
export default class Login extends React.Component {
	state = {
		isCameraFollowing: cache.load("isCameraFollowing")
	};
	/**
	* Enables or disables the camera follow state
	* @param {SyntheticEvent} e
	* 	A `material-ui` event
	* @param {boolean} isCameraFollowing
	* 	Whether or not the camera should be following the player
	*/
	toggleCameraFollow(e, isCameraFollowing) {
		publish(CAMERA_FOLLOW_CONFIGURED, {
			isCameraFollowing
		});
	}
	/**
	* Renders a component with a simple login menu
	* @return {ReactElement}
	* 	The React component
	*/
	render() {
		const styles = {
			heading: {
				marginTop: "2rem"
			},
			block: {
				maxWidth: 300,
				marginTop: "2rem"
			},
			toggle: {
				marginBottom: 16
			}
		};
		return (
			<div className="row center-xs center-sm center-md center-lg" style={{
				/* This is a flexboxgrid workaround; 6.3.0 is broken */
				margin: 0
			}}>
				<div style={styles.heading} className="col-md-3 col-lg-3">
					<h1>Game settings</h1>
					<div style={styles.block}>
						<Toggle label="Camera follows my location" defaultToggled={this.state.isCameraFollowing} style={styles.toggle} onToggle={::this.toggleCameraFollow}/>
					</div>
				</div>
			</div>
		);
	}
}