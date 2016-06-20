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
import injectTapEventPlugin from "react-tap-event-plugin";
import {
	default as LayoutStore,
	MENU_TOGGLED
} from "../stores/LayoutStore";
import {
	default as LocationStore,
	LOCATION_GRANTED,
	LOCATION_REQUESTED,
	LOCATION_SETUP_REQUESTED
} from "../stores/LocationStore";
import {
	default as ConnectionStore,
	CONNECTION_DISRUPTED,
	CONNECTION_ESTABLISHED,
	LOGIN,
	LOGOUT
} from "../stores/ConnectionStore";
import * as API from "client/api/index";
import { s } from "server/units";
import { publish } from "../Dispatcher";
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
			isLocationSetupRequested: false
		};
	}
	/**
	* Runs when the user presses the `Accept` button when asked whether he'd like to share his location and either logs the user out or fires a success, depending on what the user decides to do.
	*/
	acceptLocation() {
		navigator.geolocation.getCurrentPosition(() => {
			this.setState({
				isLocationRequested: false
			});
			publish(LOCATION_GRANTED);
		}, () => {
			this.setState({
				isLocationRequested: false
			});
			API.logout();
		});
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
	* Fires before a React component mounts and sets up event listeners for the store.
	* Whenever the store changes, this component will update its state.
	*/
	componentWillMount() {
		ConnectionStore.on(LOGIN, () => {
			this.setState({
				isLoggedIn: ConnectionStore.isLoggedIn
			});
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
		LocationStore.on(LOCATION_REQUESTED, () => {
			this.setState({
				isLocationRequested: true
			});
		});
		LocationStore.on(LOCATION_SETUP_REQUESTED, () => {
			this.setState({
				isLocationSetupRequested: true
			});
		});
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
	* Renders a {@link Layout} component with a menu, the navigation bar and all components that this component contains.
	* @return {ReactComponent}
	* 	The component that will be displayed
	*/
	render() {
		let logoutButton;
		if (this.state.isLoggedIn || API.isLoggedIn()) {
			logoutButton =
			<IconButton onClick={API.logout} tooltip="Logout">
				<ExitIcon/>
			</IconButton>;
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
						<RaisedButton label="Exit" onClick={::this.cancelLocation}/>
					</div>
				}>
					Sorry, but it seems as if you can't play {PROJECT_NAME}. Please unblock your GeoLocation permission for {PROJECT_NAME} if you want to play.
				</Dialog>
				<AppBar title={PROJECT_NAME} style={{
					cursor: "pointer"
				}} onTitleTouchTap={() => {
					browserHistory.push("/");
				}} iconElementRight={
					<div>
						<IconButton tooltip="Settings" onClick={() => {
							browserHistory.push("/settings");
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