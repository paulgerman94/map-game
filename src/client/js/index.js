import React from "react";
import { render } from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
// import { useRouterHistory } from "react-router";
// import { createHistory } from "history";
import Layout from "./ui/layout/Layout";
import { SERVICE_WORKER_REGISTERED } from "./ui/stores/ConnectionStore";
import { publish } from "./ui/Dispatcher";
import {
	default as Home,
	ROUTE as HOME_ROUTE
} from "./ui/views/Home";
import {
	default as Register,
	ROUTE as REGISTER_ROUTE
} from "./ui/views/Register";
import {
	default as Settings,
	ROUTE as SETTINGS_ROUTE
} from "./ui/views/Settings";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMUITheme from "material-ui/styles/getMuiTheme";
import client from "./client";
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
		primary3Color: grey500,
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
// const browserHistory = useRouterHistory(createHistory)({
// 	basename: "/<%LINUX_USERNAME%>/"
// });
(async () => {
	if (navigator.serviceWorker) {
		const registration = await navigator.serviceWorker.register("sw.js");
		publish(SERVICE_WORKER_REGISTERED, {
			registration
		});
	}
	try {
		/* The first rendering of the page should also try to establish a WebSocket connection */
		await client.open();
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
							<Route path={HOME_ROUTE} component={Layout}>
								<IndexRoute component={Home}/>
								<Route path={REGISTER_ROUTE} component={Register}/>
								<Route path={SETTINGS_ROUTE} component={Settings}/>
							</Route>
						</Router>
					</main>
				</div>
			</MuiThemeProvider>
		), document.querySelector("map-game"));
	}
})();