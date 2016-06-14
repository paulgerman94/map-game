import React from "react";
import { default as ReactDOM } from "react-dom";
import L from "client/ui/LeafletWrapper";
import { coffeeMarker } from "../markers";
/**
* This component contains the dashboard view that the user should see when entering the app as a logged in user.
* It should a simple map as well as the main game components.
*/
export default class Dashboard extends React.Component {
	state = {
		markers: [{
			latitude: 51.505,
			longitude: -0.09,
			popup: "hello"
		}, {
			latitude: 51.525,
			longitude: -0.09,
			popup: "nothing here"
		}]
	};
	/**
	* Fires once this React component mounts and starts rendering a Leaflet map
	*/
	componentDidMount() {
		const mapContainer = ReactDOM.findDOMNode(this).querySelector("map-container");
		const position = [51.505, -0.09];
		const map = L.map(mapContainer)
			.setView(position, 13);
		L.tileLayer("//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
		for (const item of this.state.markers) {
			const marker = L.marker([item.latitude, item.longitude], {
				icon: coffeeMarker
			});
			marker.addTo(map)
				.bindPopup(item.popup);
		}
	}
	/**
	* Renders a component with a simple login menu
	* @return {ReactElement}
	* 	The React component
	*/
	render() {
		return (
			<div>
				<map-container/>
			</div>
		);
	}
}