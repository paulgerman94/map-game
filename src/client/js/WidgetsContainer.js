import { default as React, Component } from "react";
import Widgets from "./Widgets";
export default class WidgetsContainer extends Component {
	constructor() {
		super();
		this.state = {
			widgetData: ["one", "two", "three"]
		};
	}
	render() {
		return (
			<Widgets widgetData={this.state.widgetData}/>
		);
	}
}