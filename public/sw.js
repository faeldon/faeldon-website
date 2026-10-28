// Kill switch for the service worker gatsby-plugin-offline registered at /sw.js. Browsers that
// still have it fetch this file on their next visit, and it removes itself and every cache, then
// reloads the open tabs so they load the site from the network. Never register a worker here.
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      await self.registration.unregister()
      const clients = await self.clients.matchAll({ type: 'window' })
      clients.forEach((client) => client.navigate(client.url))
    })(),
  )
})
