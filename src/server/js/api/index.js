/**
* Adds an array of numbers and sends the sum back to the client.
* @param {object} options An object
* @param {Array.<number>} options.args
* 	The arguments passed by the caller
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