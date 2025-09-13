self.addEventListener("install" , function (installEvent) {

    installEvent.waitUntil(
        caches.open("admin")
    )

})

self.addEventListener("fetch", function (fetchEvent) {

    let method = fetchEvent.request.method; 
    if(method == "GET") {
    fetchEvent.respondWith(fetch(fetchEvent.request,{credentials:"include"}).then(res => {
        let clone = res.clone();
        if(fetchEvent.request.url.startsWith("http")) {
            caches.open("admin").then(cache => {
                cache.put(fetchEvent.request,clone)
            })
        }
        return res;
    }
    ).catch(err => {
        console.log(err, "in the sw")
    }))

    }
    
})