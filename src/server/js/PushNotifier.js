import WebPush from "web-push-encryption";
import Telegram from "telegram-bot-api";
import { setTelegramChatID } from "./db";
WebPush.setGCMAPIKey(process.env.GCM_KEY);
/**
* The sole purpose of this class is to send out push notifications to users' phones and browsers.
*/
export default class PushNotifier {
	/**
	* Constructs a new {@link PushNotifier} instance
	* @param {Server} server
	* 	A reference to a {@link Server} object that can be used when a broadcast should be performed
	*/
	constructor(server) {
		/**
		* A reference to a {@link Server} object that can be used when a broadcast should be performed
		*/
		this.server = server;
		this.telegram = new Telegram({
			token: process.env.TELEGRAM_KEY,
			updates: {
				enabled: true
			}
		});
		this.telegram.on("message", message => {
			console.log(message);
			try {
				const telegramChatID = message.chat.id;
				const [, telegramToken] = message.text.match(/\/start (.*)/);
				for (const client of server.clients) {
					const user = client.properties.user;
					if (user && user.telegramToken === telegramToken) {
						const { accountName } = user;
						const { db } = server;
						user.telegramChatID = telegramChatID;
						setTelegramChatID({
							db,
							accountName,
							telegramChatID
						});
					}
				}
			}
			catch (e) {
				console.log(e);
				/* Ignore all other messages */
			}
		});
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
			if (client.properties.user && client.properties.user.telegramChatID) {
				this.telegram.sendMessage({
					text: `*${subject}*\n${body}`,
					"chat_id": client.properties.user.telegramChatID,
					"parse_mode": "Markdown"
				});
			}
		}
	}
}