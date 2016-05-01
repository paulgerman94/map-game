import React from "react";
import { Link } from "react-router";
import { TextField, Paper } from "material-ui";
import getMUITheme from "material-ui/styles/getMuiTheme";
const theme = getMUITheme();
export default class extends React.Component {
	render() {
		return (
			<div style={{
				margin: "0"
			}} className="row center-xs center-sm center-md center-lg">
				<div className="col-sm-3 col-lg-3">
					<p>Please log in to continue.</p>
					<TextField floatingLabelText="Username"/>
					<TextField floatingLabelText="Password" type="password"/>
					<p>This is a single-page app. By navigating over <Link to="/widgets">here</Link>, you'll see that the site doesn't need to refresh.</p>
				</div>
			</div>
		);
	}
};