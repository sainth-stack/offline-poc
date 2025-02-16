// public/service-worker.js
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  event.waitUntil(self.skipWaiting()); // Activate immediately
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated.");
  event.waitUntil(self.clients.claim()); // Take control immediately
});

self.addEventListener("fetch", (event) => {
  console.log("Service Worker fetching:", event.request.url);
});
