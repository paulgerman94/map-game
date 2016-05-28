import React from "react";
import dispatcher from "../Dispatcher";
import { EventEmitter } from "events";
import { MenuItem } from "material-ui";
/**
* This class is a Redux store that keeps a global view of a (not yet clearly defined) part of the app state.
* Right now, this store encompasses all the state information.
*/
class SomeStore extends EventEmitter {
	/**
	* @type {boolean}
	* 	Whether or not the menu is visible
	*/
	isMenuVisible = false;
	/**
	* @type {Array.<object>}
	* 	An array of users that the application knows
	*/
	users = [{
		text: "some-text-value",
		value: <MenuItem primaryText="@user1" secondaryText="·◡·"/>
	}, {
		text: "some-text-value",
		value: <MenuItem primaryText="@user2" secondaryText="·o·"/>
	}];
	/**
	* Adds a user to the store
	* @param {string} username
	* 	The user's username
	* @param {string} label
	* 	The label that should be attached to the users
	*/
	addUser(username, label) {
		this.users.push({
			text: "some-text-value",
			value: <MenuItem primaryText={username} secondaryText={label}/>
		});
		this.emit("change");
	}
	/**
	* Toggles the menu visibility
	*/
	toggleMenu() {
		this.isMenuVisible = !this.isMenuVisible;
		this.emit("menuToggled", this.isMenuVisible);
	}
	/**
	* Handles a Redux action and manipulates the store depending on the action
	* @param {string} action
	* 	The name of the action that the store should invoke
	*/
	handleActions(action) {
		console.log("SomeStore received an action: ", action);
		switch (action.type) {
			case "ADD_USER": {
				this.addUser(action.username, action.label);
				break;
			}
			case "TOGGLE_MENU": {
				this.toggleMenu();
				break;
			}
			default:
				break;
		}
	}
}
const someStore = new SomeStore();
dispatcher.register(::someStore.handleActions);
export default someStore;