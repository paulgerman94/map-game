import "babel-polyfill";
import fetch from "node-fetch";
export async function execute(query) {
	const source = query.trim().replace(/\s+/g, "");
	const url = `http://overpass.osm.rambler.ru/cgi/interpreter?data=[out:json];${source}out body;`;
	const response = await fetch(url);
	return await response.json();
};