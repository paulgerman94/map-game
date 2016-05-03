import { default as React, Component } from "react";
import Users from "./Users";
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
};
export default class UsersContainer extends Component {
	constructor() {
		super();
		this.state = {
			users: []
		};
	}
	async componentWillMount() {
		let users = await getUsers();
		this.setState({
			users
		});
	}
	render() {
		return <Users users={this.state.users}/>
	}
};