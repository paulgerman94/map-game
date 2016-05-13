import util from "util";
export function log(...args) {
	console.log(util.inspect(...args, {
		colors: true,
		depth: null
	}));
};