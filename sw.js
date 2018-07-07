var CACHE = 'restaurant-review';

//listen to installation and finish only when the precache promise resolved
self.addEventListener('install', (event) => {
    console.log('sw is being installed');
    event.waitUntil(precache());
});

//listen to fetch. respond from the cache.
/*self.addEventListener('fetch', (event) => {
    console.log('The service worker is serving the asset.');
    event.respondWith(fromNetwork(event.request, 400).catch(() => {
        return fromCache(event.request);
    }));
    event.respondWith(update(event.request));
});*/
self.addEventListener('fetch', (event) => {
    event.respondWith(

        caches.match(event.request).then(function (response) {
            update(event.request);
            return response || fetch(event.request);
        });
    );
});


//precache function - open up a new cache and add all that's needed
const precache = () => {
    console.log('caching');
    return caches.open(CACHE).then((cache) => {
        return cache.addAll([
            'index.html',
            'favicon.ico',
            'index.js',
            'resturant.html',
            'css/styles.css',
            'data/restuarant.json',
            'js/main.js',
            'js/dbhelper.js',
            'js/restaurant_info.js'
        ])
    });
}

//retrieve request from cache
const fromCache = (request) => {
    console.log('retreiving from cache if available');
    return caches.open(CACHE).then((cache) => {
        return cache.match(request).then((matching) => {
            return matching || fetch(request);
        });
    });
}

//update cache with new responses
const update = (request) => {
    console.log('updating cache');

    return caches.open(CACHE).then((cache) => {
        return fetch(request).then((response) => {
            return cache.put(request, response);
        });
    });
}

//respond from network
const fromNetwork = (request, timeout) => {
    return new Promise((fulfill, timeout) => {
        var timeoutId = setTimeout(reject, timeout);

        fetch(request).then((response) => {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
};
