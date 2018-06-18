const toolbox = require('sw-toolbox');

const cacheName = `algoliaCache_${Date.now()}`;

toolbox.router.get('https://community.algolia.com/*.html', toolbox.fastest);
toolbox.router.get('https://community.algolia.com/', toolbox.fastest);
toolbox.router.get('https://community.algolia.com', toolbox.fastest);

toolbox.router.get(
  /https:\/\/community\.algolia\.com\/js\/app-(.*[a-z0-9]).js/g,
  toolbox.fastest
);

// Replace old service
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [cacheName];
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(key);
          }

          return key;
        })
      )
    )
  );
});
