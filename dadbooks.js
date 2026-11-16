/* French Family Travels · Dad's Books
   Art French's own Shutterfly photo books, page by page.
   Viking, Regal and Paris show his printed Shutterfly pages, with any photo the print file left out put back in its frame.
   The other books are rebuilt from his saved page layouts: every photo where he placed it, every caption he typed, on his line breaks. */
(function(){
const css=`
.db{max-width:1240px;margin:0 auto;padding-block:28px 60px;padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px))}
.db h1{font-family:var(--display);font-weight:400;font-size:clamp(34px,5vw,56px);margin:4px 0 6px;line-height:1}
.db .lede{max-width:62ch;color:var(--muted);font-size:15px;line-height:1.55;margin:0 0 26px}
.dbshelf{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:28px 22px}
.dbbook{display:flex;flex-direction:column;gap:10px;text-align:left;color:var(--ink);text-decoration:none;cursor:pointer;background:none;border:0;padding:0;font:inherit}
.dbcover{position:relative;aspect-ratio:1.29;border-radius:4px 10px 10px 4px;overflow:hidden;background:var(--chip);box-shadow:-6px 0 0 -2px color-mix(in srgb,var(--ink) 25%,transparent) inset,0 2px 4px rgba(0,0,0,.18),0 22px 40px -22px rgba(0,0,0,.65);transition:transform .25s cubic-bezier(.2,.7,.2,1),box-shadow .25s}
.dbcover::after{content:"";position:absolute;inset:0 auto 0 0;width:7%;background:linear-gradient(90deg,rgba(0,0,0,.28),rgba(255,255,255,.08) 55%,transparent);pointer-events:none}
.dbbook:hover .dbcover,.dbbook:focus-visible .dbcover{transform:translateY(-4px) rotate(-.4deg);box-shadow:-6px 0 0 -2px color-mix(in srgb,var(--ink) 25%,transparent) inset,0 4px 8px rgba(0,0,0,.2),0 30px 50px -22px rgba(0,0,0,.7)}
.dbcover>img{width:100%;height:100%;object-fit:cover;display:block}
.dbcover .dbpage{position:absolute;inset:0;width:100%;height:100%;aspect-ratio:auto;box-shadow:none;border-radius:0}
.dbbook b{font-family:var(--display);font-weight:400;font-size:21px;line-height:1.1}
.dbmeta{display:flex;flex-wrap:wrap;gap:4px 10px;font-size:12.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.dbtag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;padding:3px 8px;border-radius:999px;background:var(--chip);color:var(--gold);align-self:flex-start}
/* a page rebuilt from Dad's layout */
.dbpage{position:relative;container-type:inline-size;aspect-ratio:var(--ar);width:100%;color:#232733;overflow:hidden;
  background:radial-gradient(120% 90% at 50% 40%,#FDFBF6 0%,#F7F2E7 70%,#EFE8D8 100%);box-shadow:0 1px 2px rgba(0,0,0,.2),0 24px 50px -28px rgba(0,0,0,.7)}
.dbpage::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .38 0 0 0 0 .25 0 0 0 .07 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}
.dbpage .ph{position:absolute;padding:.5cqw;background:#fff;border:0;box-shadow:0 .12cqw .3cqw rgba(0,0,0,.18),0 .5cqw 1.3cqw -.3cqw rgba(0,0,0,.3);box-sizing:border-box;cursor:zoom-in;transition:transform .2s}
.dbpage .ph:hover{transform:translateY(-.15cqw)}
.dbpage .ph img{width:100%;height:100%;object-fit:cover;display:block;background:#e9e4d8}
.dbpage .tx{position:absolute;z-index:2;text-align:center;white-space:normal;overflow-wrap:break-word;hyphens:manual;font-family:'EB Garamond',Garamond,Georgia,serif;font-kerning:normal;font-feature-settings:"liga","kern";text-wrap:pretty}
.dbpage .tx.hd{font-family:'Cormorant Garamond','EB Garamond',Garamond,Georgia,serif;font-weight:600;letter-spacing:.015em;color:#1b2742}
.dbpage .tx.pa{color:#262a33}
.dbpage .tx.cp{color:#41454f}
.dbpage.fitting .tx{visibility:hidden}
.dbpp{position:relative;width:100%;container-type:inline-size}
.dbprint{width:100%;display:block;box-shadow:0 1px 2px rgba(0,0,0,.2),0 24px 50px -28px rgba(0,0,0,.7);background:#fff}
.dbpp .hot{position:absolute;border:0;padding:0;background:transparent;cursor:zoom-in;border-radius:2px}
.dbpp .hot:hover,.dbpp .hot:focus-visible{box-shadow:0 0 0 .25cqw rgba(226,194,125,.9);outline:none}
/* reader */
.dbr{display:flex;flex-direction:column;height:calc(100dvh - var(--barh,58px) - env(safe-area-inset-top,0px));min-height:520px;background:color-mix(in srgb,var(--paper) 60%,#000 40%)}
.dbr:fullscreen{height:100vh;height:100dvh}
.dbrbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;padding-block:12px;padding-left:max(18px,env(safe-area-inset-left,0px));padding-right:max(18px,env(safe-area-inset-right,0px));background:var(--paper);border-bottom:1px solid var(--line)}
.dbrbar h2{font-family:var(--display);font-weight:400;font-size:24px;margin:0;line-height:1.05;margin-right:auto;min-width:0}
.dbrbar h2 small{display:block;font-family:var(--body);font-size:12px;color:var(--muted);margin-top:2px}
.dbrbar button,.dbrbar a{font:600 12.5px var(--body);color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:7px 12px;cursor:pointer;text-decoration:none;white-space:nowrap}
.dbrbar .seg{display:inline-flex;padding:3px;border-radius:999px;background:var(--chip);gap:2px} .dbrbar .seg button{border:0;background:transparent;color:var(--muted)} .dbrbar .seg button[aria-pressed="true"]{background:var(--surface);color:var(--ink)}
.dbstage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:22px 64px;position:relative;touch-action:pan-y;overflow:hidden}
.dbspread{display:flex;align-items:center;justify-content:center}
.dbspread>div{flex:0 0 auto}
.dbspread.two>div:first-child .dbpage,.dbspread.two>div:first-child .dbprint{border-radius:6px 0 0 6px} .dbspread.two>div:last-child .dbpage,.dbspread.two>div:last-child .dbprint{border-radius:0 6px 6px 0}
.dbspread.two>div:first-child{position:relative} .dbspread.two>div:first-child::after{content:"";position:absolute;inset:0 0 0 auto;width:6%;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(0,0,0,.16))}
.dbspread.two>div:last-child{position:relative} .dbspread.two>div:last-child::after{content:"";position:absolute;inset:0 auto 0 0;width:6%;pointer-events:none;background:linear-gradient(270deg,transparent,rgba(0,0,0,.12))}
.dbnav{position:absolute;top:50%;transform:translateY(-50%);width:46px;height:46px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-size:22px;cursor:pointer;display:grid;place-items:center;box-shadow:0 10px 24px -12px rgba(0,0,0,.6);z-index:2}
.dbnav:disabled{opacity:.3;cursor:default} .dbnav.prev{left:max(10px,env(safe-area-inset-left,0px))} .dbnav.next{right:max(10px,env(safe-area-inset-right,0px))}
.dbfoot{display:flex;align-items:center;gap:14px;padding-block:10px 14px;padding-left:max(18px,env(safe-area-inset-left,0px));padding-right:max(18px,env(safe-area-inset-right,0px));color:#E9E3D6;font-size:12.5px;font-variant-numeric:tabular-nums}
.dbfoot input{flex:1;accent-color:var(--gold)}
.dbfoot span{min-width:96px;text-align:right}
@media (max-width:760px){ .dbstage{padding:10px 8px 64px} .dbnav{top:auto;bottom:10px;transform:none} .dbrbar h2{font-size:19px;width:100%} .db h1{font-size:34px} .dbshelf{grid-template-columns:repeat(2,minmax(0,1fr));gap:20px 14px} .dbbook b{font-size:16px} }
@media (prefers-reduced-motion:reduce){ .dbcover,.dbpage .ph{transition:none} }
`;
const E=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let DB=null, loadP=null, fontsP=null;
function addCss(){ if(document.getElementById('db-css')) return; const st=document.createElement('style'); st.id='db-css'; st.textContent=css; document.head.appendChild(st);
  const l=document.createElement('link'); l.rel='stylesheet'; l.href='dbfonts.css'; document.head.appendChild(l) }
function fonts(){ if(!fontsP) fontsP=(document.fonts&&document.fonts.load?Promise.all(["400 20px 'EB Garamond'","600 20px 'Cormorant Garamond'"].map(f=>document.fonts.load(f))).catch(()=>{}):Promise.resolve()).then(()=>new Promise(r=>setTimeout(r,0))); return Promise.race([fontsP,new Promise(r=>setTimeout(r,2500))]) }
function load(){ if(DB) return Promise.resolve(DB); if(!loadP) loadP=fetch('dadbooks.json').then(r=>r.json()).then(j=>DB=j); return loadP }
const trip=k=>(typeof T!=='undefined'&&T[k])||null;
const thumb=(t,id)=>{ try{ return (typeof turl==='function'?turl:purl)(t,id) }catch(e){ return '' } };
const full=(t,id)=>{ try{ return purl(t,id)||'' }catch(e){ return '' } };

/* Dad's text geometry, measured against his printed pages: a text box's height is a whole number of lines,
   each line 0.208 × its stored size apart, and the first line sits 0.19 × the size above the box's top. */
const PITCH=.208, LIFT=.19;
function role(p,fs,s,n){ const sizes=p.t.map(x=>x[1]).sort((a,b)=>a-b), med=sizes[sizes.length>>1]||fs;
  if(fs>=med*1.25||fs>=520) return 'hd'; return (n>=3&&s.length>110)?'pa':'cp' }
function layoutPage(b,p,pi){ const t=trip(b.key); if(!t) return '<div class="dbpage"></div>';
  const pct=(v,d)=>(v/d*100).toFixed(3)+'%', cq=v=>(v/p.W*100).toFixed(3)+'cqw';
  const phs=p.b.map(([id,x,y,w,h])=>`<button class="ph" data-ph="${id}" style="left:${pct(x,p.W)};top:${pct(y,p.H)};width:${pct(w,p.W)};height:${pct(h,p.H)}" aria-label="${E(capOf(p,id)||'Open photo')}"><img alt="" loading="lazy" decoding="async" data-id="${id}" src="${E(thumb(t,id))}"></button>`).join('');
  const txs=p.t.map(([s,fs,x,y,w,h],k)=>{ const pitch=PITCH*fs, n=Math.max(1,Math.round((h-.045*fs)/pitch)), r=role(p,fs,s,n), cx=x+w/2, ww=w*1.05;
    return `<div class="tx ${r}" data-k="${k}" data-n="${n}" data-fs="${fs}" style="left:${cq(cx-ww/2)};top:${cq(y-LIFT*fs)};width:${cq(ww)};line-height:${cq(pitch)};font-size:${cq(.2*fs)}">${E(s)}</div>` }).join('');
  return `<div class="dbpage fitting" data-p="${pi}" data-b="${b.key}" style="--ar:${p.W}/${p.H}">${phs}${txs}</div>` }
const capOf=(p,id)=>{ const c=(p.c||[]).find(x=>x[0]===id); return c?c[1]:'' };

/* Fit each text block to exactly Dad's number of lines: the largest size that still wraps into them.
   Sizes are in container units, so a page is fitted once and stays right at any zoom. */
const FIT={};
function fitPage(pg,b){ const key=b.key+'/'+pg.dataset.p, txs=[...pg.querySelectorAll('.tx')]; const W=pg.clientWidth; if(!W){ return }
  const cache=FIT[key];
  if(cache){ txs.forEach((e,k)=>e.style.fontSize=cache[k]); pg.classList.remove('fitting'); return }
  const p=b.pages[+pg.dataset.p]; const res=[];
  txs.forEach((e,k)=>{ const fs=+e.dataset.fs, n=+e.dataset.n, pitchPx=PITCH*fs/p.W*W;
    const fits=f=>{ e.style.fontSize=(f/p.W*100)+'cqw'; return e.scrollHeight<=n*pitchPx+pitchPx*.35 && e.scrollWidth<=e.clientWidth+1 };
    let lo=.13*fs, hi=(e.classList.contains('hd')?.235:.222)*fs;
    if(fits(hi)) lo=hi; else { for(let i=0;i<7;i++){ const m=(lo+hi)/2; if(fits(m)) lo=m; else hi=m } }
    res[k]=lo });
  // same-size captions on a page read as one hand: give each size group one size (never below 88% of its median)
  const groups={}; txs.forEach((e,k)=>{ const g=e.dataset.fs+e.className; (groups[g]=groups[g]||[]).push(k) });
  Object.values(groups).forEach(ks=>{ if(ks.length<2) return; const v=ks.map(k=>res[k]).sort((a,b)=>a-b), med=v[v.length>>1]; const m=Math.max(v[0],med*.88); ks.forEach(k=>{ res[k]=Math.min(res[k],m) }) });
  const out=res.map(f=>(f/p.W*100).toFixed(3)+'cqw'); txs.forEach((e,k)=>e.style.fontSize=out[k]); FIT[key]=out; pg.classList.remove('fitting') }

function upgrade(root,b){ const t=trip(b.key); if(!t||typeof ensurePhotos!=='function') return; ensurePhotos(t).then(()=>{ root.querySelectorAll('.dbpage img[data-id]').forEach(im=>{ const u=full(t,+im.dataset.id); if(u&&im.src!==u) im.src=u }) }).catch(()=>{}) }
function coverHTML(b){ if(b.front||b.print) return `<img src="${E(b.front||b.print[0])}" alt="" loading="lazy">`; return b.pages?layoutPage(b,b.pages[0],0):'' }
const pagesOf=(b,mode)=>mode==='print'&&b.print?b.print.length:(b.pages?b.pages.length:(b.print||[]).length);

/* ---- shelf ---- */
window.dadBooks=async function(app){ addCss(); app.innerHTML='<div class="wrap load">Opening Dad\'s books…</div>';
  try{ await load() }catch(e){ app.innerHTML='<div class="wrap load">Dad\'s books did not load. Reload the page to try again.</div>'; return }
  const yrs=DB.books.map(b=>+b.year).filter(Boolean);
  app.innerHTML=`<section class="db"><div class="eyebrow">Made by Art French on Shutterfly · ${Math.min(...yrs)} – ${Math.max(...yrs)}</div><h1>Dad's Books</h1>
    <p class="lede">The ${DB.books.length} photo books Dad designed himself, one for each trip and one for the family. Open any book to turn its pages the way he laid them out: his photo choices, his captions, his order. Tap any photo to see it large with its caption.</p>
    <div class="dbshelf">${DB.books.map(b=>`<a class="dbbook" href="#book-${b.key}"><div class="dbcover">${coverHTML(b)}</div><b>${E(b.title)}</b><div class="dbmeta"><span>${E(b.dates||b.year)}</span><span>${pagesOf(b,b.print?'print':'layout')} pages</span><span>${b.nphotos} photos</span></div>${b.print?'<span class="dbtag">His printed pages</span>':''}</a>`).join('')}</div></section>`;
  await fonts(); app.querySelectorAll('.dbcover .dbpage').forEach(pg=>{ const b=DB.books.find(x=>x.key===pg.dataset.b); if(b) fitPage(pg,b) });
  if(typeof ensureThumbs==='function') DB.books.forEach(b=>{ const t=trip(b.key); if(t&&!b.print) ensureThumbs(t).then(()=>{ app.querySelectorAll(`.dbbook[href="#book-${b.key}"] img[data-id]`).forEach(im=>{ const u=thumb(t,+im.dataset.id); if(u) im.src=u }) }).catch(()=>{}) });
};

/* ---- reader ---- */
let KEYH=null, RO=null;
window.dadBook=async function(app,key,page){ addCss(); app.innerHTML='<div class="wrap load">Opening the book…</div>';
  try{ await load() }catch(e){ app.innerHTML='<div class="wrap load">This book did not load. Reload the page to try again.</div>'; return }
  const b=DB.books.find(x=>x.key===key); if(!b){ location.hash='books'; return } const t=trip(b.key);
  let mode=b.print?'print':'layout'; let i=Math.max(0,(+page||1)-1);
  if(t&&typeof ensureThumbs==='function'){ try{ await ensureThumbs(t) }catch(e){} }
  await fonts();
  app.innerHTML=`<section class="dbr"><div class="dbrbar"><a href="#books">← Dad's Books</a><h2>${E(b.title)}<small>${E(b.dates||b.year)} · designed by Art French</small></h2>
    ${b.print&&b.pages?`<div class="seg" role="group" aria-label="How to show the pages"><button data-m="print" aria-pressed="${mode==='print'}">As printed</button><button data-m="layout" aria-pressed="${mode==='layout'}">Sharper photos</button></div>`:''}
    ${t?`<a href="#${b.key}">The trip</a>`:''}<button id="dbfs">Full screen</button></div>
    <div class="dbstage" id="dbstage"><button class="dbnav prev" aria-label="Previous pages">‹</button><div class="dbspread" id="dbspread"></div><button class="dbnav next" aria-label="Next pages">›</button></div>
    <div class="dbfoot"><input type="range" id="dbslider" min="1" value="1" aria-label="Page"><span id="dbpos"></span></div></section>`;
  const root=app.querySelector('.dbr'), sp=root.querySelector('#dbspread'), stage=root.querySelector('#dbstage'), sl=root.querySelector('#dbslider'), pos=root.querySelector('#dbpos');
  const n=()=>pagesOf(b,mode); const two=()=>stage.clientWidth>900;
  const spreadStart=k=>two()?(k===0?0:(k%2?k:k-1)):k; const spreadLen=k=>two()&&k>0&&k+1<n()?2:1;
  const arOf=k=>mode==='print'?((b.par&&b.par[k])||1.293):(b.pages[k]?b.pages[k].W/b.pages[k].H:1.293);
  function pageEl(k){ if(mode==='print'){ const hs=(b.hot&&b.hot[k])||[];
      return `<div class="dbpp" data-pk="${k}" style="aspect-ratio:${arOf(k)}"><img class="dbprint" src="${E(b.print[k])}" alt="Page ${k+1}">${hs.map(([id,x,y,w,h,c],j)=>`<button class="hot" data-j="${j}" style="left:${x*100}%;top:${y*100}%;width:${w*100}%;height:${h*100}%" aria-label="${E(c||'Open photo')}"></button>`).join('')}</div>` }
    return layoutPage(b,b.pages[k],k) }
  // size the spread to the stage on both axes, so no page is ever cut off (full screen included)
  function fit(){ const cs=getComputedStyle(stage); const H=stage.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom), W=stage.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
    const kids=[...sp.children]; if(!kids.length||H<=0||W<=0) return; const ars=kids.map((_,j)=>arOf(i+j)); const sumAr=ars.reduce((a,c)=>a+c,0);
    const h=Math.min(H,W/sumAr); kids.forEach((d,j)=>{ d.style.width=(h*ars[j])+'px' });
    sp.querySelectorAll('.dbpage').forEach(pg=>fitPage(pg,b)) }
  function render(){ i=spreadStart(Math.min(Math.max(0,i),n()-1)); const L=spreadLen(i);
    sp.className='dbspread'+(L===2?' two':''); sp.innerHTML=Array.from({length:L},(_,j)=>`<div>${pageEl(i+j)}</div>`).join('');
    sl.max=n(); sl.value=i+1; pos.textContent=L===2?`Pages ${i+1}–${i+2} of ${n()}`:(i===0?`Cover · ${n()} pages`:`Page ${i+1} of ${n()}`);
    root.querySelector('.prev').disabled=i<=0; root.querySelector('.next').disabled=i+L>=n();
    fit(); if(mode==='layout') upgrade(sp,b);
    sp.querySelectorAll('.ph').forEach(x=>x.onclick=()=>{ if(!t||typeof openLB!=='function') return; const pg=b.pages[+x.closest('.dbpage').dataset.p]; const ids=pg.b.map(q=>q[0]); openLB(t,ids.map(id=>({id,cap:capOf(pg,id)?'|'+capOf(pg,id):''})),ids.indexOf(+x.dataset.ph)) });
    sp.querySelectorAll('.dbpp').forEach(pp=>{ const hs=(b.hot&&b.hot[+pp.dataset.pk])||[]; pp.querySelectorAll('.hot').forEach(h=>h.onclick=()=>{ if(!t||typeof openLB!=='function') return; openLB(t,hs.map(([id,,,,,c])=>({id,cap:c?'|'+c:''})),+h.dataset.j) }) });
    try{ history.replaceState(null,'','#book-'+b.key+(i?'-'+(i+1):'')) }catch(e){} }
  const step=d=>{ const L=spreadLen(i); i=d>0?i+L:(two()?Math.max(0,i===1?0:i-2):i-1); render() };
  root.querySelector('.prev').onclick=()=>step(-1); root.querySelector('.next').onclick=()=>step(1);
  sl.oninput=()=>{ i=+sl.value-1; render() };
  root.querySelectorAll('[data-m]').forEach(x=>x.onclick=()=>{ mode=x.dataset.m; root.querySelectorAll('[data-m]').forEach(y=>y.setAttribute('aria-pressed',String(y===x))); i=Math.min(i,n()-1); render() });
  root.querySelector('#dbfs').onclick=()=>{ (document.fullscreenElement?document.exitFullscreen():root.requestFullscreen&&root.requestFullscreen()).catch(()=>{}) };
  let sx=null; stage.addEventListener('pointerdown',e=>{ sx=e.clientX }); stage.addEventListener('pointerup',e=>{ if(sx==null) return; const dx=e.clientX-sx; sx=null; if(Math.abs(dx)>60) step(dx<0?1:-1) });
  if(KEYH) removeEventListener('keydown',KEYH); KEYH=e=>{ if(!document.body.contains(root)||document.querySelector('.lb')) return; if(e.key==='ArrowRight'||e.key===' '){ e.preventDefault(); step(1) } else if(e.key==='ArrowLeft'){ e.preventDefault(); step(-1) } else if(e.key==='Home'){ i=0; render() } else if(e.key==='End'){ i=n()-1; render() } }; addEventListener('keydown',KEYH);
  // re-layout when the stage changes size (window resize, full screen, phone rotation); re-render only if one/two-page mode flips
  let wasTwo=two(); if(RO) RO.disconnect(); RO=new ResizeObserver(()=>{ if(!document.body.contains(root)){ RO.disconnect(); return } if(two()!==wasTwo){ wasTwo=two(); render() } else fit() }); RO.observe(stage);
  render();
};
})();
