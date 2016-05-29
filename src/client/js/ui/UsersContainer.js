import { default as React, Component } from "react";
import Users from "./Users";
/**
* Loads the users asynchronously in order to display them in the GUI.
* @return {Promise}
* 	A promise that resolves once all users have been fetched
*/
async function getUsers() {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve([{
				name: "Hans",
				id: 0
			}, {
				name: "Peter",
				id: 1
			}, {
				name: "Bob",
				id: 2
			}]);
		}, 100 + 1000 * Math.random());
	});
}
/**
* This class is a React component that displays a {@link Users} component and automatically fetches its content asynchronously.
*/
export default class UsersContainer extends Component {
	/**
	* Creates a new {@link UsersContainer} instance
	*/
	constructor() {
		super();
		/**
		* @type {Object}
		* @property {Array.<object>} state.users
		*/
		this.state = {
			users: []
		};
	}
	/**
	* Fires before a React component mounts and asynchronously fetches the users first.
	* After the users have been fetched, the state is updated.
	*/
	async componentWillMount() {
		const users = await getUsers();
		this.setState({
			users
		});
	}
	/**
	* Renders a {@link Users} component and injects a list of example users into it.
	* @return {ReactComponent}
	* 	The component that will be displayed
	*/
	render() {
		return <Users users={this.state.users}/>;
	}
}