import PIXI from "pixi.js";
import React from "react";
import { render } from "react-dom";
import { Router, Route, browserHistory } from "react-router";
import Layout from "./ui/layout/Layout";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon, AppBar } from "material-ui";
import Home from "./ui/Home";
import UsersContainer from "./ui/UsersContainer";
import WidgetsContainer from "./ui/WidgetsContainer";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMUITheme from "material-ui/styles/getMuiTheme";
import {
	blue300,
	cyan500, cyan700,
	grey100, grey400, grey500,
	pinkA200,
	darkBlack, white
} from "material-ui/styles/colors";
const muiTheme = getMUITheme({
	palette: {
		primary1Color: blue300,
		primary2Color: pinkA200,
		primary3Color: pinkA200,
		accent1Color: pinkA200,
		accent2Color: grey100,
		accent3Color: grey500,
		textColor: darkBlack,
		alternateTextColor: white,
		canvasColor: white
	},
	appBar: {
		height: 50
	}
});
if (navigator.serviceWorker) {
	navigator.serviceWorker.register("sw.js");
}
render((
	<MuiThemeProvider muiTheme={muiTheme}>
		<div>
			<main>
				<Router history={browserHistory}>
					<Route component={Layout}>
						<Route path="/" component={Home}/>
						<Route path="/widgets" component={WidgetsContainer}/>
						<Route path="/users" component={UsersContainer}/>
					</Route>
				</Router>
			</main>
		</div>
	</MuiThemeProvider>
), document.querySelector("map-game"));