import WebPush from "web-push-encryption";
import Telegram from "telegram-bot-api";
import { setTelegramChatID, queryUserInformation } from "./db";
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
		/**
		* A reference to a an instance of `telegram-bot-api` that can be used to message a user via Telegram
		*/
		this.telegram = new Telegram({
			token: process.env.TELEGRAM_KEY,
			updates: {
				enabled: true
			}
		});
		this.telegram.on("message", message => {
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
	notifyClients(clients, {
		subject = "Notification",
		icon = "img/logo-192.png",
		body
	} = {}) {
		for (const client of clients) {
			if (client.properties.user && client.properties.user.subscription) {
				WebPush.sendWebPush(JSON.stringify({
					subject,
					icon,
					body
				}), client.properties.user.subscription);
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
	/**
	* Sends a push notification to a list of account names
	* @param {Array<string>|Set<string>} accountNames
	* 	The accountNames to send the notification to
	* @param {object} options
	* 	An object that defines how the push notification will look like
	* @param {string} [options.subject="Notification"]
	* 	The title of the notification
	* @param {string} options.image
	* 	A string that encodes the image that should be displayed in the notification
	* @param {string} options.body
	* 	The content of the notification
	*/
	async notifyAccounts(accountNames, {
		subject = "Notification",
		icon = "img/logo-192.png",
		body
	} = {}) {
		const { db } = this.server;
		const accountInfos = accountNames.map(async accountName => queryUserInformation({
			accountName,
			db
		}));
		Promise.all(accountInfos).then(accountInfos => {
			for (const accountName of accountNames) {
				const accountInfo = accountInfos.find(accountInfo => accountInfo.accountName === accountName);
				const webPushSubscription = JSON.parse(accountInfo.webpushSubscription);
				const telegramChatID = accountInfo.telegramChatID;
				if (webPushSubscription) {
					WebPush.sendWebPush(JSON.stringify({
						subject,
						icon,
						body
					}), webPushSubscription);
				}
				if (telegramChatID) {
					this.telegram.sendMessage({
						text: `*${subject}*\n${body}`,
						"chat_id": telegramChatID,
						"parse_mode": "Markdown"
					});
				}
			}
		});
	}
}