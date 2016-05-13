import "babel-polyfill";
import fetch from "node-fetch";
export const NODE = Symbol("[[Node]]");
export const WAY = Symbol("[[Way]]");
export const m = 1;
export const km = 1000 * m;
export class Entity {
	constructor(type, options) {
		if (type !== NODE && type !== WAY) {
			throw new Error("Unsupported type");
		}
		this.type = type;
		this.options = options;
	}
	get typeSource() {
		switch (this.type) {
			case NODE:
				return "node";
			case WAY:
				return "way";
		}
	}
};
export class Node extends Entity {
	constructor(options) {
		super(NODE, options);
	}
};
export class Way extends Entity {
	constructor(options) {
		super(WAY, options);
	}
};
export function find(entity) {
	return new Query(entity);
}
export class Query {
	constructor(entity) {
		this.searchEntity = entity;
	}
	compile() {
		/* Don't recompile */
		if (this.compiled) {
			return this.compiled;
		}
		/* For a query, first clarify what we're looking for */
		this.compiled = `${this.searchEntity.typeSource}["name"="${this.searchEntity.options.name}"];`;
		/* If we're looking for an entity around a point, specify it */
		if (this.aroundEntity) {
			this.compiled += `
				${this.aroundEntity.typeSource}
				(around:${this.aroundDistance})
				["name"="${this.aroundEntity.options.name}"];
			`;
		}
		return this.compiled.trim().replace(/\s+/g, "");
	}
	around(entity, distance = 1000 * m) {
		this.aroundEntity = entity;
		this.aroundDistance = distance;
		[this.aroundEntity, this.searchEntity] = [this.searchEntity, this.aroundEntity]
		return this;
	}
};
export async function execute(query) {
	/* Auto-compile all queries */
	let source = query.compiled || query.compile();
	const url = `http://overpass.osm.rambler.ru/cgi/interpreter?data=[out:json];${source}out body;`;
	const response = await fetch(url);
	const json = await response.json();
	return json
}
export async function getNode() {
	const darmstadt = new Node({
		name: "Darmstadt"
	});
	const frankfurt = new Node({
		name: "Frankfurt"
	});
	const query = find(darmstadt).around(frankfurt, 50 * km);
	return await retrieve(query);
};