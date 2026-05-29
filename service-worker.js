/* =========================================================================
 *  수료증 발급기 — Service Worker
 *  - 캐시 우선(Cache First) 전략으로 오프라인에서도 동작하도록 한다.
 *  - 새 버전 배포 시 CACHE_VERSION 값을 올리면 이전 캐시는 activate에서 자동 삭제.
 * =======================================================================*/

// ▼ 새 버전 배포 시 이 값만 +1 하면 됨 (예: 'v1' → 'v2' → 'v3' ...)
const CACHE_VERSION = 'v4';
const CACHE_NAME = `cert-app-${CACHE_VERSION}`;

// 설치 시점에 미리 받아둘 파일 목록 — 오프라인 동작을 위한 기본 셋
const PRECACHE_URLS = [
  './',
  './index.html',
  './template.docx',
  './manifest.json',
  './favicon.ico',
  './icons/favicon-16x16.png',
  './icons/favicon-32x32.png',
  './icons/favicon-48x48.png',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  // 외부 CDN 라이브러리 (한 번 받아두면 오프라인에서도 docx 생성 가능)
  'https://unpkg.com/pizzip/dist/pizzip.js',
  'https://unpkg.com/pizzip/dist/pizzip-utils.js',
  'https://unpkg.com/docxtemplater/build/docxtemplater.js',
  'https://unpkg.com/file-saver/dist/FileSaver.min.js',
];

/**
 * install: 위 목록을 일괄 캐시.
 *  - 일부 파일(icons 미준비 등)이 실패해도 전체 설치가 막히지 않도록
 *    각 URL을 개별 fetch + put 으로 처리한다.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'reload' });
            if (res && res.ok) {
              await cache.put(url, res.clone());
            }
          } catch (err) {
            // 한 파일 실패가 전체 설치를 막지 않도록 무시 (로그만 남김)
            console.warn('[SW] precache 실패:', url, err);
          }
        })
      );
    })()
  );
  // 새 SW가 즉시 활성화되도록
  self.skipWaiting();
});

/**
 * activate: 이전 버전 캐시 삭제 + 즉시 클라이언트 제어 시작
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith('cert-app-') && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

/**
 * fetch: Cache First 전략
 *  - 캐시에 있으면 즉시 반환
 *  - 없으면 네트워크 요청 후 응답을 캐시에 저장하고 반환
 *  - 네트워크도 실패하면 캐시된 fallback 반환 (없으면 그대로 실패)
 */
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // GET 요청만 캐시 대상 (POST/PUT/DELETE 등은 그대로 통과)
  if (req.method !== 'GET') return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      if (cached) return cached;

      try {
        const res = await fetch(req);
        // 정상 응답만 캐시에 저장 (opaque 응답은 그대로 저장)
        if (res && (res.status === 200 || res.type === 'opaque')) {
          cache.put(req, res.clone()).catch(() => {});
        }
        return res;
      } catch (err) {
        // 네트워크 실패 시 마지막으로 한 번 더 매칭 시도
        const fallback = await cache.match(req);
        if (fallback) return fallback;
        throw err;
      }
    })()
  );
});
