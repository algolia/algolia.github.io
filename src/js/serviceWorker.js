
const toolbox = require('sw-toolbox');

const cacheName = `algoliaCache_${Date.now()}`;

toolbox.router.get('/*.html', toolbox.fastest);
toolbox.router.get('/', toolbox.fastest);

// Replace old service
self.addEventListener('install', function(event) {
  console.log('INSTALLED');
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