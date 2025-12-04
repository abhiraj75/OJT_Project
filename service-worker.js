// SERVICE WORKER – CyberDodge

// A version number so we can force updates when needed
const CACHE_NAME = "cyberdodge-v1";

// List of files to cache immediately when SW installs
const STATIC_ASSETS = [
  "/",               // main HTML route
  "/index.html",     // your game HTML
  "/style.css",      // CSS
  "/script.js",      // JS logic
];

/*
-----------------------------------
 INSTALL EVENT
-----------------------------------
Runs when the browser first installs the Service Worker.
We use it to pre-cache the static files.
*/
self.addEventListener("install", (event) => {
  console.log("[SW] Install event");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );

  // Activate the SW immediately without waiting
  self.skipWaiting();
});

/*
-----------------------------------
 ACTIVATE EVENT
-----------------------------------
Runs when the Service Worker activates.
We use it to delete old caches based on version.
*/
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate event");

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME) // delete old versions
          .map((key) => {
            console.log("[SW] Removing old cache:", key);
            return caches.delete(key);
          })
      )
    )
  );

  // Claim clients so the SW applies immediately
  self.clients.claim();
});

/*
-----------------------------------
 FETCH EVENT
-----------------------------------
Intercepts every network request.
We serve files from CACHE first → if not found, fetch from network.
*/
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If found in cache → serve instantly
      if (cachedResponse) {
        return cachedResponse;
      }

      // Else fetch from network and store in cache (optional)
      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      });
    })
  );
});