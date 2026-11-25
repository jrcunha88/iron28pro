const C="iron28-v22";
const F=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-180.png"];
// Baixa sempre do servidor (ignora o cache HTTP do navegador) ao instalar
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>fetch(new Request(u,{cache:"reload"})).then(r=>c.put(u,r))))));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  const pagina = e.request.mode==="navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("index.html");
  if(pagina){ // página: sempre a versão mais nova quando há internet; offline usa a cópia salva
    e.respondWith(fetch(e.request.url,{cache:"no-store"}).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put("index.html",cp));return res;}).catch(()=>caches.match("index.html").then(r=>r||caches.match("./"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res;})));
});
