import React from "react";
/**
* This component contains the dashboard view that the user should see when entering the app as a logged in user.
* It should a simple map as well as the main game components.
*/
export default class Dashboard extends React.Component {
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
					<p>Put a map here, kthx</p>
				</div>
			</div>
		);
	}
}