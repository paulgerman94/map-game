/**
* Asks the server to send a list of POIs to the client.
* Later on in development, these should be exactly the flag positions in the player's vicinity.
* @param {Client} client
* 	The client singleton that proxies requests to the server
* @return {Promise}
* 	The `Promise` resolves with an {@link Array} of POIs and rejects with the type of error that occurred.
*/
export default async function getPOIs(client) {
	return new Promise((resolve, reject) => {
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(async ({
				coords
			}) => {
				const payload = {};
				for (const key in coords) {
					/* For DOM objects, the properties don't reside on the prototype */
					if (!coords.hasOwnProperty(key)) {
						payload[key] = coords[key];
					}
				}
				try {
					const [pois] = await client.getPOIs(payload);
					resolve(pois.elements);
				}
				catch (e) {
					reject(e);
				}
			}, error => {
				reject(error);
			});
		}
		else {
			console.log("Sorry, your device doesn't support GeoLocation.");
		}
	});
}