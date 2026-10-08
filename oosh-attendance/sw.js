// OOSH Attendance moved to https://ooshonline.github.io/oosh-attendance/ (2026-10).
// This replacement worker removes itself from the old address. It deliberately leaves the
// Cache Storage alone: caches are shared across the whole github.io origin, and the app at
// its new address uses the same cache name.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(self.registration.unregister().then(() => self.clients.matchAll()).then(cs => cs.forEach(c => c.navigate(c.url))));
});
