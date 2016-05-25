import { log } from "../util";
export function add({
	args,
	message,
	client
} = {}) {
	log("A client wants to add the numbers: ", args);
	const sum = args.reduce((a, b) => a + b, 0);
	message.reply(sum);
}