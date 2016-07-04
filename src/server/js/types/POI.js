import pgp from "pg-promise";
const pgpDB = pgp();
/**
* This class is mostly used as a custom SQL serialization representation for a composite type
*/
export class POI {
	/**
	* Constructs a new POI instance for database communication
	* @param {number} id
	* 	The element ID to be saved in the database
	* @param {string} type
	* 	The element type to be saved in the database
	* @param {object} element
	* 	The raw OSM element (to be saved as metadata in the database) to be associated with this POI
	*/
	constructor(id, type, element) {
		/**
		* Tells `pg-promise` that this type is to be parsed as it is
		* @type {boolean}
		*/
		this._rawDBType = true;
		/**
		* The OSM ID that the POI can be linked to
		* @type {number}
		*/
		this.id = id;
		/**
		* The type of OSM element that we're dealing with
		* @type {string}
		*/
		this.type = type;
		/**
		* The raw OSM element (to be saved as metadata in the database) to be associated with this POI
		* @type {object}
		*/
		this.element = element;
	}
	/**
	* Serializes and escapes this type for `pg-promise`
	* @return {string}
	* 	A string that is safe to use within SQL queries
	*/
	formatDBType() {
		return pgpDB.as.format("poi(${id}, ${type})", {
			id: this.id,
			type: this.type
		});
	}
	/**
	* Parses a single POI serialization that the database returns
	* @param {string} string
	* 	The serialized POI to parse
	* @return {POI}
	* 	A POI instance that is described by `string`
	*/
	static parse(string) {
		const [id, type] = string.split(",");
		return new POI(Number(id), type);
	}
	/**
	* Parses a POI array serialization that the database returns
	* @param {string} string
	* 	The serialized POI array to parse
	* @return {Array.<POI>}
	* 	An array of {@link POI} instances that are described by their corresponding serializations
	*/
	static parseArray(string) {
		if (string === "{}") {
			return [];
		}
		return string
			.replace(/"|({{)|(}})/g, "")
			.split(`),(`)
			.map(x => x.replace(/[()]/g, ""))
			.map(s => this.parse(s));
	}
}
export default POI;