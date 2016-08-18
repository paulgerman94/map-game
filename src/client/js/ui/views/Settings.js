import React from "react";
import { Toggle } from "material-ui";
import { RaisedButton } from "material-ui";
import {
	default as SettingsStore,
	CAMERA_FOLLOW_CONFIGURED
} from "../stores/SettingsStore";
import {
	default as PermissionStore,
	GRANTED,
	NOTIFICATIONS,
	PREFERENCE_CHANGED,
	PERMISSION_CHANGED,
	ENABLED,
	DISABLED
} from "../stores/PermissionStore";
import {
	default as ConnectionStore,
	TELEGRAM_TOKEN_RECEIVED
} from "../stores/ConnectionStore";
import { publish } from "../Dispatcher";
/**
* The URL route where this view should be available
*/
export const ROUTE = "settings";
/**
* This component contains the home view that the user should see when entering the app.
* It should a simple login/registration menu if the user isn't logged in.
* Otherwise, it should display the general game UI.
*/
export default class Login extends React.Component {
	state = {};
	/**
	* Creates a new {@link Login} component
	*/
	constructor() {
		super();
		this.update = ::this.update;
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
			/* The user wants to toggle notifictations to `on` */
			const notifications = PermissionStore.get(NOTIFICATIONS);
			if (notifications.permission === GRANTED) {
				/* We can toggle it without asking him for permission */
				PermissionStore.setPreference(NOTIFICATIONS, ENABLED);
			}
			else {
				/* Dispatch this task to a dedicated dialog */
				PermissionStore.request(NOTIFICATIONS);
			}
		}
		else {
			/* Toggling off is always possible */
			PermissionStore.setPreference(NOTIFICATIONS, DISABLED);
		}
	}
	/**
	* Applies all settings from the SettingsStore and re-renders the component
	*/
	update() {
		this.setState({});
	}
	/**
	* Sets up all event listeners
	*/
	componentWillMount() {
		PermissionStore.on(PREFERENCE_CHANGED, this.update);
		PermissionStore.on(PERMISSION_CHANGED, this.update);
		ConnectionStore.on(TELEGRAM_TOKEN_RECEIVED, this.update);
	}
	/**
	* Removes all event listeners
	*/
	componentWillUnmount() {
		PermissionStore.off(PREFERENCE_CHANGED, this.update);
		PermissionStore.off(PERMISSION_CHANGED, this.update);
		ConnectionStore.off(TELEGRAM_TOKEN_RECEIVED, this.update);
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
						<Toggle label="Show push notifications" toggled={
							PermissionStore.get(NOTIFICATIONS).permission === GRANTED &&
							PermissionStore.get(NOTIFICATIONS).preference === ENABLED} style={styles.toggle} onToggle={::this.toggleNotificationsAllowed}/>
					</div>
					<div hidden={!ConnectionStore.user} style={styles.block}>
						<RaisedButton style={{ margin: "0 auto" }} target="_blank" label="Link account to Telegram" primary disabled={!ConnectionStore.user || ConnectionStore.user && !ConnectionStore.user.telegramToken} href={`https://telegram.me/MapGameBot?start=${ConnectionStore.user && ConnectionStore.user.telegramToken || "#"}`}/>
					</div>
				</div>
			</div>
		);
	}
}