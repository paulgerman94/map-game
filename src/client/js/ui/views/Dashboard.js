import React from "react";
import ReactDOM from "react-dom";
import L from "client/ui/LeafletWrapper";
import client from "client/client";
import { capitalize } from "client/util";
import { capture } from "client/api/index";
import ConnectionStore from "../stores/ConnectionStore";
import {
	default as LocationStore,
	AREA_UPDATED,
	FLAG_CACHE_UPDATED,
	FLAG_SELECTED
} from "../stores/LocationStore";
import {
	default as SettingsStore
} from "../stores/SettingsStore";
import {
	default as PermissionStore,
	NOTIFICATIONS,
	LOCATION,
	GRANTED,
	PROMPT,
	DENIED,
	PERMISSION_CHANGED,
	UNSET
} from "../stores/PermissionStore";
import StateStore from "../stores/StateStore";
import { Flag, Player } from "../Flag";
import { publish } from "../Dispatcher";
import { POI_RADIUS } from "server/constants";
import {
	Dialog,
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
	RaisedButton
} from "material-ui";
/**
* This component contains the dashboard view that the user should see when entering the app as a logged in user.
* It should a simple map as well as the main game components.
*/
export default class Dashboard extends React.Component {
	map;
	currentFlag;
	layers = {};
	state = {
		view: null,
		shownFlags: [],
		showFlagDetails: false,
		currentMarker: null,
		zoom: 15,
		accuracy: 0
	};
	styles = {
		layers: {
			player: {
				reach: {
					failed: {
						color: "hsl(8, 100%, 80%)"
					},
					loading: {
						color: "hsl(228, 100%, 80%)"
					},
					ready: {
						color: "hsl(228, 100%, 50%)"
					}
				}
			}
		}
	};
	/**
	* Instantiates a new {@link Dashboard} component
	*/
	constructor() {
		super();
		this.handlePermissionChanges = ::this.handlePermissionChanges;
		this.receiveUserCoordinates = ::this.receiveUserCoordinates;
		this.drawArea = ::this.drawArea;
		this.appendZoomFix = ::this.appendZoomFix;
		this.removeZoomFix = ::this.removeZoomFix;
		this.showFlagDialog = ::this.showFlagDialog;
		this.update = ::this.update;
	}
	/**
	* Watches the user coordinates in an interval and sends them to the server. Once the server replies with the corresponding flags, the flags are added to the map.
	*/
	async receiveUserCoordinates() {
		this.geoLocationWatchID = navigator.geolocation.watchPosition(async position => {
			const { coords } = position;
			const {
				accuracy,
				latitude,
				longitude
			} = coords;
			const view = [latitude, longitude];
			this.setState({
				view,
				accuracy
			});
			this.initializeView(...view);
			/* Immediately move the player to his new position */
			this.drawPlayer(...view, accuracy, this.styles.layers.player.reach.loading);
			/* Immediately clear all flags and draw only flags from client cache */
			this.drawFlags();
			if (SettingsStore.isCameraFollowing) {
				/* The camera should also follow immediately */
				this.map.panTo(view);
			}
			let reachStyle;
			try {
				const flags = await this.createFlags(...view);
				/* Is the player still where he was back when he requested the flags? */
				if (this.isCurrentPosition(...view)) {
					/* Update the player to signal completion, update the flags */
					reachStyle = this.styles.layers.player.reach.ready;
					this.drawFlags(flags);
				}
			}
			catch (e) {
				/* Update the player to signal failure */
				reachStyle = this.styles.layers.player.reach.failed;
			}
			finally {
				/* Is the player still where he was back when he requested the flags? */
				if (this.isCurrentPosition(...view)) {
					/* Update the player if the operation was issued for the current position */
					this.drawPlayer(...view, accuracy, reachStyle);
				}
			}
		}, null, {
			enableHighAccuracy: true
		});
	}
	/**
	* This function determines if the latitude and longitude provided are what the map is currently set to.
	* Note that this function is needed because Leaflet maps don't save their position exactly.
	* @param {number} latitude
	* 	The latitude of the point
	* @param {number} longitude
	* 	The longitude of the point
	* @return {boolean}
	* 	Whether or not this is the position that the map currently displays
	*/
	isCurrentPosition(latitude, longitude) {
		const [viewLatitude, viewLongitude] = this.state.view;
		return viewLatitude === latitude && viewLongitude === longitude;
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
			this.map.setView([latitude, longitude], this.state.zoom);
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
		/* We're using an arrow function anyway, but using `this` will result in a transpilation error… */
		const [pois] = await client.getPOIs({
			latitude,
			longitude
		});
		const flags = pois.map(poi => {
			const flag = new Flag(poi.metadata, {
				owner: poi.owner,
				ownedSince: poi.captured_at,
				team: poi.team
			});
			return flag.specialized;
		});
		this.setState({
			shownFlags: flags
		});
		publish(FLAG_CACHE_UPDATED, {
			flags
		});
		return flags;
	}
	/**
	* Updates the map's flag layer with flags
	* @param {Array.<Flag>} [flags]
	* 	An array of {@link Flag} instances to draw on the map — if the array is ommitted, the function will instead try to draw flags from the client cache that would be contained in the player's reach
	*/
	drawFlags(flags) {
		const [latitude, longitude] = this.state.view;
		this.layers.markers.clearLayers();
		if (!flags) {
			/* Display cached flags */
			const circle = L.circle(this.state.view, POI_RADIUS);
			for (const flag of LocationStore.flags) {
				if (this.isCurrentPosition(latitude, longitude)) {
					if (circle.contains([flag.latitude, flag.longitude])) {
						/* If the cached flag is in the reach, draw it */
						this.layers.markers.addLayer(flag.marker);
					}
				}
			}
		}
		else {
			for (const flag of flags) {
				this.layers.markers.addLayer(flag.marker);
			}
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
	* @param {object} [reachStyle={}]
	* 	An optional style object that determines how the player reach will be rendered
	*/
	drawPlayer(latitude, longitude, accuracy, reachStyle = {}) {
		/* Create or update the player reach */
		if (!this.layers.player.reach) {
			const reach = L.circle([latitude, longitude], POI_RADIUS);
			this.layers.player.reach = reach;
			this.layers.player.addLayer(reach);
		}
		else {
			this.layers.player.reach.setStyle(reachStyle);
			this.layers.player.reach.setLatLng([latitude, longitude]);
		}
		/* Create or update the player marker */
		if (!this.layers.player.marker) {
			const playerMarker = this.layers.player.marker = new Player({
				lon: longitude,
				lat: latitude,
				tags: {
					name: "You"
				},
				type: "node"
			}).marker;
			this.layers.player.marker = playerMarker;
			this.layers.player.addLayer(playerMarker);
		}
		else {
			this.layers.player.marker.setLatLng([latitude, longitude]);
		}
		/* Create or update the player accuracy */
		if (!this.layers.player.accuracy) {
			const accuracyCircle = L.circle([latitude, longitude], accuracy, {
				color: "red"
			});
			this.layers.player.accuracy = accuracyCircle;
			this.layers.player.addLayer(accuracyCircle);
		}
		else {
			this.layers.player.accuracy.setLatLng([latitude, longitude]);
		}
	}
	/**
	* This function handles a {@link Permission} change during runtime.
	* If the {@link Permission} type was `LOCATION` and the change was to `GRANTED`, the game will start receiving the user's coordinates and draw the map.
	* @param {PermissionChangeEvent} change
	* 	The event that describes how the permission has been changed
	*/
	handlePermissionChanges(change) {
		switch (change.type) {
			case LOCATION: {
				switch (change.permission) {
					case GRANTED: {
						this.receiveUserCoordinates();
						break;
					}
					default: {
						break;
					}
				}
				break;
			}
			default: {
				break;
			}
		}
	}
	/**
	* Updates the map's area layer with known circles that were cached on the server
	* @param {Array.<object>} circles
	* 	An array of circle centers to draw with objects providing the properties `latitude`, `longitude` and `radius`
	*/
	drawArea(circles) {
		this.layers.area.clearLayers();
		for (const { latitude, longitude, radius } of circles) {
			const areaCircle = L.circle([latitude, longitude], radius, {
				weight: 1,
				color: "hsl(120, 100%, 80%)",
				fillOpacity: 0.025,
				opacity: 0.5
			});
			this.layers.area.addLayer(areaCircle);
		}
	}
	/**
	* Redraws the flags from cache and updates the dialog
	*/
	update() {
		this.drawFlags();
		this.setState({});
	}
	/**
	* Sets up all event listeners
	*/
	componentWillMount() {
		PermissionStore.on(PERMISSION_CHANGED, this.handlePermissionChanges);
		LocationStore.on(AREA_UPDATED, this.drawArea);
		LocationStore.on(FLAG_SELECTED, this.showFlagDialog);
		LocationStore.on(FLAG_CACHE_UPDATED, this.update);
		if (StateStore.dashboard) {
			this.state = StateStore.dashboard;
		}
	}
	/**
	* Removes all event listeners
	*/
	componentWillUnmount() {
		PermissionStore.off(PERMISSION_CHANGED, this.handlePermissionChanges);
		LocationStore.off(AREA_UPDATED, this.drawArea);
		LocationStore.off(FLAG_SELECTED, this.showFlagDialog);
		LocationStore.off(FLAG_CACHE_UPDATED, this.update);
		navigator.geolocation.clearWatch(this.geoLocationWatchID);
		client.off("drawArea", this.drawArea);
		this.map.off("zoomstart", this.appendZoomFix);
		this.map.off("zoomend", this.removeZoomFix);
		StateStore.dashboard = this.state;
	}
	/**
	* Adds the "zoom patch" styling element to the head of the HTML
	*/
	appendZoomFix() {
		const css = document.createElement("style");
		css.setAttribute("id", "disable-jag");
		css.type = "text/css";
		css.innerHTML = `
			/* This prevents a jagged path transition on zooms */
			path {
				transition: none;
			}
		`;
		document.head.appendChild(css);
	}
	/**
	* Removes the "zoom patch" styling element by the next slot in the execution queue
	*/
	removeZoomFix() {
		this.setState({
			zoom: this.map.getZoom()
		});
		setTimeout(() => {
			document.querySelector("#disable-jag").remove();
		}, 0);
	}
	/**
	* Fires once this React component mounts and starts rendering a Leaflet map
	*/
	async componentDidMount() {
		const mapContainer = ReactDOM.findDOMNode(this).querySelector("map-container");
		const map = L.map(mapContainer);
		this.map = map;
		/* Set up listeners for patching rendering issues */
		map.on("zoomstart", this.appendZoomFix);
		map.on("zoomend", this.removeZoomFix);
		/* Create layers */
		this.layers.area = new L.FeatureGroup();
		this.layers.markers = new L.FeatureGroup();
		this.layers.player = new L.FeatureGroup();
		this.map.addLayer(this.layers.area);
		this.map.addLayer(this.layers.markers);
		this.map.addLayer(this.layers.player);
		L.tileLayer("//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
		if (this.state.view) {
			/* Restore view, player and flags */
			map.setView(this.state.view, this.state.zoom);
			this.drawPlayer(...this.state.view, this.state.accuracy);
			this.drawFlags(this.state.shownFlags);
		}
		/* Handle GeoLocation permissions */
		const geoLocation = PermissionStore.get(LOCATION);
		switch (geoLocation.permission) {
			default:
			case GRANTED: {
				this.receiveUserCoordinates();
				break;
			}
			case PROMPT: {
				PermissionStore.request(LOCATION);
				break;
			}
			case DENIED: {
				PermissionStore.requestSetup(LOCATION);
				break;
			}
		}
		/* Handle Notification permissions */
		const notifications = PermissionStore.get(NOTIFICATIONS);
		if (notifications.permission === PROMPT && notifications.preference === UNSET) {
			PermissionStore.request(NOTIFICATIONS);
		}
	}
	/**
	* Sets the current flag and then opens up the flag dialog
	* @param {Flag} currentFlag
	* 	The flag whose details the dialog should show
	*/
	showFlagDialog(currentFlag) {
		this.setState({
			currentFlag,
			showFlagDetails: true
		});
	}
	/**
	* Hides the flag dialog
	*/
	hideFlagDialog() {
		this.setState({
			showFlagDetails: false
		});
	}
	/**
	* Updates the flaw owner and toggles a redraw
	* @param {Flag} flag
	* 	The old flag to update
	* @param {string} owner
	* 	The account name of whoever owns the flag now
	*/
	updateFlagOwner(flag, owner) {
		flag.info.owner = owner;
		flag.info.ownedSince = new Date();
		flag.info.team = ConnectionStore.user.team;
		/* Specialize the flag */
		const newFlag = new Flag(flag.element, flag.info).specialized;
		this.setState({
			currentFlag: newFlag
		});
		publish(FLAG_CACHE_UPDATED, {
			flags: [newFlag]
		});
	}
	/**
	* Renders a component with a simple login menu
	* @return {ReactElement}
	* 	The React component
	*/
	render() {
		const flag = this.state.currentFlag;
		const flagAvailable = Boolean(flag);
		let flagDetails;
		if (flagAvailable) {
			const flagDetailsRequested = this.state.showFlagDetails;
			const title = flagAvailable && flag.name;
			const { latitude, longitude, id, typeName } = flag;
			const distance = L.latLng(...this.state.view).distanceTo(L.latLng(latitude, longitude));
			const { type } = flag.element;
			const owner = flag.owner;
			const isOwnTeam = flag.info.team === ConnectionStore.user.team;
			const ownedSince = flag.ownedSince && new Intl.DateTimeFormat(navigator.language, {
				weekday: "long",
				month: "long",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "numeric",
				hour12: false
			}).format(new Date(flag.ownedSince));
			flagDetails = (
				<Dialog title={title} open={flagAvailable && flagDetailsRequested} autoScrollBodyContent={true} onRequestClose={::this.hideFlagDialog} actions={
					<div>
						<RaisedButton label="Cancel" onClick={::this.hideFlagDialog} style={{
							margin: "0.5rem"
						}}/>
						<RaisedButton label="Capture" primary onClick={async () => {
							try {
								await capture(flag);
								::this.updateFlagOwner(flag, ConnectionStore.user.accountName);
							}
							catch (e) {
								/* Capture failed */
							}
						}} disabled={id === undefined || isOwnTeam} style={{
							margin: "0.5rem"
						}}/>
					</div>
				}>
					<Table selectable={false}>
						<TableHeader adjustForCheckbox={false} displaySelectAll={false}>
							<TableRow>
								<TableHeaderColumn>Property</TableHeaderColumn>
								<TableHeaderColumn>Value</TableHeaderColumn>
							</TableRow>
						</TableHeader>
						<TableBody displayRowCheckbox={false}>
							<TableRow>
								<TableRowColumn>Distance</TableRowColumn>
								<TableRowColumn>{distance.toFixed(2)} m</TableRowColumn>
							</TableRow>
							<TableRow>
								<TableRowColumn>Current owner</TableRowColumn>
								<TableRowColumn>{owner}</TableRowColumn>
							</TableRow>
							<TableRow>
								<TableRowColumn>Owned since</TableRowColumn>
								<TableRowColumn>{ownedSince}</TableRowColumn>
							</TableRow>
							<TableRow>
								<TableRowColumn>GPS Coordinates</TableRowColumn>
								<TableRowColumn>({latitude}, {longitude})</TableRowColumn>
							</TableRow>
							<TableRow>
								<TableRowColumn>Category</TableRowColumn>
								<TableRowColumn>{capitalize(typeName)}</TableRowColumn>
							</TableRow>
							<TableRow>
								<TableRowColumn>Type</TableRowColumn>
								<TableRowColumn>{capitalize(type)}</TableRowColumn>
							</TableRow>
							<TableRow>
								<TableRowColumn>ID</TableRowColumn>
								<TableRowColumn>{id}</TableRowColumn>
							</TableRow>
						</TableBody>
					</Table>
				</Dialog>
			);
		}
		return (
			<div>
				{flagDetails}
				<map-container/>
			</div>
		);
	}
}