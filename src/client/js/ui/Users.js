import React from "react";
/**
* This class models a React component that displays a list of users.
*/
export default class Users extends React.Component {
	/**
	* An object that associates every React property to a type
	* @type {object}
	*/
	static propTypes = {
		users: Object
	};
	/**
	* Renders a component with a list of users
	* @return {ReactElement}
	* 	The React component
	*/
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