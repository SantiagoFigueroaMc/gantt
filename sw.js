const CACHE_NAME = 'v1-mi-sitio-offline';
const ASSETS = [
  '/',
  'file-dropzone.css',
  'gantt_2.css',
  'gantt_2.html',
  'gantt_2.js',
  'gantt.css',
  'index.html',
  'style.css',
  'theme.css',
  'theme.js',
  'js/clipboard.js',
  'js/dates.js',
  'js/file.js',
  'js/gantt.js',
  'js/main.js',
  'js/observable.js',
  'js/state.js',
  'js/storage.js',
  'js/table.js',
];

// Instalación: Cachear archivos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Abriendo caché y agregando assets');
      // Usamos .map para agregar uno por uno y evitar que falle todo el grupo
      return Promise.all(
        ASSETS.map(url => {
          return cache.add(url).catch(err => {
            console.error('No se pudo cachear:', url, err);
          });
        })
      );
    })
  );
});


// Fetch: Servir desde caché o ir a la red
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
