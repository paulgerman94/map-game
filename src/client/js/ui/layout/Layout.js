import { default as React, Component } from "react";
import { Link } from "react-router";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon, AppBar, Drawer, AutoComplete, MenuItem, IconButton } from "material-ui";
import NavigationClose from "material-ui/svg-icons/navigation/close";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import FeedIcon from "material-ui/svg-icons/communication/rss-feed";
import MessagesIcon from "material-ui/svg-icons/communication/email";
import FriendsIcon from "material-ui/svg-icons/social/group";
import ChatIcon from "material-ui/svg-icons/communication/chat";
import ShopIcon from "material-ui/svg-icons/action/shopping-cart";
import HelpCenterIcon from "material-ui/svg-icons/action/help";
import SettingsIcon from "material-ui/svg-icons/action/settings";
import NotificationsIcon from "material-ui/svg-icons/social/notifications";
import SomeStore from "../stores/SomeStore";
import { browserHistory } from "react-router";
import { PROJECT_NAME } from "../constants";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();
import * as actions from "../NavBarActions";
export default class Layout extends Component {
	constructor() {
		super();
		this.state = {
			users: SomeStore.users,
			isMenuVisible: SomeStore.isMenuVisible
		};
	}
	componentWillMount() {
		SomeStore.on("change", () => {
			this.setState({
				users: SomeStore.users
			});
		});
		SomeStore.on("menuToggled", () => {
			this.setState({
				isMenuVisible: SomeStore.isMenuVisible
			});
		});
	}
	toggleMenu() {
		actions.toggleMenu();
	}
	render() {
		return (
			<div>
				<AppBar title={PROJECT_NAME} onTitleTouchTap={() => {
					browserHistory.push("/");
				}} iconElementRight={
					<div>
						{/*<AutoComplete hintText="text-value data" filter={AutoComplete.noFilter} dataSource={this.state.users}/>
						<IconButton tooltip="Notifications">
							<NotificationsIcon/>
						</IconButton>*/}
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
};