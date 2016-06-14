import React from "react";
import ReactDOM from "react-dom";
import L from "client/ui/LeafletWrapper";
import client from "client/client";
import { requestLocation, requestLocationSetup } from "../actions/DashboardActions";
import { default as DashboardStore, GRANT_LOCATION } from "../stores/DashboardStore";
import { Flag } from "../flags/Flag";
import { Restaurant } from "../flags/Restaurant";
/**
* This component contains the dashboard view that the user should see when entering the app as a logged in user.
* It should a simple map as well as the main game components.
*/
export default class Dashboard extends React.Component {
	map = null;
	/**
	* Watches the user coordinates in an interval and sends them to the server. Once the server replies with the corresponding flags, the flags are added to the map.
	*/
	async receiveUserCoordinates() {
		navigator.geolocation.watchPosition(async position => {
			const { coords } = position;
			const {
				latitude,
				longitude
			} = coords;
			const [pois] = await client.getPOIs({
				latitude,
				longitude
			});
			const flags = pois.elements.map(poi => {
				if (poi.type === "node" && poi.tags.amenity === "restaurant") {
					return new Restaurant(poi);
				}
				else {
					return new Flag(poi);
				}
			});
			for (const flag of flags) {
				flag.marker.addTo(this.map)
					.bindPopup("flag.popup");
			}
		});
	}
	/**
	* Sets up all event listeners
	*/
	componentWillMount() {
		DashboardStore.on(GRANT_LOCATION, () => {
			::this.receiveUserCoordinates();
		});
	}
	/**
	* Fires once this React component mounts and starts rendering a Leaflet map
	*/
	async componentDidMount() {
		const mapContainer = ReactDOM.findDOMNode(this).querySelector("map-container");
		const position = [51.505, -0.09];
		const map = L.map(mapContainer)
			.setView(position, 13);
		this.map = map;
		L.tileLayer("//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
		const result = await navigator.permissions.query({
			name: "geolocation"
		});
		if (result.state === "granted") {
			::this.receiveUserCoordinates();
		}
		else if (result.state === "prompt") {
			requestLocation();
		}
		else if (result.state === "denied") {
			requestLocationSetup();
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