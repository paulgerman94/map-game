/**
* Capitalizes a the first letter of a word and leaves the rest unchanged
* @param {string} word
* 	The word to be capitalized
* @return {string}
* 	A string where the first letter is capitalized and the rest remains unchanged
*/
export function capitalize(word) {
	return `${word.at(0).toUpperCase()}${word.substr(1)}`;
}