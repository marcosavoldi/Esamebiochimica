const cacheName = 'test-app-cache-v1';
const filesToCache = [
    './', // La pagina principale (root)
    './index.html', // La pagina del test
    './control_panel.html', // La pagina del pannello di controllo
    './service-worker.js', // Il service worker stesso
];

// Installazione del Service Worker e caching delle risorse
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
    console.log('Service Worker installato e risorse messe in cache');
});

// Attivazione del Service Worker e pulizia delle cache vecchie
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        console.log('Cache vecchia rimossa:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    console.log('Service Worker attivato');
});

// Intercetta le richieste di rete e serve i file dalla cache quando possibile
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                console.log('Risorsa servita dalla cache:', event.request.url);
                return response;
            }
            console.log('Risorsa richiesta dalla rete:', event.request.url);
            return fetch(event.request);
        })
    );
});