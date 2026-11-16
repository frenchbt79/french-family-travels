/* French Family Travels · Lifelines timeline
   One bar per person, grouped into swim-lanes by family line. A quiet ruler on top carries the presidencies and
   world/Toledo events; the chart body stays clean. Hover for a card, click to pin someone and light up their
   ancestors and descendants, scroll/pinch to zoom, drag to pan, use the mini-map brush, or the Time Machine
   mode: a year scrubber with everyone alive and a Toledo map of where they were. */
(function(){
const css=`
.tlx{--tl-bg:var(--paper,#FAF8F3);--tl-sf:var(--surface,#fff);--tl-ink:var(--ink,#0F1A2E);--tl-mut:var(--muted,#5B6474);--tl-acc:var(--gold,#8A5F1E);--tl-line:var(--line,#E3DCCD);--tl-grid:rgba(15,26,46,.08);--tl-dim:.22;--onbar:rgba(15,26,46,.88);
  --French:#2E6FD9;--Schmitt:#D65A8C;--Wetzel:#1F9E89;--Goodwin:#C9861A;--Today:#8B5CF6;--halo:rgba(0,0,0,.35);padding-block:22px 40px;display:flex;flex-direction:column;gap:14px}
:root[data-theme="dark"] .tlx,.dark .tlx{--tl-grid:rgba(255,255,255,.07);--tl-dim:.25;--onbar:rgba(255,255,255,.92);--French:#5B8EF0;--Schmitt:#E87AA6;--Wetzel:#3FBBA6;--Goodwin:#F0B84A;--Today:#A78BFA}
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]) .tlx{--tl-grid:rgba(255,255,255,.07);--tl-dim:.25;--onbar:rgba(255,255,255,.92);--French:#5B8EF0;--Schmitt:#E87AA6;--Wetzel:#3FBBA6;--Goodwin:#F0B84A;--Today:#A78BFA} }
.tlx .hd{display:flex;flex-wrap:wrap;gap:8px 28px;align-items:flex-end;justify-content:space-between}
.tlx h1{font-family:var(--display,'DM Serif Display',serif);font-weight:400;font-size:clamp(32px,4.6vw,48px);margin:0;line-height:1}
.tlx .hd p{margin:6px 0 0;color:var(--tl-mut);max-width:66ch;line-height:1.5;font-size:14.5px}
.tlx .modes{display:flex;gap:4px;background:var(--chip,#EFE7D8);padding:4px;border-radius:999px}
.tlx .modes button{padding:7px 14px;border-radius:999px;font-weight:600;font-size:13.5px;color:var(--tl-mut)} .tlx .modes button[aria-pressed="true"]{background:var(--tl-sf);color:var(--tl-ink);box-shadow:0 1px 3px rgba(0,0,0,.12)}
.tlx .pills{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.tlx .pills button{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border-radius:999px;font-size:13px;font-weight:500;border:1.5px solid var(--tl-line);color:var(--tl-ink);background:var(--tl-sf)}
.tlx .pills button i{width:10px;height:10px;border-radius:50%;background:var(--c)} .tlx .pills button[aria-pressed="false"]{color:var(--tl-mut);background:transparent} .tlx .pills button[aria-pressed="false"] i{background:transparent;border:2px solid var(--c)}
.tlx .pills .sep{width:1px;height:22px;background:var(--tl-line);margin:0 6px}
.tlx .pills .tg[aria-pressed="true"]{background:var(--tl-ink);color:var(--tl-bg);border-color:var(--tl-ink)}
.tlx .stage{position:relative;background:var(--tl-sf);border:1px solid var(--tl-line);border-radius:18px;overflow:hidden;box-shadow:0 24px 60px -36px rgba(15,26,46,.45)}
.tlx canvas{display:block;width:100%;touch-action:none;outline:none}
.tlx .ro{position:absolute;left:50%;top:96px;transform:translateX(-50%);z-index:3;pointer-events:none;font-size:12px;font-weight:600;padding:5px 12px;border-radius:999px;background:var(--tl-ink);color:var(--tl-bg);box-shadow:0 8px 20px -10px rgba(0,0,0,.5);white-space:nowrap;opacity:0;transition:opacity .15s}
.tlx .ro.on{opacity:1}
.tlx .card{position:absolute;z-index:5;pointer-events:none;width:260px;background:var(--tl-ink);color:var(--tl-bg);border-radius:14px;padding:12px 14px;font-size:13px;line-height:1.45;box-shadow:0 22px 50px -18px rgba(0,0,0,.6);opacity:0;transition:opacity .12s}
.tlx .card.on{opacity:1} .tlx .card .av{float:left;width:40px;height:40px;border-radius:50%;margin:0 10px 6px 0;display:grid;place-items:center;font-family:var(--display,'DM Serif Display',serif);font-size:17px;color:#fff;overflow:hidden} .tlx .card .av img{width:100%;height:100%;object-fit:cover}
.tlx .card b{display:block;font-family:var(--display,'DM Serif Display',serif);font-weight:400;font-size:17px;line-height:1.15;margin-bottom:2px} .tlx .card small{display:block;opacity:.72;margin-top:4px} .tlx .card .rel{display:inline-block;margin-top:6px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--goldL,#D9B36A)}
.tlx .foot{display:flex;flex-wrap:wrap;gap:8px 20px;align-items:center;color:var(--tl-mut);font-size:12.5px;line-height:1.5}
.tlx .foot kbd{display:inline-block;min-width:20px;text-align:center;padding:0 5px;border-radius:5px;border:1px solid var(--tl-line);border-bottom-width:2px;font:600 11px var(--body,'DM Sans');color:var(--tl-ink);background:var(--chip,#EFE7D8)}
.tlx .pin{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:12px;background:var(--chip,#EFE7D8);font-size:13.5px} .tlx .pin b{font-weight:600} .tlx .pin button{margin-left:auto;font-size:12.5px;color:var(--tl-acc);font-weight:600}
.tlx .pin a{color:var(--tl-acc);font-weight:600;text-decoration:none}
/* time machine */
.tlx .tm{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.3fr)}
.tlx .scrub{padding:16px 18px 10px;border-bottom:1px solid var(--tl-line);grid-column:1/-1}
.tlx .scrub .yr{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap} .tlx .scrub .yr b{font-family:var(--display,'DM Serif Display',serif);font-weight:400;font-size:58px;line-height:1;font-variant-numeric:tabular-nums} .tlx .scrub .yr span{color:var(--tl-mut);font-size:13.5px;line-height:1.4;max-width:70ch}
.tlx .scrub .row{display:flex;gap:12px;align-items:center;margin-top:8px} .tlx .scrub input[type=range]{flex:1;accent-color:var(--tl-acc);height:28px}
.tlx .scrub .play{padding:7px 14px;border-radius:999px;background:var(--tl-acc);color:#fff;font-weight:600;font-size:13px;flex:none}
.tlx .strip{height:50px;width:100%;display:block}
.tlx .grid{display:flex;flex-direction:column;gap:16px;padding:14px 16px 20px;overflow:auto;max-height:640px;scrollbar-width:thin}
.tlx .grp h4{margin:0 0 8px;display:flex;align-items:center;gap:8px;font:700 10.5px var(--body,'DM Sans',sans-serif);letter-spacing:1.6px;text-transform:uppercase;color:var(--tl-mut)}
.tlx .grp h4 i{width:9px;height:9px;border-radius:50%;background:var(--c);flex:none} .tlx .grp h4 b{font-weight:600;color:var(--tl-ink);letter-spacing:0;font-size:12px}
.tlx .grp h4::after{content:"";flex:1;height:1px;background:var(--tl-line)}
.tlx .grp .fl{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px 4px}
.tlx .pc{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;cursor:pointer;animation:tlin .35s both;border-radius:14px;padding:8px 2px 8px;transition:background .15s;min-width:0}
.tlx .pc:hover,.tlx .pc.hot{background:var(--chip,#EFE7D8)} .tlx .pc.sel{background:color-mix(in srgb,var(--c) 20%,transparent)}
.tlx .pc:focus-visible{outline:2px solid var(--tl-acc);outline-offset:2px}
@media (prefers-reduced-motion: reduce){ .tlx .pc{animation:none} }
@keyframes tlin{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
.tlx .pc .d{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;color:#fff;font-family:var(--display,'DM Serif Display',serif);font-size:19px;position:relative;background:var(--c);box-shadow:0 0 0 2.5px var(--tl-sf),0 0 0 5px var(--c),0 10px 20px -12px rgba(0,0,0,.6);text-shadow:0 1px 2px rgba(0,0,0,.35)}
.tlx .pc .d img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:50%}
.tlx .pc .d.np{opacity:.6}
.tlx .pc .ag{position:absolute;right:-8px;bottom:-5px;min-width:22px;height:18px;padding:0 5px;border-radius:999px;background:var(--tl-ink);color:var(--tl-bg);font:700 10px/18px var(--body,'DM Sans',sans-serif);font-variant-numeric:tabular-nums;text-shadow:none;box-shadow:0 0 0 2px var(--tl-sf);z-index:1}
.tlx .pc .ag.born{background:var(--tl-acc);color:#fff} .tlx .pc .ag.died{background:#5A5F6B;color:#fff}
.tlx .pc .n{font-size:11.5px;line-height:1.2;color:var(--tl-ink);font-weight:600;max-width:100%;overflow-wrap:anywhere} .tlx .pc .n em{display:block;font-style:normal;font-weight:400;color:var(--tl-mut);font-size:10.5px}
.tlx .tmx-glb{position:relative;border-left:1px solid var(--tl-line);min-height:640px;background:#050B17;overflow:hidden;color:#FFF6E4}
.tlx .tmx-glb canvas{position:absolute;inset:0;width:100%;height:100%;cursor:grab;touch-action:none} .tlx .tmx-glb canvas.drag{cursor:grabbing}
.tlx .tmx-ttl{position:absolute;left:16px;top:14px;z-index:2;pointer-events:none} .tlx .tmx-ttl div{font-size:10.5px;letter-spacing:2px;text-transform:uppercase;color:#D9B36A;font-weight:700} .tlx .tmx-ttl b{display:block;font-family:var(--display,'DM Serif Display',serif);font-weight:400;font-size:26px;line-height:1.1;margin-top:2px;font-variant-numeric:tabular-nums}
.tlx .tmx-ctl{position:absolute;right:12px;top:12px;z-index:3;display:flex;flex-wrap:wrap;justify-content:flex-end;gap:5px;max-width:66%}
.tlx .tmx-ctl button{padding:6px 11px;border-radius:999px;background:rgba(238,230,216,.12);color:#FFF6E4;font-size:12px;font-weight:600;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)} .tlx .tmx-ctl button:hover{background:rgba(238,230,216,.2)} .tlx .tmx-ctl button[aria-pressed="true"]{background:#D9B36A;color:#0A1426}
.tlx .tmx-zm{position:absolute;right:12px;bottom:12px;z-index:3;display:flex;flex-direction:column;gap:5px} .tlx .tmx-zm button{width:34px;height:34px;border-radius:50%;background:rgba(238,230,216,.12);color:#FFF6E4;font-size:18px;display:grid;place-items:center}
.tlx .tmx-st{position:absolute;left:14px;bottom:12px;right:60px;z-index:2;font-size:11.5px;color:rgba(238,230,216,.72);pointer-events:none;line-height:1.45}
.tlx .tmx-st i{display:inline-block;width:10px;height:10px;border-radius:50%;border:1.5px dashed rgba(238,230,216,.7);vertical-align:-1px;margin:0 3px 0 6px}
.tlx .tmx-tip{position:absolute;z-index:4;pointer-events:none;background:rgba(6,12,23,.95);color:#FFF6E4;border:1px solid rgba(238,230,216,.16);border-radius:10px;padding:7px 10px;font-size:12px;line-height:1.35;white-space:nowrap;transform:translate(-50%,calc(-100% - 10px));opacity:0;transition:opacity .12s;box-shadow:0 12px 30px -12px #000} .tlx .tmx-tip.on{opacity:1} .tlx .tmx-tip b{display:block;font-size:13px} .tlx .tmx-tip span{opacity:.72}
.tlx .tmx-sel{position:absolute;left:14px;top:74px;z-index:4;width:280px;max-width:calc(100% - 28px);background:rgba(8,14,26,.96);color:#FFF6E4;border:1px solid rgba(238,230,216,.16);border-radius:16px;padding:14px 14px 14px;font-size:13px;line-height:1.45;box-shadow:0 24px 60px -20px rgba(0,0,0,.85)} .tlx .tmx-sel[hidden]{display:none}
.tlx .tmx-sel .av{float:left;width:50px;height:50px;border-radius:50%;margin:0 12px 6px 0;display:grid;place-items:center;font-family:var(--display,'DM Serif Display',serif);font-size:19px;color:#fff;overflow:hidden;box-shadow:0 0 0 2.5px var(--c)} .tlx .tmx-sel .av img{width:100%;height:100%;object-fit:cover}
.tlx .tmx-sel b{display:block;font-family:var(--display,'DM Serif Display',serif);font-weight:400;font-size:20px;line-height:1.12;margin:2px 22px 2px 0} .tlx .tmx-sel small{display:block;opacity:.72}
.tlx .tmx-sel .wh{clear:both;display:block;margin-top:8px;padding-top:8px;border-top:1px solid rgba(238,230,216,.12);color:#D9B36A;font-size:12.5px}
.tlx .tmx-sel .go{display:inline-block;margin-top:10px;padding:7px 13px;border-radius:999px;background:#D9B36A;color:#0A1426;font-weight:700;font-size:12.5px;text-decoration:none}
.tlx .tmx-sel .x{position:absolute;right:8px;top:6px;width:30px;height:30px;border-radius:50%;color:rgba(238,230,216,.72);font-size:19px} .tlx .tmx-sel .x:hover{background:rgba(238,230,216,.1)}
@media (max-width:900px){ .tlx .tm{grid-template-columns:1fr} .tlx .tmx-glb{order:2;border-left:0;border-top:1px solid var(--tl-line);min-height:0;height:min(66vh,560px)} .tlx .grid{order:3;max-height:480px} .tlx .tmx-sel{top:auto;bottom:52px;left:10px} .tlx .tmx-ttl b{font-size:21px} }
@media (max-width:700px){ .tlx .scrub .yr b{font-size:44px} .tlx .card{width:220px} .tlx .tmx-ctl{max-width:none;left:10px;right:10px;top:62px;justify-content:flex-start} .tlx .tmx-ctl button{padding:5px 9px;font-size:11.5px} .tlx .tmx-ttl{left:12px;top:10px} .tlx .tmx-st{font-size:11px;left:10px} .tlx .grp .fl{grid-template-columns:repeat(auto-fill,minmax(72px,1fr))} }
@media (pointer:coarse){ .tlx .pills button{min-height:40px} .tlx .modes button{min-height:40px} .tlx .scrub input[type=range]{height:44px} .tlx .scrub .play{min-height:44px} .tlx .tmx-ctl button{min-height:36px} .tlx .tmx-zm button{width:42px;height:42px} }`;
const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

const E=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const NOW=new Date().getFullYear();
const LINES=[['French','French line'],['Schmitt','Schmitt line'],['Wetzel','Wetzel line'],['Goodwin','Goodwin line'],['Today',"Art & Ginger's family"]];
let TREE=null,HIST=null,BRN=null,GEO=null,PEOPLE=null,MAPD=null; const ON={French:1,Schmitt:1,Wetzel:1,Goodwin:1,Today:1}; let showCtx=true;
const full=p=>[p.g,p.s].filter(Boolean).join(' ').trim()||'Unknown';
const ini=p=>((p.g||'?')[0]+((p.s||'')[0]||'')).toUpperCase();
const cssVar=(el,n)=>getComputedStyle(el).getPropertyValue(n).trim();
async function load(){ if(PEOPLE) return;
  [TREE,HIST,BRN,GEO]=await Promise.all(['tree.json','history.json','branches.json','places_geo.json'].map(n=>fetch(n).then(r=>r.json())));
  PEOPLE=Object.values(TREE.people).filter(p=>p.by||p.dy).map(p=>{ const by=p.by||p.dy-60, dy=p.dy||(p.by<1930?Math.min(p.by+78,NOW):null); const alive=!p.dy&&p.by>=1930;
    const sp=(p.fams||[]).map(f=>TREE.fams[f]).filter(Boolean).map(f=>({y:+((f.md||'').match(/\d{4}/)||[0])[0],id:f.h===p.id?f.w:f.h})).filter(x=>x.y);
    return {...p,by,dy,alive,br:BRN[p.id]||'Schmitt',name:full(p),sp,est:!p.by||(!p.dy&&!alive)} }) }
function ancestors(id,acc=new Set()){ const p=TREE.people[id]; if(!p) return acc; for(const f of p.famc||[]){ const F=TREE.fams[f]; for(const x of [F.h,F.w]) if(x&&!acc.has(x)){ acc.add(x); ancestors(x,acc) } } return acc }
function descendants(id,acc=new Set()){ const p=TREE.people[id]; if(!p) return acc; for(const f of p.fams||[]){ for(const c of TREE.fams[f].c||[]) if(!acc.has(c)){ acc.add(c); descendants(c,acc) } } return acc }
const presAt=y=>HIST.presidents.find(q=>y>=q.from&&(q.to==null||y<q.to));
const party=q=>q.party==='Democratic'?'#5C7FD6':q.party==='Republican'?'#D6655C':/Whig|Federalist/.test(q.party)?'#B89A5C':'#8A8F99';
function cardHTML(p,yr,pinned){ const age=yr!=null?yr-p.by:null; const rel=pinned&&pinned!==p?(ancestors(pinned.id).has(p.id)?'ancestor':descendants(pinned.id).has(p.id)?'descendant':pinned.sp.some(s=>s.id===p.id)?'spouse':''):(pinned===p?'pinned':'');
  const ps=pSrc(p);
  return `<span class="av" style="background:var(--${p.br})">${ps?`<img src="${ps}" alt="">`:E(ini(p))}</span><b>${E(p.name)}</b>${E(p.b?'b. '+p.b:'b. about '+p.by)}${p.bp?', '+E(p.bp.replace(/\s*\(.*\)/,'')):''}<br>${p.d?`d. ${E(p.d)}${p.dp?', '+E(p.dp.replace(/\s*\(.*\)/,'')):''}`:(p.alive?'living':'death not recorded')}${age!=null&&age>=0&&(!p.dy||yr<=p.dy)?`<small>aged ${age} in ${yr}${presAt(yr)?' · '+E(presAt(yr).name)+' was president':''}</small>`:''}<small>${E(LINES.find(l=>l[0]===p.br)[1])}${p.est?' · dates partly estimated':''}</small>${rel?`<span class="rel">${rel}</span>`:''}` }

window.familyTimeline=async function(app,mode){ if(typeof view!=='undefined') view={tab:'timeline'};
  app.innerHTML='<div class="wrap tlx"><p style="color:var(--muted)">Loading the family…</p></div>';
  try{ await load() }catch(e){ app.innerHTML='<div class="wrap tlx"><p>The timeline did not load. Reload to try again.</p></div>'; return }
  mode=mode||'machine';
  const root=app.querySelector('.tlx'); root.innerHTML=`<div class="hd"><div><div class="eyebrow">The family in time · ${PEOPLE.length} people · 1560 – ${NOW}</div><h1>${mode==='machine'?'Time Machine':'Lifelines'}</h1><p id="tlsub"></p></div><div class="modes" role="group" aria-label="Timeline mode"><button data-m="machine" aria-pressed="${mode==='machine'}">Time Machine</button><button data-m="lines" aria-pressed="${mode==='lines'}">Lifelines</button></div></div>
    <div class="pills">${LINES.map(([k,l])=>`<button data-l="${k}" aria-pressed="${ON[k]?'true':'false'}" style="--c:var(--${k})"><i></i>${l}</button>`).join('')}<span class="sep"></span><button class="tg" data-ctx aria-pressed="${showCtx}">Presidents &amp; events</button></div>
    <div class="stage" id="tlstage"></div><div id="tlpin"></div><div class="foot" id="tlfoot"></div>`;
  root.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{ const h='timeline'+(b.dataset.m==='lines'?'-lines':''); if(location.hash!=='#'+h) location.hash=h; else familyTimeline(app,b.dataset.m) });
  root.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{ ON[b.dataset.l]=!ON[b.dataset.l]; b.setAttribute('aria-pressed',String(!!ON[b.dataset.l])); root._redraw&&root._redraw(true) });
  root.querySelector('[data-ctx]').onclick=function(){ showCtx=!showCtx; this.setAttribute('aria-pressed',String(showCtx)); root._redraw&&root._redraw() };
  if(mode==='machine') machine(root); else lines(root) };

/* ---------------- Lifelines ---------------- */
function lines(root){ const stage=root.querySelector('#tlstage'); stage.innerHTML=`<canvas id="tlc" tabindex="0" aria-label="Family lifelines. Arrow keys move the year, plus and minus zoom, Escape clears."></canvas><div class="ro" id="tlro"></div><div class="card" id="tlcard"></div>`;
  root.querySelector('#tlsub').textContent='Every person is one bar, grouped by family line. Hover anyone for their story and the president of the day; click to pin them and light up their ancestors and descendants. Scroll to zoom, drag to pan, drag the mini-map below the ruler.';
  root.querySelector('#tlfoot').innerHTML=`<span><kbd>←</kbd> <kbd>→</kbd> move the year</span><span><kbd>+</kbd> <kbd>−</kbd> zoom</span><span><kbd>Esc</kbd> unpin</span><span>Bars with a soft end are living family. The ruler on top shows presidencies (coloured by party) and world events (gold ticks are Toledo).</span>`;
  const cv=stage.querySelector('#tlc'), ctx=cv.getContext('2d'), ro=stage.querySelector('#tlro'), card=stage.querySelector('#tlcard'), pinBox=root.querySelector('#tlpin');
  const GUT=()=>W>=1100?128:W>=700?92:70, RULER=46, MINI=42, ROW=14, BAR=8, LANEGAP=22, TOP=RULER+MINI+16;
  let W=0,H=0,dpr=1,dom=[1560,NOW],hover=null,pinned=null,cursorYr=null,drag=null,anim=null,layoutCache=null,theme=null;
  const x=()=>d3.scaleLinear().domain(dom).range([GUT(),W-18]);
  function colors(){ theme={}; for(const [k] of LINES) theme[k]=cssVar(root,'--'+k)||'#888'; theme.ink=cssVar(root,'--tl-ink'); theme.mut=cssVar(root,'--tl-mut'); theme.grid=cssVar(root,'--tl-grid'); theme.acc=cssVar(root,'--tl-acc'); theme.dim=+cssVar(root,'--tl-dim')||.22; theme.onbar=cssVar(root,'--onbar'); theme.sf=cssVar(root,'--tl-sf'); theme.halo=cssVar(root,'--halo')||'rgba(0,0,0,.35)' }
  function layout(){ // swim-lanes; packing is on the full domain so rows don't jump while zooming
    const xs=d3.scaleLinear().domain([1560,NOW]).range([0,1]); const lanes=[]; let y=TOP;
    for(const [k,label] of LINES){ if(!ON[k]) continue; const ppl=PEOPLE.filter(p=>p.br===k).sort((a,b)=>a.by-b.by||a.name.localeCompare(b.name)); const rows=[];
      for(const p of ppl){ const s=xs(p.by), e=xs(p.dy||NOW)+0.012; let r=rows.findIndex(v=>v<=s-0.004); if(r<0){ rows.push(e); r=rows.length-1 } else rows[r]=e; p._row=r }
      const h=rows.length*ROW+10; lanes.push({k,label,ppl,y,h,n:ppl.length}); ppl.forEach(p=>{ p._y=y+8+p._row*ROW }); y+=h+LANEGAP }
    return {lanes,H:y+30} }
  function size(){ if(!root.isConnected){ ro_.disconnect(); mo.disconnect(); return } const r=cv.getBoundingClientRect(); dpr=Math.min(2,devicePixelRatio||1); W=Math.max(320,r.width); colors(); layoutCache=layout(); H=Math.max(480,layoutCache.H); cv.style.height=H+'px'; cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); draw() }
  function draw(){ const L=layoutCache||layout(); const X=x(); const g0=GUT(); ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,W,H); const span=dom[1]-dom[0], pxYr=(W-18-g0)/span;
    // ruler: years
    ctx.font='600 11px DM Sans, sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top'; const step=pxYr>18?5:pxYr>7?10:pxYr>3.2?20:pxYr>1.4?50:100; const y0=Math.ceil(dom[0]/step)*step;
    for(let yr=y0;yr<=dom[1];yr+=step){ const xx=X(yr); ctx.fillStyle=theme.mut; ctx.fillText(yr,xx,8); ctx.strokeStyle=theme.grid; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(xx,TOP-6); ctx.lineTo(xx,H-20); ctx.stroke() }
    // ruler: presidencies + events
    let evEnd=0; if(showCtx){ const py=24; HIST.presidents.forEach((q,i)=>{ const a=Math.max(X(q.from),g0), b=Math.min(X(q.to||NOW),W-18); if(b-a<1) return; ctx.fillStyle=party(q); ctx.globalAlpha=i%2?.32:.22; ctx.fillRect(a,py,b-a,12); ctx.globalAlpha=1;
        const w=b-a; let nm=w>120?q.name:w>44?q.name.split(' ').slice(-1)[0]:w>16?q.name.split(' ').map(s=>s[0]).join(''):''; if(nm){ ctx.fillStyle=theme.ink; ctx.font='600 9.5px DM Sans, sans-serif'; ctx.textBaseline='middle'; ctx.textAlign='center'; if(ctx.measureText(nm).width<w-6) ctx.fillText(nm,(a+b)/2,py+6) } });
      HIST.events.forEach(e=>{ const xx=X(e.year); if(xx<g0||xx>W-18) return; ctx.fillStyle=e.kind==='local-Toledo'?theme.acc:theme.mut; ctx.globalAlpha=e.kind==='local-Toledo'?.9:.55; ctx.fillRect(xx-.5,py+15,1.5,6); ctx.globalAlpha=1; if(pxYr>4){ ctx.font='500 9.5px DM Sans, sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top'; const lbl=e.label.length>26?e.label.slice(0,24)+'…':e.label; const w=ctx.measureText(lbl).width; if(xx+3+w<=(evEnd||0)) return; evEnd=xx+3+w+8; ctx.fillStyle=theme.mut; ctx.fillText(lbl,xx+3,py+21) } }) }
    // mini-map
    const my=RULER+6; const mx=d3.scaleLinear().domain([1560,NOW]).range([g0,W-18]); ctx.fillStyle=theme.grid; ctx.fillRect(g0,my,W-18-g0,MINI-10);
    for(const l of L.lanes) for(const p of l.ppl){ ctx.fillStyle=theme[p.br]; ctx.globalAlpha=.55; ctx.fillRect(mx(p.by),my+3+(p._row%12)*2.4,Math.max(1,mx(p.dy||NOW)-mx(p.by)),1.6) } ctx.globalAlpha=1;
    ctx.strokeStyle=theme.acc; ctx.lineWidth=1.5; ctx.fillStyle='rgba(217,179,106,.14)'; const bx0=mx(dom[0]), bx1=mx(dom[1]); ctx.fillRect(bx0,my-1,bx1-bx0,MINI-8); ctx.strokeRect(bx0,my-1,bx1-bx0,MINI-8);
    // lanes
    const pinAnc=pinned?ancestors(pinned.id):null, pinDes=pinned?descendants(pinned.id):null;
    ctx.save(); ctx.beginPath(); ctx.rect(g0-2,TOP-8,W-g0-14,H-TOP); ctx.clip();
    for(const l of L.lanes){ ctx.fillStyle=theme[l.k]; ctx.globalAlpha=.06; ctx.fillRect(g0-2,l.y,W-g0-14,l.h); ctx.globalAlpha=1;
      for(const p of l.ppl){ const a=X(p.by), b=X(p.dy||NOW); if(b<g0-20||a>W) continue; const y=p._y; const c=theme[l.k]; let alpha=1; let hot=hover===p||pinned===p; let rel='';
        if(pinned){ if(pinAnc.has(p.id)) rel='anc'; else if(pinDes.has(p.id)) rel='des'; else if(pinned.sp.some(s=>s.id===p.id)) rel='sp'; if(pinned!==p&&!rel) alpha=theme.dim } else if(hover&&hover!==p) alpha=.55;
        ctx.globalAlpha=alpha; const w=Math.max(4,b-a); ctx.fillStyle=c; if(p.alive){ const gr=ctx.createLinearGradient(a,0,b,0); gr.addColorStop(0,c); gr.addColorStop(.8,c); gr.addColorStop(1,c+'00'); ctx.fillStyle=gr }
        ctx.beginPath(); ctx.roundRect(a,y,w,BAR,4); ctx.fill(); if(rel||hot){ ctx.strokeStyle=rel?theme.acc:theme.ink; ctx.lineWidth=rel?1.5:1.2; ctx.stroke() }
        if(alpha>.5){ ctx.font='500 10.5px DM Sans, sans-serif'; ctx.textBaseline='middle'; const tw=ctx.measureText(p.name).width; if(w>=tw+14){ ctx.textAlign='left'; ctx.lineWidth=2.5; ctx.strokeStyle=theme.halo; ctx.strokeText(p.name,a+7,y+BAR/2+.5); ctx.fillStyle=theme.onbar; ctx.fillText(p.name,a+7,y+BAR/2+.5) } else { const nxt=l.ppl.find(q=>q._row===p._row&&q.by>p.by); const room=(nxt?X(nxt.by):W-18)-b-8; let nm=p.name; if(room<tw) nm=(p.g||'').split(' ')[0]+' '+((p.s||'')[0]||'')+'.'; if(room>=ctx.measureText(nm).width&&room>26){ ctx.fillStyle=theme.ink; ctx.globalAlpha=alpha*.85; ctx.textAlign='left'; ctx.fillText(nm,b+6,y+BAR/2+.5); ctx.globalAlpha=alpha } } }
        if(rel){ ctx.fillStyle=theme.acc; ctx.font='700 9px DM Sans, sans-serif'; ctx.textAlign='right'; ctx.fillText(rel==='anc'?'↑':rel==='des'?'↓':'♥',a-4,y+BAR/2+.5) }
        if(pxYr>2.2&&!pinned) for(const m of p.sp){ const q=l.ppl.find(z=>z.id===m.id); if(!q||q._row<=p._row) continue; const xm=X(m.y); ctx.strokeStyle=c; ctx.globalAlpha=.35*alpha; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(xm,y+BAR); ctx.lineTo(xm,q._y); ctx.stroke() } }
      ctx.globalAlpha=1 }
    ctx.restore();
    // lane headers (outside clip)
    for(const l of L.lanes){ ctx.fillStyle=theme[l.k]; ctx.fillRect(g0-10,l.y+2,2,Math.min(l.h-4,28)); ctx.fillStyle=theme.ink; ctx.font='700 10.5px DM Sans, sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top'; const lbl=W>=700?l.label.toUpperCase():l.k.toUpperCase(); ctx.fillText(lbl.length>18&&W<1100?l.k.toUpperCase():lbl,14,l.y+4); ctx.fillStyle=theme.mut; ctx.font='500 10.5px DM Sans, sans-serif'; ctx.fillText(l.n+' people',14,l.y+18) }
    // cursor
    if(cursorYr!=null){ const xx=X(cursorYr); ctx.strokeStyle=theme.acc; ctx.globalAlpha=.6; ctx.lineWidth=1; ctx.setLineDash([3,3]); ctx.beginPath(); ctx.moveTo(xx,TOP-8); ctx.lineTo(xx,H-20); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=1 } }
  function readout(yr){ if(yr==null){ ro.classList.remove('on'); return } const alive=PEOPLE.filter(p=>ON[p.br]&&p.by<=yr&&(p.dy||NOW)>=yr).length; const pr=presAt(yr); ro.textContent=`${yr} · ${alive} alive${pr?' · '+pr.name:''}`; ro.classList.add('on') }
  const coarse=matchMedia('(pointer:coarse)').matches; function pick(mx,my){ const L=layoutCache, X=x(); const pad=coarse?8:3; for(const l of L.lanes){ if(my<l.y||my>l.y+l.h) continue; for(const p of l.ppl){ if(my>=p._y-pad&&my<=p._y+BAR+pad&&mx>=X(p.by)-3&&mx<=X(p.dy||NOW)+3) return p } } return null }
  function showCard(p,mx,my){ if(!p){ card.classList.remove('on'); return } card.innerHTML=cardHTML(p,cursorYr,pinned); card.classList.add('on'); const X=x(); const b=X(p.dy||NOW); const left=(b+280<W)?b+10:Math.max(8,X(p.by)-270); card.style.left=Math.min(W-270,Math.max(8,left))+'px'; card.style.top=Math.min(H-170,p._y+16)+'px' }
  function setPin(p){ pinned=p; if(p){ const anc=ancestors(p.id).size, des=descendants(p.id).size; pinBox.innerHTML=`<div class="pin"><i style="width:12px;height:12px;border-radius:50%;background:var(--${p.br})"></i><span><b>${E(p.name)}</b> pinned · ${anc} ancestors ↑ and ${des} descendants ↓ lit up${typeof TREE!=='undefined'?` · <a href="#tree-${p.id}">open in the tree</a>`:''}</span><button id="tlunpin">Unpin (Esc)</button></div>`; pinBox.querySelector('#tlunpin').onclick=()=>setPin(null) } else pinBox.innerHTML=''; draw() }
  function zoomTo(d,ms=220){ d=[Math.max(1560,d[0]),Math.min(NOW,d[1])]; if(d[1]-d[0]<16){ const c=(d[0]+d[1])/2; d=[c-8,c+8] } if(d[0]<1560){ d=[1560,1560+(d[1]-d[0])] } if(d[1]>NOW){ d=[NOW-(d[1]-d[0]),NOW] } const from=[...dom]; anim&&anim.stop(); const i=d3.interpolate(from,d); anim=d3.timer(t=>{ const k=d3.easeCubicOut(Math.min(1,t/ms)); dom=i(k); draw(); if(k>=1){ anim.stop(); anim=null } }) }
  cv.addEventListener('pointermove',e=>{ const r=cv.getBoundingClientRect(), mx=e.clientX-r.left, my=e.clientY-r.top; const X=x();
    if(drag){ if(drag.mini){ const mx2=d3.scaleLinear().domain([1560,NOW]).range([GUT(),W-18]); const span=dom[1]-dom[0]; let c=mx2.invert(mx); dom=[c-span/2,c+span/2]; if(dom[0]<1560) dom=[1560,1560+span]; if(dom[1]>NOW) dom=[NOW-span,NOW]; draw(); return } const dy=X.invert(drag.x)-X.invert(mx); let d=[drag.d[0]+dy,drag.d[1]+dy]; const span=d[1]-d[0]; if(d[0]<1560) d=[1560,1560+span]; if(d[1]>NOW) d=[NOW-span,NOW]; dom=d; draw(); return }
    if(my>=TOP-8&&mx>=GUT()){ cursorYr=Math.round(X.invert(mx)); readout(cursorYr) } else { cursorYr=null; readout(null) }
    const p=my>=TOP-8?pick(mx,my):null; cv.style.cursor=p?'pointer':(my<RULER+MINI?'ew-resize':'grab'); hover=p; showCard(p,mx,my); draw() });
  cv.addEventListener('pointerleave',()=>{ hover=null; cursorYr=null; readout(null); card.classList.remove('on'); draw() });
  cv.addEventListener('pointerdown',e=>{ const r=cv.getBoundingClientRect(), mx=e.clientX-r.left, my=e.clientY-r.top; cv.setPointerCapture(e.pointerId); drag={x:mx,y:my,d:[...dom],moved:false,mini:my>RULER&&my<RULER+MINI}; if(drag.mini){ const mx2=d3.scaleLinear().domain([1560,NOW]).range([GUT(),W-18]); const span=dom[1]-dom[0]; let c=mx2.invert(mx); dom=[c-span/2,c+span/2]; if(dom[0]<1560) dom=[1560,1560+span]; if(dom[1]>NOW) dom=[NOW-span,NOW]; draw() } });
  cv.addEventListener('pointerup',e=>{ const r=cv.getBoundingClientRect(), mx=e.clientX-r.left, my=e.clientY-r.top; const was=drag; drag=null; if(was&&Math.abs(mx-was.x)+Math.abs(my-was.y)<4&&!was.mini){ const p=pick(mx,my); setPin(p===pinned?null:p) } });
  cv.addEventListener('dblclick',()=>zoomTo([1560,NOW],300));
  cv.addEventListener('wheel',e=>{ e.preventDefault(); const r=cv.getBoundingClientRect(), mx=e.clientX-r.left; const X=x(); const yr=X.invert(mx); const k=Math.exp(e.deltaY*.0012); const span=(dom[1]-dom[0])*k; if(span>NOW-1560&&k>1){ dom=[1560,NOW]; draw(); return } const f=(yr-dom[0])/(dom[1]-dom[0]); let d=[yr-f*span,yr+(1-f)*span]; if(span<16) return; if(d[0]<1560) d=[1560,1560+span]; if(d[1]>NOW) d=[NOW-span,NOW]; dom=d; draw() },{passive:false});
  let pinch=null; cv.addEventListener('touchstart',e=>{ if(e.touches.length===2){ pinch={d:Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY),dom:[...dom]}; drag=null } },{passive:true});
  cv.addEventListener('touchmove',e=>{ if(pinch&&e.touches.length===2){ const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY); const k=pinch.d/d; const c=(pinch.dom[0]+pinch.dom[1])/2, span=Math.max(16,Math.min(NOW-1560,(pinch.dom[1]-pinch.dom[0])*k)); let dd=[c-span/2,c+span/2]; if(dd[0]<1560) dd=[1560,1560+span]; if(dd[1]>NOW) dd=[NOW-span,NOW]; dom=dd; draw() } },{passive:true});
  cv.addEventListener('touchend',()=>pinch=null);
  cv.addEventListener('keydown',e=>{ const span=dom[1]-dom[0]; if(e.key==='ArrowLeft'||e.key==='ArrowRight'){ const s=(e.key==='ArrowLeft'?-1:1)*(e.shiftKey?10:1)*Math.max(1,span/120); zoomTo([dom[0]+s,dom[1]+s],80); e.preventDefault() } else if(e.key==='+'||e.key==='='){ const c=(dom[0]+dom[1])/2; zoomTo([c-span/3,c+span/3]); e.preventDefault() } else if(e.key==='-'){ const c=(dom[0]+dom[1])/2; zoomTo([c-span*.75,c+span*.75]); e.preventDefault() } else if(e.key==='Escape'&&pinned){ setPin(null); e.stopPropagation() } else if(e.key==='Enter'&&hover){ setPin(hover===pinned?null:hover) } else if(e.key==='Home'){ zoomTo([1560,NOW],300) } else if(e.key==='End'){ zoomTo([NOW-110,NOW],300) } });
  root._redraw=(relayout)=>{ if(relayout) size(); else { colors(); draw() } };
  const ro_=new ResizeObserver(()=>size()); ro_.observe(cv); const mo=new MutationObserver(()=>{ if(!root.isConnected){ mo.disconnect(); return } colors(); draw() }); mo.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','class']}); size(); setTimeout(()=>{ if(root.isConnected) zoomTo([1790,NOW],900) },300) }

/* ---------------- Time Machine ----------------
   A year scrubber over an interactive globe. Everyone alive that year sits on the globe as a portrait pin at
   their latest known place (or with their spouse / parents when their own place is unknown). Pins that share a
   spot stack up with a count and fan out on hover or tap; moves animate along great-circle arcs; the globe
   follows the family's centre of gravity unless you take the wheel. */
const rewindF=f=>{ if(d3.geoArea(f)>2*Math.PI){ const g=f.geometry; const rev=r=>r.slice().reverse(); if(g.type==='Polygon') g.coordinates=g.coordinates.map(rev); else if(g.type==='MultiPolygon') g.coordinates=g.coordinates.map(p=>p.map(rev)) } return f };
const JS=n=>(typeof neJSON==='function'?neJSON(n):fetch(n+'.json').then(r=>{ if(!r.ok) throw new Error(n); return r.json() }));
let GLB=null;
async function loadGlobe(){ if(GLB) return GLB; const w=await JS('world'); GLB={land:topojson.feature(w,w.objects.land),borders:topojson.mesh(w,w.objects.countries,(a,b)=>a!==b),hd:null,hdP:null}; return GLB }
function loadHD(){ if(!GLB) return Promise.resolve(null); if(GLB.hd) return Promise.resolve(GLB.hd); if(GLB.hdP) return GLB.hdP;
  GLB.hdP=Promise.all(['land10','coast10','lakes10','rivers10','states_lines','urban10'].map(JS)).then(ts=>{
    const prep=t=>{ const fc=topojson.feature(t,t.objects[Object.keys(t.objects)[0]]); const out=[]; for(const f of fc.features){ if(!f.geometry) continue; if(/Polygon/.test(f.geometry.type)) rewindF(f); const b=d3.geoBounds(f), c=d3.geoCentroid(f); let r=0; for(const q of [b[0],b[1],[b[0][0],b[1][1]],[b[1][0],b[0][1]]]) r=Math.max(r,d3.geoDistance(c,q)); if(!isFinite(r)||!(c[0]===c[0])) { out.push({f,c:[0,0],r:Math.PI}); continue } out.push({f,c,r}) } return out };
    const [la,co,lk,rv,st,ub]=ts.map(prep); GLB.hd={land:la,coast:co,lakes:lk,rivers:rv,states:st,urban:ub}; return GLB.hd }).catch(()=>{ GLB.hdP=null; return null }); return GLB.hdP }
const GEOX={'France':[46.6,2.4],'France (probably)':[46.6,2.4],'La Prairie, New France':[45.416,-73.499],'Québec, New France':[46.813,-71.208],'Beauport / Québec, New France':[46.86,-71.19],'Québec (Grondines seigneurie), New France':[46.583,-72.033],'Grondines, New France':[46.583,-72.033],'Wijk bij Duurstede, Utrecht, Netherlands':[51.975,5.341],'Netherlands':[52.13,5.29],'Suffolk, England':[52.19,.97],'Little Waldingfield, Suffolk, England':[52.07,.80],'Flushing, Queens County, NY':[40.767,-73.833],'Hempstead, Queens County, NY':[40.706,-73.619],'Hempstead, Long Island, NY (after 1677)':[40.706,-73.619],'New York':[40.713,-74.006],'La Rochelle, Aunis, France (per family record)':[46.160,-1.151],"Saint-Hilaire-sur-l'Autise, Poitou (Vendée), France":[46.42,-.75],'Rouen, Normandy, France':[49.443,1.099],'Paris, France':[48.857,2.352],'Niort, diocese of Poitiers, Poitou (Deux-Sèvres), France':[46.323,-.459],'Saint-Jean-de-Sauves, diocese of Poitiers (Vienne), France':[46.84,.09],'Saint-Jean-de-Sauves, Poitou (Vienne), France':[46.84,.09],"Saint-Jean-d'Aubrigoux, diocese of Clermont, Auvergne (Haute-Loire), France":[45.37,3.80],'Le Puy, diocese of Clermont, Auvergne (Haute-Loire), France':[45.043,3.885],'Waterville, OH':[41.50,-83.718],'Toledo, Ohio (probably)':[41.664,-83.555],'Dutch Brazil (Fort Cabedelo, near Recife)':[-6.97,-34.84],'Germany (Württemberg or Baden, probably)':[48.66,9.35],'Detroit (Fort Pontchartrain), New France (probably)':[42.331,-83.046],'Detroit area (approx.)':[42.331,-83.046],'Posen province, Prussia (Germany)':[52.41,16.93]};
const GC={French:'#5B8EF0',Schmitt:'#E87AA6',Wetzel:'#3FBBA6',Goodwin:'#F0B84A',Today:'#A78BFA'};
const hexA=(h,a)=>{ const n=parseInt((h||'#999999').slice(1),16); return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})` };
const short=s=>{ const parts=(s||'').replace(/\s*\(.*\)\s*/,'').split(',').map(x=>x.trim()).filter(Boolean); if(!parts.length) return ''; let t=/^\d/.test(parts[0])&&parts[1]?parts[1]:parts[0]; if(/^[A-Z]{2}$/.test(t)) t=({OH:'Ohio',MI:'Michigan',NY:'New York',IN:'Indiana',FL:'Florida',IL:'Illinois',SD:'South Dakota',PA:'Pennsylvania'})[t]||t; return t.replace(/ Co\.?$/,' County') };
const REF=[['Atlantic Ocean',-40,33,1,3.5,1],['Gulf of Mexico',-90,25,1.6,8,1],['Lake Erie',-81.3,42.15,5,70,1],['Lake Michigan',-87,43.7,5,40,1],['Lake Huron',-82.3,44.7,5,40,1],['Lake Ontario',-77.9,43.65,5,40,1],['Lake Superior',-88,47.6,5,30,1],['North Sea',3.5,56,4,30,1],
  ['Toledo',-83.5379,41.6639,45,999,0],['Maumee',-83.6538,41.5628,60,999,0],['Perrysburg',-83.6277,41.5570,60,999,0],['Sylvania',-83.7130,41.7189,60,999,0],['Oregon',-83.4869,41.6434,60,999,0],['Point Place',-83.49,41.72,70,999,0],['Ottawa Hills',-83.6430,41.6648,90,999,0],['Monroe',-83.3977,41.9164,45,999,0],['Detroit',-83.0458,42.3314,25,999,0],['Chicago',-87.6298,41.8781,25,999,0]];
const USN={OH:'Ohio',MI:'Michigan',NY:'New York',IN:'Indiana',FL:'Florida',IL:'Illinois',SD:'South Dakota',PA:'Pennsylvania',Ohio:'Ohio'};
function clusterLabel(k){ const n=k.m.length, pc={}; k.m.forEach(q=>{ const s=q.o.pl||''; pc[s]=(pc[s]||0)+1 }); const [top,c]=Object.entries(pc).sort((a,b)=>b[1]-a[1])[0]; if(Object.keys(pc).length===1) return top; if(c/n>=.5) return /^[A-Z]{2}$/.test(top)?(USN[top]||top):(/,| Co\b|County/.test(top)?top:top+' area');
  const cc={}; k.m.forEach(q=>{ const parts=(q.o.plFull||'').split(',').map(x=>x.trim().replace(/\s*\d{5}.*$/,'')).filter(Boolean); let ct=parts[parts.length-1]||''; if(/^(USA|US|United States)$/i.test(ct)&&parts.length>1) ct=parts[parts.length-2]; ct=USN[ct]||ct; if(/New France/.test(ct)) ct='New France'; cc[ct]=(cc[ct]||0)+1 });
  const [ct]=Object.entries(cc).sort((a,b)=>b[1]-a[1])[0]; return ct||(top+' area') }
const pSrc=p=>{ try{ if(typeof window.ftPortrait==='function'){ const s=window.ftPortrait(p.id); if(s) return s } }catch(e){} try{ if(typeof portraitFor==='function'){ const r=portraitFor(p); if(r&&r.src) return r.src } }catch(e){} return '' };
function machine(root){ const stage=root.querySelector('#tlstage'); root.querySelector('#tlsub').textContent='Pick a year and watch the family on the globe: who was alive, how old they were and where they lived. Press play to see them cross the ocean, settle Ohio and spread out again, from the first ancestor to today.';
  root.querySelector('#tlfoot').innerHTML=`<span><kbd>←</kbd> <kbd>→</kbd> one year at a time (<kbd>Shift</kbd> for ten)</span><span><kbd>Space</kbd> play / pause</span><span><kbd>F</kbd> follow the family</span><span>Drag the globe to spin it, scroll or pinch to zoom down to the street. Faces that share a place stack up — hover or tap a stack to fan it out, click it to zoom in.</span>`;
  stage.innerHTML=`<div class="tm"><div class="scrub"><div class="yr"><b id="tmy">1900</b><span id="tmc"></span></div><div class="row"><button class="play" id="tmplay">▶ Play</button><input type="range" id="tmr" min="1560" max="${NOW}" value="1900" step="1" aria-label="Year"></div><canvas class="strip" id="tms"></canvas></div>
    <div class="grid" id="tmg" aria-label="Everyone alive that year"></div>
    <div class="tmx-glb" id="tmglb"><canvas id="tmm" tabindex="0" aria-label="Globe of where the family lived that year. Drag to rotate, scroll or pinch to zoom."></canvas>
      <div class="tmx-ttl"><div>Where they were</div><b id="tmwy">1900</b></div>
      <div class="tmx-ctl"><button data-fl aria-pressed="true">◎ Follow the family</button><button data-go="toledo">Toledo</button><button data-go="lakes">Great Lakes</button><button data-go="world">Atlantic world</button></div>
      <div class="tmx-zm"><button id="tmzi" aria-label="Zoom in">+</button><button id="tmzo" aria-label="Zoom out">−</button></div>
      <div class="tmx-st" id="tmst"></div><div class="tmx-tip" id="tmtip"></div><div class="tmx-sel" id="tmsel" hidden></div></div></div>`;
  const $s=q=>stage.querySelector(q);
  const rng=$s('#tmr'), yEl=$s('#tmy'), wyEl=$s('#tmwy'), cap=$s('#tmc'), grid=$s('#tmg'), strip=$s('#tms'), glb=$s('#tmglb'), cm=$s('#tmm'), tip=$s('#tmtip'), selBox=$s('#tmsel'), stEl=$s('#tmst'), playB=$s('#tmplay'), flB=$s('[data-fl]');
  let yr=(()=>{ try{ return +(sessionStorage.getItem('tmyr')||1900) }catch(e){ return 1900 } })(), playing=null, hot=null, sel=null, fan=null, follow=true, theme={};
  const colors=()=>{ for(const [k] of LINES) theme[k]=cssVar(root,'--'+k); theme.acc=cssVar(root,'--tl-acc'); theme.mut=cssVar(root,'--tl-mut'); theme.grid=cssVar(root,'--tl-grid') };
  const where=(p,y)=>{ const evs=(p.ev||[]).filter(e=>e.y&&e.y<=y&&e.p&&GEO[e.p]).sort((a,b)=>b.y-a.y); if(evs.length) return {g:GEO[evs[0].p],pl:evs[0].p,why:evs[0].t||'Lived'}; if(p.addr&&GEO[p.addr]&&y>=(p.dy||NOW)-30) return {g:GEO[p.addr],pl:p.addr,why:'Home'}; if(p.bp&&GEO[p.bp]) return {g:GEO[p.bp],pl:p.bp,why:'Born'}; return null };
  for(const k in GEOX) if(!GEO[k]) GEO[k]={lat:GEOX[k][0],lon:GEOX[k][1]};
  const whereX=(p,y)=>{ const w=where(p,y); if(w) return w; const cand=[]; for(const s of p.sp||[]) if(s.y<=y+2) cand.push([s.id,'Living with their spouse']); const par=[]; for(const f of p.famc||[]){ const F=TREE.fams[f]; if(F) par.push(F.h,F.w) } if(y-p.by<21) par.forEach(id=>cand.push([id,'Living with their parents']));
    for(const [id,why] of cand){ const q=id&&TREE.people[id]; if(!q) continue; const w2=where(q,y); if(w2) return {...w2,why,approx:true} }
    const kids=(p.fams||[]).flatMap(f=>(TREE.fams[f]&&TREE.fams[f].c)||[]).map(id=>TREE.people[id]).filter(q=>q&&q.bp&&GEO[q.bp]&&q.by).sort((a,b)=>Math.abs(a.by-y)-Math.abs(b.by-y));
    if(kids.length&&kids[0].by<=y+12) return {g:GEO[kids[0].bp],pl:kids[0].bp,why:'Where their children were born',approx:true};
    for(const id of par){ const q=id&&TREE.people[id]; if(!q) continue; const w2=where(q,y); if(w2) return {...w2,why:'Near their parents',approx:true} } return null };
  const alive=()=>PEOPLE.filter(p=>ON[p.br]&&p.by<=yr&&(p.dy||NOW)>=yr).sort((a,b)=>a.by-b.by);
  function drawStrip(){ colors(); const r=strip.getBoundingClientRect(); if(r.width<10) return; const dpr=Math.min(2,devicePixelRatio||1); strip.width=r.width*dpr; strip.height=50*dpr; const c=strip.getContext('2d'); c.setTransform(dpr,0,0,dpr,0,0); const x=d3.scaleLinear().domain([1560,NOW]).range([10,r.width-10]);
    const counts=[]; for(let y=1560;y<=NOW;y+=2) counts.push([y,PEOPLE.filter(p=>ON[p.br]&&p.by<=y&&(p.dy||NOW)>=y).length]); const mx=d3.max(counts,q=>q[1])||1;
    c.fillStyle=theme.acc; c.globalAlpha=.22; c.beginPath(); c.moveTo(x(1560),46); counts.forEach(([y,n])=>c.lineTo(x(y),46-n/mx*40)); c.lineTo(x(NOW),46); c.fill(); c.globalAlpha=1;
    if(showCtx) HIST.events.forEach(e=>{ c.fillStyle=e.kind==='local-Toledo'?theme.acc:theme.mut; c.globalAlpha=.7; c.fillRect(x(e.year),44,1.5,6); c.globalAlpha=1 });
    c.strokeStyle=theme.acc; c.lineWidth=2; c.beginPath(); c.moveTo(x(yr),2); c.lineTo(x(yr),50); c.stroke(); c.fillStyle=theme.mut; c.font='600 10px DM Sans, sans-serif'; c.textAlign='center'; c.textBaseline='top'; [1600,1700,1800,1900,2000].forEach(y=>c.fillText(y,x(y),0)) }

  /* ---- globe state ---- */
  const ctx=cm.getContext('2d'); const proj=d3.geoOrthographic().precision(.35).clipAngle(90); const GRAT=d3.geoGraticule10();
  let W=0,H=0,dpr=1,R0=1, clon=-60, clat=40, zk=1.25, tgt=null, moving=false, mvT=0, raf=0, stars=null;
  let placed=[], byId=new Map(), hits=[], fanBox=null, srcCache=new Map();
  const imgs=new Map(), lastLoc=new Map(), anim=new Map();
  const clampZ=z=>Math.max(.9,Math.min(320,z));
  const GO={toledo:{lon:-83.58,lat:41.64,zk:110},lakes:{lon:-83.6,lat:42.8,zk:8},world:{lon:-38,lat:44,zk:1.45}};
  const req=()=>{ if(!raf) raf=requestAnimationFrame(frame) };
  function size(){ const r=glb.getBoundingClientRect(); if(r.width<10||r.height<10) return; W=r.width; H=r.height; dpr=Math.min(2,devicePixelRatio||1); cm.width=Math.round(W*dpr); cm.height=Math.round(H*dpr); R0=Math.min(W,H)*.44; stars=null; req() }
  function makeStars(){ const oc=document.createElement('canvas'); oc.width=cm.width; oc.height=cm.height; const o=oc.getContext('2d'); o.setTransform(dpr,0,0,dpr,0,0); const g=o.createRadialGradient(W*.5,H*.45,0,W*.5,H*.5,Math.hypot(W,H)*.7); g.addColorStop(0,'#0C1830'); g.addColorStop(1,'#04080F'); o.fillStyle=g; o.fillRect(0,0,W,H);
    let s=7; const rnd=()=>{ s=(s*16807)%2147483647; return s/2147483647 }; for(let i=0;i<Math.round(W*H/2600);i++){ const a=rnd()*.55+.08; o.fillStyle=`rgba(238,230,216,${a})`; o.fillRect(rnd()*W,rnd()*H,rnd()<.08?1.6:1,rnd()<.08?1.6:1) } return oc }
  const src=p=>{ if(srcCache.has(p.id)) return srcCache.get(p.id); const s=pSrc(p); srcCache.set(p.id,s); return s };
  function img(p){ const s=src(p); if(!s) return null; let e=imgs.get(s); if(!e){ e=new Image(); e.decoding='async'; e.onload=()=>req(); e.src=s; imgs.set(s,e) } return e.complete&&e.naturalWidth?e:null }
  function face(c,p,x,y,r,o={}){ const col=GC[p.br]||'#9AA6B7';
    c.save(); c.shadowColor='rgba(0,0,0,.6)'; c.shadowBlur=o.hot?18:9; c.shadowOffsetY=2; c.beginPath(); c.arc(x,y,r+2.6,0,7); c.fillStyle=col; c.fill(); c.restore();
    const im=img(p); c.save(); c.beginPath(); c.arc(x,y,r,0,7); c.clip();
    if(im){ const k=Math.max(2*r/im.naturalWidth,2*r/im.naturalHeight), w=im.naturalWidth*k, h=im.naturalHeight*k; c.drawImage(im,x-w/2,y-h/2,w,h) }
    else { c.fillStyle=col; c.fillRect(x-r,y-r,2*r,2*r); const g=c.createRadialGradient(x-r*.35,y-r*.45,r*.1,x,y,r*1.1); g.addColorStop(0,'rgba(255,255,255,.28)'); g.addColorStop(1,'rgba(0,0,0,.32)'); c.fillStyle=g; c.fillRect(x-r,y-r,2*r,2*r);
      c.fillStyle='rgba(255,255,255,.96)'; c.font=`400 ${Math.round(r*.92)}px 'DM Serif Display', Georgia, serif`; c.textAlign='center'; c.textBaseline='middle'; c.fillText(ini(p),x,y+r*.08) }
    c.restore();
    if(o.approx){ c.save(); c.setLineDash([2.5,2.5]); c.beginPath(); c.arc(x,y,r+5,0,7); c.strokeStyle='rgba(238,230,216,.75)'; c.lineWidth=1.2; c.stroke(); c.restore() }
    if(o.hot||o.sel){ c.beginPath(); c.arc(x,y,r+5.5,0,7); c.strokeStyle='#FFF6E4'; c.lineWidth=2.2; c.stroke() } }
  const lbl=(c,t,x,y,font,fill,boxes,align='center')=>{ c.font=font; const w=c.measureText(t).width; const bx=align==='center'?x-w/2:align==='right'?x-w:x; const b=[bx-3,y-8,bx+w+3,y+8]; if(boxes.some(q=>!(b[2]<q[0]||b[0]>q[2]||b[3]<q[1]||b[1]>q[3]))) return false; if(b[0]<2||b[2]>W-2||b[1]<2||b[3]>H-2) return false; boxes.push(b);
    c.textAlign=align; c.textBaseline='middle'; c.lineJoin='round'; c.strokeStyle='rgba(4,8,15,.85)'; c.lineWidth=3.5; c.strokeText(t,x,y); c.fillStyle=fill; c.fillText(t,x,y); return true };

  function frame(){ raf=0; if(!root.isConnected||!W) return; const now=performance.now(); let again=false; const c=ctx;
    if(tgt&&!moving){ const d=d3.geoDistance([clon,clat],[tgt.lon,tgt.lat]); const k=.09; const nc=d>1e-6?d3.geoInterpolate([clon,clat],[tgt.lon,tgt.lat])(k):[tgt.lon,tgt.lat]; clon=nc[0]; clat=nc[1];
      const cap=d>.003?Math.max(1.1,Math.min(W,H)*.42/(R0*Math.sin(Math.min(1.45,d)))):Infinity; const want=Math.min(tgt.zk,cap); zk=zk*Math.pow(want/zk,want<zk?.14:.075);
      if(d<2e-5&&Math.abs(Math.log(tgt.zk/zk))<.004){ clon=tgt.lon; clat=tgt.lat; zk=tgt.zk; tgt=null } else again=true }
    const R=R0*zk; proj.rotate([-clon,-clat]).scale(R).translate([W/2,H/2]).clipExtent([[-80,-80],[W+80,H+80]]); const path=d3.geoPath(proj,c); const ctr=[clon,clat]; const lite=moving;
    c.setTransform(1,0,0,1,0,0); if(!stars) stars=makeStars(); c.drawImage(stars,0,0); c.setTransform(dpr,0,0,dpr,0,0);
    if(R<Math.hypot(W,H)*.8){ const g=c.createRadialGradient(W/2,H/2,R*.96,W/2,H/2,R*1.22); g.addColorStop(0,'rgba(110,170,230,.30)'); g.addColorStop(1,'rgba(110,170,230,0)'); c.fillStyle=g; c.beginPath(); c.arc(W/2,H/2,R*1.25,0,7); c.fill() }
    const og=c.createRadialGradient(W/2-R*.35,H/2-R*.4,R*.05,W/2,H/2,R); og.addColorStop(0,'#173A64'); og.addColorStop(1,'#0A1C36'); c.beginPath(); path({type:'Sphere'}); c.fillStyle=og; c.fill();
    if(!GLB){ loadGlobe().then(req).catch(()=>{}); return }
    const vis=Math.min(Math.PI/2,Math.asin(Math.min(1,Math.hypot(W,H)/2/R))+.03); const inV=o=>d3.geoDistance(ctr,o.c)<vis+o.r;
    const hd=GLB.hd, useHD=zk>=3&&hd; if(zk>=2.4&&!hd) loadHD().then(req);
    if(zk<7){ c.beginPath(); path(GRAT); c.strokeStyle='rgba(238,230,216,.055)'; c.lineWidth=1; c.stroke() }
    c.beginPath(); if(useHD){ for(const o of hd.land) if(inV(o)) path(o.f) } else path(GLB.land); c.fillStyle=zk>25?'#2F5884':'#294D76'; c.fill();
    if(!useHD){ c.strokeStyle='rgba(226,194,125,.38)'; c.lineWidth=.7; c.stroke(); c.beginPath(); path(GLB.borders); c.strokeStyle='rgba(238,230,216,.15)'; c.lineWidth=.6; c.stroke() }
    else { if(!lite){ c.beginPath(); for(const o of hd.urban) if(inV(o)) path(o.f); c.fillStyle='rgba(238,230,216,.085)'; c.fill() }
      c.beginPath(); for(const o of hd.lakes) if(inV(o)) path(o.f); c.fillStyle='#10294B'; c.fill(); c.strokeStyle='rgba(110,170,230,.4)'; c.lineWidth=.7; c.stroke();
      c.beginPath(); for(const o of hd.coast) if(inV(o)) path(o.f); c.strokeStyle='rgba(226,194,125,.45)'; c.lineWidth=zk>30?1.1:.8; c.stroke();
      if(!lite&&zk>=7){ c.beginPath(); for(const o of hd.rivers) if(inV(o)) path(o.f); c.strokeStyle='rgba(110,170,230,.42)'; c.lineWidth=zk>40?1.5:.8; c.stroke() }
      if(!lite){ c.beginPath(); for(const o of hd.states) if(inV(o)) path(o.f); c.setLineDash([3,3]); c.strokeStyle='rgba(238,230,216,.2)'; c.lineWidth=.7; c.stroke(); c.setLineDash([]) }
      if(zk<14){ c.beginPath(); path(GLB.borders); c.strokeStyle='rgba(238,230,216,.22)'; c.lineWidth=.8; c.stroke() } }
    const visG=ll=>d3.geoDistance(ctr,ll)<Math.PI/2-.012;
    // arcs: birthplace → where they are now (quiet), plus the animated move when a place changes
    c.lineCap='round';
    for(const o of placed){ if(!o.from) continue; const isH=o.p.id===hot||o.p.id===sel; if(lite&&!isH) continue; c.beginPath(); path({type:'LineString',coordinates:[o.from,[o.lon,o.lat]]}); c.strokeStyle=hexA(GC[o.p.br],isH?.95:.3); c.lineWidth=isH?2.4:1.1; c.stroke();
      if(isH){ const a=proj(o.from); if(a&&visG(o.from)){ c.beginPath(); c.arc(a[0],a[1],4,0,7); c.strokeStyle=hexA(GC[o.p.br],.95); c.lineWidth=2; c.stroke() } } }
    for(const [id,a] of anim){ if(!a.from) continue; const o=byId.get(id); if(!o) continue; const t=Math.min(1,(now-a.t0)/1400); if(t>=1) continue; again=true; const e=1-Math.pow(1-t,3), ip=d3.geoInterpolate(a.from,[o.lon,o.lat]); const pts=[]; for(let i=0;i<=28;i++) pts.push(ip(e*i/28)); c.beginPath(); path({type:'LineString',coordinates:pts}); c.strokeStyle=hexA(GC[o.p.br],.9); c.lineWidth=2.6; c.stroke() }
    // pins → clusters (moving pins travel alone)
    const pts=[]; for(const o of placed){ let ll=[o.lon,o.lat], pop=1, mv=false; const a=anim.get(o.p.id); if(a){ const t=Math.min(1,(now-a.t0)/1400); if(a.from&&t<1){ ll=d3.geoInterpolate(a.from,ll)(1-Math.pow(1-t,3)); mv=true; again=true } else if(!a.from){ pop=Math.min(1,(now-a.t0)/420); if(pop<1) again=true } }
      if(!visG(ll)) continue; const xy=proj(ll); if(!xy||xy[0]<-40||xy[1]<-40||xy[0]>W+40||xy[1]>H+40) continue; pts.push({o,x:xy[0],y:xy[1],pop,mv}) }
    const CR=zk>40?40:46, GD=Math.max(.0012,Math.min(.05,30/(R0*zk))); const cl=[]; for(const q of pts){ if(q.mv){ cl.push({x:q.x,y:q.y,m:[q],mv:true}); continue } let best=null,bd=CR; for(const k of cl){ if(k.mv) continue; const d=Math.hypot(k.x-q.x,k.y-q.y); if(d<bd&&d3.geoDistance([k.m[0].o.lon,k.m[0].o.lat],[q.o.lon,q.o.lat])<GD){ bd=d; best=k } } if(best) best.m.push(q); else cl.push({x:q.x,y:q.y,m:[q]}) }
    for(const k of cl){ const cnt={}; for(const q of k.m) cnt[q.o.key]=(cnt[q.o.key]||0)+1; const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0][0]; const lead=k.m.find(q=>q.o.key===top); k.key=k.mv?'mv'+k.m[0].o.p.id:top; k.x=lead.x; k.y=lead.y; const pc={}; for(const q of k.m){ const s=q.o.pl||'?'; pc[s]=(pc[s]||0)+1 } k.pl=Object.entries(pc).sort((a,b)=>b[1]-a[1])[0][0]; k.places=Object.keys(pc).length; k.label=clusterLabel(k);
      k.fan=k.m.length>1&&(fan===k.key||k.m.some(q=>q.o.p.id===hot||q.o.p.id===sel)) }
    { const MIN=40; for(const k of cl){ k.ax=k.x; k.ay=k.y }
      for(let it=0;it<24;it++){ let moved=false; for(let i=0;i<cl.length;i++) for(let j=i+1;j<cl.length;j++){ const A=cl[i],B=cl[j]; let dx=B.x-A.x, dy=B.y-A.y, d=Math.hypot(dx,dy); if(d>=MIN) continue; if(d<.01){ dx=1; dy=0; d=1 } const push=(MIN-d)/2; const ux=dx/d, uy=dy/d; A.x-=ux*push; A.y-=uy*push; B.x+=ux*push; B.y+=uy*push; moved=true } if(!moved) break }
      for(const k of cl){ if(Math.hypot(k.x-k.ax,k.y-k.ay)>3){ c.beginPath(); c.moveTo(k.ax,k.ay); c.lineTo(k.x,k.y); c.strokeStyle='rgba(238,230,216,.55)'; c.lineWidth=1.1; c.stroke(); c.beginPath(); c.arc(k.ax,k.ay,3,0,7); c.fillStyle='#FFF6E4'; c.fill() } } }
    hits=[]; const boxes=[]; const big=zk>30?16:14;
    cl.sort((a,b)=>a.m.length-b.m.length);
    for(const k of cl){ if(k.fan) continue; const n=k.m.length;
      if(n===1){ const q=k.m[0], r=big*(.35+.65*q.pop); const isH=q.o.p.id===hot, isS=q.o.p.id===sel; face(c,q.o.p,q.x,q.y,isH||isS?r+3:r,{hot:isH,sel:isS,approx:q.o.approx}); hits.push({type:'one',x:q.x,y:q.y,r:r+3,o:q.o}); boxes.push([q.x-r-4,q.y-r-4,q.x+r+4,q.y+r+4]); continue }
      const back=k.m.slice(1,3); back.forEach((q,i)=>face(c,q.o.p,k.x+9+i*7,k.y-6-i*5,big-3,{})); const lead=k.m[0]; face(c,lead.o.p,k.x,k.y,big+2,{approx:false});
      const bx=k.x+big+5, by=k.y-big-2, t=String(n); c.font='700 11px DM Sans, sans-serif'; const bw=Math.max(20,c.measureText(t).width+10); c.beginPath(); c.roundRect?c.roundRect(bx-bw/2,by-10,bw,20,10):c.rect(bx-bw/2,by-10,bw,20); c.fillStyle='#D9B36A'; c.fill(); c.strokeStyle='#04080F'; c.lineWidth=2; c.stroke(); c.fillStyle='#0A1426'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(t,bx,by+.5);
      hits.push({type:'stack',x:k.x+4,y:k.y-2,r:big+8,k}); boxes.push([k.x-big-6,k.y-big-14,bx+bw/2+2,k.y+big+6]) }
    // labels for stacks, biggest first, never overlapping
    for(const k of cl.slice().sort((a,b)=>b.m.length-a.m.length)){ if(k.fan||k.m.length<2) continue; const t=k.label; if(!t||t==='?') continue; const F='600 12px DM Sans, sans-serif'; lbl(c,t,k.x,k.y+big+15,F,'#FFF6E4',boxes)||lbl(c,t,k.x,k.y-big-24,F,'#FFF6E4',boxes)||lbl(c,t,k.x+big+30,k.y+2,F,'#FFF6E4',boxes,'left')||lbl(c,t,k.x-big-10,k.y+2,F,'#FFF6E4',boxes,'right')||lbl(c,t,k.x,k.y+big+29,F,'#FFF6E4',boxes) }
    if(!lite) for(const [t,lo,la,z0,z1,water] of REF){ if(zk<z0||zk>z1||!visG([lo,la])) continue; const xy=proj([lo,la]); if(!xy) continue; lbl(c,t,xy[0],xy[1],water?"italic 500 11.5px 'DM Serif Display', Georgia, serif":'500 11px DM Sans, sans-serif',water?'rgba(150,195,240,.75)':'rgba(238,230,216,.62)',boxes) }
    // the open fan sits on top
    fanBox=null; const fk=cl.find(k=>k.fan);
    if(fk){ const n=fk.m.length, pos=[]; let i=0, ring=0; while(i<n){ const rr=54+ring*34, capN=Math.max(7,Math.floor(2*Math.PI*rr/34)), take=Math.min(capN,n-i); for(let j=0;j<take;j++){ const a=-Math.PI/2+j*2*Math.PI/take+(ring%2?Math.PI/take:0); pos.push([Math.cos(a)*rr,Math.sin(a)*rr]) } i+=take; ring++ }
      const RR=54+(ring-1)*34+22, fx=Math.max(RR+6,Math.min(W-RR-6,fk.x)), fy=Math.max(RR+6,Math.min(H-RR-6,fk.y)); fanBox={x:fx,y:fy,R:RR,key:fk.key};
      c.beginPath(); c.arc(fx,fy,RR,0,7); c.fillStyle='rgba(4,9,19,.80)'; c.fill(); c.strokeStyle='rgba(217,179,106,.55)'; c.lineWidth=1.2; c.stroke();
      if(Math.hypot(fx-fk.x,fy-fk.y)>2){ c.beginPath(); c.moveTo(fk.x,fk.y); c.lineTo(fx,fy); c.strokeStyle='rgba(217,179,106,.4)'; c.stroke(); c.beginPath(); c.arc(fk.x,fk.y,4,0,7); c.fillStyle='#D9B36A'; c.fill() }
      c.fillStyle='#FFF6E4'; c.textAlign='center'; c.textBaseline='middle'; c.font="400 22px 'DM Serif Display', Georgia, serif"; c.fillText(String(n),fx,fy-7); c.font='700 8.5px DM Sans, sans-serif'; c.fillStyle='rgba(217,179,106,.95)'; const pt=(fk.label||'').toUpperCase(); c.fillText(pt.length>14?pt.slice(0,13)+'…':pt,fx,fy+11);
      hits.push({type:'fanctr',x:fx,y:fy,r:30,k:fk});
      fk.m.forEach((q,j)=>{ const [dx,dy]=pos[j], x=fx+dx, y=fy+dy; c.beginPath(); c.moveTo(fx+dx*.42,fy+dy*.42); c.lineTo(x,y); c.strokeStyle='rgba(238,230,216,.12)'; c.lineWidth=1; c.stroke(); const isH=q.o.p.id===hot, isS=q.o.p.id===sel; face(c,q.o.p,x,y,isH||isS?15:13,{hot:isH,sel:isS,approx:q.o.approx}); hits.push({type:'member',x,y,r:15,o:q.o}) }) }
    if(again||tgt) req() }

  /* ---- data per year ---- */
  function place(al){ const now=performance.now(); const out=[]; const ids=new Set();
    for(const p of al){ const w=whereX(p,yr); if(!w) continue; ids.add(p.id); const key=w.g.lat.toFixed(3)+','+w.g.lon.toFixed(3); const b=p.bp&&GEO[p.bp]; const prev=lastLoc.get(p.id);
      if(!prev) anim.set(p.id,{t0:now,from:null}); else if(prev.key!==key) anim.set(p.id,{t0:now,from:[prev.lon,prev.lat]});
      lastLoc.set(p.id,{key,lon:w.g.lon,lat:w.g.lat});
      out.push({p,lon:w.g.lon,lat:w.g.lat,key,pl:short(w.pl),plFull:(w.pl||'').replace(/\s*\(.*\)\s*/,''),why:w.why,approx:!!w.approx,from:b&&d3.geoDistance([b.lon,b.lat],[w.g.lon,w.g.lat])>.004?[b.lon,b.lat]:null}) }
    for(const k of [...lastLoc.keys()]) if(!ids.has(k)){ lastLoc.delete(k); anim.delete(k) }
    placed=out; byId=new Map(out.map(o=>[o.p.id,o])); return out }
  function aim(force){ if((!follow&&!force)||!placed.length||!W) return; const pool=placed.filter(o=>!o.approx); const use=pool.length?pool:placed; let x=0,y=0,z=0;
    for(const o of use){ const l=o.lon*Math.PI/180, f=o.lat*Math.PI/180; x+=Math.cos(f)*Math.cos(l); y+=Math.cos(f)*Math.sin(l); z+=Math.sin(f) }
    const lon=Math.atan2(y,x)*180/Math.PI, lat=Math.atan2(z,Math.hypot(x,y))*180/Math.PI; const ds=use.map(o=>d3.geoDistance([lon,lat],[o.lon,o.lat])).sort((a,b)=>a-b); const a=ds[Math.min(ds.length-1,Math.floor(ds.length*.85))]||0;
    const z2=a>1.25?1.15:Math.max(1.15,Math.min(105,Math.min(W,H)*.34/(R0*Math.sin(Math.max(a,.0045))))); tgt={lon,lat:Math.max(-70,Math.min(70,lat)),zk:z2}; req() }
  const stopFollow=()=>{ if(follow){ follow=false; flB.setAttribute('aria-pressed','false') } };
  function selHTML(p){ const o=byId.get(p.id); const s=src(p); const age=yr-p.by; const life=[p.b?'b. '+p.b:'b. about '+p.by,p.d?'d. '+p.d:(p.alive?'living':'')].filter(Boolean).join(' · ');
    return `<button class="x" aria-label="Close">×</button><span class="av" style="--c:${GC[p.br]};background:${GC[p.br]}">${s?`<img src="${s}" alt="">`:E(ini(p))}</span><b>${E(p.name)}</b><small>${E(life)}</small><small>${p.by===yr?'Born this year':p.dy===yr?'Died this year, aged '+age:'Aged '+age+' in '+yr}${presAt(yr)&&yr>=1789?' · '+E(presAt(yr).name)+' was president':''}</small><small>${E(LINES.find(l=>l[0]===p.br)[1])}${p.est?' · dates partly estimated':''}</small>
      <span class="wh">${o?`${E(o.why)} · ${E(o.plFull)}${o.approx?' — their own address is not recorded':''}`:'No known place for this year yet'}</span><a class="go" href="#tree-${E(p.id)}">Open in the Family Tree →</a>` }
  function select(id,fly){ const p=PEOPLE.find(q=>q.id===id); if(!p){ closeSel(); return } sel=id; selBox.innerHTML=selHTML(p); selBox.hidden=false; selBox.querySelector('.x').onclick=closeSel; markGrid(true);
    const o=byId.get(id); if(fly&&o){ stopFollow(); tgt={lon:o.lon,lat:o.lat,zk:clampZ(Math.max(zk,o.approx?20:45))} } req() }
  function closeSel(){ sel=null; selBox.hidden=true; markGrid(true); req() }
  function markGrid(scroll){ grid.querySelectorAll('.pc.hot,.pc.sel').forEach(b=>b.classList.remove('hot','sel')); if(hot){ const b=grid.querySelector(`.pc[data-id="${CSS.escape(hot)}"]`); b&&b.classList.add('hot') } if(sel){ const b=grid.querySelector(`.pc[data-id="${CSS.escape(sel)}"]`); if(b){ b.classList.add('sel'); if(scroll){ const gr=grid.getBoundingClientRect(), br=b.getBoundingClientRect(); if(br.top<gr.top||br.bottom>gr.bottom) grid.scrollTop+=br.top-gr.top-gr.height/2+br.height/2 } } } }
  let prevIds=new Set();
  function renderGrid(al){ const groups=LINES.map(([k,l])=>[k,l,al.filter(p=>p.br===k)]).filter(g=>g[2].length);
    grid.innerHTML=al.length?groups.map(([k,l,ps])=>`<section class="grp" style="--c:var(--${k})"><h4><i></i>${E(l)} <b>${ps.length}</b></h4><div class="fl">${ps.map(p=>{ const s=src(p); const age=yr-p.by; const badge=p.by===yr?'born':p.dy===yr?'died':''; const np=!byId.has(p.id);
      return `<button class="pc${sel===p.id?' sel':''}" data-id="${E(p.id)}" style="--c:var(--${p.br})${prevIds.has(p.id)?';animation:none':''}" title="${E(p.name)}${np?' · no known place':''}" aria-label="${E(p.name)}, ${badge==='born'?'born this year':'aged '+age}${np?', place unknown':''}"><span class="d${np?' np':''}">${s?`<img src="${s}" alt="" loading="lazy">`:E(ini(p))}<span class="ag ${badge}">${badge==='born'?'born':badge==='died'?'† '+age:age}</span></span><span class="n">${E((p.g||'').split(' ')[0]||'Unknown')}<em>${E(p.s||'')}</em></span></button>` }).join('')}</div></section>`).join(''):'<p style="color:var(--tl-mut);padding:8px">No one in the tree had been born yet.</p>';
    prevIds=new Set(al.map(p=>p.id));
    grid.querySelectorAll('.pc').forEach(b=>{ b.onmouseenter=()=>{ hot=b.dataset.id; req() }; b.onmouseleave=()=>{ hot=null; req() }; b.onfocus=b.onmouseenter; b.onblur=b.onmouseleave; b.onclick=()=>{ if(sel===b.dataset.id){ location.hash='tree-'+b.dataset.id; return } select(b.dataset.id,true) } }) }
  function render(){ if(!root.isConnected){ playing&&clearInterval(playing); return } yEl.textContent=yr; wyEl.textContent=yr; try{ sessionStorage.setItem('tmyr',yr) }catch(e){}
    const pr=presAt(yr); const evs=HIST.events.filter(e=>e.year===yr||(e.year<yr&&e.year>=yr-3&&e.kind==='war')); cap.innerHTML=[pr?`${E(pr.name)}, president`:(yr>=1776?'the young republic, before the presidency':'before the United States'),...evs.map(e=>E(e.label))].join(' · ');
    srcCache.clear(); const al=alive(); const out=place(al); renderGrid(al); markGrid(false);
    const ap=out.filter(o=>o.approx).length, unk=al.length-out.length; stEl.innerHTML=al.length?`<b>${al.length}</b> alive in ${yr} · <b>${out.length}</b> on the globe${ap?` <i></i>${ap} placed with family`:''}${unk?` · ${unk} place unknown`:''}`:'No one in the tree had been born yet.';
    if(sel){ if(al.some(p=>p.id===sel)) select(sel,false); else closeSel() }
    drawStrip(); aim(); req() }

  /* ---- interaction ---- */
  const touch=()=>{ moving=true; clearTimeout(mvT); mvT=setTimeout(()=>{ moving=false; req() },170) };
  const hitAt=(mx,my)=>{ for(let i=hits.length-1;i>=0;i--){ const h=hits[i]; if(Math.hypot(h.x-mx,h.y-my)<=h.r+3) return h } return null };
  const showTip=h=>{ const p=h.o.p; tip.innerHTML=`<b>${E(p.name)}</b><span>${p.by===yr?'born this year':'aged '+(yr-p.by)} · ${E(h.o.pl||'')}${h.o.approx?' (with family)':''}</span>`; tip.style.left=Math.max(80,Math.min(W-80,h.x))+'px'; tip.style.top=(h.y-h.r)+'px'; tip.classList.add('on') };
  function hover(mx,my){ const h=hitAt(mx,my); let nh=null, nf=fan;
    if(h&&(h.type==='one'||h.type==='member')){ nh=h.o.p.id; showTip(h) } else tip.classList.remove('on');
    if(h&&h.type==='stack') nf=h.k.key; else if(fanBox&&Math.hypot(mx-fanBox.x,my-fanBox.y)<=fanBox.R) nf=fanBox.key; else if(!h||h.type==='one') nf=null;
    if(nh!==hot||nf!==fan){ hot=nh; fan=nf; markGrid(false); req() } cm.style.cursor=h?'pointer':'' }
  const zoomInto=k=>{ const o=k.m[0].o; stopFollow(); fan=null; tgt={lon:o.lon,lat:o.lat,zk:clampZ(Math.max(zk*3,10))}; req() };
  function tap(mx,my){ const h=hitAt(mx,my); if(!h){ fan=null; if(sel) closeSel(); req(); return }
    if(h.type==='one'||h.type==='member'){ select(h.o.p.id,false); return }
    if(h.type==='stack'){ if(fan!==h.k.key){ fan=h.k.key; req(); return } zoomInto(h.k); return }
    if(h.type==='fanctr') zoomInto(h.k) }
  const ptrs=new Map(); let drag=null, pinch=null;
  const loc=e=>{ const r=cm.getBoundingClientRect(); return [e.clientX-r.left,e.clientY-r.top] };
  cm.addEventListener('pointerdown',e=>{ try{ cm.setPointerCapture(e.pointerId) }catch(_){} ptrs.set(e.pointerId,[e.clientX,e.clientY]); if(ptrs.size===1) drag={x:e.clientX,y:e.clientY,lon:clon,lat:clat,moved:false,touch:e.pointerType!=='mouse'}; else if(ptrs.size===2){ const [a,b]=[...ptrs.values()]; pinch={d:Math.hypot(a[0]-b[0],a[1]-b[1]),zk}; drag=null } });
  cm.addEventListener('pointermove',e=>{ if(ptrs.has(e.pointerId)) ptrs.set(e.pointerId,[e.clientX,e.clientY]);
    if(pinch&&ptrs.size===2){ const [a,b]=[...ptrs.values()]; zk=clampZ(pinch.zk*Math.hypot(a[0]-b[0],a[1]-b[1])/pinch.d); stopFollow(); tgt=null; touch(); req(); return }
    if(drag){ const dx=e.clientX-drag.x, dy=e.clientY-drag.y; if(!drag.moved&&Math.hypot(dx,dy)>5){ drag.moved=true; stopFollow(); tgt=null; cm.classList.add('drag'); tip.classList.remove('on') }
      if(drag.moved){ const k=180/Math.PI/(R0*zk); clon=drag.lon-dx*k/Math.max(.25,Math.cos(clat*Math.PI/180)); clat=Math.max(-80,Math.min(80,drag.lat+dy*k)); touch(); req() } return }
    const [mx,my]=loc(e); hover(mx,my) });
  const up=e=>{ ptrs.delete(e.pointerId); if(pinch&&ptrs.size<2){ pinch=null; drag=null; return } if(drag&&!drag.moved&&e.type==='pointerup'){ const [mx,my]=loc(e); tap(mx,my) } drag=null; cm.classList.remove('drag') };
  cm.addEventListener('pointerup',up); cm.addEventListener('pointercancel',up);
  cm.addEventListener('pointerleave',e=>{ if(e.pointerType!=='mouse') return; if(hot||fan){ hot=null; fan=null; markGrid(false); req() } tip.classList.remove('on') });
  cm.addEventListener('wheel',e=>{ e.preventDefault(); const [mx,my]=loc(e); const f=Math.exp(-Math.max(-60,Math.min(60,e.deltaY))*.0042); const nz=clampZ(zk*f);
    if(nz>zk){ const g=proj.invert([mx,my]); if(g&&isFinite(g[0])&&d3.geoDistance(g,[clon,clat])<Math.PI/2){ const c2=d3.geoInterpolate([clon,clat],g)(1-zk/nz); clon=c2[0]; clat=c2[1] } }
    zk=nz; stopFollow(); tgt=null; touch(); req() },{passive:false});
  const zoomBy=f=>{ stopFollow(); tgt={lon:(tgt||{}).lon??clon,lat:(tgt||{}).lat??clat,zk:clampZ(zk*f)}; req() };
  $s('#tmzi').onclick=()=>zoomBy(2); $s('#tmzo').onclick=()=>zoomBy(.5);
  flB.onclick=()=>{ follow=!follow; flB.setAttribute('aria-pressed',String(follow)); if(follow) aim(true) };
  stage.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ stopFollow(); fan=null; tgt={...GO[b.dataset.go]}; req() });

  rng.value=yr; rng.oninput=()=>{ yr=+rng.value; render() };
  const toggle=()=>{ if(playing){ clearInterval(playing); playing=null; playB.textContent='▶ Play'; return } playB.textContent='❚❚ Pause'; if(yr>=NOW) yr=1560; if(!follow){ follow=true; flB.setAttribute('aria-pressed','true') } playing=setInterval(()=>{ if(!root.isConnected){ clearInterval(playing); return } yr=Math.min(NOW,yr+(yr<1800?3:1)); rng.value=yr; render(); if(yr>=NOW) toggle() },yr<1800?160:300) }; playB.onclick=toggle;
  root._key=e=>{ if(e.key==='ArrowLeft'||e.key==='ArrowRight'){ yr=Math.max(1560,Math.min(NOW,yr+(e.key==='ArrowLeft'?-1:1)*(e.shiftKey?10:1))); rng.value=yr; render(); return true } if(e.key===' '){ toggle(); return true }
    if(e.key==='f'||e.key==='F'){ flB.click(); return true } if(e.key==='+'||e.key==='='){ zoomBy(1.6); return true } if(e.key==='-'||e.key==='_'){ zoomBy(1/1.6); return true } if(e.key==='Escape'&&(sel||fan)){ fan=null; closeSel(); return true } return false };
  root._redraw=()=>render();
  const ro2=new ResizeObserver(()=>{ if(!root.isConnected){ ro2.disconnect(); return } const had=W; size(); drawStrip(); if(!had) aim(true) }); ro2.observe(glb);
  size(); loadGlobe().then(()=>{ req(); if(zk<2.4) setTimeout(()=>loadHD().then(req),1200) }).catch(()=>{}); render();
  // start already near the family so the first fly-in is short
  if(placed.length&&tgt){ clon=tgt.lon; clat=tgt.lat; zk=Math.min(tgt.zk,3); } }
})();
