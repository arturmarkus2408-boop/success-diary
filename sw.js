const CV="success-diary-v1",SC=CV+"-s",RC=CV+"-r";
const STATIC=[".","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./icon-maskable-192.png","./icon-maskable-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(SC).then(c=>c.addAll(STATIC)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>!k.startsWith(CV)).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET")return;
  const isHTML=r.mode==="navigate"||(r.headers.get("accept")||"").includes("text/html");
  if(isHTML){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(SC).then(ca=>ca.put(r,c));return res;}).catch(()=>caches.match(r).then(c=>c||caches.match("./index.html"))));return;}
  e.respondWith(caches.match(r).then(c=>{if(c)return c;return fetch(r).then(res=>{if(res&&res.status===200&&(res.type==="basic"||res.type==="cors")){const cp=res.clone();caches.open(RC).then(ca=>ca.put(r,cp));}return res;}).catch(()=>c);}));
});
self.addEventListener("notificationclick",e=>{
  e.notification.close();
  e.waitUntil((async()=>{const all=await self.clients.matchAll({type:"window",includeUncontrolled:true});for(const c of all){if("focus"in c){try{return await c.focus();}catch{}}}if(self.clients.openWindow)return self.clients.openWindow("./");})());
});
