import { default as React, Component } from "react";
/**
* This class is a React component that displays a {@link Register} component and automatically fetches its content asynchronously.
*/
export default class Register extends Component {
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
					<p>This should be where players may register</p>
				</div>
			</div>
		);
	}
}