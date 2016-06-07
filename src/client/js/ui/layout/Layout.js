import { default as React, Component } from "react";
import { AppBar, Drawer, MenuItem, IconButton } from "material-ui";
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
import { default as LayoutStore, MENU_TOGGLED } from "../stores/LayoutStore";
import * as actions from "../actions/LayoutActions";
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
			users: LayoutStore.users,
			isMenuVisible: LayoutStore.isMenuVisible
		};
	}
	/**
	* Fires before a React component mounts and sets up event listeners for the store.
	* Whenever the store changes, this component will update its state.
	*/
	componentWillMount() {
		LayoutStore.on(MENU_TOGGLED, () => {
			this.setState({
				isMenuVisible: LayoutStore.isMenuVisible
			});
		});
	}
	/**
	* If the menu is invisible, this function will make it visible.
	* If the menu is visible, this function will make it invisible.
	*/
	toggleMenu() {
		actions.toggleMenu();
	}
	/**
	* Renders a {@link Layout} component with a menu, the navigation bar and all components that this component contains.
	* @return {ReactComponent}
	* 	The component that will be displayed
	*/
	render() {
		return (
			<div>
				<AppBar title={PROJECT_NAME} style={{
					cursor: "pointer"
				}} onTitleTouchTap={() => {
					browserHistory.push("/");
				}} iconElementRight={
					<div>
						<IconButton tooltip="Settings">
							<SettingsIcon/>
						</IconButton>
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
				<Drawer docked={false} width={300} open={this.state.isMenuVisible} onRequestChange={actions.toggleMenu}>
					<MenuItem onClick={actions.toggleMenu} leftIcon={<FeedIcon/>} primaryText="Feed"/>
					<MenuItem onClick={actions.toggleMenu} leftIcon={<ChatIcon/>} primaryText="Chat"/>
					<MenuItem onClick={actions.toggleMenu} leftIcon={<MessagesIcon/>} primaryText="Messages"/>
					<MenuItem onClick={actions.toggleMenu} leftIcon={<FriendsIcon/>} primaryText="Friends"/>
					<MenuItem onClick={actions.toggleMenu} leftIcon={<ShopIcon/>} primaryText="Shop"/>
					<MenuItem onClick={actions.toggleMenu} leftIcon={<HelpCenterIcon/>} primaryText="Help center"/>
				</Drawer>
				<main style={{
					marginTop: "2rem"
				}}>
					{this.props.children}
				</main>
			</div>
		);
	}
}