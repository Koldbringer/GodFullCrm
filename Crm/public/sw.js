// Service Worker for offline map support
const CACHE_NAME = 'hvac-crm-map-cache-v1';
const TILE_CACHE_NAME = 'hvac-crm-map-tiles-v1';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/map/offline',
  '/api/sample-data',
];

// OpenStreetMap tile URL pattern
const OSM_TILE_URL_PATTERN = /^https:\/\/[a-z]\.tile\.openstreetmap\.org\//;

// Install event - precache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return (cacheName !== CACHE_NAME && cacheName !== TILE_CACHE_NAME);
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle map tile requests separately
  if (OSM_TILE_URL_PATTERN.test(event.request.url)) {
    event.respondWith(handleMapTileRequest(event.request));
    return;
  }
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    // For API requests, try network first, then cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to store in cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response to store in cache
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
      })
  );
});

// Handle map tile requests
async function handleMapTileRequest(request) {
  // Try to get from cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, fetch from network
  try {
    const response = await fetch(request);
    
    // Cache the tile for future use
    const cache = await caches.open(TILE_CACHE_NAME);
    cache.put(request, response.clone());
    
    return response;
  } catch (error) {
    // If network request fails, return a fallback tile or error
    console.error('Failed to fetch map tile:', error);
    
    // You could return a fallback tile image here
    // For now, we'll just return a 404
    return new Response('Tile not available offline', { status: 404 });
  }
}