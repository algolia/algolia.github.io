
const toolbox = require('sw-toolbox');

const cacheName = `algoliaCache_${Date.now()}`;

toolbox.router.get('https://community.algolia.com/*.html', toolbox.fastest);
toolbox.router.get('https://community.algolia.com/', toolbox.fastest);
toolbox.router.get('https://community.algolia.com', toolbox.fastest);

toolbox.router.get(/https\:\/\/community\.algolia\.com\/js\/app\-(.*[a-z0-9]).js/g, toolbox.fastest);

// Replace old service
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [cacheName];
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});