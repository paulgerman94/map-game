import React from "react";
export default class Users extends React.Component {
	static propTypes = {
		users: Object
	};
	render() {
		return (
			<div>
				<h1>Users</h1>
				<ul>
					{this.props.users.map(user => {
						return (
							<li key={user.id}>
								{user.name}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}