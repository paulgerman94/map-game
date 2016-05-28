import React from "react";
import { Link } from "react-router";
import { TextField } from "material-ui";
/**
* This component contains the home view that the user should see when entering the app.
* It should a simple login/registration menu if the user isn't logged in.
* Otherwise, it should display the general game UI.
*/
export default class Home extends React.Component {
	/**
	* Renders a component with a simple login menu
	* @return {ReactElement}
	* 	The React component
	*/
	render() {
		return (
			<div style={{
				margin: "0"
			}} className="row center-xs center-sm center-md center-lg">
				<div className="col-sm-3 col-lg-3">
					<p>Please log in to continue.</p>
					<TextField floatingLabelText="Username"/>
					<TextField floatingLabelText="Password" type="password"/>
					<p>This is a single-page app. By navigating over <Link to="/users">here</Link>, you'll see that the site doesn't need to refresh.</p>
				</div>
			</div>
		);
	}
}