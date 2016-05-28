import "babel-polyfill";
import fetch from "node-fetch";
const servers = [
	"http://overpass-api.de/api",
	"http://overpass.osm.rambler.ru/cgi"
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
	const url = `${server}/interpreter?data=[out:json];${source}out body;`;
	const response = await fetch(url);
	return await response.json();
}