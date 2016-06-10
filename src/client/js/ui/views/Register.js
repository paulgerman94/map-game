import { default as React, Component } from "react";
import { TextField, RaisedButton, CircularProgress } from "material-ui";
/**
* This class is a React component that displays a {@link Register} component and automatically fetches its content asynchronously.
*/
export default class Register extends Component {
	state = {
		accountName: "",
		displayName: "",
		email: "",
		password: ["",""]
	}
	/**
	* Updates the state's account name based on user input
	* @param {SyntheticEvent} e
	* 	A `material-ui` event that behaves like a `KeyboardEvent`
	* @param {string} accountName
	* 	The account name that the user has entered
	*/
	updateAccountName(e,accountName) {
		this.setState({accountName});
		console.log(this.state);
	}
	/**
	* Updates the state's display name based on user input
	* @param {SyntheticEvent} e
	* 	A `material-ui` event that behaves like a `KeyboardEvent`
	* @param {string} displayName
	* 	The display name that the user has entered
	*/
	updateDisplayName(e,displayName) {
		this.setState({displayName});
		console.log(this.state);
	}
	/**
	* Updates the state's email based on user input
	* @param {SyntheticEvent} e
	* 	A `material-ui` event that behaves like a `KeyboardEvent`
	* @param {string} email
	* 	The email that the user has entered
	*/
	updateEmail(e,email) {
		this.setState({email});
		console.log(this.state);
	}
	/**
	* Updates the state's password based on user input
	* @param {SyntheticEvent} e
	* 	A `material-ui` event that behaves like a `KeyboardEvent`
	* @param {string} password
	* 	The password that the user has entered
	*/
	updatePassword(e,password) {
		const array = this.state.password;
		array[0] = password;
		this.setState({password: array});
		console.log(this.state);
	}
	/**
	* Updates the state's password (repeated) based on user input
	* @param {SyntheticEvent} e
	* 	A `material-ui` event that behaves like a `KeyboardEvent`
	* @param {string} password
	* 	The password (repeated) that the user has entered
	*/
	updatePasswordRepeat(e,password) {
		const array = this.state.password;
		array[1] = password;
		this.setState({password: array});
		console.log(this.state);
	}
	/**
	* Renders a {@link Users} component and injects a list of example users into it.
	* @return {ReactComponent}
	* 	The component that will be displayed
	*/
	render() {
		return (
			<div className="row center-xs center-sm center-md center-lg" style={{
				/* This is a flexboxgrid workaround; 6.3.0 is broken */
				margin: 0
			}}>
				<div className="col-sm-3 col-lg-3">
					<TextField floatingLabelText="Account name" onChange={::this.updateAccountName}/>
					<TextField floatingLabelText="Display name" onChange={::this.updateDisplayName}/>
					<TextField floatingLabelText="Email" onChange={::this.updateEmail}/>
					<TextField floatingLabelText="Password" type="password" onChange={::this.updatePassword}/>
					<TextField floatingLabelText="Repeat password" type="password" onChange={::this.updatePasswordRepeat}/>
					<RaisedButton style={{
						marginTop: "1em"
					}} label="Register"/>
				</div>
			</div>
		);
	}
}
