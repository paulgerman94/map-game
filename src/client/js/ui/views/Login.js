import React from "react";
import { Link } from "react-router";
import { TextField, RaisedButton, CircularProgress } from "material-ui";
import { login } from "client/api/index";
import * as actions from "../actions/LoginActions";
/**
* This component contains the home view that the user should see when entering the app.
* It should a simple login/registration menu if the user isn't logged in.
* Otherwise, it should display the general game UI.
*/
export default class Login extends React.Component {
	state = {
		isAccountNameValid: false,
		isPasswordValid: false,
		isLoggingIn: false
	};
	/**
	* Logs a user in and sets the state such that potential login errors as well as a spinner are displayed.
	* If the login suceeds, the state is set such that the Dashboard is displayed.
	* @param {SyntheticEvent} e
	* 	A `material-ui` event that behaves like a `KeyboardEvent` or a `ClickEvent` depending on how this method is invoked
	*/
	async login(e) {
		if (e.type === "keydown" && e.key !== "Enter") {
			/* If this is a keydown event for any other key than ↲, ignore it*/
			return;
		}
		else {
			/* If it is a keydown event for ↲ or a click event, try to login */
			let isLoginSuccessful = false;
			if (this.isLoginValid) {
				this.setState({
					isLoggingIn: true
				});
				const { accountName, password } = this.state;
				try {
					await login({
						accountName,
						password
					});
					/* We have successfully logged in! */
					this.setState({
						errorText: null
					});
					isLoginSuccessful = true;
				}
				catch (e) {
					/* Don't differentiate errors for now */
					this.setState({
						errorText: "Login failed. Please check your credentials."
					});
				}
				finally {
					this.setState({
						isLoggingIn: false
					});
					if (isLoginSuccessful) {
						actions.login();
					}
				}
			}
		}
	}
	/**
	* Updates the state's account name and determines if it is valid or not
	* @param {SyntheticEvent} e
	* 	A `material-ui` event that behaves like a `KeyboardEvent`
	* @param {string} accountName
	* 	The account name that the user has entered
	*/
	updateAccountName(e, accountName) {
		const isAccountNameValid = accountName.length > 0;
		this.setState({
			accountName,
			isAccountNameValid
		});
	}
	/**
	* Updates the state's password and determines if it is valid or not
	* @param {SyntheticEvent} e
	* 	A `material-ui` event that behaves like a `KeyboardEvent`
	* @param {string} password
	* 	The password that the user has entered
	*/
	updatePassword(e, password) {
		const isPasswordValid = password.length > 6;
		this.setState({
			password,
			isPasswordValid
		});
	}
	/**
	* Determines if the login button should be clickable or not and if pressing the Enter key in an `input` will try to login or not.
	* @param {SyntheticEvent} e
	* 	A `material-ui` event that behaves like a `KeyboardEvent`
	* @return {boolean}
	* 	Whether or not the action to login should be allowed right now
	*/
	get isLoginValid() {
		return this.state.isAccountNameValid && this.state.isPasswordValid && !this.state.isLoggingIn;
	}
	/**
	* Renders a component with a simple login menu
	* @return {ReactElement}
	* 	The React component
	*/
	render() {
		return (
			<div className="row center-xs center-sm center-md center-lg" style={{
				/* This is a flexboxgrid workaround; 6.3.0 is broken */
				margin: 0
			}}>
				<div className="col-sm-3 col-lg-3">
					<CircularProgress style={{
						visibility: this.state.isLoggingIn ? "visible" : "hidden"
					}}/>
					<p>Please log in to continue.</p>
					<div className="row center-xs center-sm center-md center-lg">
						<TextField onKeyDown={::this.login} onChange={::this.updateAccountName} floatingLabelText="Username"/>
					</div>
					<div className="row center-xs center-sm center-md center-lg">
						<TextField onKeyDown={::this.login} errorText={this.state.errorText} onChange={::this.updatePassword} floatingLabelText="Password" type="password"/>
					</div>
					<div className="row center-xs center-sm center-md center-lg" style={{
						marginTop: "2rem"
					}}>
						<RaisedButton label="Register" containerElement={
							<Link to="register"/>
						}/>
						<RaisedButton label="Login" primary onClick={::this.login} disabled={!this.isLoginValid} style={{
							marginLeft: "0.5rem"
						}}/>
					</div>
				</div>
			</div>
		);
	}
}