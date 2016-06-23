import React from "react";
import { Toggle } from "material-ui";
import {
	default as SettingsStore,
	CAMERA_FOLLOW_CONFIGURED,
	NOTIFICATION_CONFIGURED,
	NOTIFICATION_REQUESTED
} from "../stores/SettingsStore";
import { publish } from "../Dispatcher";
export const ROUTE = "settings";
/**
* This component contains the home view that the user should see when entering the app.
* It should a simple login/registration menu if the user isn't logged in.
* Otherwise, it should display the general game UI.
*/
export default class Login extends React.Component {
	/**
	* Creates a new {@link Login} component
	*/
	constructor() {
		super();
		this.copySettings = ::this.copySettings;
	}
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
	* Enables or disables the notification state
	* @param {SyntheticEvent} e
	* 	A `material-ui` event
	* @param {boolean} isNotificationAllowed
	* 	Whether or not push notifications should be displayed
	*/
	async toggleNotificationsAllowed(e, isNotificationAllowed) {
		if (isNotificationAllowed) {
			const notificationPermission = await navigator.permissions.query({
				name: "notifications"
			});
			if (notificationPermission.state === "granted") {
				/* Just toggle it */
				publish(NOTIFICATION_CONFIGURED, {
					isNotificationAllowed
				});
			}
			else {
				/* Make sure that we can toggle it, then do it */
				publish(NOTIFICATION_REQUESTED);
			}
		}
		else {
			/* Just toggle it */
			publish(NOTIFICATION_CONFIGURED, {
				isNotificationAllowed
			});
		}
	}
	/**
	* Applies all settings from the SettingsStore
	*/
	copySettings() {
		this.setState({});
	}
	/**
	* Sets up all event listeners
	*/
	componentWillMount() {
		SettingsStore.on(NOTIFICATION_CONFIGURED, this.copySettings);
	}
	/**
	* Removes all event listeners
	*/
	componentWillUnmount() {
		SettingsStore.off(NOTIFICATION_CONFIGURED, this.copySettings);
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
						<Toggle label="Make camera follow me" defaultToggled={SettingsStore.isCameraFollowing} style={styles.toggle} onToggle={::this.toggleCameraFollow}/>
					</div>
					<div style={styles.block}>
						<Toggle label="Show push notifications" toggled={SettingsStore.isNotificationAllowed} style={styles.toggle} onToggle={::this.toggleNotificationsAllowed}/>
					</div>
				</div>
			</div>
		);
	}
}