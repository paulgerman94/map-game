const CACHE_NAME = location.host;
let cacheURLs = [
	"/game/"
];
self.addEventListener("install", e => {
	e.waitUntil(caches.open(CACHE_NAME).then(cache => {
		return cache.addAll(cacheURLs);
	}));
});
self.addEventListener("fetch", e => {
	e.respondWith(caches.match(e.request).then(response => {
		let isOnline = navigator.onLine;
		if (!isOnline) {
			if (response) {
				console.log(response);
				return response;
			}
			else {
				console.log("no response found:", response);
				return fetch(e.request);
			}
		}
		else {
			return fetch(e.request);
		}
	}).catch(e => {
		console.log("noo");
	}));
});