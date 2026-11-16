/* French Family Travels · Home Movies
   The family's VHS tapes, digitised and uploaded to YouTube. A timeline of little preview windows
   (frames pulled from each film), a player page per film with its scenes and the people spotted in it,
   and hooks so the Family Tree can list the films each person appears in. */
(function(){
const css=`
.mv{padding-block:24px 48px;display:flex;flex-direction:column;gap:22px}
.mvhero{display:flex;flex-wrap:wrap;gap:14px 28px;align-items:flex-end;justify-content:space-between}
.mvhero h1{font-family:var(--display);font-weight:400;font-size:clamp(34px,5vw,54px);margin:0;line-height:1}
.mvhero p{margin:6px 0 0;color:var(--muted);max-width:60ch;line-height:1.5}
.mvhero .yt{display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;background:var(--chip);color:var(--ink);font-weight:600;font-size:13.5px;text-decoration:none}
.mvhero .yt i{width:10px;height:10px;border-radius:50%;background:#E0342B}
.mvtl{position:relative;padding:18px 0 6px}
.mvaxis{position:sticky;top:var(--barh,58px);z-index:5;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:8px 0 10px;margin:0 0 10px;background:var(--paper);border-bottom:1px solid var(--line)}
.mvaxis::-webkit-scrollbar{display:none}
.mvaxis button{flex:none;display:flex;align-items:baseline;gap:6px;padding:6px 12px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-size:13px;font-weight:600;letter-spacing:.3px}
.mvaxis button small{font-size:11px;color:var(--muted);font-weight:500;font-variant-numeric:tabular-nums}
.mvaxis button[aria-current="true"]{background:var(--ink);color:var(--paper);border-color:var(--ink)} .mvaxis button[aria-current="true"] small{color:inherit;opacity:.75}
.mvdec{scroll-margin-top:calc(var(--barh,58px) + 56px)}
.mvdec{display:flex;flex-direction:column;gap:10px;margin-bottom:26px}
.mvdec h2{font-family:var(--display);font-weight:400;font-size:26px;margin:0;display:flex;align-items:baseline;gap:12px}
.mvdec h2 span{font-family:var(--body);font-size:12.5px;color:var(--muted);font-weight:500}
.mvrow{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}
.mvc{position:relative;text-align:left;text-decoration:none;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 1px 2px rgba(20,28,41,.05),0 10px 26px -18px rgba(20,28,41,.45);transition:transform .25s,box-shadow .25s}
.mvc:hover{transform:translateY(-2px);box-shadow:0 1px 2px rgba(20,28,41,.05),0 18px 34px -16px rgba(20,28,41,.5)}
.mvc .win{position:relative;aspect-ratio:4/3;background:#0A1426;overflow:hidden}
.mvc .win .fr{position:absolute;inset:0;background-size:600% auto;background-repeat:no-repeat;background-position:0 0;transition:opacity .2s}
.mvc .win .fr.b{opacity:0}
.mvc .win::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,.55));pointer-events:none}
.mvc .play{position:absolute;left:50%;top:50%;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(10,20,38,.75);border:1.5px solid rgba(255,246,228,.7);display:grid;place-items:center;color:#FFF6E4;font-size:16px;padding-left:3px;opacity:.85;pointer-events:none}
.mvc .dur{position:absolute;right:8px;bottom:8px;font-size:11px;font-weight:700;padding:2px 7px;border-radius:999px;background:rgba(10,20,38,.8);color:#FFF6E4;font-variant-numeric:tabular-nums}
.mvc .tape{position:absolute;left:8px;top:8px;font-size:10px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;padding:3px 7px;border-radius:999px;background:rgba(226,194,125,.9);color:#0A1426}
.mvc .tx{padding:10px 12px 12px;display:flex;flex-direction:column;gap:3px}
.mvc .nm{font-weight:600;font-size:14px;line-height:1.25;color:var(--ink)}
.mvc .yr{font-size:12.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.mvc .who{display:flex;gap:-4px;margin-top:4px}
.mvc .who img{width:22px;height:22px;border-radius:50%;object-fit:cover;border:2px solid var(--surface);margin-right:-6px;background:var(--chip)}
.mvc .who span{font-size:11px;color:var(--muted);margin-left:10px;align-self:center}
.mvp{padding-block:18px 48px;display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:26px;align-items:start}
.mvp .player{position:relative;aspect-ratio:4/3;background:#000;border-radius:16px;overflow:hidden;box-shadow:0 30px 60px -30px rgba(0,0,0,.6)}
.mvp .player iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.mvp .screen{cursor:pointer;background-color:#0A1426;background-size:600% auto;background-repeat:no-repeat;outline:none}
.mvp .screen::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 40%,rgba(0,0,0,.65) 100%);pointer-events:none}
.mvp .screen .scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 1px,rgba(0,0,0,0) 1px 3px);pointer-events:none;mix-blend-mode:overlay}
.mvp .screen .osd{position:absolute;left:18px;top:14px;display:flex;flex-direction:column;gap:2px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:15px;font-weight:700;color:#F3F0E6;letter-spacing:1px;text-shadow:0 0 6px rgba(0,0,0,.9),0 1px 0 #000;pointer-events:none}
.mvp .screen .osd .rec{color:#FF5B4D}
.mvp .screen .big,.mvp .screen .live{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;color:#FFF6E4;padding:20px}
.mvp .screen .big .btn{width:84px;height:84px;border-radius:50%;background:rgba(226,194,125,.95);color:#0A1426;display:grid;place-items:center;font-size:32px;padding-left:6px;box-shadow:0 10px 40px rgba(0,0,0,.6);transition:transform .2s}
.mvp .screen:hover .big .btn{transform:scale(1.06)}
.mvp .screen .big .lbl{font-family:var(--display);font-size:26px;margin-top:6px}
.mvp .screen .big small,.mvp .screen .live small{font-size:12.5px;opacity:.8;max-width:42ch;line-height:1.5}
.mvp .screen .live u{cursor:pointer;text-decoration-color:var(--gold)}
.mvp .screen .live .dot{width:12px;height:12px;border-radius:50%;background:#FF5B4D;box-shadow:0 0 0 0 rgba(255,91,77,.7);animation:fftpulse 1.4s infinite}
.mvp .screen .live b{font-family:var(--display);font-weight:400;font-size:22px}
.mvp .screen.on{background-image:none!important;background:#06101F}
.mvp .screen.on::before{display:none}
@keyframes fftpulse{0%{box-shadow:0 0 0 0 rgba(255,91,77,.7)}70%{box-shadow:0 0 0 12px rgba(255,91,77,0)}100%{box-shadow:0 0 0 0 rgba(255,91,77,0)}}
.mvp h1{font-family:var(--display);font-weight:400;font-size:clamp(28px,4vw,42px);margin:10px 0 2px;line-height:1.05}
.mvp .meta{color:var(--muted);font-size:13.5px;display:flex;flex-wrap:wrap;gap:6px 16px}
.mvp .meta a{color:var(--gold)}
.scenes{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:8px;margin-top:8px}
.scenes button{position:relative;aspect-ratio:4/3;border-radius:10px;overflow:hidden;background:#0A1426;background-size:600% auto;background-repeat:no-repeat;border:1px solid var(--line)}
.scenes button:hover{outline:2px solid var(--gold)}
.scenes button span{position:absolute;left:6px;bottom:5px;font-size:11px;font-weight:700;padding:1px 6px;border-radius:999px;background:rgba(10,20,38,.8);color:#FFF6E4;font-variant-numeric:tabular-nums}
.mvside{display:flex;flex-direction:column;gap:16px}
.mvside h3{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin:0}
.chap{display:flex;flex-direction:column;gap:4px}
.chap button{display:flex;justify-content:space-between;gap:10px;text-align:left;padding:8px 10px;border-radius:10px;background:var(--chip);font-size:13.5px}
.chap button span{color:var(--muted);font-variant-numeric:tabular-nums;font-size:12px}
.cast{display:flex;flex-direction:column;gap:6px}
.cast button{display:flex;align-items:center;gap:10px;text-align:left;padding:6px 8px;border-radius:12px;background:var(--chip);font-size:13.5px}
.cast img{width:36px;height:36px;border-radius:50%;object-fit:cover;background:var(--surface)}
.cast b{font-weight:600} .cast small{display:block;color:var(--muted);font-size:12px}
.mvmore{display:flex;flex-direction:column;gap:6px}
.mvmore a{display:flex;justify-content:space-between;gap:10px;padding:8px 10px;border-radius:10px;background:var(--chip);font-size:13.5px;text-decoration:none;color:var(--ink)}
.mvmore a span{color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
.mvnote{font-size:12.5px;color:var(--muted);line-height:1.5}
@media (max-width:860px){ .mvp{grid-template-columns:1fr} }`;
const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
const E=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let MV=null; // movies.json
const fmt=s=>{ s=Math.round(s); const h=Math.floor(s/3600), m=Math.floor(s%3600/60), x=s%60; return h?`${h}:${String(m).padStart(2,'0')}:${String(x).padStart(2,'0')}`:`${m}:${String(x).padStart(2,'0')}` };
const span=m=>m.y0===m.y1?String(m.y0):`${m.y0} – ${m.y1}`;
async function load(){ if(!MV){ MV=await (await fetch('movies.json')).json(); MV.films.sort((a,b)=>(a.y0-b.y0)||(a.m0||0)-(b.m0||0)||a.title.localeCompare(b.title)) }
  try{ if(typeof loadFaces==='function') await loadFaces() }catch(e){}
  // who's in each film: face clusters that have been named on the People page, seen at least 4 times
  for(const m of MV.films){ m.cast=Object.entries(m.people||{}).filter(([pid,d])=>d.n>=4&&typeof pName==='function'&&pName(pid)&&!((typeof NAMES!=='undefined'&&NAMES[pid])||{}).hidden).map(([pid,d])=>{ const f=(typeof FACES!=='undefined'&&FACES&&FACES.people||[]).find(x=>x.id===pid); return {pid,name:pName(pid),n:d.n,first:d.first,img:f&&typeof faceURL==='function'?faceURL(f,0):''} }).sort((a,b)=>b.n-a.n).slice(0,8) }
  return MV }
window.loadMovies=load;
// frame k of a film's contact sheet as a background-position (sheets are 6 columns wide)
const frameBG=(m,k)=>{ const rows=Math.ceil(m.frames.length/6); const c=k%6, r=Math.floor(k/6); return `background-image:url('${m.sheet}');background-size:600% ${rows*100}%;background-position:${c/5*100}% ${rows>1?r/(rows-1)*100:0}%` };
function card(m){ const n=m.frames.length; const who=(m.cast||[]).slice(0,4);
  return `<a class="mvc" href="#movie-${m.id}" data-n="${n}"><div class="win">${n?`<div class="fr a" style="${frameBG(m,Math.min(n-1,4))}"></div><div class="fr b" style="${frameBG(m,Math.min(n-1,9))}"></div>`:''}<span class="play">▶</span><span class="tape">VHS</span><span class="dur">${fmt(m.dur)}</span></div>
    <div class="tx"><span class="nm">${E(m.title)}</span><span class="yr">${E(span(m))}${m.chapters&&m.chapters.length?' · '+m.chapters.length+' chapters':''}</span>${who.length?`<div class="who">${who.map(c=>`<img src="${c.img}" alt="" title="${E(c.name)}">`).join('')}<span>${who.map(c=>c.name.split(' ')[0]).join(', ')}</span></div>`:''}</div></a>` }
window.homeMovies=async function(app){ view={tab:'movies'};
  app.innerHTML='<div class="wrap load">Rewinding the tapes…</div>';
  try{ await load() }catch(e){ app.innerHTML='<div class="wrap load">The films did not load. Reload to try again.</div>'; return }
  if(view.tab!=='movies') return;
  const films=MV.films; const y0=Math.min(...films.map(m=>m.y0)), y1=Math.max(...films.map(m=>m.y1)); const total=films.reduce((s,m)=>s+m.dur,0);
  const decades={}; films.forEach(m=>{ const d=Math.floor(m.y0/10)*10; (decades[d]=decades[d]||[]).push(m) });
  const decs=Object.keys(decades).map(Number).sort((a,b)=>a-b);
  app.innerHTML=`<div class="wrap mv"><div class="mvhero"><div><div class="eyebrow">Home movies · ${films.length} films · ${Math.round(total/3600)} hours</div><h1>The Tapes</h1><p>Every VHS tape digitised and put on YouTube, from the Wetzel reels of 1947 to the kids goofing around with the camcorder. Each window shows frames from the film; open one to watch it, jump between scenes and see who's in it.</p></div>
      <a class="yt" href="${E(MV.channel)}" target="_blank" rel="noopener"><i></i>Open the YouTube channel</a></div>
    <div class="mvtl"><div class="mvaxis" role="tablist" aria-label="Decades">${decs.map(d=>`<button data-dec="${d}" aria-current="false">${d}s<small>${decades[d].length}</small></button>`).join('')}</div>
      ${decs.map(d=>`<section class="mvdec" id="dec${d}"><h2>${d}s <span>${decades[d].length} film${decades[d].length>1?'s':''} · ${fmt(decades[d].reduce((s,m)=>s+m.dur,0))}</span></h2><div class="mvrow">${decades[d].map(card).join('')}</div></section>`).join('')}</div>
    <p class="mvnote">Preview frames and scene breaks were pulled from the films automatically; faces are matched against the people named on the People page, so naming someone there also names them in the films.</p></div>`;
  // decade chips: jump + highlight the decade in view
  { const chips=[...app.querySelectorAll('.mvaxis button')]; chips.forEach(b=>b.onclick=()=>{ const sec=app.querySelector('#dec'+b.dataset.dec); if(sec) sec.scrollIntoView({behavior:'smooth',block:'start'}) });
    const secs=[...app.querySelectorAll('.mvdec')]; if('IntersectionObserver' in window&&secs.length){ const io=new IntersectionObserver(es=>{ if(!app.isConnected) return io.disconnect(); es.forEach(e=>{ e.target._in=e.isIntersecting }); const cur=secs.find(x=>x._in)||secs[0]; chips.forEach(c=>c.setAttribute('aria-current',String('dec'+c.dataset.dec===cur.id))) },{rootMargin:'-120px 0px -60% 0px'}); secs.forEach(x=>io.observe(x)) } }
  // flip between two frames on hover
  app.querySelectorAll('.mvc').forEach(c=>{ const b=c.querySelector('.fr.b'); if(!b) return; let k=1, t=null; const m=films.find(x=>'#movie-'+x.id===c.getAttribute('href')); c.onmouseenter=()=>{ t=setInterval(()=>{ k=(k+1)%m.frames.length; b.style.cssText=frameBG(m,k); b.style.opacity=1 },700); b.style.opacity=1 }; c.onmouseleave=()=>{ clearInterval(t); b.style.opacity=0 } });
};
window.homeMovie=async function(app,id){ view={tab:'movies'};
  try{ await load() }catch(e){ app.innerHTML='<div class="wrap load">The film did not load.</div>'; return }
  const m=MV.films.find(x=>x.id===id); if(!m){ location.hash='movies'; return }
  const i=MV.films.indexOf(m); const prev=MV.films[i-1], next=MV.films[i+1];
  const n=m.frames.length, poster=n?frameBG(m,Math.min(n-1,4)):'';
  app.innerHTML=`<div class="wrap mvp"><div><div class="player screen" id="ytp" style="${poster}" role="button" tabindex="0" aria-label="Play ${E(m.title)}">
        <div class="scan"></div>
        <div class="osd"><span class="rec">● PLAY</span><span class="tc" id="osdtc">0:00:00 SP</span></div>
        <div class="big"><span class="btn">▶</span><span class="lbl">Play the tape</span><small>opens a player window right here · scenes and chapters drive it</small></div>
        <div class="live" hidden><span class="dot"></span><b>Playing in the player window</b><small>Tap any scene below to jump · <u data-act="focus">bring the window back</u> · <u data-act="big">theatre size</u></small></div>
      </div>
      <div class="eyebrow" style="margin-top:14px">Home movie · ${E(span(m))}</div><h1>${E(m.title)}</h1>
      <div class="meta"><span>${fmt(m.dur)}</span><span>Uploaded ${E(m.up)}</span><a href="https://www.youtube.com/watch?v=${m.id}" target="_blank" rel="noopener">Watch on YouTube ↗</a></div>
      ${m.frames.length?`<h3 class="eyebrow" style="margin-top:18px">Scenes · tap to jump</h3><div class="scenes">${m.frames.map((t,k)=>`<button data-t="${t}" style="${frameBG(m,k)}" aria-label="Jump to ${fmt(t)}"><span>${fmt(t)}</span></button>`).join('')}</div>`:''}</div>
    <aside class="mvside">
      ${m.chapters&&m.chapters.length?`<div><h3>Chapters</h3><div class="chap">${m.chapters.map(c=>`<button data-t="${c.t}">${E(c.title)}<span>${fmt(c.t)}</span></button>`).join('')}</div></div>`:''}
      ${(m.cast||[]).length?`<div><h3>Who's in this film</h3><div class="cast">${m.cast.map(c=>`<button data-t="${c.first}" data-p="${c.pid}"><img src="${c.img}" alt=""><span><b>${E(c.name)}</b><small>first seen at ${fmt(c.first)} · ${c.n} sightings</small></span></button>`).join('')}</div><p class="mvnote">Matched by face against the People page; VHS faces are small, so treat it as a hint.</p></div>`:'<p class="mvnote">No named faces spotted yet — name people on the People page and they\'ll be matched here.</p>'}
      <div><h3>More tapes</h3><div class="mvmore">${prev?`<a href="#movie-${prev.id}">← ${E(prev.title)}<span>${E(span(prev))}</span></a>`:''}${next?`<a href="#movie-${next.id}">${E(next.title)} →<span>${E(span(next))}</span></a>`:''}<a href="#movies">All ${MV.films.length} films<span>timeline</span></a></div></div>
    </aside></div>`;
  // The artifact host blocks third-party iframes, so the film plays in a chromeless YouTube window
  // that we open exactly over the screen box; scene/chapter/face buttons re-point that same window.
  const scr=document.getElementById('ytp');
  const url=t=>`https://www.youtube.com/embed/${m.id}?autoplay=1&start=${Math.max(0,Math.floor(+t||0))}&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`;
  const dock=big=>{ const r=scr.getBoundingClientRect(); const chrome=Math.max(0,window.outerHeight-window.innerHeight);
    let w=Math.round(r.width), h=Math.round(r.height), x=Math.round(window.screenX+r.left), y=Math.round(window.screenY+chrome+r.top);
    if(big){ w=Math.min(1280,Math.round(screen.availWidth*.8)); h=Math.round(w*3/4); x=Math.round((screen.availWidth-w)/2); y=Math.round((screen.availHeight-h)/2) }
    return `popup=yes,width=${w},height=${h},left=${x},top=${y},resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no` };
  const setLive=on=>{ scr.classList.toggle('on',on); scr.querySelector('.big').hidden=on; scr.querySelector('.live').hidden=!on };
  const play=(t,big)=>{ const u=url(t); let p=window.__fftPlayer;
    if(p&&!p.closed){ try{ p.location.href=u; p.focus() }catch(e){ p=null } }
    if(!p||p.closed){ p=window.open(u,'fft_player',dock(big)); window.__fftPlayer=p }
    if(!p){ window.open(`https://www.youtube.com/watch?v=${m.id}&t=${Math.floor(+t||0)}s`,'_blank','noopener'); return }
    setLive(true); if(scr._poll) clearInterval(scr._poll); scr._poll=setInterval(()=>{ if(!app.isConnected||!window.__fftPlayer||window.__fftPlayer.closed){ clearInterval(scr._poll); if(app.isConnected) setLive(false) } },800);
    const tc=document.getElementById('osdtc'); if(tc){ const s=Math.floor(+t||0); tc.textContent=`${Math.floor(s/3600)}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')} SP` } };
  const seek=t=>{ play(t,false); window.scrollTo({top:0,behavior:'smooth'}) };
  scr.onclick=e=>{ const act=e.target.dataset&&e.target.dataset.act; if(act==='focus'){ const p=window.__fftPlayer; if(p&&!p.closed) p.focus(); else play(0,false); return } if(act==='big'){ const p=window.__fftPlayer; if(p&&!p.closed){ try{ p.close() }catch(_){} } play(0,true); return } if(!scr.classList.contains('on')) play(0,false); else { const p=window.__fftPlayer; if(p&&!p.closed) p.focus() } };
  scr.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); scr.click() } };
  if(window.__fftPlayer&&!window.__fftPlayer.closed){ /* a window from another film is open: re-point it to this film */ play(0,false) }
  app.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>seek(b.dataset.t));
};
// for the Family Tree: films a person appears in (by face cluster) or that cover their lifetime
window.filmsFor=function(clusterIds,by,dy){ if(!MV) return []; const out=[];
  for(const m of MV.films){ const hit=(m.cast||[]).find(c=>clusterIds.includes(c.pid)); if(hit) out.push({m,why:'appears',first:hit.first}); }
  return out.sort((a,b)=>a.m.y0-b.m.y0) };
})();
