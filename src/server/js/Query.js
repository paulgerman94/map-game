import "babel-polyfill";
import fetch from "node-fetch";
import { err } from "./util";
const servers = [
	"http://overpass-api.de/api",
	"http://overpass.osm.rambler.ru/cgi",
	"http://api.openstreetmap.fr/oapi/interpreter/"
];
/**
* Executes a query on a random Overpass server.
* Note that this function will always append `out body;` to the input.
* @param {string} query
* 	The query in Overpass QL syntax
* @return {object}
* 	An object created from the JSON query result
*/
export async function execute(query) {
	const source = query.trim().replace(/\s+/g, "");
	const server = servers[Math.floor(servers.length * Math.random())];
	const url = `${server}/interpreter?data=[out:json];${source}out center;`;
	const response = await fetch(url);
	const text = await response.text();
	try {
		return JSON.parse(text);
	}
	catch (e) {
		err("Overpass API sent an invalid reply", text);
		throw new Error("Overpass API error (rate limit exceeded?)");
	}
}