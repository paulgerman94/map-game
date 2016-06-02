import fs from "fs";
/**
* Models a generic {@link Promise} wrapper for various callback-based APIs
* @param {function} resolve
* 	A function that is invoked when the {@link Promise resolves}
* @param {function} reject
* 	A function that is invoked when the {@link Promise rejects}
* @return {Promise}
* 	A {@link Promise} that rejects if the callback's error argument is truthy; resolves with the result otherwise
*/
export function defer(resolve, reject) {
	return (err, result) => {
		if (err) {
			reject(err);
		}
		else {
			resolve(result);
		}
	};
}
/**
* Returns the contents of a file
* @param {string} file
* 	The file path that should be read
* @return {string}
* 	The file contents
*/
export function getFileContents(file) {
	return new Promise((resolve, reject) => {
		fs.readFile(file, "utf-8", defer(resolve, reject));
	});
}
/**
* Returns the SQL source code of a file
* @param {string} name
* 	The basename of the SQL file to be read
* @return {string}
* 	The SQL source code, ready to be run against a database instance
*/
export async function getSQL(name) {
	return await getFileContents(`src/server/sql/${name}.sql`);
}