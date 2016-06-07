import React from "react";
import { render } from "react-dom";
import { Router, Route, browserHistory } from "react-router";
import Layout from "./ui/layout/Layout";
import Home from "./ui/views/Home";
import UsersContainer from "./ui/UsersContainer";
import Register from "./ui/views/Register";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMUITheme from "material-ui/styles/getMuiTheme";
import client from "./client";
// import getPOIs from "./getPOIs";
import {
	blue300,
	grey100, grey500,
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
(async () => {
	try {
		await client.open();
		// 	const pois = await getPOIs(client);
		// 	console.log(pois);
		// const exOmni = {
		// 	accountName: "exomni",
		// 	email: "ex@om.ni",
		// 	displayName: "exOmni",
		// 	password: "password123"
		// };
	}
	catch (e) {
		console.info("Server is currently offline.");
	}
	finally {
		render((
			<MuiThemeProvider muiTheme={muiTheme}>
				<div>
					<main>
						<Router history={browserHistory}>
							<Route component={Layout}>
								<Route path="/" component={Home}/>
								<Route path="/users" component={UsersContainer}/>
								<Route path="/register" component={Register}/>
							</Route>
						</Router>
					</main>
				</div>
			</MuiThemeProvider>
		), document.querySelector("map-game"));
	}
})();