/**
* @param {object} options An object
* @param {Array} options.args
* 	The arguments passed by the caller
* @param {Message} options.message
* 	An RPC message object that can be used to send a reply
* @param {RPCClient} options.client
* 	The RPC client that has called the function
* @return {number}
* 	The sum of all the numbers passed in `args`
*/
export function add({
	args,
	message
} = {}) {
	const sum = args.reduce((a, b) => a + b, 0);
	message.reply(sum);
}