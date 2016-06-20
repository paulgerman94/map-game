import React from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import * as API from "client/api/index";
import {
	default as ConnectionStore,
	LOGIN,
	LOGOUT
} from "../stores/ConnectionStore";
/**
* This component contains the home view that the user should see when entering the app.
* It should a simple login/registration menu if the user isn't logged in.
* Otherwise, it should display the general game UI.
*/
export default class Home extends React.Component {
	state = {
		isLoginDataAvailable: false,
		isLoggedIn: false
	};
	constructor() {
		super();
		this.showDashboard = ::this.showDashboard;
		this.showLogin = ::this.showLogin;
	}
	/**
	* Updates the state of this component such that only the state is displayed that users should see when they're logged out
	*/
	showLogin() {
		this.setState({
			isLoggedIn: false,
			isLoginDataAvailable: true
		});
	}
	/**
	* Updates the state of this component such that only the state is displayed that users should see when they're logged in
	*/
	showDashboard() {
		this.setState({
			isLoggedIn: true,
			isLoginDataAvailable: true
		});
	}
	/**
	* Fires before a React component mounts and asynchronously tries to login with the session token, if there is one.
	* If the login is successful, the state will be set such that the dashboard is displayed.
	* If the login fails, the state will be set such that the login menu is displayed.
	* Additionally, it will set up all the listeners for the flux store.
	*/
	async componentWillMount() {
		/* If the user logs in via the sub-view <Login>, change the state to transfer him to his <Dashboard> */
		ConnectionStore.on(LOGIN, this.showDashboard);
		/* If the user logs out, change the state to transfer him to his <Login> view again */
		ConnectionStore.on(LOGOUT, this.showLogin);
		try {
			/* If we can log in by just using the session token, we can show the dashboard */
			await API.login();
			this.showDashboard();
		}
		catch (e) {
			/* If not, we'll have to render the login/register screen */
			this.showLogin();
		}
	}
	/**
	* Fires before a React component unmounts and unregisters all event listeners so that no memory is leaked
	*/
	async componentWillUnmount() {
		/* Unregister event listeners */
		ConnectionStore.off(LOGIN, this.showDashboard);
		ConnectionStore.off(LOGOUT, this.showLogin);
	}
	/**
	* Renders a component with a simple login menu
	* @return {ReactElement}
	* 	The React component
	*/
	render() {
		if (!this.state.isLoginDataAvailable) {
			/* Return a spinner? */
			return <p></p>;
		}
		else {
			return this.state.isLoggedIn ? <Dashboard/> : <Login/>;
		}
	}
}