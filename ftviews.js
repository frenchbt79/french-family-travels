/* French Family Travels · Family Tree views: Family, Fan chart, Circles, How we're related (the one-sheet 'Whole tree' stays in tree.js) */
(function(){
let P=null,F=null,FACE={},GEN=null;
const FV_LOAD=async()=>{ if(P) return; const T=await (await fetch('tree.json')).json(); try{ GEN=await (await fetch('genealogy.json')).json() }catch(e){ GEN={people:{},faceImg:{}} }
  P={}; for(const [id,p] of Object.entries(T.people)){ P[id]={g:p.g,s:p.s,sex:p.sex,by:p.by,dy:p.dy,bp:p.bp,famc:p.famc||[],fams:p.fams||[]}; const b=GEN.people&&GEN.people[id]&&GEN.people[id].bio; if(b) P[id].bio=b.slice(0,420) }
  F=T.fams; FACE=new Proxy({},{get:(o,id)=>{ if(typeof id!=='string') return undefined; const u=(typeof window.ftPortrait==='function'&&window.ftPortrait(id))||(GEN.faceImg&&GEN.faceImg[id])||''; return u||undefined }}) };
let FV_MOUNTED=false;
const $=s=>document.querySelector(s), E=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const FV_CSS=".fv{--l-french:#C4674A;--l-schmitt:#4F8783;--l-wetzel:#4F76AE;--l-goodwin:#8463A0;--wedge:var(--chip);display:flex;flex-direction:column;height:calc(100vh - var(--barh,58px) - env(safe-area-inset-top,0px));min-height:560px;overflow:hidden;background:var(--paper);color:var(--ink);font-family:var(--body);position:relative}\n.fv .eyebrow{color:var(--gold)}\n.fv [hidden]{display:none!important}\n.fvtabs-tree{display:flex;gap:4px;padding:4px;border-radius:999px;background:var(--chip);flex-wrap:wrap;align-self:flex-start;pointer-events:auto}\n.fvtabs-tree button{border:0;background:transparent;color:var(--muted);font:600 13px var(--body);padding:8px 14px;border-radius:999px;cursor:pointer}\n.fvtabs-tree button[aria-selected=\"true\"]{background:var(--surface);color:var(--ink);box-shadow:0 2px 8px -4px rgba(0,0,0,.35)}\n@media (max-width:760px){.fvtabs-tree{order:3;width:100%}.fvtabs-tree button{flex:1;padding:7px 4px;font-size:12px}}\n\n\n.fvhead{display:flex;flex-wrap:wrap;align-items:flex-end;gap:12px 24px;padding-block:18px 10px;padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px))}\n.fvhead h1{font-family:var(--display);font-weight:400;font-size:clamp(28px,4vw,40px);margin:0;line-height:1}\n.eyebrow{font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:var(--gold)}\n.fvtabs{display:flex;gap:4px;padding:4px;border-radius:999px;background:var(--chip);margin-left:auto;flex-wrap:wrap}\n.fvtabs button{border:0;background:transparent;color:var(--muted);font:600 13.5px var(--body);padding:9px 16px;border-radius:999px;cursor:pointer}\n.fvtabs button[aria-selected=\"true\"]{background:var(--surface);color:var(--ink);box-shadow:0 2px 8px -4px rgba(0,0,0,.35)}\n.fvtabs button:focus-visible,button:focus-visible,select:focus-visible{outline:2px solid var(--gold);outline-offset:2px}\n.fvview{flex:1;min-height:0;display:flex;flex-direction:column}\n.fvbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;padding-block:4px 8px;padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px));color:var(--muted);font-size:13px}\n.fvbar p{margin:0;max-width:62ch;line-height:1.45} .fvbar b{color:var(--ink)}\n.fvbar button,.fvbar select{font:600 12.5px var(--body);color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:7px 12px;cursor:pointer}\n.fvbar select{max-width:min(420px,90vw)}\n.fvbar input[type=range]{accent-color:var(--gold);width:120px}\n.fvstage{flex:1;min-height:0;position:relative;overflow:hidden}\n.fvlegend{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12px;color:var(--muted);padding-block:6px 12px;padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px))}\n.fvlegend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px;vertical-align:-1px}\n\n.pt{--s:48px;width:var(--s);height:var(--s);flex:none;border-radius:50%;padding:3px;background:var(--lc);display:inline-block;box-shadow:0 8px 18px -10px rgba(0,0,0,.6)}\n.pt img,.pt i{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;object-fit:cover;border:2px solid var(--surface);box-sizing:border-box;font:400 calc(var(--s)*.34) var(--display);font-style:normal;color:#fff;background:radial-gradient(circle at 32% 26%,#5B7BA6,#24384F 78%)}\n.pt.f i{background:radial-gradient(circle at 32% 26%,#B37587,#5A2F3B 78%)}\n.pt.xs{--s:26px;padding:2px} .pt.sm{--s:40px} .pt.md{--s:58px} .pt.lg{--s:84px} .pt.xl{--s:120px;padding:4px}\n\n#fv-v-fan svg{display:block;cursor:grab}\npath.w{fill:color-mix(in srgb,var(--lc) 22%,var(--wedge));stroke:var(--paper);stroke-width:1.5;cursor:pointer;transition:fill .15s}\npath.w:hover{fill:color-mix(in srgb,var(--lc) 45%,var(--wedge))}\npath.w.fvempty{fill:color-mix(in srgb,var(--wedge) 50%,transparent);cursor:default}\n.pring{fill:var(--lc,var(--gold))} .pring.root{fill:var(--gold)}\n.pini{fill:#fff;font-family:var(--display);text-anchor:middle}\ncircle.pring+text.pini{fill:#fff}\ntext.fvnm{fill:var(--ink);font-weight:700;text-anchor:middle} text.fvyr{fill:var(--muted);text-anchor:middle;font-variant-numeric:tabular-nums}\ntext.rad{fill:var(--ink);font-weight:600} text.rootnm{fill:var(--ink);font:400 18px var(--display);text-anchor:middle;cursor:pointer}\ntext.glab{fill:var(--muted);font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase}\n\n#fv-v-focus .fvstage{overflow:auto}\n.fwrap{min-height:100%;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px max(16px,env(safe-area-inset-right,0px)) 40px max(16px,env(safe-area-inset-left,0px))}\n.fwrap.in{animation:fin .35s cubic-bezier(.2,.7,.2,1)} @keyframes fin{from{opacity:.2;transform:translateY(10px)}}\n@media (prefers-reduced-motion:reduce){.fwrap.in{animation:none}}\n.frow{display:flex;flex-wrap:wrap;justify-content:center;gap:14px 18px;align-items:flex-end}\n.fside{display:flex;flex-direction:column;align-items:center;gap:6px}\n.gp{display:flex;gap:6px;min-height:20px} .gp .fcard{padding:6px 8px;min-width:0;width:96px}\n.fcard{border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:18px;padding:12px 12px 10px;width:138px;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;border-top:3px solid var(--lc);font-family:var(--body);transition:transform .15s,box-shadow .15s}\n.fcard:hover{transform:translateY(-2px);box-shadow:0 18px 34px -20px rgba(0,0,0,.6)}\n.fcard b{margin-top:6px;font-size:13px;line-height:1.2;text-align:center;text-wrap:balance} .fcard .fvsn{font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:var(--muted);font-weight:700} .fcard .fvyr{font-size:11.5px;color:var(--gold);font-weight:600;font-variant-numeric:tabular-nums}\n.fcard.sm b{font-size:11.5px;margin-top:4px} .fcard.sm .fvyr{font-size:10.5px}\n.fcard.fvhero{width:190px;padding:16px 14px 12px;box-shadow:0 0 0 4px color-mix(in srgb,var(--gold) 22%,transparent)} .fcard.fvhero b{font-family:var(--display);font-weight:400;font-size:19px}\n.fcard.spouse{box-shadow:none}\n.couple{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center}\n.ring{font-size:11px;font-weight:700;color:var(--muted);padding:3px 9px;border:1px solid var(--line);border-radius:999px;background:var(--surface)}\n.sibs{display:flex;flex-direction:column;align-items:center;gap:6px;max-width:340px} .sgrid{display:flex;flex-wrap:wrap;gap:6px;justify-content:center} .sgrid .fcard{width:104px;padding:8px}\n.lab{font-size:10.5px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:var(--muted)} .lab.c{margin-top:2px}\n.conn.v{width:2px;height:22px;background:color-mix(in srgb,var(--gold) 60%,transparent);border-radius:2px}\n\ncircle.famc{fill:color-mix(in srgb,var(--lc) 10%,transparent);stroke:color-mix(in srgb,var(--lc) 60%,transparent);stroke-width:1.5}\ncircle.famc.d0{fill:color-mix(in srgb,var(--gold) 6%,transparent);stroke:var(--gold);stroke-dasharray:3 4}\n.fvpin{cursor:pointer} .fvpin:hover .pring{fill:var(--gold)}\ntext.cl{fill:var(--ink);font-weight:700;text-anchor:middle;paint-order:stroke;stroke:var(--paper);stroke-width:3px;pointer-events:none} text.cl.leaf{font-weight:600}\n\n#fv-v-path .fvstage{overflow:auto;padding-block:8px 40px;padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px))}\n.phead{display:flex;gap:16px;align-items:center;max-width:720px;margin:0 auto 18px}\n.phead .fvbig{font:400 64px/1 var(--display);color:var(--gold);font-variant-numeric:tabular-nums}\n.phead h3{font:400 24px/1.15 var(--display);margin:4px 0;text-wrap:balance} .fvmeta{color:var(--muted);font-size:12.5px}\n.fvsteps{list-style:none;margin:0 auto;padding:0;max-width:720px;display:flex;flex-direction:column;gap:0;position:relative}\n.fvsteps li{display:grid;grid-template-columns:150px 1fr;gap:14px;align-items:center;position:relative;padding:8px 0}\n.fvsteps li::before{content:\"\";position:absolute;left:182px;top:-8px;bottom:-8px;width:2px;background:var(--line)}\n.fvsteps li:first-child::before{top:50%} .fvsteps li:last-child::before{bottom:50%}\n.fvsteps .fvgen{font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--muted);text-align:right}\n.fvstep{display:flex;gap:14px;align-items:center;text-align:left;background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--lc);border-radius:16px;padding:10px 14px;color:var(--ink);font-family:var(--body);cursor:pointer;position:relative;z-index:1;min-width:0}\n.fvstep:hover{box-shadow:0 14px 30px -18px rgba(0,0,0,.6)} .fvstep b{display:block;font-size:14.5px} .fvstep>span{min-width:0;display:flex;flex-direction:column;gap:2px}\n.fvsn2{font-size:12.5px;color:var(--ink);opacity:.85;line-height:1.4}\n.fvempty{color:var(--muted);text-align:center;margin-top:40px}\n\n#fv-cardb{display:flex;flex-direction:column;gap:12px}\n#fv-card{position:absolute;right:max(16px,env(safe-area-inset-right,0px));top:96px;width:min(340px,calc(100% - 32px));max-height:calc(100% - 120px);overflow:auto;background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:16px;box-shadow:0 30px 60px -30px rgba(0,0,0,.7);z-index:5;display:flex;flex-direction:column;gap:12px}\n#fv-cardx{position:absolute;top:8px;right:10px;border:0;background:transparent;color:var(--muted);font-size:22px;cursor:pointer;width:32px;height:32px;border-radius:50%}\n.ctop{display:flex;gap:14px;align-items:center} .ctop h3{font:400 22px/1.1 var(--display);margin:3px 0;text-wrap:balance}\n.fvbio{margin:0;font-size:13px;line-height:1.55}\n.fvrel{display:flex;flex-direction:column;gap:8px} .fvrel>div{display:flex;flex-wrap:wrap;gap:6px;align-items:center} .fvrel b{font-size:10.5px;letter-spacing:1.4px;text-transform:uppercase;color:var(--muted);width:100%}\n.fvrel button{display:inline-flex;align-items:center;gap:6px;border:0;background:var(--chip);color:var(--ink);border-radius:999px;padding:3px 10px 3px 3px;font:500 12.5px var(--body);cursor:pointer}\n.cacts{display:flex;flex-wrap:wrap;gap:6px} .cacts button{border:1px solid var(--line);background:transparent;color:var(--ink);border-radius:999px;padding:7px 11px;font:600 12px var(--body);cursor:pointer} .cacts button:hover{border-color:var(--gold)}\n@media (max-width:760px){\n  .fvhead{padding-block:12px 6px} .fvtabs{margin-left:0;width:100%} .fvtabs button{flex:1;padding:8px 6px;font-size:12.5px}\n  #fv-card{top:auto;bottom:max(10px,env(safe-area-inset-bottom,0px));max-height:46%}\n  .fvsteps li{grid-template-columns:1fr} .fvsteps .fvgen{text-align:left} .fvsteps li::before{display:none}\n  .fcard{width:118px} .fcard.fvhero{width:156px} .pt.xl{--s:96px} .fvbar p{display:none}\n}\n";
const FV_MARKUP="<header class=\"fvhead\"><div><div class=\"eyebrow\">The French family \u00b7 from 1560 to today</div><h1>Family Tree</h1></div>\n<nav class=\"fvtabs\" role=\"tablist\" aria-label=\"Choose a view\"><button data-v=\"all\" role=\"tab\">Whole tree</button><button data-v=\"focus\" role=\"tab\">Family</button><button data-v=\"fan\" role=\"tab\">Fan chart</button><button data-v=\"circ\" role=\"tab\">Circles</button><button data-v=\"path\" role=\"tab\">How we're related</button></nav></header>\n<section class=\"fvview\" id=\"fv-v-fan\"><div class=\"fvbar\"><p>Everyone you come from, in rings. <b id=\"fv-fanroot\"></b> sits at the centre, parents in the first ring, and each ring out is one generation older. Tap a wedge to read about them; double-tap to put them in the centre.</p><label>Rings <input id=\"fv-fang\" type=\"range\" min=\"3\" max=\"9\" value=\"7\"> <b id=\"fv-fangv\">7</b></label><button id=\"fv-fanme\">Back to Brad</button></div><div class=\"fvstage\"></div></section>\n<section class=\"fvview\" id=\"fv-v-focus\" hidden><div class=\"fvbar\"><p>One family at a time: <b id=\"fv-focname\"></b> with their parents and grandparents above, brothers and sisters beside them, children below. Tap anyone to move to their family.</p><button id=\"fv-focup\">Up a generation</button><button id=\"fv-focme\">Brad's family</button><button id=\"fv-focall\">See on the whole tree</button></div><div class=\"fvstage\"></div></section>\n<section class=\"fvview\" id=\"fv-v-circ\" hidden><div class=\"fvbar\"><p>Everyone who came from one couple, as nested circles. Each circle is a family; the faces inside are their children and grandchildren. <b id=\"fv-circcount\"></b></p><select id=\"fv-circsel\" aria-label=\"Choose the couple\"></select></div><div class=\"fvstage\"></div></section>\n<section class=\"fvview\" id=\"fv-v-path\" hidden><div class=\"fvbar\"><p>Pick any ancestor and see the exact line from you back to them, one generation per step.</p><select id=\"fv-pathto\" aria-label=\"Choose an ancestor\"></select></div><div class=\"fvstage\"></div></section>\n<div class=\"fvlegend\"></div>\n<aside id=\"fv-card\" hidden aria-live=\"polite\"><button id=\"fv-cardx\" aria-label=\"Close\">\u00d7</button><div id=\"fv-cardb\"></div></aside>";
function FV_SETUP(mode,arg){
const LINES=[{k:'french',root:'I1800',name:'French',c:'var(--l-french)'},{k:'schmitt',root:'I1811',name:'Schmitt',c:'var(--l-schmitt)'},{k:'wetzel',root:'I2489',name:'Wetzel',c:'var(--l-wetzel)'},{k:'goodwin',root:'I2',name:'Goodwin',c:'var(--l-goodwin)'}];
const par=id=>{ const p=P[id]; const f=p&&p.famc&&p.famc[0]&&F[p.famc[0]]; return f?[f.h||null,f.w||null]:[null,null] };
const spouseFams=id=>((P[id]||{}).fams||[]).map(fid=>[fid,F[fid]]).filter(x=>x[1]);
const kids=id=>spouseFams(id).flatMap(([,f])=>f.c||[]).filter(k=>P[k]);
const spouses=id=>spouseFams(id).map(([,f])=>f.h===id?f.w:f.h).filter(s=>s&&P[s]);
const sibs=id=>{ const p=P[id]; const f=p&&p.famc&&p.famc[0]&&F[p.famc[0]]; return f?(f.c||[]).filter(c=>c!==id&&P[c]):[] };
const first=p=>((p.g||'').replace(/[()]/g,'').trim().split(/\s+/)[0])||'Unknown';
const given=p=>(p.g||'Unknown').replace(/[()]/g,'');
const full=p=>`${given(p)} ${p.s||''}`.trim();
const yrs=p=>(p.by||p.dy)?`${p.by||'?'} – ${p.dy||(p.by&&p.by<1925?'?':'')}`:'';
const ini=p=>(((p.g||'?').match(/[A-Za-zÀ-ÿ]/)||['?'])[0]+(((p.s||'').match(/[A-Za-zÀ-ÿ]/)||[''])[0])).toUpperCase();
const place=s=>(s||'').replace(/\s*\(.*\)\s*$/,'');
// which grandparent line a person belongs to
const LINEOF={}; for(const L of LINES){ const st=[L.root]; while(st.length){ const id=st.pop(); if(!id||!P[id]||LINEOF[id]) continue; LINEOF[id]=L; st.push(...par(id)) } }
const lineColor=id=>LINEOF[id]?LINEOF[id].c:'var(--gold)';
const portrait=(id,cls='')=>{ const p=P[id]; if(!p) return ''; const f=FACE[id]; return `<span class="pt ${p.sex==='F'?'f':'m'} ${cls}" style="--lc:${lineColor(id)}">${f?`<img src="${f}" alt="">`:`<i>${E(ini(p))}</i>`}</span>` };

/* ---------- shared person card ---------- */
let SEL=null;
function select(id,from){ SEL=id; const p=P[id]; if(!p) return; const [h,w]=par(id);
  const chip=x=>x&&P[x]?`<button data-go="${x}">${portrait(x,'xs')}<span>${E(full(P[x]))}</span></button>`:'';
  $('#fv-cardb').innerHTML=`<div class="ctop">${portrait(id,'lg')}<div><div class="eyebrow" style="color:${lineColor(id)}">${LINEOF[id]?E(LINEOF[id].name)+' line':'The family'}</div><h3>${E(full(p))}</h3><div class="fvmeta">${E([yrs(p),place(p.bp)].filter(Boolean).join(' · '))}</div></div></div>
    ${p.bio?`<p class="fvbio">${E(p.bio)}${p.bio.length>=420?'…':''}</p>`:''}
    <div class="fvrel">${(h||w)?`<div><b>Parents</b>${chip(h)}${chip(w)}</div>`:''}${spouses(id).length?`<div><b>Married</b>${spouses(id).map(chip).join('')}</div>`:''}${kids(id).length?`<div><b>Children</b>${kids(id).map(chip).join('')}</div>`:''}</div>
    <div class="cacts"><button data-view="focus" data-id="${id}">Open in Family view</button><button data-view="fan" data-id="${id}">Fan from here</button><button data-view="path" data-id="${id}">How we're related</button><button data-view="all" data-id="${id}">On the whole tree</button></div>`;
  $('#fv-card').hidden=false;
  $('#fv-card').querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ select(b.dataset.go); if(VIEW==='focus') focusOn(b.dataset.go) });
  $('#fv-card').querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{ const v=b.dataset.view, x=b.dataset.id; if(v==='fan') FANROOT=x; if(v==='focus') FOC=x; if(v==='path') PATHTO=x; if(v==='all'){ location.hash='tree-'+x; return } show(v) });
}

/* ---------- 1. Fan chart ---------- */
let FANROOT='I962', FANG=innerWidth<700?5:7;
function drawFan(){ const host=$('#fv-v-fan .fvstage'); host.innerHTML=''; const W=host.clientWidth, H=host.clientHeight; const side=(W>1100&&!$('#fv-card').hidden)?360:0; const R=Math.max(140,Math.min((W-side)*.5-12,H*.56)); const CX=-side/2, CY=-H*.5+R+14;
  const radii=[0]; const r0=R*.17; radii.push(r0); const span=(R-r0); const wts=[1.45,1.3,1.15,.9,.8,.72,.64,.58,.52].slice(0,FANG); const tw=wts.reduce((a,b)=>a+b,0); for(const w of wts) radii.push(radii[radii.length-1]+span*w/tw);
  const A0=-Math.PI*.76, A1=Math.PI*.76; // 295° fan, open at the bottom for the root
  const svg=d3.select(host).append('svg').attr('viewBox',`${-W/2} ${-H/2} ${W} ${H}`).attr('width',W).attr('height',H);
  const z=svg.append('g'); const g=z.append('g').attr('transform',`translate(${CX},${CY})`); svg.call(d3.zoom().scaleExtent([.6,8]).on('zoom',e=>z.attr('transform',e.transform))).on('dblclick.zoom',null);
  const arc=d3.arc(); let slots=[[FANROOT]];
  for(let k=1;k<=FANG;k++){ slots[k]=[]; for(const id of slots[k-1]){ const [h,w]=id?par(id):[null,null]; slots[k].push(h,w) } }
  const defs=svg.append('defs');
  for(let k=1;k<=FANG;k++){ const n=2**k, da=(A1-A0)/n;
    slots[k].forEach((id,i)=>{ const a0=A0+i*da, a1=a0+da; const p=id&&P[id];
      const path=g.append('path').attr('d',arc({innerRadius:radii[k]+1,outerRadius:radii[k+1]-1,startAngle:a0+.002,endAngle:a1-.002,cornerRadius:k<4?6:2})).attr('class','w'+(p?'':' fvempty'));
      if(!p) return; path.style('--lc',lineColor(id)).on('click',()=>select(id)).on('dblclick',()=>{ FANROOT=id; drawFan() }).append('title').text(full(p)+(yrs(p)?' · '+yrs(p):''));
      const mid=(a0+a1)/2, rm=(radii[k]+radii[k+1])/2, arcLen=rm*da, ring=radii[k+1]-radii[k];
      const x=Math.sin(mid)*rm, y=-Math.cos(mid)*rm;
      if(k<=3){ // portrait + name
        const ps=Math.min(ring*.52,arcLen*.42,64); if(ps>18){ const cid='c'+k+'_'+i; defs.append('clipPath').attr('id',cid).append('circle').attr('cx',x).attr('cy',y-ring*.12).attr('r',ps/2);
          const ring2=g.append('circle').attr('cx',x).attr('cy',y-ring*.12).attr('r',ps/2+2).attr('class','pring').style('--lc',lineColor(id)).attr('pointer-events','none');
          if(FACE[id]) g.append('image').attr('href',FACE[id]).attr('x',x-ps/2).attr('y',y-ring*.12-ps/2).attr('width',ps).attr('height',ps).attr('clip-path',`url(#${cid})`).attr('preserveAspectRatio','xMidYMid slice').attr('pointer-events','none');
          else g.append('text').attr('x',x).attr('y',y-ring*.12).attr('class','pini').attr('font-size',ps*.36).attr('dy','.35em').text(ini(p)).attr('pointer-events','none') }
        const nfs=Math.min(13,arcLen/7,ring*.2); g.append('text').attr('x',x).attr('y',y+ring*.3).attr('class','fvnm').attr('font-size',nfs).text(first(p)).attr('pointer-events','none');
        if(ring>64) g.append('text').attr('x',x).attr('y',y+ring*.3+nfs+1).attr('class','fvyr').attr('font-size',Math.min(10.5,arcLen/9,ring*.16)).text(yrs(p)).attr('pointer-events','none');
      } else { // radial text along the spoke
        const deg=mid*180/Math.PI; const flip=mid<0; const fs=Math.max(6,Math.min(11.5,arcLen*.55,R/26));
        if(arcLen<5) return;
        const t=g.append('text').attr('class','rad').attr('font-size',fs).attr('transform',`rotate(${deg-90}) translate(${rm},0) rotate(${flip?180:0})`).attr('text-anchor','middle').attr('dy','.35em').attr('pointer-events','none');
        const label=k<=5?full(p):first(p); const maxch=Math.floor(ring/(fs*.55)); t.text(label.length>maxch?label.slice(0,maxch-1)+'…':label) }
    }) }
  // root
  const rp=P[FANROOT]; defs.append('clipPath').attr('id','croot').append('circle').attr('r',r0*.78);
  g.append('circle').attr('r',r0*.78+4).attr('class','pring root');
  if(FACE[FANROOT]) g.append('image').attr('href',FACE[FANROOT]).attr('x',-r0*.78).attr('y',-r0*.78).attr('width',r0*1.56).attr('height',r0*1.56).attr('clip-path','url(#croot)').attr('preserveAspectRatio','xMidYMid slice');
  else g.append('text').attr('class','pini').attr('font-size',r0*.6).attr('dy','.35em').text(ini(rp));
  if(R>260) g.append('text').attr('class','rootnm').attr('y',r0*.78+26).text(first(rp)+' '+(rp.s||'')); if(R>260) g.append('text').attr('class','fvyr').attr('y',r0*.78+42).attr('font-size',12).text(yrs(rp));
  g.selectAll('.rootnm,circle.root').on('click',()=>select(FANROOT));
  const gl=['Parents','Grandparents','Great-grandparents','2× great','3× great','4× great','5× great','6× great','7× great'];
  for(let k=2;k<=Math.min(FANG,6);k++){ const r=(radii[k]+radii[k+1])/2; g.append('text').attr('class','glab').attr('x',0).attr('y',r+4).text(gl[k-1]).attr('text-anchor','middle') }
  $('#fv-fanroot').textContent=full(rp);
}

/* ---------- 2. Family (focus) view ---------- */
let FOC='I1833';
function focusOn(id){ FOC=id; renderFocus(true); try{ history.replaceState(null,'','#family-'+id) }catch(e){} }
function renderFocus(anim){ const id=FOC, p=P[id]; if(!p) return; const [h,w]=par(id); const sp=spouses(id); const ks=kids(id); const sb=sibs(id);
  const card=(x,cls='')=>x&&P[x]?`<button class="fcard ${cls}" data-id="${x}" style="--lc:${lineColor(x)}">${portrait(x,cls.includes('hero')?'xl':'md')}<b>${E(given(P[x]))}</b><span class="fvsn">${E(P[x].s||'')}</span><span class="fvyr">${E(yrs(P[x]))}</span></button>`:'';
  const gp=x=>{ const [a,b]=x?par(x):[null,null]; return (a||b)?`<div class="gp">${card(a,'sm')}${card(b,'sm')}</div>`:'<div class="gp none"></div>' };
  $('#fv-v-focus .fvstage').innerHTML=`<div class="fwrap ${anim?'in':''}">
    <div class="frow up"><div class="fside">${gp(h)}${card(h)}</div><div class="fside">${gp(w)}${card(w)}</div></div>
    ${(h||w)?'<div class="conn v"></div>':''}
    <div class="frow mid">${sb.length?`<div class="sibs"><div class="lab">Brothers &amp; sisters</div><div class="sgrid">${sb.map(x=>card(x,'sm')).join('')}</div></div>`:''}
      <div class="couple">${card(id,'hero')}${sp.map(x=>`<div class="ring">m.${(()=>{ const f=spouseFams(id).find(([,f])=>f.h===x||f.w===x); const y=f&&String(f[1].md||'').match(/\d{4}/); return y?' '+y[0]:'' })()}</div>${card(x,'hero spouse')}`).join('')}</div></div>
    ${ks.length?`<div class="conn v"></div><div class="lab c">Children</div><div class="frow kids">${ks.map(k=>card(k)).join('')}</div>`:''}
  </div>`;
  $('#fv-v-focus .fvstage').querySelectorAll('.fcard').forEach(b=>b.onclick=()=>{ if(b.dataset.id===FOC) select(FOC); else { focusOn(b.dataset.id); select(b.dataset.id) } });
  $('#fv-focname').textContent=full(p);
}

/* ---------- 3. Family circles (descendants) ---------- */
let CIRC='F690'; const CHOICES=[['F690','Jack & Teddy French'],['F3','Kenneth & Arlene Wetzel'],['F691','Stewart & Gertrude French'],['F2','Art & Ginger French']];
function descTree(fid,depth=0){ const f=F[fid]; const node={id:fid,fam:true,h:f.h,w:f.w,children:[]};
  for(const c of f.c||[]){ if(!P[c]) continue; const own=(P[c].fams||[]).filter(x=>F[x]); if(own.length&&depth<6){ for(const of of own.slice(0,1)){ const sub=descTree(of,depth+1); sub.via=c; node.children.push(sub) } } else node.children.push({id:c,value:1}) }
  if(!node.children.length) node.value=1; return node }
function drawCircles(){ const host=$('#fv-v-circ .fvstage'); host.innerHTML=''; const W=host.clientWidth, H=host.clientHeight, S=Math.min(W,H)-16;
  const root=d3.hierarchy(descTree(CIRC)).sum(d=>d.value||0).sort((a,b)=>b.value-a.value); d3.pack().size([S,S]).padding(d=>d.depth===0?18:10)(root);
  const svg=d3.select(host).append('svg').attr('width',W).attr('height',H); const g=svg.append('g').attr('transform',`translate(${(W-S)/2},${(H-S)/2})`);
  const defs=svg.append('defs'); let n=0;
  const nodes=g.selectAll('g.n').data(root.descendants()).join('g').attr('class','n').attr('transform',d=>`translate(${d.x},${d.y})`);
  nodes.filter(d=>d.data.fam).append('circle').attr('r',d=>d.r).attr('class',d=>'famc d'+d.depth).style('--lc',d=>lineColor(d.data.via||d.data.h||d.data.w));
  nodes.filter(d=>d.data.fam).each(function(d){ const sel=d3.select(this); const ids=[d.data.via, ...[d.data.h,d.data.w].filter(x=>x&&x!==d.data.via)].filter(x=>x&&P[x]).slice(0,2);
    const ps=Math.max(16,Math.min(56,d.r*.32)); ids.forEach((pid,i)=>{ const cx=(i-(ids.length-1)/2)*(ps*.92), cy=-d.r+ps*.62+4; const cid='cc'+(n++); defs.append('clipPath').attr('id',cid).append('circle').attr('r',ps/2);
      const gg=sel.append('g').attr('transform',`translate(${cx},${cy})`).attr('class','fvpin').on('click',e=>{ e.stopPropagation(); select(pid) });
      gg.append('circle').attr('r',ps/2+2).attr('class','pring').style('--lc',lineColor(pid));
      if(FACE[pid]) gg.append('image').attr('href',FACE[pid]).attr('x',-ps/2).attr('y',-ps/2).attr('width',ps).attr('height',ps).attr('clip-path',`url(#${cid})`).attr('preserveAspectRatio','xMidYMid slice');
      else gg.append('text').attr('class','pini').attr('font-size',ps*.38).attr('dy','.35em').text(ini(P[pid])); });
    if(d.r>46) sel.append('text').attr('class','cl').attr('y',-d.r+ps*1.22+12).attr('font-size',Math.min(13,d.r/7)).text(ids.map(x=>first(P[x])).join(' & ')) });
  nodes.filter(d=>!d.data.fam).each(function(d){ const pid=d.data.id, sel=d3.select(this); const ps=d.r*1.6; const cid='cc'+(n++); defs.append('clipPath').attr('id',cid).append('circle').attr('r',ps/2);
    sel.attr('class','n fvpin').on('click',()=>select(pid)); sel.append('circle').attr('r',ps/2+2).attr('class','pring').style('--lc',lineColor(pid));
    if(FACE[pid]) sel.append('image').attr('href',FACE[pid]).attr('x',-ps/2).attr('y',-ps/2).attr('width',ps).attr('height',ps).attr('clip-path',`url(#${cid})`).attr('preserveAspectRatio','xMidYMid slice');
    else sel.append('text').attr('class','pini').attr('font-size',ps*.34).attr('dy','.35em').text(ini(P[pid]));
    if(d.r>14) sel.append('text').attr('class','cl leaf').attr('y',ps/2+12).attr('font-size',Math.min(11,d.r/2.4)).text(first(P[pid])) });
  const cnt=root.descendants().reduce((a,d)=>a+(d.data.fam?((d.data.h?1:0)+(d.data.w?1:0)-(d.data.via?1:0)):1),0)+(1);
  $('#fv-circcount').textContent=`${root.leaves().length} living branches · ${root.height+1} generations`;
}

/* ---------- 4. How we're related (path) ---------- */
let PATHFROM='I962', PATHTO='I112';
function pathUp(from,to){ const prev={[from]:null}; const q=[from]; while(q.length){ const x=q.shift(); if(x===to) break; for(const y of par(x)) if(y&&P[y]&&!(y in prev)){ prev[y]=x; q.push(y) } } if(!(to in prev)) return null; const out=[]; let c=to; while(c){ out.push(c); c=prev[c] } return out.reverse() }
function relName(n){ return ['You','Parent','Grandparent','Great-grandparent'][n]||`${n-2}× great-grandparent` }
function drawPath(){ const host=$('#fv-v-path .fvstage'); const path=pathUp(PATHFROM,PATHTO);
  if(!path){ host.innerHTML=`<p class="fvempty">${E(full(P[PATHTO]))} isn't a direct ancestor of ${E(full(P[PATHFROM]))}. Pick someone from the list.</p>`; return }
  const n=path.length-1; const tp=P[PATHTO];
  host.innerHTML=`<div class="phead"><div class="fvbig">${n}</div><div><div class="eyebrow">generations apart</div><h3>${E(full(tp))} is your ${E(relName(n).toLowerCase())}</h3><div class="fvmeta">${E([yrs(tp),place(tp.bp)].filter(Boolean).join(' · '))}</div></div></div>
    <ol class="fvsteps">${path.slice().reverse().map((id,i)=>{ const p=P[id]; const k=n-i; return `<li style="--lc:${lineColor(id)}"><span class="fvgen">${E(relName(k))}</span><button class="fvstep" data-id="${id}">${portrait(id,'md')}<span><b>${E(full(p))}</b><span class="fvmeta">${E([yrs(p),place(p.bp)].filter(Boolean).join(' · '))}</span>${p.bio?`<span class="fvsn2">${E(p.bio.split(/(?<=\.)\s/)[0])}</span>`:''}</span></button></li>` }).join('')}</ol>`;
  host.querySelectorAll('.fvstep').forEach(b=>b.onclick=()=>select(b.dataset.id));
}
function fillPathPicker(){ const anc=[]; const seen=new Set(); const q=[[PATHFROM,0]]; while(q.length){ const [x,d]=q.shift(); for(const y of par(x)) if(y&&P[y]&&!seen.has(y)){ seen.add(y); anc.push([y,d+1]); q.push([y,d+1]) } }
  anc.sort((a,b)=>(P[a[0]].by||9999)-(P[b[0]].by||9999)); const sel=$('#fv-pathto');
  sel.innerHTML=anc.map(([id,d])=>`<option value="${id}" ${id===PATHTO?'selected':''}>${E(full(P[id]))}${P[id].by?' ('+P[id].by+')':''} · ${E(relName(d))}</option>`).join(''); }

/* ---------- views + boot ---------- */
let VIEW='fan';
function show(v){ if(v==='all'){ location.hash=FOC?'tree-'+FOC:'tree'; return } VIEW=v; document.querySelectorAll('.fvtabs button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.v===v))); document.querySelectorAll('.fvview').forEach(s=>s.hidden=s.id!=='fv-v-'+v);
  if(v==='fan') drawFan(); if(v==='focus') renderFocus(true); if(v==='circ') drawCircles(); if(v==='path'){ fillPathPicker(); drawPath() }
  const hh={focus:'family-'+FOC,fan:'fan-'+FANROOT,circ:'circles-'+CIRC,path:'related-'+PATHTO}[v]; try{ if(hh&&location.hash!=='#'+hh) history.replaceState(null,'','#'+hh) }catch(e){} }
document.querySelectorAll('.fvtabs button').forEach(b=>b.onclick=()=>show(b.dataset.v));
$('#fv-fang').oninput=e=>{ FANG=+e.target.value; $('#fv-fangv').textContent=FANG; drawFan() };
$('#fv-fanme').onclick=()=>{ FANROOT='I962'; drawFan() };
$('#fv-circsel').innerHTML=CHOICES.map(([f,n])=>`<option value="${f}">${E(n)}</option>`).join(''); $('#fv-circsel').onchange=e=>{ CIRC=e.target.value; drawCircles() };
$('#fv-pathto').onchange=e=>{ PATHTO=e.target.value; drawPath() };
$('#fv-focall').onclick=()=>{ location.hash='tree-'+FOC }; $('#fv-focme').onclick=()=>focusOn('I962'); $('#fv-focup').onclick=()=>{ const [h,w]=par(FOC); const x=h||w; x&&focusOn(x) };
$('#fv-cardx').onclick=()=>{ $('#fv-card').hidden=true; if(VIEW==='fan') drawFan() };
document.querySelector('.fvlegend').innerHTML=LINES.map(L=>`<span><i style="background:${L.c}"></i>${E(L.name)} line</span>`).join('')+`<span><i style="background:var(--gold)"></i>Art &amp; Ginger's family</span>`;
let rt; if(!window._fvResize) window._fvResize=1, addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(()=>{ if(VIEW==='fan') drawFan(); if(VIEW==='circ') drawCircles() },150) });

  if(mode==='fan'&&arg&&P[arg]) FANROOT=arg; if(mode==='focus'&&arg&&P[arg]) FOC=arg; if(mode==='circ'&&arg&&F[arg]) CIRC=arg; if(mode==='path'&&arg&&P[arg]) PATHTO=arg;
  $('#fv-fang').value=FANG; $('#fv-fangv').textContent=FANG;
  if(mode==='circ') $('#fv-circsel').value=CIRC; show(mode||'focus');
}

window.fvTabs=function(app,focusId){ const head=app.querySelector('.ft .fthead'); if(!head||head.querySelector('.fvtabs')) return;
  if(!document.getElementById('fv-css')){ const st=document.createElement('style'); st.id='fv-css'; st.textContent=FV_CSS; document.head.appendChild(st) }
  const nav=document.createElement('nav'); nav.className='fvtabs fvtabs-tree'; nav.setAttribute('aria-label','Choose a view');
  const id=focusId||'I1833'; nav.innerHTML=[['all','Whole tree',null],['family','Family','family-'+id],['fan','Fan chart','fan-I962'],['circ','Circles','circles'],['path',"How we're related",'related']].map(([v,l,h])=>`<button data-h="${h||''}" aria-selected="${v==='all'}">${l}</button>`).join('');
  nav.querySelectorAll('button').forEach(b=>b.onclick=()=>{ if(b.dataset.h) location.hash=b.dataset.h });
  const ttl=head.querySelector('.ttl'); ttl?ttl.after(nav):head.prepend(nav) };
window.familyViews=async function(app,mode,arg){
  app.innerHTML='<div class="wrap load">Opening the family tree…</div>';
  try{ await FV_LOAD() }catch(e){ app.innerHTML='<div class="wrap load">The family tree did not load. Reload the page to try again.</div>'; return }
  if(!document.getElementById('fv-css')){ const st=document.createElement('style'); st.id='fv-css'; st.textContent=FV_CSS; document.head.appendChild(st) }
  app.innerHTML='<section class="fv">'+FV_MARKUP+'</section>';
  FV_SETUP(mode,arg);
};
})();
