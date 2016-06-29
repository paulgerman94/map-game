// const CACHE_NAME = location.host;
// const cacheURLs = [
// 	"/<%LINUX_USERNAME%>/"
// ];
self.addEventListener("install", () => {
	// e.waitUntil(caches.open(CACHE_NAME).then(cache => {
	// 	return cache.addAll(cacheURLs);
	// }));
	self.skipWaiting();
});
self.addEventListener("fetch", e => {
	e.respondWith(caches.match(e.request).then(response => {
		const isOnline = navigator.onLine;
		if (!isOnline) {
			if (response) {
				console.log(response);
				return response;
			}
			console.log("no response found:", response);
			return fetch(e.request);
		}
		return fetch(e.request);
	}).catch(() => {
		console.log("noo");
	}));
});
self.addEventListener("push", e => {
	const payload = e.data.json();
	self.registration.showNotification(payload.subject, {
		body: payload.body,
		icon: payload.icon
	});
});