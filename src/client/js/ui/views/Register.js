import client from "client/client";
import emailRegEx from "email-regex";
import { default as React, Component } from "react";
import { TextField, RaisedButton, CircularProgress } from "material-ui";
const emailChecker = emailRegEx({
	exact: true
});
/**
* This class is a React component that displays a {@link Register} component and automatically fetches its content asynchronously.
*/
export default class Register extends Component {
	state = {
		accountName: "",
		displayName: "",
		email: "",
		errors: {
			accountName: null,
			displayName: null,
			email: null,
			password: null
		},
		password: ["", ""]
	}
	/**
	* Updates the state's account name based on user input
	* @param {SyntheticEvent} e
	* 	A `material-ui` event that behaves like a `KeyboardEvent`
	* @param {string} accountName
	* 	The account name that the user has entered
	*/
	async updateAccountName(e, accountName) {
		this.setState({
			accountName
		});
		const errors = this.state.errors;
		/* Did the user enter anything? */
		if (accountName.length) {
			/* Check if the account name is still free */
			const [freeState] = await client.isFree({
				accountName
			});
			if (freeState.value === this.state.accountName && freeState.success) {
				/* The server replied that the name is still free */
				errors.accountName = null;
			}
			if (freeState.value === this.state.accountName && !freeState.success) {
				/* The server replied that the name is already taken */
				errors.accountName = "This name is already taken.";
			}
		}
		else {
			errors.accountName = "Your account name can't be empty.";
		}
		this.setState({
			errors
		});
	}
	/**
	* Updates the state's display name based on user input
	* @param {SyntheticEvent} e
	* 	A `material-ui` event that behaves like a `KeyboardEvent`
	* @param {string} displayName
	* 	The display name that the user has entered
	*/
	updateDisplayName(e, displayName) {
		this.setState({
			displayName
		});
		const errors = this.state.errors;
		/* Did the user enter anything? */
		if (displayName.length) {
			errors.displayName = null;
		}
		else {
			errors.displayName = "Your display name can't be empty.";
		}
		this.setState({
			errors
		});
	}
	/**
	* Updates the state's email based on user input
	* @param {SyntheticEvent} e
	* 	A `material-ui` event that behaves like a `KeyboardEvent`
	* @param {string} email
	* 	The email that the user has entered
	*/
	async updateEmail(e, email) {
		this.setState({
			email
		});
		const errors = this.state.errors;
		/* Did the user enter anything? */
		if (email.length) {
			/* Check if the account name is still free */
			const [freeState] = await client.isFree({
				email
			});
			if (freeState.value === this.state.email && freeState.success) {
				/* The server replied that the email is still free */
				if (emailChecker.test(email)) {
					/* The email address is valid */
					errors.email = null;
				}
				else {
					errors.email = "This email address is invalid.";
				}
			}
			if (freeState.value === this.state.email && !freeState.success) {
				/* The server replied that the email is already taken */
				errors.email = "This email address is already taken.";
			}
		}
		else {
			errors.email = "Your email address can't be empty.";
		}
		this.setState({
			errors
		});
	}
	/**
	* Updates the state's password array based on user input
	* @param {string} password
	* 	The password that the user has entered
	* @param {number} i
	* 	The index in the password array to update
	*/
	updatePasswords(password, i) {
		const errors = this.state.errors;
		/* Update the state's password */
		const passwordArray = this.state.password;
		passwordArray[i] = password;
		this.setState({
			password: passwordArray
		});
		/* Did the user enter a valid password? */
		if (password.length > 6) {
			/* Do the passwords match? */
			if (this.state.password.every(p => p === password)) {
				errors.password = null;
			}
			else {
				errors.password = "The passwords do not match.";
			}
		}
		else {
			errors.password = "Your password is too short.";
		}
		this.setState({
			errors
		});
	}
	/**
	* Updates the state's password based on user input
	* @param {SyntheticEvent} e
	* 	A `material-ui` event that behaves like a `KeyboardEvent`
	* @param {string} password
	* 	The password that the user has entered
	*/
	updatePassword(e, password) {
		this.updatePasswords(password, 0);
	}
	/**
	* Updates the state's repeated password based on user input
	* @param {SyntheticEvent} e
	* 	A `material-ui` event that behaves like a `KeyboardEvent`
	* @param {string} password
	* 	The repeated password that the user has entered
	*/
	updateRepeatedPassword(e, password) {
		this.updatePasswords(password, 1);
	}
	/**
	* Checks if the registration form is valid
	*/
	get isRegistrationValid() {
		/* Check if every field contains something */
		for (const value of Object.values(this.state)) {
			if (typeof value === "string") {
				if (!value.length) {
					return false;
				}
			}
			if (Array.isArray(value)) {
				if (!value.every(x => x.length)) {
					return false;
				}
			}
		}
		/* Check if any field has an error */
		for (const errorText of Object.values(this.state.errors)) {
			if (errorText) {
				return false;
			}
		}
		return true;
	}
	/**
	* Renders a {@link Register} component displaying a form that the user can use to register a new account
	* @return {ReactComponent}
	* 	The component that will be displayed
	*/
	render() {
		return (
			<div className="row center-xs center-sm center-md center-lg" style={{
				/* This is a flexboxgrid workaround; 6.3.0 is broken */
				margin: 0
			}}>
				<div className="col-md-3 col-lg-3">
					<div className="row center-xs center-sm center-md center-lg">
						<TextField floatingLabelText="Account name" onChange={::this.updateAccountName} errorText={this.state.errors.accountName}/>
					</div>
					<div className="row center-xs center-sm center-md center-lg">
						<TextField floatingLabelText="Display name" onChange={::this.updateDisplayName} errorText={this.state.errors.displayName}/>
					</div>
					<div className="row center-xs center-sm center-md center-lg">
						<TextField floatingLabelText="Email" onChange={::this.updateEmail} errorText={this.state.errors.email}/>
					</div>
					<div className="row center-xs center-sm center-md center-lg">
						<TextField floatingLabelText="Password" type="password" onChange={::this.updatePassword} errorText={this.state.errors.password}/>
					</div>
					<div className="row center-xs center-sm center-md center-lg">
						<TextField floatingLabelText="Repeat password" type="password" onChange={::this.updateRepeatedPassword} errorText={this.state.errors.password}/>
					</div>
					<div className="row center-xs center-sm center-md center-lg">
						<RaisedButton disabled={!this.isRegistrationValid} style={{
							marginTop: "1rem",
							marginBottom: "1rem"
						}} label="Register"/>
					</div>
				</div>
			</div>
		);
	}
}