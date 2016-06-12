import React from "react";
import { default as ReactDOM, render } from "react-dom";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
/**
* This component contains the dashboard view that the user should see when entering the app as a logged in user.
* It should a simple map as well as the main game components.
*/
export default class Dashboard extends React.Component {
	componentDidMount() {
		const position = [51.505, -0.09];
		const map = (
			<Map center={position} zoom={13} style={{
				width: "calc(100vw)",
				height: "calc(100vh - 50px)",
				display: "block",
			}}>
				<TileLayer url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
				<Marker position={position}>
					<Popup>
						<span>A pretty CSS3 popup.<br/>Easily customizable.</span>
					</Popup>
				</Marker>
			</Map>
		);
		const mapContainer = ReactDOM.findDOMNode(this).querySelector("map-container");
		render(map, mapContainer);
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
				<div className="col-sm-12 col-lg-12">
					<map-container/>
				</div>
			</div>
		);
	}
}