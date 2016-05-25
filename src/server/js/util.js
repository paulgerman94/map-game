import util from "util";
import chalk from "chalk";
export function print(messageStyle, title, ...args) {
	function fill(value, minLength = 2) {
		return value.toString().padLeft(minLength, "0");
	}
	let now = new Date();
	let date = fill(now.getDate());
	let month = fill(now.getMonth() + 1);
	let year = now.getFullYear();
	let hours = fill(now.getHours());
	let minutes = fill(now.getMinutes());
	let seconds = fill(now.getSeconds());
	let milliseconds = fill(now.getMilliseconds(), 4);
	let formattedTime = `${hours}:${minutes}:${seconds}:${milliseconds}`;
	let formattedDate = `${year}-${month}-${date}`;
	let timestamp = `(${formattedDate} ${formattedTime})`;
	let printArgs = args.map(arg => {
		if (arg instanceof Error) {
			return arg.stack;
		}
		else if (typeof arg === "string") {
			return arg.replace(/"([^"]*)"/g, function($1, $2) {
				return chalk.bold.green($2);
			});
		}
		else {
			return arg instanceof Object ? util.inspect(arg, {
				colors: true,
				depth: null
			}) : arg;
		}
	});
	console.log(`${chalk.bold.white(timestamp)} ${title}${messageStyle(...printArgs)}`);
};
export function log(...args) {
	print(chalk.white, "", ...args);
}
export function err(...args) {
	print(chalk.bold.red, chalk.bold.red("Error: "), ...args);
};
export function warn(...args) {
	print(chalk.bold.yellow, chalk.bold.yellow("Warning: "), ...args);
};
export function debug(...args) {
	print(chalk.bold.magenta, chalk.bold.magenta("Debug: "), ...args);
};
export default log;