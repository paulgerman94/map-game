import { default as React, Component } from "react";
import Users from "./Users";
/**
* Loads the users asynchronously in order to display them in the GUI.
* @return {Promise} A promise that resolves once all users have been fetched
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
export default class UsersContainer extends Component {
	constructor() {
		super();
		this.state = {
			users: []
		};
	}
	async componentWillMount() {
		const users = await getUsers();
		this.setState({
			users
		});
	}
	render() {
		return <Users users={this.state.users}/>;
	}
}