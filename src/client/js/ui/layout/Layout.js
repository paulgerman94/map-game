import { default as React, Component } from "react";
import { AppBar, Drawer, Dialog, MenuItem, IconButton, RaisedButton } from "material-ui";
import ExitIcon from "material-ui/svg-icons/action/exit-to-app";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import FeedIcon from "material-ui/svg-icons/communication/rss-feed";
import MessagesIcon from "material-ui/svg-icons/communication/email";
import FriendsIcon from "material-ui/svg-icons/social/group";
import ChatIcon from "material-ui/svg-icons/communication/chat";
import ShopIcon from "material-ui/svg-icons/action/shopping-cart";
import HelpCenterIcon from "material-ui/svg-icons/action/help";
import SettingsIcon from "material-ui/svg-icons/action/settings";
import { browserHistory } from "react-router";
import { PROJECT_NAME } from "../constants";
import SplashScreen from "client/ui/SplashScreen";
import injectTapEventPlugin from "react-tap-event-plugin";
import { ROUTE as HOME_ROUTE } from "../views/Home";
import { ROUTE as SETTINGS_ROUTE } from "../views/Settings";
import {
	default as LayoutStore,
	MENU_TOGGLED
} from "../stores/LayoutStore";
import {
	default as ConnectionStore,
	CONNECTION_DISRUPTED,
	CONNECTION_ESTABLISHED,
	LOGIN,
	LOGOUT,
	SCORE_UPDATED
} from "../stores/ConnectionStore";
// import SettingsStore from "../stores/SettingsStore";
import * as API from "client/api/index";
import { s } from "server/units";
import { publish } from "../Dispatcher";
import {
	default as PermissionStore,
	NOTIFICATIONS,
	LOCATION,
	PERMISSION_CHANGED,
	PREFERENCE_CHANGED,
	PERMISSION_REQUESTED,
	PERMISSION_SETUP_REQUESTED,
	GRANTED,
	DENIED,
	PROMPT,
	ENABLED,
	DISABLED
} from "../stores/PermissionStore";
import client from "client/client";
injectTapEventPlugin();
/**
* This React component is used to use a common Layout across the whole page.
* The layout can be thought of a container that contains other components, but additionally also displays the menu or the navigation bar.
*/
export default class Layout extends Component {
	/**
	* An object that associates every React property to a type
	* @type {object}
	*/
	static propTypes = {
		children: React.PropTypes.node
	};
	/**
	* Creates a new {@link Layout} instance
	*/
	constructor() {
		super();
		/**
		* @type {Object}
		* @property {Array.<object>} state.users
		* 	An array of users
		* @property {boolean} isMenuVisible
		* 	Whether or not the menu is visible right now
		*/
		this.state = {
			isMenuVisible: LayoutStore.isMenuVisible,
			isLoggedIn: false,
			isLocationRequested: false,
			isLocationSetupRequested: false,
			isNotificationRequested: false
		};
	}
	/**
	* Runs when the user presses the `Accept` button when asked whether he'd like to share his location and either logs the user out or fires a success, depending on what the user decides to do.
	*/
	async acceptLocation() {
		const permission = await PermissionStore.requestPermission(LOCATION);
		this.setState({
			isLocationRequested: false
		});
		switch (permission) {
			case DENIED: {
				PermissionStore.requestSetup(LOCATION);
				API.logout();
				break;
			}
			default: {
				break;
			}
		}
	}
	/**
	* Runs when the user presses the `Cancel` button when asked whether he'd like to share his location and logs the user out.
	*/
	cancelLocation() {
		this.setState({
			isLocationRequested: false,
			isLocationSetupRequested: false
		});
		API.logout();
	}
	/**
	* Enables push notifications for the user on the server, assuming that the permission was granted
	*/
	async enablePushNotifications() {
		/* Send the new notification ID to the server */
		const registration = ConnectionStore.serviceWorkerRegistration;
		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true
		});
		API.updateSubscription(subscription);
	}
	/**
	* Disables push notifications for the user on the server
	*/
	async disablePushNotifications() {
		API.removeSubscription();
	}
	/**
	* Accepts a notification dialog by configuring the settings to whatever the user chooses
	*/
	async acceptNotification() {
		const notifications = PermissionStore.get(NOTIFICATIONS);
		switch (notifications.permission) {
			case GRANTED: {
				this.enablePushNotifications();
				this.setState({
					isNotificationRequested: false
				});
				break;
			}
			case PROMPT: {
				await PermissionStore.requestPermission(NOTIFICATIONS);
				this.acceptNotification();
				break;
			}
			case DENIED: {
				this.setState({
					isNotificationRequested: false
				});
				/* Show a warning? */
				break;
			}
			default: {
				/* Make the user decide again */
				this.setState({
					isNotificationRequested: true
				});
				break;
			}
		}
	}
	/**
	* Denies notifications by caching this decision and disabling the dialog
	*/
	denyNotificiation() {
		this.setState({
			isNotificationRequested: false
		});
	}
	/**
	* Fires before a React component mounts and sets up event listeners for the store.
	* Whenever the store changes, this component will update its state.
	*/
	async componentWillMount() {
		await PermissionStore.initialize();
		try {
			/* The first rendering of the page should also try to establish a WebSocket connection */
			await client.open();
		}
		catch (e) {
			/* At least show the user the screen now */
			SplashScreen.hide();
		}
		ConnectionStore.on(LOGIN, async () => {
			this.setState({
				isLoggedIn: ConnectionStore.isLoggedIn
			});
			window.document.title = `Map game | ${ConnectionStore.user.accountName}`;
			/* Request a Telegram token so we can link accounts */
			API.getTelegramToken();
		});
		ConnectionStore.on(LOGOUT, () => {
			this.setState({
				isLoggedIn: ConnectionStore.isLoggedIn
			});
		});
		LayoutStore.on(MENU_TOGGLED, () => {
			this.setState({
				isMenuVisible: LayoutStore.isMenuVisible
			});
		});
		PermissionStore.on(PERMISSION_REQUESTED, request => {
			switch (request.type) {
				case NOTIFICATIONS: {
					this.setState({
						isNotificationRequested: true
					});
					break;
				}
				case LOCATION: {
					this.setState({
						isLocationRequested: true
					});
					break;
				}
				default: {
					break;
				}
			}
		});
		PermissionStore.on(PERMISSION_SETUP_REQUESTED, request => {
			switch (request.type) {
				case LOCATION: {
					this.setState({
						isLocationSetupRequested: true
					});
					break;
				}
				default: {
					break;
				}
			}
		});
		PermissionStore.on(PERMISSION_CHANGED, change => {
			switch (change.type) {
				case NOTIFICATIONS: {
					switch (change.permission) {
						case GRANTED: {
							::this.acceptNotification();
							break;
						}
						default: {
							break;
						}
					}
					break;
				}
				default: {
					break;
				}
			}
		});
		PermissionStore.on(PREFERENCE_CHANGED, change => {
			switch (change.type) {
				case NOTIFICATIONS: {
					switch (change.permission) {
						case ENABLED: {
							this.enablePushNotifications();
							break;
						}
						case DISABLED: {
							this.disablePushNotifications();
							break;
						}
						default: {
							break;
						}
					}
					break;
				}
				default: {
					break;
				}
			}
		});
		ConnectionStore.on(SCORE_UPDATED, ::this.updateScore);
		setInterval(::this.checkConnection, s);
	}
	/**
	* Checks if the connection to the server is still up.
	* If not, a {@link CONNECTION_DISRUPTED} event is fired.
	* If it is, a {@link CONNECTION_ESTABLISHED} event is fired.
	*/
	checkConnection() {
		if (!API.isConnectionOpen()) {
			publish(CONNECTION_DISRUPTED);
		}
		else {
			publish(CONNECTION_ESTABLISHED);
		}
	}
	/**
	* If the menu is invisible, this function will make it visible.
	* If the menu is visible, this function will make it invisible.
	*/
	toggleMenu() {
		publish(MENU_TOGGLED);
	}
	/**
	* Updates the score
	* @param {number} score
	* 	The old flag to update
	*/
	updateScore(){
		this.forceUpdate();
	}
	/**
	* Renders a {@link Layout} component with a menu, the navigation bar and all components that this component contains.
	* @return {ReactComponent}
	* 	The component that will be displayed
	*/
	render() {
		let logoutButton;
		let scoreDisplay;
		if (this.state.isLoggedIn || API.isLoggedIn()) {
			logoutButton =
			<IconButton onClick={() => {
				API.logout();
				browserHistory.push(HOME_ROUTE);
			}} tooltip="Logout">
				<ExitIcon/>
			</IconButton>;
			if (ConnectionStore.user !== null){
				scoreDisplay = <span style={ {
					color: "whitesmoke",
					fontSize: "1.5rem",
					fontWeight: "bold",
					verticalAlign: "text-bottom"
				} }>Score: {ConnectionStore.user.score}</span>;
			}
		}
		return (
			<div>
				<Dialog title="Location needed" modal={true} open={this.state.isLocationRequested} actions={
					<div>
						<RaisedButton label="Cancel" onClick={::this.cancelLocation}/>
						<RaisedButton label="Accept" primary onClick={::this.acceptLocation}/>
					</div>
				}>
					In order to play, you must share your location with {PROJECT_NAME}.
				</Dialog>
				<Dialog title="Location setup needed" modal={true} open={this.state.isLocationSetupRequested} actions={
					<div>
						<RaisedButton label="OK" onClick={::this.cancelLocation}/>
					</div>
				}>
					Sorry, but it seems as if you can't play {PROJECT_NAME}. Please unblock your GeoLocation permission for {PROJECT_NAME} if you want to play.
				</Dialog>
				<Dialog title="Display notifications" modal={true} open={this.state.isNotificationRequested} actions={
					<div>
						<RaisedButton label="No" onClick={::this.denyNotificiation}/>
						<RaisedButton label="Yes" primary onClick={::this.acceptNotification}/>
					</div>
				}>
					Would you like to receive notifications from {PROJECT_NAME}?
				</Dialog>
				<AppBar title={<span style={{
					cursor: "pointer"
				}}>{PROJECT_NAME}</span>} onTitleTouchTap={() => {
					browserHistory.push(HOME_ROUTE);
				}} iconElementRight={
					<div>
						{scoreDisplay}
						<IconButton tooltip="Settings" onClick={() => {
							browserHistory.push(SETTINGS_ROUTE);
						}}>
							<SettingsIcon/>
						</IconButton>
						{logoutButton}
					</div>
				}
				iconElementLeft={
					<div>
						<IconButton onClick={this.toggleMenu}>
							<NavigationMenu/>
						</IconButton>
					</div>
				}
				/>
				<Drawer docked={false} width={300} open={this.state.isMenuVisible} onRequestChange={::this.toggleMenu}>
					<MenuItem onClick={::this.toggleMenu} leftIcon={<FeedIcon/>} primaryText="Feed"/>
					<MenuItem onClick={::this.toggleMenu} leftIcon={<ChatIcon/>} primaryText="Chat"/>
					<MenuItem onClick={::this.toggleMenu} leftIcon={<MessagesIcon/>} primaryText="Messages"/>
					<MenuItem onClick={::this.toggleMenu} leftIcon={<FriendsIcon/>} primaryText="Friends"/>
					<MenuItem onClick={::this.toggleMenu} leftIcon={<ShopIcon/>} primaryText="Shop"/>
					<MenuItem onClick={::this.toggleMenu} leftIcon={<HelpCenterIcon/>} primaryText="Help center"/>
				</Drawer>
				<main>
					{this.props.children}
				</main>
			</div>
		);
	}
}
