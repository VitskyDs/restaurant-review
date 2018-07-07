/*Register SW*/
if (navigator.serviceWorker) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').then((registration) => {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch((err) => {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}


/*on install cache all thats specified*/
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('restaurant-review-v1').then(function (cache) {
            return cache.addAll([
                './', './index.html', './img/', './img/1.jpg'
            ]);
        })
    );
});

/*If request is cached, respond with the cached content*/
self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                return response;
            } else {
                caches.put(response);
                fetch(event.request)
            }
        });
    );
});
