'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "e66010ffc8fc2bebe9c28e4bb39aeaaa",
"assets/assets/game_pages/close_game_arrow.png": "daaf7b9e58c1363238c865556a396cf2",
"assets/assets/game_pages/difficulty_level.png": "35e6b1c1df29300498775946f7ef9487",
"assets/assets/game_pages/difficulty_level_fill.png": "28091f883ed39aa9f6fa56da2d64e3ee",
"assets/assets/game_pages/dots_and_lines/dot_icon.png": "0647028df01575e0e20182fa4bf1d0fe",
"assets/assets/game_pages/game_page_background.png": "2bc202c979785dfd4f3fd8a5b699504f",
"assets/assets/game_pages/settings/settings_window_notch.png": "45adb00c82d987e26af4165f1cebc7c2",
"assets/assets/game_pages/settings/slider_selection_4.png": "ac6caf0f010bdea73e987efb7c587c0f",
"assets/assets/game_pages/tic_tac_toe/field_grid.png": "8f372c2c84838ffa8cf877a5eaa884f1",
"assets/assets/game_pages/tic_tac_toe/o_dark.png": "32637dee171056b59bb9898fb1a3c105",
"assets/assets/game_pages/tic_tac_toe/o_icon.png": "8d2c1ae9c7042aba74d4b8a421868067",
"assets/assets/game_pages/tic_tac_toe/o_white.png": "d61cb5462018a28ea4ce0470a5d455e1",
"assets/assets/game_pages/tic_tac_toe/win_o.png": "911c1c2ca631f887ae3d4fc48082ba74",
"assets/assets/game_pages/tic_tac_toe/win_x.png": "f35610a3a7fa4ca568077c8698c73852",
"assets/assets/game_pages/tic_tac_toe/x_dark.png": "46714ccc5fbd6f16baf5d38cedaf0c32",
"assets/assets/game_pages/tic_tac_toe/x_icon.png": "3cb8a7c2dcf41e1ceb3cee5cfa16fa0b",
"assets/assets/game_pages/tic_tac_toe/x_white.png": "0c0ed96619c575532fa49c20a5ee872e",
"assets/assets/game_pages/undo_move_arrow.png": "650c3078a0d0711f4467d3e9dffc63a0",
"assets/assets/main_menu/menu_background.png": "01d3a846465b55d5d4e91f0dba432d35",
"assets/assets/main_menu/play.png": "46824b5ff6c47429393ecdd236de0c35",
"assets/assets/main_menu/rect_play.png": "55d864ed0db888a51d0aebc43edc789b",
"assets/assets/main_menu/settings.png": "baa54b8325fbbb4b4ce7b4b91be5859d",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "477358d9e0e4813614d39d8849e8f08c",
"assets/shaders/ink_sparkle.frag": "6333b551ea27fd9d8e1271e92def26a9",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "940f224bdc620eafe7072d3d4c094129",
"/": "940f224bdc620eafe7072d3d4c094129",
"main.dart.js": "4c9af41242cca67e51ad86c77a576bae",
"manifest.json": "bf487b3f0e70abda1bb51c3d52f41913",
"version.json": "59dcc39cdce675c5aa2ec03702f67326"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
