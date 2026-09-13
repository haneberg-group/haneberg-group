/* Haneberg Group LTD — service worker.
 *
 * Bump VERSION whenever a cached file changes, otherwise returning visitors
 * keep the old copy until their cache is evicted.
 */

var APP_PREFIX = 'hgroup_';
var VERSION = 'v1';
var CACHE = APP_PREFIX + VERSION;

// Core shell, fetched up front so the site works offline after the first visit.
var PRECACHE = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/nav.js',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/assets/icons/favicon-32x32.png',
  '/assets/icons/android-icon-96x96.png',
  '/assets/icons/android-icon-192x192.png',
  '/assets/icons/apple-icon-180x180.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE)
      // addAll is atomic: one 404 would reject the whole install, so each entry
      // is added on its own and failures are tolerated.
      .then(function (cache) {
        return Promise.all(PRECACHE.map(function (url) {
          return cache.add(new Request(url, { cache: 'reload' })).catch(function () {});
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (key) {
          if (key !== CACHE && key.indexOf(APP_PREFIX) === 0) return caches.delete(key);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network first, so content updates land immediately; the cached
  // shell is the offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          var copy = response.clone();
          caches.open(CACHE).then(function (cache) { cache.put('/index.html', copy); });
          return response;
        })
        .catch(function () {
          return caches.match(request).then(function (hit) {
            return hit || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Assets: serve from cache immediately, refresh in the background.
  event.respondWith(
    caches.match(request).then(function (hit) {
      var network = fetch(request)
        .then(function (response) {
          if (response && response.status === 200 && response.type === 'basic') {
            var copy = response.clone();
            caches.open(CACHE).then(function (cache) { cache.put(request, copy); });
          }
          return response;
        })
        .catch(function () { return hit; });

      return hit || network;
    })
  );
});
