/* eslint-disable no-restricted-globals */

const CACHE_NAME = "my-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/static/js/bundle.js",
    "/static/css/main.css",
    "/logo192.png",
    "/models/tiny_face_detector_model-weights_manifest.json",  // Cache model files
    "/models/tiny_face_detector_model-shard1",  // Cache model weights
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        })
    );
});
