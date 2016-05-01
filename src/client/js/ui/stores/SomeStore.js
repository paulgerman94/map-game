import { EventEmitter } from "events";
import React from "react";
import { MenuItem } from "material-ui";
import dispatcher from "../Dispatcher";
class SomeStore extends EventEmitter {
	constructor() {
		super();
		this.isMenuVisible = false;
		this.users = [{
			text: "some-text-value",
			value: <MenuItem primaryText="@chiru" secondaryText="·◡·"/>,
		}, {
			text: "some-text-value",
			value: <MenuItem primaryText="@suika" secondaryText="♥"/>,
		}];
	}
	addUser(username, label) {
		this.users.push({
			text: "some-text-value",
			value: <MenuItem primaryText={username} secondaryText={label}/>,
		});
		this.emit("change");
	}
	toggleMenu() {
		this.isMenuVisible = !this.isMenuVisible;
		this.emit("menuToggled", this.isMenuVisible);
	}
	handleActions(action) {
		console.log("SomeStore received an action: ", action)
		switch (action.type) {
			case "ADD_USER": {
				this.addUser(action.username, action.label)
			}
			case "TOGGLE_MENU": {
				this.toggleMenu();
			}
		}
	}
}
const someStore = new SomeStore();
dispatcher.register(::someStore.handleActions);
export default someStore;
window.dispatcher = dispatcher;