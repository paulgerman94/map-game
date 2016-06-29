import WebPush from "web-push-encryption";
WebPush.setGCMAPIKey(process.env.GCM_KEY);
/**
* The sole purpose of this class is to send out push notifications to users' phones and browsers.
*/
export class PushNotifier {
	/**
	* Constructs a new {@link PushNotifier} instance
	* @param {Server} server
	* 	A reference to a {@link Server} object that can be used when a broadcast should be performed
	*/
	constructor(server) {
		this.server = server;
	}
	/**
	* Sends a push notification to a list of clients
	* @param {Array|Set} clients
	* 	The clients to send the notification to
	* @param {object} options
	* 	An object that defines how the push notification will look like
	* @param {string} [options.subject="Notification"]
	* 	The title of the notification
	* @param {string} options.image
	* 	A string that encodes the image that should be displayed in the notification
	* @param {string} options.body
	* 	The content of the notification
	*/
	notify(clients, {
		subject = "Notification",
		image,
		body
	} = {}) {
		for (const client of clients) {
			if (client.properties.subscription) {
				WebPush.sendWebPush(JSON.stringify({
					subject,
					image,
					body
				}), client.properties.subscription);
			}
		}
	}
}
export default PushNotifier;