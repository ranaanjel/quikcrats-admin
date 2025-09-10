self.addEventListener("install" , function (installEvent) {

    installEvent.waitUntil(
        caches.open("admin")
    )

})

self.addEventListener("fetch", function (fetchEvent) {
    
    fetchEvent.respondWith(fetch(fetchEvent.request).then(res => {
        let clone = res.clone();
        if(fetchEvent.request.url.startsWith("http")) {
            caches.open("admin").then(cache => {
                cache.put(fetchEvent.request,clone)
            })
        }

        return res
    }
    ).catch())
})