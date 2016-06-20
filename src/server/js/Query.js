import "babel-polyfill";
import fetch from "node-fetch";
import { err } from "./util";
import { ms } from "./units";
/* Note that the German server seems to be the only one introducing a rate limit as can be seen on http://overpass-api.de/api/status. In order to spatially parallelize the requests, we choose a rate limit of 20 for the others; this is not a fixed upper bound. */
const APIs = [{
	url: "http://overpass-api.de/api",
	rateLimit: 3
}, {
	url: "http://api.openstreetmap.fr/oapi/interpreter",
	rateLimit: 20
}, {
	url: "http://overpass.osm.rambler.ru/cgi",
	rateLimit: 20
}];
const connections = new Map();
for (const api of APIs) {
	connections.set(api, 0);
}
/**
* Chooses an API that is still free in terms of its rate limit
* @return {object}
* 	An API which can still be used for a new connection
*/
function chooseFreeAPI() {
	for (const [api, openConnections] of connections) {
		if (openConnections < api.rateLimit) {
			/* Immediately reserve the API */
			connections.set(api, openConnections + 1);
			return api;
		}
	}
	return null;
}
/**
* Asynchronously waits for an API that can be used for a new connection
* @return {Promise}
* 	A Promise that resolves to a free API some time in the future. Resolving will automatically reserve the connection.
*/
async function waitForFreeAPI() {
	const api = chooseFreeAPI();
	if (api === null) {
		return new Promise(resolve => {
			const timer = setInterval(() => {
				const api = chooseFreeAPI();
				if (api !== null) {
					clearInterval(timer);
					resolve(api);
				}
			}, 500 * ms);
		});
	}
	else {
		return api;
	}
}
/**
* Executes a query on a random Overpass server.
* Note that this function will always append `out center;` to the input.
* @param {string} query
* 	The query in Overpass QL syntax
* @return {object}
* 	An object created from the JSON query result
*/
export async function execute(query) {
	const source = query.trim().replace(/\s+/g, "");
	const api = await waitForFreeAPI();
	const server = api.url;
	const url = `${server}/interpreter?data=[out:json];${source}out center;`;
	const response = await fetch(url);
	const currentConnections = connections.get(api);
	connections.set(api, currentConnections - 1);
	const text = await response.text();
	try {
		return JSON.parse(text);
	}
	catch (e) {
		err("Overpass API sent an invalid reply", text, api);
		throw new Error("Overpass API error (rate limit exceeded?)");
	}
}