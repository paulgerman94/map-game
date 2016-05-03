import React from "react";
import { Link } from "react-router";
export default React.createClass({
	render() {
		return (
			<div>
				<h1>Users</h1>
				<ul>
					{this.props.users.map((user, i) => {
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
});