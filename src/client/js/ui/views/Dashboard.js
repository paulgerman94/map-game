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
import { Player } from "../flags/Player";
import { School } from "../flags/School";
import { publish } from "../Dispatcher";
import { POI_RADIUS } from "server/constants";
/**
* This component contains the dashboard view that the user should see when entering the app as a logged in user.
* It should a simple map as well as the main game components.
*/
export default class Dashboard extends React.Component {
	map;
	markers;
	player;
	/**
	* Watches the user coordinates in an interval and sends them to the server. Once the server replies with the corresponding flags, the flags are added to the map.
	*/
	async receiveUserCoordinates() {
		navigator.geolocation.watchPosition(async position => {
			const { coords } = position;
			const {
				accuracy,
				latitude,
				longitude
			} = coords;
			this.initializeView(latitude, longitude);
			const flags = await this.createFlags(latitude, longitude);
			this.drawPlayer(latitude, longitude, accuracy);
			this.drawFlags(flags);
		}, null, {
			enableHighAccuracy: true
		});
	}
	/**
	* Sets the initial map position to render.
	* If the map already has a set position, this is a no-op.
	* @param {number} latitude
	* 	The latitude to initialize the view to
	* @param {number} longitude
	* 	The longitude to initialize the view to
	*/
	initializeView(latitude, longitude) {
		/* Initialize view */
		try {
			/* If the map has a center, the view must have been initialized already */
			this.map.getCenter();
		}
		catch (e) {
			/* Otherwise, its position is undefined */
			this.map.setView([latitude, longitude], 15);
		}
	}
	/**
	* Contacts the server to retrieve POIs that this function will map to their corresponding {@link Flag} instances
	* @param {number} latitude
	* 	The latitude of the coordinate where flags should be created
	* @param {number} longitude
	* 	The longitude of the coordinate where flags should be created
	* @return {Array.<Flag>}
	* 	An array of {@link Flag} instances that can be drawn on the map
	*/
	async createFlags(latitude, longitude) {
		const [{ nodes, ways, areas }] = await client.getPOIs({
			latitude,
			longitude
		});
		const elementCollections = [nodes, ways, areas];
		return elementCollections.map(elementCollection => {
			return elementCollection.map(poi => {
				if (poi.tags.amenity === "restaurant") {
					return new Restaurant(poi);
				}
				if (poi.tags.amenity === "music_school" ||
					poi.tags.amenity === "dancing_school" ||
					poi.tags.amenity === "driving_school" ||
					poi.tags.amenity === "language_school" ||
					poi.tags.amenity === "school" ||
					poi.tags.amenity === "university"
				) {
					return new School(poi);
				}
				else {
					return new Flag(poi);
				}
			});
		}).reduce((a, b) => a.concat(b));
	}
	/**
	* Updates the map's flag layer with flags
	* @param {Array.<Flag>} flags
	* 	An array of {@link Flag} instances to draw on the map
	*/
	drawFlags(flags) {
		this.markers.clearLayers();
		for (const flag of flags) {
			this.markers.addLayer(flag.marker);
		}
	}
	/**
	* Updates the map's player layer with the player position and the POI radius
	* @param {number} latitude
	* 	The latitude of the coordinate where the player should be drawn
	* @param {number} longitude
	* 	The longitude of the coordinate where the player should be drawn
	* @param {number} accuracy
	* 	The accuracy of the player's position in meters
	*/
	drawPlayer(latitude, longitude, accuracy) {
		this.player.clearLayers();
		const reach = L.circle([latitude, longitude], POI_RADIUS);
		const player = new Player({
			lon: longitude,
			lat: latitude,
			tags: {
				name: "You"
			},
			type: "node"
		}).marker;
		const playerAccuracy = L.circle([latitude, longitude], accuracy, {
			color: "red"
		});
		for (const element of [reach, playerAccuracy, player]) {
			this.player.addLayer(element);
		}
	}
	/**
	* Updates the map's area layer with known circles that were cached on the server
	* @param {Message} message
	* 	A message object that can be used to send a reply
	* @param {...*} args
	* 	The arguments that are passed by the caller
	*/
	drawArea(message, ...args) {
		const [circles] = args;
		this.area.clearLayers();
		for (const { latitude, longitude, radius } of circles) {
			const areaCircle = L.circle([latitude, longitude], radius, {
				weight: 1,
				color: "hsl(220, 100%, 60%)",
				fillOpacity: 0.0035,
				opacity: 0.25
			});
			this.area.addLayer(areaCircle);
		}
		/* TODO: Fix replies in protocol to send token? */
		message.reply();
	}
	/**
	* Sets up all event listeners
	*/
	componentWillMount() {
		LocationStore.on(LOCATION_GRANTED, ::this.receiveUserCoordinates);
		client.on("drawArea", ::this.drawArea);
	}
	/**
	* Removes all event listeners
	*/
	componentWillUnmount() {
		LocationStore.off(LOCATION_GRANTED, ::this.receiveUserCoordinates);
		client.off("drawArea", ::this.drawArea);
	}
	/**
	* Fires once this React component mounts and starts rendering a Leaflet map
	*/
	async componentDidMount() {
		const mapContainer = ReactDOM.findDOMNode(this).querySelector("map-container");
		const map = L.map(mapContainer);
		this.map = map;
		this.area = new L.FeatureGroup();
		this.markers = new L.FeatureGroup();
		this.player = new L.FeatureGroup();
		this.map.addLayer(this.area);
		this.map.addLayer(this.player);
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