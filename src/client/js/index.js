import React from "react";
import { render } from "react-dom";
import { Router, Route, browserHistory } from "react-router";
import Layout from "./ui/layout/Layout";
import Home from "./ui/Home";
import UsersContainer from "./ui/UsersContainer";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMUITheme from "material-ui/styles/getMuiTheme";
import client from "./client";
import * as API from "./api/index";
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
render((
	<MuiThemeProvider muiTheme={muiTheme}>
		<div>
			<main>
				<Router history={browserHistory}>
					<Route component={Layout}>
						<Route path="/" component={Home}/>
						<Route path="/users" component={UsersContainer}/>
					</Route>
				</Router>
			</main>
		</div>
	</MuiThemeProvider>
), document.querySelector("map-game"));
(async () => {
	await client.open();
// 	console.log("Let's ask the server to compute the sum of the first 10 numbers.");
// 	const [result] = await client.add(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
// 	console.log(`1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 = ${result}.`);
// 	console.time("ask");
// 	const pois = await getPOIs(client);
// 	console.log(pois);
	const exOmni = {
		accountName: "exomni",
		email: "ex@om.ni",
		displayName: "exOmni",
		password: "password123"
	};
// 	client.register({
// 		accountName: "exomni",
// 		email: "ex@om.ni",
// 		displayName: "exOmni",
// 		password: "password123"
// 	});
// 	const [token] = await client.login(exOmni);
	const token = await API.login(exOmni);
	console.log(token);
// 	setTimeout(async () => {
// 		const [secondToken] = await client.login(exOmni);
// 		store.save("token", secondToken);
// 	}, 1000);
})();