import util from "util";
import chalk from "chalk";
/**
* @param {*} value A value that should be expanded
* @param {number} [minLength=2]
* 	The minimum length that the string, after expansion, should be
* @return {string}
* 	A string with content `value` that has been left-padded with zeros so that it is `minLength` characters long
*/
function fill(value, minLength = 2) {
	return value.toString().padLeft(minLength, "0");
}
/**
* Creates a timestamp
* @return {string}
* 	A timestamp that is used before every printed message
*/
function getTimestamp() {
	const now = new Date();
	const date = fill(now.getDate());
	const month = fill(now.getMonth() + 1);
	const year = now.getFullYear();
	const hours = fill(now.getHours());
	const minutes = fill(now.getMinutes());
	const seconds = fill(now.getSeconds());
	const milliseconds = fill(now.getMilliseconds(), 4);
	const formattedTime = `${hours}:${minutes}:${seconds}:${milliseconds}`;
	const formattedDate = `${year}-${month}-${date}`;
	const timestamp = `(${formattedDate} ${formattedTime})`;
	return timestamp;
}
/**
* Prints styled messages on the terminal
* @param {string} messageStyle
* 	An terminal-specific escape sequence used for coloring
* @param {string} title
* 	A title that will be displayed before a message to associate the colors to specific meanings
* @param {...*} args
* 	The arguments that should be printed in style
*/
export function print(messageStyle, title, ...args) {
	const printArgs = args.map(arg => {
		if (arg instanceof Error) {
			return arg.stack;
		}
		else if (typeof arg === "string") {
			return arg.replace(/"([^"]*)"/g, ($1, $2) => chalk.bold.green($2));
		}
		else {
			return arg instanceof Object ? util.inspect(arg, { colors: true,
				depth: null
			}) : arg;
		}
	});
	console.log(`${chalk.bold.white(getTimestamp())} ${title}${messageStyle(...printArgs)}`);
}
/**
* Logs a message on the terminal using the `default` style
* @param {...*} args
* 	The arguments that should be printed using the `default` style
*/
export function log(...args) {
	print(chalk.white, "", ...args);
}
/**
* Logs a message on the terminal using the `error` style
* @param {...*} args
* 	The arguments that should be printed using the `error` style
*/
export function err(...args) {
	print(chalk.bold.red, chalk.bold.red("Error: "), ...args);
}
/**
* Logs a message on the terminal using the `warning` style
* @param {...*} args
* 	The arguments that should be printed using the `warning` style
*/
export function warn(...args) {
	print(chalk.bold.yellow, chalk.bold.yellow("Warning: "), ...args);
}
/**
* Logs a message on the terminal using the `debug` style
* @param {...*} args
* 	The arguments that should be printed using the `debug` style
*/
export function debug(...args) {
	print(chalk.bold.magenta, chalk.bold.magenta("Debug: "), ...args);
}
export default log;