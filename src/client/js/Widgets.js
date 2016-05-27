import { default as React, Component } from "react";
export default class Widgets extends Component {
	static propTypes = {
		widgetData: Object
	};
	render() {
		return (
			<div>
				<h1>Widgets</h1>
				<ul>
					{this.props.widgetData.map((value, i) => {
						return (
							<li key={i}>
								{value}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}