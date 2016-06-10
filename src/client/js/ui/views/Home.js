import React from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { login } from "client/api/index";
import { default as UserStore, LOGIN_SUCCESSFUL, LOGOUT_SUCCESSFUL } from "../stores/UserStore";
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
	/**
	* Updates the state of this component such that only the state is displayed that users should see when they're logged out
	*/
	logout() {
		this.setState({
			isLoggedIn: false,
			isLoginDataAvailable: true
		});
	}
	/**
	* Updates the state of this component such that only the state is displayed that users should see when they're logged in
	*/
	login() {
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
		/* If the user logs out, change the state to transfer him to his <Login> view again */
		UserStore.on(LOGOUT_SUCCESSFUL, ::this.logout);
		/* If the user logs in via the sub-view <Login>, change the state to transfer him to his <Dashboard> */
		UserStore.on(LOGIN_SUCCESSFUL, ::this.login);
		try {
			/* If we can log in by just using the session token, we can show the dashboard */
			await login();
			this.login();
		}
		catch (e) {
			/* If not, we'll have to render the login/register screen */
			this.logout();
		}
	}
	/**
	* Fires before a React component unmounts and unregisters all event listeners so that no memory is leaked
	*/
	async componentWillUnmount() {
		/* Unregister event listeners */
		UserStore.off(LOGOUT_SUCCESSFUL, ::this.logout);
		UserStore.off(LOGIN_SUCCESSFUL, ::this.login);
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