import Point from "../Point";
import { km } from "../units";
import { err } from "../util";
/**
* Adds an array of numbers and sends the sum back to the client.
* @param {object} options An object
* @param {Array.<number>} options.args
* 	The arguments provided by the caller. Here, the array is to be expected to be an array of numbers.
* @param {Message} options.message
* 	An RPC message object that can be used to send a reply
* @param {RPCClient} options.client
* 	The RPC client that has called the function
*/
export function add({
	args,
	message
} = {}) {
	const sum = args.reduce((a, b) => a + b, 0);
	message.reply(sum);
}
/**
* @param {object} options An object
* @param {Array.<number>} options.args
* 	The arguments provided by the caller. Here, the arguments are expected to contain at least one object that matches the properties of a `Position` (GeoLocation API) object.
* @param {Message} options.message
* 	An RPC message object that can be used to send a reply
* @param {RPCClient} options.client
* 	The RPC client that has called the function
*/
export async function getPOIs({
	args,
	message
}) {
	try {
		const [coordinates] = args;
		const {
			latitude,
			longitude
		} = coordinates;
		const point = new Point({
			latitude,
			longitude
		});
		const results = await point.closest(["restaurant"], km);
		message.reply(results);
	}
	catch (e) {
		err(e);
	}
}