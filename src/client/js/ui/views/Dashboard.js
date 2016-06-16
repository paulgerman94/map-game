import React from "react";
import ReactDOM from "react-dom";
import L from "client/ui/LeafletWrapper";
import client from "client/client";
import {
	default as LocationStore,
	LOCATION_REQUESTED,
	LOCATION_SETUP_REQUESTED,
	LOCATION_GRANTED
} from "../stores/LocationStore";
import { Flag } from "../flags/Flag";
import { Restaurant } from "../flags/Restaurant";
import { publish } from "../Dispatcher";
/**
* This component contains the dashboard view that the user should see when entering the app as a logged in user.
* It should a simple map as well as the main game components.
*/
export default class Dashboard extends React.Component {
	map = null;
	isMapPositioned = false;
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
			if (!this.isMapPositioned) {
				this.map.setView([latitude, longitude], 13);
				this.isMapPositioned = true;
			}
			const flags = pois.elements.map(poi => {
				if (poi.type === "node" && poi.tags.amenity === "restaurant") {
					return new Restaurant(poi);
				}
				else {
					return new Flag(poi);
				}
			});
			this.markers.clearLayers();
			for (const flag of flags) {
				this.markers.addLayer(flag.marker.bindPopup(flag.name));
			}
		});
	}
	/**
	* Sets up all event listeners
	*/
	componentWillMount() {
		LocationStore.on(LOCATION_GRANTED, ::this.receiveUserCoordinates);
	}
	/**
	* Removes all event listeners
	*/
	componentWillUnmount() {
		LocationStore.off(LOCATION_GRANTED, ::this.receiveUserCoordinates);
	}
	/**
	* Fires once this React component mounts and starts rendering a Leaflet map
	*/
	async componentDidMount() {
		const mapContainer = ReactDOM.findDOMNode(this).querySelector("map-container");
		const map = L.map(mapContainer);
		this.map = map;
		this.markers = new L.FeatureGroup();
		this.map.addLayer(this.markers);
		L.tileLayer("//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
		const result = await navigator.permissions.query({
			name: "geolocation"
		});
		if (result.state === "granted") {
			::this.receiveUserCoordinates();
		}
		else if (result.state === "prompt") {
			publish(LOCATION_REQUESTED);
		}
		else if (result.state === "denied") {
			publish(LOCATION_SETUP_REQUESTED);
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