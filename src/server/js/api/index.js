export function add({
	args,
	message
} = {}) {
	const sum = args.reduce((a, b) => a + b, 0);
	message.reply(sum);
}