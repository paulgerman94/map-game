import { log } from "../util";
export function add({
	args,
	message,
	client
} = {}) {
	const sum = args.reduce((a, b) => a + b, 0);
	message.reply(sum);
};