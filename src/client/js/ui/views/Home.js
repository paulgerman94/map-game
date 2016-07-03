import React from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import {
	default as ConnectionStore,
	LOGIN,
	LOGOUT
} from "../stores/ConnectionStore";
/**
* The URL route where this view should be available
*/
export const ROUTE = "/";
/**
* This component contains the home view that the user should see when entering the app.
* It should a simple login/registration menu if the user isn't logged in.
* Otherwise, it should display the general game UI.
*/
export default class Home extends React.Component {
	/**
	* Instantiates a new {@link Home} component
	*/
	constructor() {
		super();
		this.update = ::this.update;
	}
	/**
	* Triggers the renderer to update
	*/
	update() {
		this.setState({});
	}
	/**
	* Fires before a React component mounts and asynchronously tries to login with the session token, if there is one.
	* If the login is successful, the state will be set such that the dashboard is displayed.
	* If the login fails, the state will be set such that the login menu is displayed.
	* Additionally, it will set up all the listeners for the flux store.
	*/
	async componentWillMount() {
		/* If the user logs in via the sub-view <Login>, change the state to transfer him to his <Dashboard> */
		ConnectionStore.on(LOGIN, this.update);
		ConnectionStore.on(LOGOUT, this.update);
	}
	/**
	* Fires before a React component unmounts and unregisters all event listeners so that no memory is leaked
	*/
	async componentWillUnmount() {
		/* Unregister event listeners */
		ConnectionStore.off(LOGIN, this.update);
		ConnectionStore.off(LOGOUT, this.update);
	}
	/**
	* Renders a component with a simple login menu
	* @return {ReactElement}
	* 	The React component
	*/
	render() {
		if (ConnectionStore.isLoggedIn) {
			return <Dashboard/>;
		}
		else {
			return <Login/>;
		}
	}
}