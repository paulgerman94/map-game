import React from "react";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import { login } from "client/api/index";
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
	* Fires before a React component mounts and asynchronously tries to login with the session token, if there is one.
	* If the login is successful, the state will be set such that the dashboard is displayed.
	* If the login fails, the state will be set such that the login menu is displayed.
	*/
	async componentWillMount() {
		try {
			/* If we can log in by just using the session token, we can show the dashboard */
			await login();
			this.setState({
				isLoggedIn: true,
				isLoginDataAvailable: true
			});
		}
		catch (e) {
			/* If not, we'll have to render the login/register screen */
			this.setState({
				isLoggedIn: false,
				isLoginDataAvailable: true
			});
		}
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