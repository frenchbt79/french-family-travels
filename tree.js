/* French Family Travels · Family Tree
   One continuous chart of every person in the tree: generations are worked out from the relationships,
   couples sit side by side, siblings and both family lines share the sheet. Scroll or pinch to zoom
   (cards simplify as you zoom out), drag to pan, tap anyone to light up their bloodline and read
   their story, double-tap to fly in. Four colours mark the four grandparent lines. */
(function(){
const css=`
.ft{display:grid;grid-template-columns:minmax(0,1fr) 380px;height:calc(100vh - 58px - env(safe-area-inset-top,0px));min-height:560px;background:var(--paper);overflow:hidden}
.ftstage{position:relative;overflow:hidden;min-width:0;background:radial-gradient(90% 70% at 50% 40%,var(--surface) 0%,var(--paper) 70%);touch-action:none;cursor:grab;outline:none}
.ftstage::before{content:"";position:absolute;inset:0;background-image:radial-gradient(circle,var(--line) 1px,transparent 1.2px);background-size:26px 26px;opacity:.55;pointer-events:none}
.ftstage:active{cursor:grabbing}
.ftworld{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform}
.ftworld svg{position:absolute;left:0;top:0;overflow:visible;pointer-events:none}
.ftworld path{fill:none;stroke:var(--gold);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;opacity:.55;transition:opacity .3s,stroke-width .3s}
.ftworld path.bar{stroke:var(--line);opacity:.9}
.ftworld.sel path{opacity:.1} .ftworld.sel path.lit{opacity:.95;stroke-width:3}
.ftworld .mlab{position:absolute;z-index:4;transform:translate(-50%,-50%);font-size:10px;font-weight:700;letter-spacing:.6px;padding:2px 8px;border-radius:999px;background:var(--surface);border:1px solid var(--line);color:var(--muted);white-space:nowrap;pointer-events:none}
.ftworld .yband{position:absolute;left:0;right:0;border-top:1px dashed var(--line);opacity:.35;pointer-events:none}
.fc{position:absolute;width:176px;height:206px;padding:14px 10px 10px;border-radius:22px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:2px;color:var(--ink);box-sizing:border-box;
  background:linear-gradient(180deg,color-mix(in srgb,var(--surface) 96%,#fff 4%),var(--surface));border:1px solid color-mix(in srgb,var(--line) 80%,transparent);border-top:3px solid var(--lc,var(--line));
  box-shadow:0 1px 0 rgba(255,255,255,.04) inset,0 2px 4px rgba(10,16,28,.08),0 18px 38px -22px rgba(10,16,28,.55);transition:box-shadow .22s,border-color .22s,opacity .3s}
.fc:hover{border-color:color-mix(in srgb,var(--gold) 70%,transparent);box-shadow:0 2px 4px rgba(10,16,28,.1),0 26px 50px -22px rgba(10,16,28,.65);z-index:2}
.fc.focus{border-color:var(--gold);box-shadow:0 0 0 4px color-mix(in srgb,var(--gold) 26%,transparent),0 26px 54px -20px rgba(10,16,28,.7);z-index:3}
.ftworld.sel .fc{opacity:.2} .ftworld.sel .fc.lit{opacity:1}
.fc .ph{width:96px;height:96px;flex:none;border-radius:50%;padding:3px;background:linear-gradient(140deg,#8FB0DA,#3D5A80);box-shadow:0 8px 18px -8px rgba(10,16,28,.6);position:relative;transition:width .2s,height .2s}
.fc.f .ph{background:linear-gradient(140deg,#E8B0BC,#9C5A6B)}
.fc .ph img,.fc .ph i{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;object-fit:cover;border:2px solid var(--surface);font-style:normal;font-family:var(--display);font-size:30px;color:#fff;box-sizing:border-box;background:radial-gradient(circle at 32% 26%,#5B7BA6,#24384F 78%)}
.fc.f .ph i{background:radial-gradient(circle at 32% 26%,#B37587,#5A2F3B 78%)}
.fc .ph img{background:var(--chip)} .fc.dead .ph img{filter:saturate(.75) contrast(1.02)}
.fc.focus .ph{background:linear-gradient(140deg,#F3D99B,#B98A2E);box-shadow:0 0 0 6px color-mix(in srgb,var(--gold) 18%,transparent),0 10px 24px -8px rgba(10,16,28,.6)}
.fc .nm{margin-top:7px;font-size:13.5px;line-height:1.18;font-weight:700;max-width:100%;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-wrap:balance}
.fc .sn{font-size:10.5px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:var(--muted);max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fc .yr{font-size:12px;color:var(--gold);font-weight:600;font-variant-numeric:tabular-nums;margin-top:2px}
.fc .pl{font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.fc .bd{position:absolute;top:10px;right:10px;display:flex;gap:3px}
.fc .bd em{font-style:normal;font-size:9.5px;font-weight:700;min-width:18px;height:18px;padding:0 5px;border-radius:999px;display:grid;place-items:center;background:var(--chip);color:var(--muted);font-variant-numeric:tabular-nums}
.fc .fb{position:absolute;top:10px;left:10px;width:20px;height:20px;border-radius:50%;background:#1877F2;color:#fff;font:700 13px/20px system-ui,sans-serif;text-align:center} .ftworld[data-lod="0"] .fc .fb{display:none}
.fbbtn{display:inline-flex;align-items:center;gap:8px;align-self:flex-start;padding:8px 14px;border-radius:999px;background:#1877F2;color:#fff;font-weight:700;font-size:13px;text-decoration:none} .fbbtn i{font-style:normal;font:800 15px system-ui,sans-serif}
.fc .bd em.pc{background:color-mix(in srgb,var(--gold) 22%,var(--chip));color:var(--ink)}
/* level of detail: 2 = full card, 1 = compact, 0 = portrait token */
.ftworld[data-lod="1"] .fc .pl,.ftworld[data-lod="1"] .fc .bd{display:none}
.fc>*{flex-shrink:0} .ftworld[data-lod="1"] .fc .nm{font-size:18px;line-height:1.1;margin-top:8px;-webkit-line-clamp:1;display:block;white-space:nowrap;text-overflow:ellipsis} .ftworld[data-lod="1"] .fc .sn{font-size:13px} .ftworld[data-lod="1"] .fc .yr{font-size:15px} .ftworld[data-lod="1"] .fc .ph{width:100px;height:100px}
.ftworld[data-lod="0"] .fc{background:transparent;border-color:transparent;box-shadow:none;padding:0;justify-content:center}
.ftworld[data-lod="0"] .fc .ph{width:120px;height:120px;padding:4px;background:var(--lc,var(--muted));box-shadow:none} .ftworld[data-lod="0"] .fc .ph i{font-size:40px}
.ftworld[data-lod="0"] .fc .nm,.ftworld[data-lod="0"] .fc .sn,.ftworld[data-lod="0"] .fc .yr,.ftworld[data-lod="0"] .fc .pl,.ftworld[data-lod="0"] .fc .bd{display:none}
.ftworld[data-lod="0"] .fc.focus .ph{background:var(--gold);box-shadow:0 0 0 10px color-mix(in srgb,var(--gold) 30%,transparent)}
.ftworld[data-lod="0"] .mlab{display:none}
.fc .tk{display:none}
.ftworld[data-lod="0"][data-nm="1"] .fc .tk{display:block;position:absolute;left:50%;top:calc(50% + 64px);transform:translateX(-50%);margin:0;width:200px;text-align:center;font-size:calc(10.5px * var(--ik));line-height:1.15;font-weight:600;color:var(--ink);opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 4px var(--paper)}
.ftworld[data-lod="0"] .fc{overflow:visible}
.ftworld[data-lod="0"] path{stroke-width:4} .ftworld[data-lod="0"] path.bar{stroke-width:6}
.lin{position:absolute;transform:translate(-50%,-100%) scale(var(--ik,1));transform-origin:50% 100%;font-family:var(--display);font-size:22px;letter-spacing:.5px;color:var(--lc);white-space:nowrap;opacity:0;transition:opacity .3s;pointer-events:none;text-shadow:0 2px 12px var(--paper),0 0 2px var(--paper)}
.lin small{display:block;font-family:var(--body);font-size:10px;letter-spacing:2.2px;text-transform:uppercase;color:var(--muted);text-align:center}
.ftworld[data-lod="0"] .lin,.ftworld[data-lod="1"] .lin{opacity:1}
.fthead{position:absolute;left:0;top:0;right:0;padding:16px 20px 46px;background:linear-gradient(180deg,var(--paper) 0%,color-mix(in srgb,var(--paper) 82%,transparent) 58%,transparent);display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start;pointer-events:none;z-index:3}
.fthead>*{pointer-events:auto}
.fthead .ttl{display:flex;flex-direction:column;gap:2px;margin-right:auto}
.fthead h1{font-family:var(--display);font-weight:400;font-size:clamp(30px,4.4vw,48px);margin:0;line-height:1}
.ftfind{position:relative;width:min(300px,100%)}
.ftfind input{width:100%;font:inherit;font-size:14px;padding:9px 12px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--ink)}
.ftres{position:absolute;top:44px;left:0;right:0;background:var(--surface);border:1px solid var(--line);border-radius:12px;box-shadow:0 18px 40px -18px rgba(20,28,41,.45);max-height:320px;overflow:auto;z-index:5}
.ftres button{display:flex;justify-content:space-between;gap:10px;width:100%;text-align:left;padding:9px 12px;border-bottom:1px solid var(--line);font-size:13.5px}
.ftres button span{color:var(--muted);font-variant-numeric:tabular-nums;font-size:12px}
.ftrail{position:absolute;left:0;top:0;bottom:0;width:132px;pointer-events:none;z-index:1;background:linear-gradient(90deg,var(--paper) 45%,transparent);-webkit-mask:linear-gradient(180deg,transparent 150px,#000 190px,#000 calc(100% - 90px),transparent);mask:linear-gradient(180deg,transparent 150px,#000 190px,#000 calc(100% - 90px),transparent)}
.ftrail span{position:absolute;left:18px;transform:translateY(-50%);font-size:10px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:var(--muted);width:100px;line-height:1.3}
.ftrail span i{display:block;font-style:normal;font-weight:500;letter-spacing:.4px;text-transform:none;font-variant-numeric:tabular-nums;opacity:.8}
.ftrail span::after{content:"";display:block;width:28px;height:1px;background:var(--line);margin-top:4px}
.ftlegend{position:absolute;left:16px;bottom:max(16px,env(safe-area-inset-bottom,0px));display:flex;flex-wrap:wrap;gap:6px;z-index:3;max-width:min(560px,60%)}
.ftlegend button{display:inline-flex;align-items:center;gap:7px;padding:6px 11px 6px 8px;border-radius:999px;background:var(--surface);border:1px solid var(--line);font-size:12px;font-weight:600;color:var(--ink);box-shadow:0 6px 16px -10px rgba(20,28,41,.4)}
.ftlegend button i{width:10px;height:10px;border-radius:50%;background:var(--lc)} .ftlegend button small{color:var(--muted);font-weight:500}
.ftlegend button[aria-pressed="true"]{background:var(--ink);color:var(--paper);border-color:var(--ink)} .ftlegend button[aria-pressed="true"] small{color:inherit;opacity:.7}
.ftctl{position:absolute;right:216px;bottom:max(16px,env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:6px;z-index:3}
.ftctl button{width:40px;height:40px;border-radius:999px;background:var(--surface);border:1px solid var(--line);font-size:18px;display:grid;place-items:center;box-shadow:0 6px 16px -10px rgba(20,28,41,.4)}
.ftmini{position:absolute;right:16px;bottom:max(16px,env(safe-area-inset-bottom,0px));width:190px;height:120px;border-radius:12px;background:color-mix(in srgb,var(--surface) 88%,transparent);border:1px solid var(--line);box-shadow:0 10px 26px -16px rgba(20,28,41,.5);z-index:3;cursor:crosshair;overflow:hidden;backdrop-filter:blur(6px)}
.ftmini canvas{width:100%;height:100%;display:block}
.fthint{position:absolute;left:50%;bottom:max(18px,env(safe-area-inset-bottom,0px));transform:translateX(-50%);font-size:12px;color:var(--muted);background:color-mix(in srgb,var(--surface) 85%,transparent);border:1px solid var(--line);padding:6px 12px;border-radius:999px;pointer-events:none;z-index:3;white-space:nowrap;transition:opacity .6s}
.fthint.gone{opacity:0}
.ftpanel{border-left:1px solid var(--line);background:var(--surface);overflow-y:auto;padding:22px 22px 36px;display:flex;flex-direction:column;gap:16px;min-width:0}
.ftpanel .big{display:flex;gap:14px;align-items:center}
.ftpanel .big .av{width:72px;height:72px;border-radius:18px;flex:none;display:grid;place-items:center;font-family:var(--display);font-size:30px;color:#fff;background:var(--muted);overflow:hidden}
.ftpanel .big .av img{width:100%;height:100%;object-fit:cover}
.ftpanel h2{font-family:var(--display);font-weight:400;font-size:30px;line-height:1.05;margin:0;text-wrap:balance}
.ftpanel .aka{color:var(--muted);font-size:13px}
.ftpanel h3{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin:6px 0 0}
.ftpanel .linechip{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--muted);margin-top:4px} .ftpanel .linechip i{width:9px;height:9px;border-radius:50%;background:var(--lc)}
.tl{display:flex;flex-direction:column;border-left:2px solid var(--line);margin-left:6px}
.tl div{position:relative;padding:0 0 12px 16px}
.tl div::before{content:"";position:absolute;left:-7px;top:4px;width:12px;height:12px;border-radius:50%;background:var(--surface);border:2px solid var(--gold)}
.tl b{display:block;font-size:13.5px}
.tl span{display:block;font-size:12.5px;color:var(--muted)}
.tl.jobs div::before{border-color:#3D5A80} .tl em{font-style:italic;color:#8A3B3B}
.rel{display:flex;flex-direction:column;gap:6px}
.rel button{display:flex;justify-content:space-between;gap:10px;text-align:left;padding:8px 10px;border-radius:10px;background:var(--chip);font-size:13.5px}
.rel button span{color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
.note{font-size:13.5px;line-height:1.6;white-space:pre-line;color:var(--ink);background:var(--chip);border-radius:12px;padding:12px 14px;max-height:260px;overflow:auto}
.ftstats{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:12.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.vital{font-size:13px;color:var(--muted);line-height:1.45} .vital b{color:var(--ink);font-weight:600}
.fam{display:grid;grid-template-columns:auto 1fr;gap:6px 10px;align-items:baseline;font-size:13.5px}
.fam dt{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);padding-top:3px}
.fam dd{margin:0;display:flex;flex-wrap:wrap;gap:4px 6px}
.fam dd button{padding:3px 9px;border-radius:999px;background:var(--chip);font-size:13px;line-height:1.3}
.fam dd button:hover{background:var(--gold);color:#0A1426}
.bio{font-size:14px;line-height:1.6;margin:0}
.conf{display:inline-flex;gap:3px;vertical-align:middle;margin-left:6px} .conf i{width:6px;height:6px;border-radius:50%;background:var(--line)} .conf i.on{background:var(--gold)}
.recs{display:flex;flex-direction:column;gap:6px}
.recs a{display:grid;grid-template-columns:auto 1fr auto;gap:8px 10px;align-items:start;padding:8px 10px;border-radius:10px;background:var(--chip);text-decoration:none;color:var(--ink);font-size:13px;line-height:1.4}
.recs a:hover{outline:1px solid var(--gold)}
.recs .chip{font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;padding:3px 7px;border-radius:999px;background:var(--surface);border:1px solid var(--line);color:var(--muted);white-space:nowrap;margin-top:1px}
.recs .chip.Grave{color:#7A6B4E} .recs .chip.Obituary,.recs .chip.Newspaper{color:#8A3B3B} .recs .chip.Census{color:#2F5D7C} .recs .chip.Photo{color:#4E7A5A} .recs .chip.Profile{color:#5B4E7A}
.recs .rt{font-weight:600} .recs .rs{display:block;color:var(--muted);font-size:12px;font-weight:400}
.recs .rn{grid-column:2;color:var(--muted);font-size:12px}
.recs .ext{color:var(--muted);font-size:14px}
.more{align-self:flex-start;font-size:13px;color:var(--gold);padding:4px 0}
.strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:2px 0 4px}
.strip button{min-width:0;text-align:left;display:flex;flex-direction:column;gap:4px}
.strip img{width:100%;aspect-ratio:4/3;height:auto;object-fit:cover;border-radius:10px;background:var(--chip)}
.strip.wide{grid-template-columns:repeat(2,minmax(0,1fr))}
.strip span{font-size:11px;color:var(--muted);line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ftpanel{overflow-x:hidden} .ftpanel>*{min-width:0;max-width:100%} .ftpanel .big{overflow:hidden} .ftpanel .vital,.ftpanel .aka,.ftpanel .bio,.recs a,.tl span,.tl b{overflow-wrap:anywhere}
.ovw{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ovw button{display:flex;flex-direction:column;gap:2px;align-items:flex-start;text-align:left;padding:10px 12px;border-radius:12px;background:var(--chip);border-left:4px solid var(--lc)}
.ovw button b{font-size:13.5px} .ovw button small{color:var(--muted);font-size:11.5px;line-height:1.35}
.glb{position:fixed;inset:0;z-index:70;background:rgba(5,8,13,.92);display:grid;grid-template-rows:1fr auto;place-items:center;padding:20px}
.glb img{max-width:min(96vw,1100px);max-height:78vh;border-radius:8px;box-shadow:0 30px 80px -20px #000}
.glb figcaption{color:#F3EEE6;font-size:13.5px;text-align:center;max-width:800px;line-height:1.5;opacity:.85}
.glb button.x{position:absolute;top:14px;right:16px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:22px}
@media (max-width:860px){ .ft{grid-template-columns:1fr;grid-template-rows:max(480px,calc(100svh - var(--barh,58px))) auto;height:auto} .ftpanel{border-left:0;border-top:1px solid var(--line)} .ftrail{display:none} .ftmini{width:120px;height:76px;right:10px;bottom:max(58px,calc(env(safe-area-inset-bottom,0px) + 58px))} .fthead{left:0;top:0;right:0;padding:10px 12px 34px;gap:6px} .fthead h1{font-size:24px} .fthead .eyebrow{display:none} .ftfind{flex:1 1 160px;max-width:260px} .ftfind input{padding:7px 12px} .ftctl{flex-direction:row;right:10px;left:auto;bottom:max(10px,env(safe-area-inset-bottom,0px));gap:4px} .ftctl button{width:38px;height:38px} .ftlegend{left:10px;right:auto;bottom:max(58px,calc(env(safe-area-inset-bottom,0px) + 58px));max-width:70%} .ftlegend button small{display:none} .fthint{display:none} }
@media (pointer:coarse){ .ftctl button{width:44px;height:44px} .ftfind input{font-size:16px} .fam dd button{min-height:36px} }`;
const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

let TREE=null, focus=null, famFocus='F2', FCENTER=null;
const ZMIN=.08, ZMAX=2.4;
const LINES={french:{id:'I1800',name:'French',color:'#C4674A',from:'Syracuse NY · Toledo'},schmitt:{id:'I1811',name:'Schmitt',color:'#5B8E8A',from:'Bavaria · Toledo'},wetzel:{id:'I2489',name:'Wetzel',color:'#5A7FB5',from:'Posen · Napoleon OH'},goodwin:{id:'I2',name:'Goodwin',color:'#8E6AA6',from:'Indiana · Elkhart'},core:{id:null,name:'The family',color:'#E2C27D',from:'Toledo · today'}};
const elbow=(x1,y1,x2,y2)=>{ const my=(y1+y2)/2, r=Math.min(10,Math.abs(x2-x1)/2,Math.abs(y2-y1)/4); if(Math.abs(x2-x1)<1) return `M${x1},${y1} V${y2}`; const d=x2>x1?1:-1; return `M${x1},${y1} V${my-r} Q${x1},${my} ${x1+d*r},${my} H${x2-d*r} Q${x2},${my} ${x2},${my+r} V${y2}` };
const E=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const P=id=>TREE.people[id], F=id=>TREE.fams[id];
const full=p=>[p.title&&!/^(I|II|III|IV|Jr|Sr)$/.test(p.title)?p.title:'',p.g,p.s,p.title&&/^(I|II|III|IV)$/.test(p.title)?p.title:''].filter(Boolean).join(' ').trim()||'Unknown';
const marriedNames=p=>{ if(!TREE||p.sex!=='F') return []; const out=[]; for(const fid of p.fams||[]){ const f=TREE.fams[fid]; const h=f&&f.h&&TREE.people[f.h]; if(h&&h.s&&h.s!==p.s){ const g=(p.g||'').split(' ')[0]; out.push(g+' '+h.s); for(const a of p.aka||[]) out.push(a+' '+h.s) } } return out };
const yrs=p=>(p.by||p.dy)?`${p.by||'?'} – ${p.dy||(p.by&&p.by<1925?'?':'')}`:'';
const place=s=>(s||'').replace(/\s*\(.*\)\s*$/,'');
function parentsOf(id){ const p=P(id); const f=p&&p.famc[0]&&F(p.famc[0]); return f?[f.h,f.w]:[null,null] }
function spouseFams(id){ const p=P(id); return (p&&p.fams||[]).map(fid=>({fid,f:F(fid)})).filter(x=>x.f) }
function childrenOf(id){ return spouseFams(id).flatMap(x=>x.f.c) }
let GEN=null; const gen=id=>(GEN&&GEN.people&&GEN.people[id])||null;
const lifespan=p=>{ if(!p.by||!p.dy) return ''; const a=p.dy-p.by; return a>0&&a<120?` (${a})`:'' };
const fmtD=d=>{ if(!d) return ''; const m={JAN:'Jan',FEB:'Feb',MAR:'Mar',APR:'Apr',MAY:'May',JUN:'Jun',JUL:'Jul',AUG:'Aug',SEP:'Sep',OCT:'Oct',NOV:'Nov',DEC:'Dec'}; return String(d).replace(/\b(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\b/g,x=>m[x]).replace(/^ABT /,'about ') };
function vital(p){ const b=p.b?`b. ${fmtD(p.b)}${p.bp?', '+place(p.bp):''}`:(p.bp?`b. ${place(p.bp)}`:''); const d=p.d?`d. ${fmtD(p.d)}${p.dp?', '+place(p.dp):''}${lifespan(p)}`:(p.dp?`d. ${place(p.dp)}`:(p.by&&p.by<1925?'':'')); return [b,d].filter(Boolean).join(' · ') }
function bookURL(id){ try{ if(typeof T==='undefined'||!T.family20) return ''; return typeof turl==='function'?turl(T.family20,id):'' }catch(e){ return '' } }
function clustersFor(p){ try{ if(typeof FACES==='undefined'||!FACES||!FACES.people) return []; const want=[full(p),p.g+' '+p.s,(p.g||'').split(' ')[0]+' '+p.s,...(p.aka||[]).map(a=>a+' '+p.s),...marriedNames(p)].map(s=>s.toLowerCase().replace(/\s+/g,' ').trim()); return FACES.people.filter(f=>{ const n=(typeof pName==='function'?pName(f.id):'').toLowerCase().replace(/\s*\(.*?\)/g,'').replace(/\s+/g,' ').trim(); return n&&want.includes(n) }).map(f=>f.id) }catch(e){ return [] } }
function portraitFor(p){ const fi=GEN&&GEN.faceImg&&GEN.faceImg[p.id]; if(fi) return {src:fi,kind:'face'}; const fu=faceFor(p); if(fu) return {src:fu,kind:'face'}; const g=GEN&&GEN.portraits&&GEN.portraits[p.id]; if(g!=null){ const u=bookURL(g); if(u) return {src:u,kind:'book'} } return null }
function showImg(src,cap){ const el=document.createElement('figure'); el.className='glb'; el.innerHTML=`<img src="${src}" alt=""><figcaption>${E(cap||'')}</figcaption><button class="x" aria-label="Close">×</button>`; el.onclick=e=>{ if(e.target===el||e.target.classList.contains('x')) el.remove() }; document.body.appendChild(el); el.querySelector('.x').focus() }
function faceFor(p){ try{ if(typeof FACES==='undefined'||!FACES||!FACES.people) return ''; const want=[full(p),p.g+' '+p.s,(p.g||'').split(' ')[0]+' '+p.s,...(p.aka||[]).map(a=>a+' '+p.s),...marriedNames(p)].map(s=>s.toLowerCase().replace(/\s+/g,' ').trim());
  const hit=FACES.people.find(f=>{ const n=(typeof pName==='function'?pName(f.id):'').toLowerCase().replace(/\s*\(.*?\)/g,'').replace(/\s+/g,' ').trim(); return n&&want.includes(n) }); return hit?faceURL(hit,0):'' }catch(e){ return '' } }
// ---- people, lines and cards ----
let LINE={}, GENOF={}, ANC={}, DESC={};
function lineOf(id){ return LINE[id]||'core' }
const firstName=p=>{ const g=(p.g||'').trim(); if(!g) return p.s?'':'Unknown'; const t=p.title&&/^(I|II|III|IV|Jr|Sr)$/.test(p.title)?' '+p.title:''; return g+t };
function card(id,x,y){ const p=P(id); if(!p) return ''; const por=portraitFor(p); const fu=por?por.src:''; const ltr=t=>((t||'').match(/[A-Za-zÀ-ÿ]/)||[''])[0]; const ini=((ltr(p.g)||'?')+ltr(p.s)).toUpperCase(); const L=LINES[lineOf(id)];
  const g=gen(p.id); const n=g?g.recs.length:0; const ph=(GEN&&GEN.bookPhotos&&GEN.bookPhotos[p.id]||[]).length+(g?g.photos.length:0); const dead=p.dy||p.d||(p.by&&p.by<1920); const tip=E(full(p))+(yrs(p)?' · '+E(yrs(p)):'');
  return `<button class="fc ${p.sex==='M'?'m':p.sex==='F'?'f':''} ${dead?'dead':''}" data-id="${p.id}" aria-label="${tip}" title="${tip}" style="left:${x}px;top:${y}px;--lc:${L.color}"><span class="ph">${fu?`<img src="${fu}" alt="" loading="lazy" draggable="false">`:`<i>${E(ini)}</i>`}</span>${GEN&&GEN.facebook&&GEN.facebook[p.id]?'<span class="fb" title="On Facebook">f</span>':''}<span class="tk">${E((firstName(p).replace(/[()]/g,'').split(/\s+/)[0])||'')}</span><span class="nm">${E(firstName(p))}</span><span class="sn">${E(p.s||'')}</span><span class="yr">${E(yrs(p))||'&nbsp;'}</span>${p.bp?`<span class="pl">${E(place(p.bp))}</span>`:''}${(n||ph)?`<span class="bd">${ph?`<em class="pc" title="${ph} photo${ph>1?'s':''}">${ph}</em>`:''}${n?`<em title="${n} record${n>1?'s':''}">${n}</em>`:''}</span>`:''}</button>` }
function famPanel(root){ const f=F(famFocus), h=P(f.h), w=P(f.w); const N=Object.keys(TREE.people).length; const years=Object.values(TREE.people).map(p=>p.by).filter(Boolean); const y0=Math.min(...years);
  const gens=Math.max(...Object.values(GENOF).map(g=>-g));
  const withRecs=GEN&&GEN.people?Object.keys(GEN.people).filter(id=>P(id)&&GEN.people[id].recs&&GEN.people[id].recs.length).length:0;
  const lineBtn=k=>{ const L=LINES[k]; const n=Object.keys(LINE).filter(id=>LINE[id]===k).length; const top=Object.keys(LINE).filter(id=>LINE[id]===k).map(id=>P(id)).filter(p=>p.by).sort((a,b)=>a.by-b.by)[0]; return `<button data-line="${k}" style="--lc:${L.color}"><b>${E(L.name)} line</b><small>${n} people · ${E(L.from)}${top?` · back to ${top.by}`:''}</small></button>` };
  root.querySelector('.ftpanel').innerHTML=`<div><div class="eyebrow">The French family</div><h2>${E(h?full(h):'')} &amp; ${E(w?full(w):'')}</h2><div class="aka">${E([f.md?'Married '+fmtD(f.md):'',f.mp].filter(Boolean).join(' · ')||'')}</div></div>
    <p style="margin:0;color:var(--muted);font-size:13.5px;line-height:1.55">${N} people across ${gens} generations, from ${y0} to today, on one sheet. Scroll to zoom, drag to move, tap anyone to light up their bloodline, double-tap to fly in. The four colours are the four grandparent lines.</p>
    <h3>The four lines</h3><div class="ovw">${['french','schmitt','wetzel','goodwin'].map(lineBtn).join('')}</div>
    ${rel([f.h,f.w],'Parents')}${rel(f.c,'Children')}
    <div class="ftstats"><span>${withRecs} people with records</span><span>${Object.keys(TREE.fams).length} marriages</span></div>`;
  root.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>refocus(root,b.dataset.go));
  root.querySelectorAll('[data-line]').forEach(b=>b.onclick=()=>{ flyToLine(root,b.dataset.line) }) }
function countAnc(id,seen=new Set()){ const [h,w]=parentsOf(id); for(const x of [h,w]) if(x&&!seen.has(x)){ seen.add(x); countAnc(x,seen) } return seen.size }
function lifeEvents(p){ const evs=[...(p.ev||[])]; for(const {f} of spouseFams(p.id)) if(f.md||f.mp){ const sp=P(f.h===p.id?f.w:f.h); evs.push({t:'Married'+(sp?' '+full(sp):''),d:f.md,p:f.mp,y:(f.md||'').match(/\d{4}/)?+(f.md.match(/\d{4}/)[0]):null}) }
  const ord=t=>t==='Buried'?1:0; return evs.sort((a,b)=>((a.y||9999)-(b.y||9999))||(ord(a.t)-ord(b.t))) }
function rel(ids,label){ ids=ids.filter(id=>id&&P(id)); if(!ids.length) return ''; return `<h3>${label}</h3><div class="rel">${ids.map(id=>{const q=P(id); return `<button data-go="${q.id}">${E(full(q))}<span>${E(yrs(q))}</span></button>`}).join('')}</div>` }
function panel(root){ if(famFocus) return famPanel(root); const p=P(focus); const por=portraitFor(p); const [h,w]=parentsOf(focus); const sps=spouseFams(focus).map(x=>x.f.h===focus?x.f.w:x.f.h);
  const sibs=p.famc[0]&&F(p.famc[0])?F(p.famc[0]).c.filter(c=>c!==focus):[]; const g=gen(focus); const bp=(GEN&&GEN.bookPhotos&&GEN.bookPhotos[focus])||[];
  const famRow=(label,ids)=>{ ids=ids.filter(id=>id&&P(id)); return ids.length?`<dt>${label}</dt><dd>${ids.map(id=>`<button data-go="${id}">${E(full(P(id)))}</button>`).join('')}</dd>`:'' };
  const recs=g?g.recs:[]; const conf=g?{high:3,medium:2,low:1}[g.conf]||2:0;
  const recHTML=r=>`<a href="${E(r.url)}" target="_blank" rel="noopener"><span class="chip ${r.t}">${E(r.t)}</span><span><span class="rt">${E(r.title||r.src||'Record')}</span><span class="rs">${E([r.src,r.date].filter(Boolean).join(' · '))}</span></span><span class="ext">↗</span>${r.note?`<span class="rn">${E(r.note)}</span>`:''}</a>`;
  root.querySelector('.ftpanel').innerHTML=`<div class="big"><span class="av ${por&&por.kind==='book'?'':''}" style="background:${p.sex==='M'?'#3D5A80':p.sex==='F'?'#9C5A6B':'var(--muted)'}">${por?`<img src="${por.src}" alt="">`:E((p.g||'?')[0])}</span>
    <div><h2>${E(full(p))}</h2>${(p.aka&&p.aka.length)||marriedNames(p).length?`<div class="aka">${[...(p.aka||[]).map(a=>'“'+a+'”'),...marriedNames(p).map(n=>'Mrs '+n.split(' ').slice(-1)[0]+' · '+n)].map(E).join(' · ')}</div>`:''}<div class="vital">${E(vital(p))||E(yrs(p))}</div></div></div>${GEN&&GEN.facebook&&GEN.facebook[p.id]?`<a class="fbbtn" href="${E(GEN.facebook[p.id])}" target="_blank" rel="noopener"><i>f</i>View on Facebook ↗</a>`:''}
    <dl class="fam">${famRow('Parents',[h,w])}${famRow(sps.length>1?'Spouses':'Spouse',sps)}${famRow('Children',childrenOf(focus))}${famRow('Siblings',sibs)}</dl>
    ${g&&g.bio?`<h3>Their story <span class="conf" title="How well the records support this">${[1,2,3].map(k=>`<i class="${k<=conf?'on':''}"></i>`).join('')}</span></h3><p class="bio">${E(g.bio)}</p>`:''}
    <h3>Life</h3><div class="tl">${lifeEvents(p).map(e=>`<div><b>${E(e.t)}${e.v&&e.t==='Occupation'?': '+E(e.v):''}</b><span>${E([fmtD(e.d),e.p].filter(Boolean).join(' · ')||'Date not recorded')}</span></div>`).join('')||'<div><span>No events recorded</span></div>'}</div>
    ${p.addr?`<div class="aka">Address: ${E(p.addr.replace(/,\s*,/g,','))}</div>`:''}
    ${(()=>{ const films=typeof filmsFor==='function'?filmsFor(clustersFor(p),p.by,p.dy):[]; return films.length?`<h3>On film</h3><div class="mvmore">${films.map(f=>`<a href="#movie-${f.m.id}">${E(f.m.title)}<span>${f.m.y0===f.m.y1?f.m.y0:f.m.y0+' – '+f.m.y1} · first seen ${Math.floor(f.first/60)}:${String(Math.round(f.first%60)).padStart(2,'0')}</span></a>`).join('')}</div>`:'' })()}
    ${(GEN&&GEN.jobs&&GEN.jobs[focus]||[]).length?`<h3>Work &amp; positions</h3><div class="tl jobs">${GEN.jobs[focus].map(j=>`<div><b>${E(j.title)}${j.org?' · '+E(j.org):''}</b><span>${E([[j.from,j.to].filter(Boolean).join(' – '),j.place].filter(Boolean).join(' · '))}${(j.note+' '+j.source)&&/confirm|unlabeled|assigned|self-reported/i.test(j.note+' '+j.source)?' · <em>needs family confirmation</em>':''}</span></div>`).join('')}</div>`:''}
    ${bp.length?`<h3>In the family album</h3><div class="strip" id="ftbook">${bp.slice(0,9).map((id,k)=>`<button data-bk="${k}"><img alt="" data-id="${id}"><span>Loading…</span></button>`).join('')}</div>`:''}
    ${g&&g.photos.length?`<h3>Their world · period photographs</h3><div class="strip wide">${g.photos.map(ph=>{ const im=GEN.images[ph.h]; return im?`<button data-img="${E(im.file)}" data-cap="${E(ph.cap+' — '+im.credit)}"><img src="${E(im.file)}" alt="" loading="lazy" onerror="this.closest('button').remove()"><span>${E(ph.cap)}</span></button>`:'' }).join('')}</div>`:''}
    ${recs.length?`<h3>Records &amp; sources · ${recs.length}</h3><div class="recs" id="ftrecs">${recs.slice(0,5).map(recHTML).join('')}</div>${recs.length>5?`<button class="more" id="ftmore">Show all ${recs.length} records</button>`:''}`:(p.dy||p.by&&p.by<1940?`<h3>Records &amp; sources</h3><p class="aka">No online records gathered yet for this person.</p>`:'')}
    ${(()=>{ const TI=(GEN&&GEN.toledo_images)||[]; if(!TI.length) return ''; const hay=((p.addr||'')+' '+(p.ev||[]).map(e=>e.p||'').join(' ')+' '+((GEN.jobs&&GEN.jobs[focus])||[]).map(j=>j.org+' '+j.title).join(' ')).toLowerCase(); const keys=[['libbey','libbey'],['westminster','westminster'],['zion','zion'],['edison','edison'],['auto-lite','auto-lite'],['auto lite','auto-lite'],['new york central','new york central'],['railroad','new york central'],['colburn','colburn'],['wildwood','wildwood'],['orchard','orchard']]; const hits=TI.filter(t=>keys.some(([k,subj])=>hay.includes(k)&&t.subject.toLowerCase().includes(subj))).slice(0,6); return hits.length?`<h3>Toledo library photographs</h3><div class="recs">${hits.map(t=>`<a href="${E(t.url)}" target="_blank" rel="noopener"><span class="chip Photo">Photo</span><span><span class="rt">${E(t.subject)}</span><span class="rs">Toledo Lucas County Public Library · view on Ohio Memory</span></span><span class="ext">↗</span></a>`).join('')}</div>`:'' })()}
    ${(p.notes||[]).map(n=>`<h3>Notes</h3><div class="note">${E(n)}</div>`).join('')}
    <div class="ftstats"><span>${countAnc(focus)} known ancestors</span>${g?`<span>Research gathered Oct 2026</span>`:''}</div>`;
  root.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>refocus(root,b.dataset.go));
  root.querySelectorAll('[data-img]').forEach(b=>b.onclick=()=>showImg(b.dataset.img,b.dataset.cap));
  const more=root.querySelector('#ftmore'); if(more) more.onclick=()=>{ root.querySelector('#ftrecs').innerHTML=recs.map(recHTML).join(''); more.remove() };
  if(bp.length&&typeof T!=='undefined'&&T.family20&&typeof ensureThumbs==='function'){ const t=T.family20; ensureThumbs(t).then(()=>{ if(focus!==p.id) return; const strip=root.querySelector('#ftbook'); if(!strip) return; const caps=id=>{ for(const s of t.sections) for(const gr of (s.groups||[])) if((gr[0]||[]).includes(id)) return (gr[1]||'').replace(/^\|/,'').replace(/\|$/,'').replace(/\|/g,' · ')||s.title||''; return '' };
      strip.querySelectorAll('button').forEach((b,k)=>{ const id=bp[k]; if(id==null) return; const im=b.querySelector('img'); im.src=(typeof turl==="function"?turl:purl)(t,id); b.querySelector('span').textContent=caps(id)||'The French Family'; b.onclick=()=>{ if(typeof openLB==='function') openLB(t,bp.map(x=>({id:x,where:'The French Family'})),k) } }) }).catch(()=>{}) } }
// ---- graph: generations, marriage chains ("blocks"), bloodlines ----
const W=176,H=206,GC=26,GX=40,GY=120;
let BLOCKS=[],ROWS={},GENS=[],BLOCKOF={},PX={},ROWY={},BBOX=null,LINLAB=[],TF=d3.zoomIdentity,Z=null,RAIL=[];
function buildGraph(){
  GENOF={}; const f2=F('F2'); const q=[]; [f2.h,f2.w].filter(id=>id&&P(id)).forEach(id=>{ GENOF[id]=0; q.push(id) });
  while(q.length){ const id=q.shift(), p=P(id), g=GENOF[id];
    for(const fid of p.famc||[]){ const f=F(fid); if(!f) continue; for(const par of [f.h,f.w]) if(par&&P(par)&&!(par in GENOF)){ GENOF[par]=g-1; q.push(par) } for(const s of f.c) if(P(s)&&!(s in GENOF)){ GENOF[s]=g; q.push(s) } }
    for(const fid of p.fams||[]){ const f=F(fid); if(!f) continue; for(const sp of [f.h,f.w]) if(sp&&P(sp)&&!(sp in GENOF)){ GENOF[sp]=g; q.push(sp) } for(const c of f.c) if(P(c)&&!(c in GENOF)){ GENOF[c]=g+1; q.push(c) } } }
  for(const id in TREE.people) if(!(id in GENOF)){ const p=P(id); GENOF[id]=p.by?Math.round((p.by-1946)/30):0 }
  // bloodlines: each grandparent line = that grandparent and every ancestor of theirs; then spouses/siblings inherit; the family itself is "core"
  LINE={}; const mark=(start,key)=>{ if(!P(start)) return; const seen=new Set([start]), st=[start]; while(st.length){ const id=st.pop(); LINE[id]=LINE[id]||key; const [h,w]=parentsOf(id); for(const x of [h,w]) if(x&&P(x)&&!seen.has(x)){ seen.add(x); st.push(x) } } };
  for(const k of ['french','schmitt','wetzel','goodwin']) mark(LINES[k].id,k);
  let changed=true, guard=0; while(changed&&guard++<50){ changed=false; for(const id in TREE.people){ if(LINE[id]) continue; const p=P(id); let k=null;
      for(const fid of p.famc||[]){ const f=F(fid); if(!f) continue; k=k||LINE[f.h]||LINE[f.w]||f.c.map(c=>LINE[c]).find(Boolean) }
      for(const fid of p.fams||[]){ const f=F(fid); if(!f) continue; const sp=f.h===id?f.w:f.h; k=k||LINE[sp]||f.c.map(c=>LINE[c]).find(Boolean) }
      if(k){ LINE[id]=k; changed=true } } }
  for(const id in TREE.people){ if(GENOF[id]>=0) LINE[id]='core'; if(!LINE[id]) LINE[id]='core' }
  // marriage chains: spouses of the same generation share a block (a person with two spouses sits between them)
  const par={}; const find=x=>par[x]===x?x:(par[x]=find(par[x])); for(const id in TREE.people) par[id]=id;
  for(const fid in TREE.fams){ const f=F(fid); if(f.h&&f.w&&P(f.h)&&P(f.w)&&GENOF[f.h]===GENOF[f.w]) par[find(f.h)]=find(f.w) }
  const groups={}; for(const id in TREE.people){ const r=find(id); (groups[r]=groups[r]||[]).push(id) }
  const chain=ids=>{ if(ids.length===1) return ids; const adj={}; ids.forEach(i=>adj[i]=[]); for(const id of ids) for(const {f} of spouseFams(id)){ const sp=f.h===id?f.w:f.h; if(sp&&ids.includes(sp)&&!adj[id].includes(sp)) adj[id].push(sp) }
    let start=ids.find(i=>adj[i].length===1)||ids[0]; if(ids.length===2&&P(ids[0]).sex!=='M'&&P(ids[1]).sex==='M') start=ids[1]; else if(ids.length===2) start=P(ids[0]).sex==='M'?ids[0]:(P(ids[1]).sex==='M'?ids[1]:ids[0]);
    const out=[start], seen=new Set(out); while(out.length<ids.length){ const cur=out[out.length-1]; const nx=adj[cur].find(x=>!seen.has(x))||ids.find(x=>!seen.has(x)); seen.add(nx); out.push(nx) } return out };
  BLOCKS=Object.values(groups).map(ids=>{ const c=chain(ids); return {ids:c,gen:GENOF[c[0]],x:0,w:c.length*W+(c.length-1)*GC} });
  BLOCKOF={}; BLOCKS.forEach(b=>b.ids.forEach(id=>BLOCKOF[id]=b));
  // initial ordering: walk the pedigree up from the family (father's side first, siblings beside), then down
  ROWS={}; const placed=new Set();
  const put=(b,after)=>{ if(placed.has(b)) return; placed.add(b); const r=ROWS[b.gen]=ROWS[b.gen]||[]; const i=after?r.indexOf(after):-1; if(i>=0) r.splice(i+1,0,b); else r.push(b) };
  const up=b=>{ for(const id of b.ids){ const [h,w]=parentsOf(id); const pb=(h&&BLOCKOF[h])||(w&&BLOCKOF[w]); if(!pb) continue; const fresh=!placed.has(pb); put(pb);
      const fam=P(id).famc[0]&&F(P(id).famc[0]); if(fam){ let prev=b; for(const s of fam.c){ const sb=BLOCKOF[s]; if(sb&&sb!==b&&!placed.has(sb)){ put(sb,prev); prev=sb } } }
      if(fresh) up(pb) } };
  const down=b=>{ for(const id of b.ids) for(const {f} of spouseFams(id)){ let prev=null; for(const c of f.c){ const cb=BLOCKOF[c]; if(!cb) continue; const fresh=!placed.has(cb); put(cb,prev); prev=cb; if(fresh) down(cb) } } };
  const root=BLOCKOF[f2.h]||BLOCKOF[f2.w]; put(root); up(root); down(root);
  for(const b of BLOCKS) if(!placed.has(b)){ put(b); up(b); down(b) }
  GENS=Object.keys(ROWS).map(Number).sort((a,b)=>a-b);
  // barycenter sweeps to untangle
  const nbUp=b=>{ const o=[]; for(const id of b.ids){ const [h,w]=parentsOf(id); for(const x of [h,w]) if(x&&BLOCKOF[x]) o.push(BLOCKOF[x]) } return o };
  const nbDown=b=>{ const o=[]; for(const id of b.ids) for(const {f} of spouseFams(id)) for(const c of f.c) if(BLOCKOF[c]) o.push(BLOCKOF[c]); return o };
  const frac=new Map(); const refrac=g=>{ const r=ROWS[g]; r.forEach((b,i)=>frac.set(b,r.length>1?i/(r.length-1):.5)) }; GENS.forEach(refrac);
  for(let it=0;it<8;it++){ const dirs=it%2===0?GENS:[...GENS].reverse(); for(const g of dirs){ const r=ROWS[g]; if(r.length<2) continue; const key=new Map();
      r.forEach(b=>{ const nb=(it%2===0?nbUp(b):nbDown(b)).map(x=>frac.get(x)).filter(v=>v!=null); key.set(b,nb.length?nb.reduce((a,c)=>a+c,0)/nb.length:frac.get(b)) });
      r.sort((a,b)=>key.get(a)-key.get(b)); refrac(g) } }
  // vertical positions
  ROWY={}; GENS.forEach((g,i)=>ROWY[g]=i*(H+GY));
  // horizontal positions: priority layout with an exact no-overlap fit per row
  GENS.forEach(g=>{ const r=ROWS[g]; const tot=r.reduce((s,b)=>s+b.w,0)+(r.length-1)*GX; let x=-tot/2; r.forEach(b=>{ b.x=x; x+=b.w+GX }) });
  const cx=id=>{ const b=BLOCKOF[id]; return b.x+b.ids.indexOf(id)*(W+GC)+W/2 };
  const famMid=f=>{ const xs=[f.h,f.w].filter(id=>id&&P(id)).map(cx); return xs.length?xs.reduce((a,c)=>a+c,0)/xs.length:null };
  const upT=b=>{ const v=[]; for(const id of b.ids) for(const fid of P(id).famc||[]){ const f=F(fid); if(!f) continue; const m=famMid(f); if(m!=null) v.push(m-(cx(id)-(b.x+b.w/2))) } return v.length?v.reduce((a,c)=>a+c,0)/v.length:null };
  const dnT=b=>{ const v=[]; for(const id of b.ids) for(const {f} of spouseFams(id)){ const kids=f.c.filter(c=>BLOCKOF[c]).map(cx); if(kids.length){ const m=kids.reduce((a,c)=>a+c,0)/kids.length; const mid=famMid(f); v.push(m-((mid!=null?mid:cx(id))-(b.x+b.w/2))) } } return v.length?v.reduce((a,c)=>a+c,0)/v.length:null };
  const fitRow=(r,des)=>{ const n=r.length; let acc=0; const y=[]; for(let i=0;i<n;i++){ const c=des[i]==null?r[i].x+r[i].w/2:des[i]; y.push(c-r[i].w/2-acc); acc+=r[i].w+GX }
    const st=[]; for(let i=0;i<n;i++){ let nb={s:y[i],c:1}; while(st.length&&st[st.length-1].s/st[st.length-1].c>nb.s/nb.c){ const p=st.pop(); nb={s:p.s+nb.s,c:p.c+nb.c} } st.push(nb) }
    const fit=[]; for(const b of st){ const v=b.s/b.c; for(let k=0;k<b.c;k++) fit.push(v) } acc=0; for(let i=0;i<n;i++){ r[i].x=fit[i]+acc; acc+=r[i].w+GX } };
  for(let it=0;it<14;it++){ const dirs=it%2===0?GENS:[...GENS].reverse(); for(const g of dirs){ const r=ROWS[g]; const des=r.map(b=>{ const u=upT(b), d=dnT(b); if(it>=8){ if(u!=null&&d!=null) return (u+d)/2; return u!=null?u:d } return it%2===0?(u!=null?u:d):(d!=null?d:u) }); fitRow(r,des) } }
  PX={}; for(const id in TREE.people) PX[id]=[cx(id)-W/2,ROWY[GENOF[id]]];
  const xs=Object.values(PX).map(p=>p[0]), ys=Object.values(PX).map(p=>p[1]); BBOX=[Math.min(...xs),Math.min(...ys),Math.max(...xs)+W,Math.max(...ys)+H];
  // rail labels: generation names relative to the family, with the median birth year
  const gname=g=>g===0?'The family':g===1?'Children':g===2?'Grandchildren':g===3?'Great-grandchildren':g===-1?'Parents':g===-2?'Grandparents':g===-3?'Great-grandparents':`${-g-2}× great-grandparents`;
  RAIL=GENS.map(g=>{ const ys=ROWS[g].flatMap(b=>b.ids).map(id=>P(id).by).filter(Boolean).sort((a,b)=>a-b); const med=ys.length?ys[Math.floor(ys.length/2)]:null; return {y:ROWY[g]+H/2,label:gname(g),yr:med?`b. ~${med}`:''} });
  // bloodline labels sit above the oldest row of each line
  LINLAB=['french','schmitt','wetzel','goodwin'].map(k=>{ const ids=Object.keys(LINE).filter(id=>LINE[id]===k); if(!ids.length) return null; const top=Math.min(...ids.map(id=>GENOF[id])); const tops=ids.filter(id=>GENOF[id]<=top+1); const x=tops.reduce((s,id)=>s+PX[id][0]+W/2,0)/tops.length; return {k,x,y:ROWY[top]-30,n:ids.length} }).filter(Boolean);
}
// ---- drawing ----
const elbowV=(x1,y1,x2,y2)=>{ const my=(y1+y2)/2, r=Math.min(12,Math.abs(x2-x1)/2,Math.abs(y2-y1)/4); if(Math.abs(x2-x1)<1) return `M${x1},${y1} V${y2}`; const d=x2>x1?1:-1; return `M${x1},${y1} V${my-r} Q${x1},${my} ${x1+d*r},${my} H${x2-d*r} Q${x2},${my} ${x2},${my+r} V${y2}` };
function edges(){ const out=[]; for(const fid in TREE.fams){ const f=F(fid); const h=f.h&&P(f.h)?f.h:null, w=f.w&&P(f.w)?f.w:null; if(!h&&!w) continue;
    let mid=null, y0=null;
    if(h&&w){ const [hx,hy]=PX[h],[wx,wy]=PX[w]; const same=BLOCKOF[h]===BLOCKOF[w]&&Math.abs(BLOCKOF[h].ids.indexOf(h)-BLOCKOF[h].ids.indexOf(w))===1;
      if(same){ const l=Math.min(hx,wx)+W, r=Math.max(hx,wx); out.push(`<path class="bar" data-f="${fid}" d="M${l},${hy+H/2} H${r}"/>`); mid=(l+r)/2; y0=hy+H/2; if(f.md){ const y4=String(f.md).match(/\d{4}/); out.push(`<span class="mlab" data-f="${fid}" style="left:${mid}px;top:${y0}px">m. ${E(y4?y4[0]:f.md)}</span>`) } }
      else { out.push(`<path class="bar" data-f="${fid}" d="${elbowV(hx+W/2,hy+H,wx+W/2,wy)}"/>`); mid=(hx+wx)/2+W/2; y0=Math.max(hy,wy)+H } }
    else { const [x,y]=PX[h||w]; mid=x+W/2; y0=y+H }
    const kids=f.c.filter(c=>P(c)); if(!kids.length) continue;
    const kys=kids.map(c=>PX[c][1]); const bus=Math.min(...kys)-GY*.42; const kxs=kids.map(c=>PX[c][0]+W/2);
    let d=`M${mid},${y0} V${bus}`; const lo=Math.min(mid,...kxs), hi=Math.max(mid,...kxs); if(hi-lo>1) d+=` M${lo},${bus} H${hi}`; kids.forEach((c,i)=>{ d+=` M${kxs[i]},${bus} V${kys[i]}` });
    out.push(`<path class="line" data-f="${fid}" d="${d}"/>`) }
  return out }
function draw(root){ const w=root.querySelector('.ftworld'); const parts=edges(); const paths=parts.filter(s=>s.startsWith('<path')).join(''), labs=parts.filter(s=>!s.startsWith('<path')).join('');
  const cards=Object.keys(TREE.people).map(id=>card(id,PX[id][0],PX[id][1])).join('');
  const lins=LINLAB.map(l=>`<div class="lin" style="left:${l.x}px;top:${l.y}px;--lc:${LINES[l.k].color}"><small>${l.n} people</small>The ${E(LINES[l.k].name)} line</div>`).join('');
  w.innerHTML=`<svg width="1" height="1">${paths}</svg>${labs}${lins}${cards}`;
  w.querySelectorAll('.fc').forEach(b=>{ b.onclick=e=>{ if(e.detail>1) return; refocus(root,b.dataset.id) }; b.ondblclick=e=>{ e.preventDefault(); e.stopPropagation(); if(focus!==b.dataset.id) refocus(root,b.dataset.id); flyTo(root,b.dataset.id,Math.max(1.1,TF.k)) } });
  applySel(root) }
function refreshFaces(root){ root.querySelectorAll('.fc').forEach(b=>{ const p=P(b.dataset.id); if(!p) return; const por=portraitFor(p); const av=b.querySelector('.ph'); const cur=av.querySelector('img'); if(por&&(!cur||cur.getAttribute('src')!==por.src)) av.innerHTML=`<img src="${por.src}" alt="" loading="lazy" draggable="false">` }) }
function applyT(root){ const w=root.querySelector('.ftworld'); if(!w) return; const k=TF.k; w.style.transform=`translate(${TF.x}px,${TF.y}px) scale(${k})`; w.dataset.lod=k>=.62?2:k>=.3?1:0; w.dataset.nm=k>=.22?1:0; w.style.setProperty('--ik',Math.min(1/k,5).toFixed(3));
  const rail=root.querySelector('.ftrail'); if(rail){ const sh=root.querySelector('.ftstage').clientHeight; const step=Math.max(1,Math.ceil(48/((H+GY)*k))); rail.innerHTML=RAIL.map((r,i)=>{ const y=TF.y+r.y*k; if(y<-20||y>sh+20||i%step) return ''; return `<span style="top:${y}px">${E(r.label)}<i>${E(r.yr)}</i></span>` }).join('') } }
function drawMini(root){ const c=root.querySelector('.ftmini canvas'); if(!c||!BBOX) return; const dpr=devicePixelRatio||1, cw=c.clientWidth, ch=c.clientHeight; if(c.width!==cw*dpr){ c.width=cw*dpr; c.height=ch*dpr } const g=c.getContext('2d'); g.setTransform(dpr,0,0,dpr,0,0); g.clearRect(0,0,cw,ch);
  const bw=BBOX[2]-BBOX[0], bh=BBOX[3]-BBOX[1], s=Math.min((cw-12)/bw,(ch-12)/bh), ox=(cw-bw*s)/2-BBOX[0]*s, oy=(ch-bh*s)/2-BBOX[1]*s; root._mini={s,ox,oy};
  const lit=root._lit; for(const id in PX){ const [x,y]=PX[id]; g.fillStyle=LINES[lineOf(id)].color; g.globalAlpha=lit&&!lit.has(id)?.25:1; g.fillRect(ox+x*s,oy+y*s,Math.max(2,W*s),Math.max(2,H*s)) }
  g.globalAlpha=1; const st=root.querySelector('.ftstage'); const vx=-TF.x/TF.k, vy=-TF.y/TF.k, vw=st.clientWidth/TF.k, vh=st.clientHeight/TF.k; g.strokeStyle=getComputedStyle(root).getPropertyValue('--gold')||'#E2C27D'; g.lineWidth=1.5; g.strokeRect(ox+vx*s,oy+vy*s,vw*s,vh*s); g.fillStyle='rgba(226,194,125,.12)'; g.fillRect(ox+vx*s,oy+vy*s,vw*s,vh*s) }
// ---- camera ----
function stageOf(root){ return root.querySelector('.ftstage') }
function go(root,t,ms){ const s=d3.select(stageOf(root)); if(ms===0){ s.call(Z.transform,t); return } s.transition().duration(ms||750).ease(d3.easeCubicInOut).call(Z.transform,t) }
function fitBox(root,box,pad,ms,kmax){ const st=stageOf(root), sw=st.clientWidth, sh=st.clientHeight; const bw=box[2]-box[0], bh=box[3]-box[1]; const top=pad.top||120, side=pad.side||60, bot=pad.bottom||80;
  const k=Math.max(ZMIN,Math.min(kmax||1.15,(sw-side*2)/bw,(sh-top-bot)/bh)); const x=side+(sw-side*2)/2-(box[0]+bw/2)*k, y=top+(sh-top-bot)/2-(box[1]+bh/2)*k; go(root,d3.zoomIdentity.translate(x,y).scale(k),ms) }
function fitAll(root,ms){ fitBox(root,[BBOX[0],BBOX[1]-70,BBOX[2],BBOX[3]],{top:110,side:40,bottom:90},ms) }
function fitFamily(root,ms){ const f=F('F2'); const S=new Set([...bloodline(f.h),...bloodline(f.w)]); const ids=[...S].filter(id=>PX[id]&&GENOF[id]>=-1&&GENOF[id]<=1); fitBox(root,boxOf(ids.length?ids:Object.keys(PX)),{top:120,side:60,bottom:90},ms,1.05) }
function boxOf(ids){ const xs=ids.map(id=>PX[id][0]), ys=ids.map(id=>PX[id][1]); return [Math.min(...xs),Math.min(...ys),Math.max(...xs)+W,Math.max(...ys)+H] }
function flyTo(root,id,k,ms){ if(!PX[id]) return; const st=stageOf(root), sw=st.clientWidth, sh=st.clientHeight; const [x,y]=PX[id]; k=k||Math.max(TF.k,.95); go(root,d3.zoomIdentity.translate(sw/2-(x+W/2)*k,sh/2+20-(y+H/2)*k).scale(k),ms) }
function flyToLine(root,k){ const ids=Object.keys(LINE).filter(id=>LINE[id]===k); if(!ids.length) return; root._lineOn=root._lineOn===k?null:k; root.querySelectorAll('[data-line]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.line===root._lineOn)));
  if(root._lineOn){ root._lit=new Set(ids); root._litFam=null; fitBox(root,boxOf(ids),{top:150,side:60,bottom:90},800,.9) } else { root._lit=null; fitAll(root,700) } applySel(root) }
function showPanel(root){ panel(root); const L=focus&&LINES[lineOf(focus)]; const big=root.querySelector('.ftpanel .big>div'); if(big&&L) big.insertAdjacentHTML('beforeend',`<div class="linechip" style="--lc:${L.color}"><i></i>${L.id?E(L.name)+' line':'The family'}</div>`) }
// ---- selection: light up a bloodline ----
function bloodline(id){ const S=new Set([id]); const up=x=>{ const [h,w]=parentsOf(x); for(const y of [h,w]) if(y&&P(y)&&!S.has(y)){ S.add(y); up(y) } }; const dn=x=>{ for(const c of childrenOf(x)) if(P(c)&&!S.has(c)){ S.add(c); dn(c) } }; up(id); dn(id); for(const {f} of spouseFams(id)){ const sp=f.h===id?f.w:f.h; if(sp&&P(sp)) S.add(sp) } return S }
function applySel(root){ const w=root.querySelector('.ftworld'); if(!w) return; const S=root._lit; w.classList.toggle('sel',!!S);
  w.querySelectorAll('.fc').forEach(b=>{ b.classList.toggle('lit',!!S&&S.has(b.dataset.id)); b.classList.toggle('focus',b.dataset.id===focus) });
  w.querySelectorAll('[data-f]').forEach(el=>{ let on=false; if(S){ const f=F(el.dataset.f); const hs=[f.h,f.w].filter(x=>x&&S.has(x)).length, ks=f.c.filter(c=>S.has(c)).length; on=el.classList.contains('bar')?(hs===2||(focus&&(f.h===focus||f.w===focus))):(hs>0&&ks>0) } el.classList.toggle('lit',on) });
  drawMini(root) }
function select(root,id,fly){ focus=id; famFocus=null; root._lineOn=null; root.querySelectorAll('[data-line]').forEach(b=>b.setAttribute('aria-pressed','false')); root._lit=bloodline(id); applySel(root); showPanel(root); if(fly){ const st=stageOf(root); const [x,y]=PX[id]; const sx=TF.x+(x+W/2)*TF.k, sy=TF.y+(y+H/2)*TF.k; const vis=sx>80&&sx<st.clientWidth-80&&sy>140&&sy<st.clientHeight-80; if(TF.k<.6||!vis) flyTo(root,id,Math.max(TF.k,.95)) } }
function deselect(root,fit){ focus=null; famFocus='F2'; root._lit=null; root._lineOn=null; root.querySelectorAll('[data-line]').forEach(b=>b.setAttribute('aria-pressed','false')); applySel(root); famPanel(root); if(fit) fitAll(root,800) }
let TRAIL=[];
function refocus(root,id){ if(!P(id)) return; if(location.hash!=='#tree-'+id){ TRAIL.push(location.hash.slice(1)||'tree'); if(TRAIL.length>60) TRAIL.shift(); location.hash='tree-'+id; return } select(root,id,true) }
window.treeBack=function(){ while(TRAIL.length){ const h=TRAIL.pop(); if(h!==location.hash.slice(1)){ location.hash=h; return true } } return false };
// ---- mount ----
window.familyTree=async function(app,id){
  const ex=app.querySelector('.ft'); if(ex&&ex._mounted&&TREE){ if(id&&P(id)) select(ex,id,true); else deselect(ex,true); return }
  app.innerHTML=`<section class="ft"><div class="ftstage" id="fts" tabindex="0" aria-label="Family tree. Scroll to zoom, drag to move. Arrow keys move between relatives, plus and minus zoom, 0 fits everyone, H returns to the whole family."><div class="ftworld" data-lod="2"></div>
     <div class="fthead"><div class="ttl"><div class="eyebrow">The French family · every line on one sheet</div><h1>Family Tree</h1></div>
     <div class="ftfind"><input id="ftq" type="search" placeholder="Find anyone in the tree" autocomplete="off" aria-label="Find a person"><div class="ftres" id="ftr" hidden></div></div></div>
     <div class="ftrail" aria-hidden="true"></div>
     <div class="ftlegend" role="group" aria-label="Bloodlines">${['french','schmitt','wetzel','goodwin'].map(k=>`<button data-line="${k}" aria-pressed="false" style="--lc:${LINES[k].color}"><i></i>${LINES[k].name}<small></small></button>`).join('')}</div>
     <div class="ftmini" aria-hidden="true"><canvas></canvas></div>
     <div class="fthint">Scroll to zoom · drag to move · tap a person · double-tap to fly in</div>
     <div class="ftctl"><button id="ftfit" aria-label="Fit everyone" title="Everyone (0)">⤢</button><button id="ftin" aria-label="Zoom in">+</button><button id="ftout" aria-label="Zoom out">−</button><button id="fthome" aria-label="Back to the family" title="The family (H)">⌂</button></div></div>
     <aside class="ftpanel"><p>Loading the tree…</p></aside></section>`;
  const root=app.querySelector('.ft');
  if(!TREE){ try{ TREE=await (await fetch('tree.json')).json() }catch(e){ root.querySelector('.ftpanel').innerHTML='<p>The tree did not load. Reload to try again.</p>'; return } }
  if(!GEN){ try{ GEN=await (await fetch('genealogy.json')).json() }catch(e){ GEN={people:{},images:{},portraits:{},bookPhotos:{}} } }
  try{ if(typeof loadMovies==='function') await loadMovies() }catch(e){}
  try{ if(typeof loadFaces==='function'){ await loadFaces(); typeof initNames==='function'&&initNames() } }catch(e){}
  if(!root.isConnected) return;
  buildGraph(); draw(root);
  root.querySelectorAll('[data-line]').forEach(b=>{ const n=Object.keys(LINE).filter(id=>LINE[id]===b.dataset.line).length; b.querySelector('small').textContent=n; b.onclick=()=>flyToLine(root,b.dataset.line) });
  // faces and album thumbnails arrive after the first paint: swap them in without redrawing
  if(!window._ftAlbum&&typeof ensureThumbs==='function'&&window.T&&window.T.family20){ window._ftAlbum=ensureThumbs(window.T.family20).catch(()=>{}) }
  if(window._ftAlbum) window._ftAlbum.then(()=>{ if(root.isConnected){ refreshFaces(root); if(focus) showPanel(root) } });
  let sig='', ticks=0; const poll=setInterval(()=>{ if(!root.isConnected||ticks++>40) return clearInterval(poll); const s=typeof NAMES!=='undefined'?Object.keys(NAMES).map(k=>k+':'+(NAMES[k]&&NAMES[k].name)).join('|'):''; if(s!==sig){ sig=s; refreshFaces(root); if(focus) showPanel(root) } },1200);
  // camera
  const stage=stageOf(root), world=root.querySelector('.ftworld');
  Z=d3.zoom().scaleExtent([ZMIN,ZMAX]).clickDistance(6).filter(e=>!e.target.closest('.fthead,.ftctl,.ftlegend,.ftmini,.fthint')&&(e.type==='wheel'||!e.button)).on('zoom',e=>{ TF=e.transform; applyT(root); root.querySelector('.fthint').classList.add('gone') }).on('end',()=>drawMini(root));
  d3.select(stage).call(Z).on('dblclick.zoom',null);
  stage.addEventListener('dblclick',e=>{ if(e.target.closest('.fc,.fthead,.ftctl,.ftlegend,.ftmini')) return; const r=stage.getBoundingClientRect(); const px=e.clientX-r.left, py=e.clientY-r.top; const k=Math.min(ZMAX,TF.k*1.8); go(root,d3.zoomIdentity.translate(px-(px-TF.x)*k/TF.k,py-(py-TF.y)*k/TF.k).scale(k),500) });
  stage.addEventListener('click',e=>{ if(e.target===stage||e.target===world||e.target.tagName==='svg'||e.target.classList.contains('lin')){ if(focus||root._lit){ TRAIL.push(location.hash.slice(1)||'tree'); if(location.hash!=='#tree') location.hash='tree'; else deselect(root,false) } } });
  root.querySelector('.ftmini').onclick=e=>{ const m=root._mini; if(!m) return; const r=e.currentTarget.getBoundingClientRect(); const wx=(e.clientX-r.left-m.ox)/m.s, wy=(e.clientY-r.top-m.oy)/m.s; go(root,d3.zoomIdentity.translate(stage.clientWidth/2-wx*TF.k,stage.clientHeight/2-wy*TF.k).scale(TF.k),500) };
  root.querySelector('#ftin').onclick=()=>d3.select(stage).transition().duration(300).call(Z.scaleBy,1.4); root.querySelector('#ftout').onclick=()=>d3.select(stage).transition().duration(300).call(Z.scaleBy,1/1.4);
  root.querySelector('#ftfit').onclick=()=>fitAll(root,800); root.querySelector('#fthome').onclick=()=>{ if(location.hash!=='#tree') location.hash='tree'; else { deselect(root,false); fitFamily(root,800) } };
  if(window._ftResize) removeEventListener('resize',window._ftResize); window._ftResize=()=>{ if(root.isConnected){ applyT(root); drawMini(root) } }; addEventListener('resize',window._ftResize);
  root._mounted=true;
  // first view: the whole sheet, then settle on the family
  TF=d3.zoomIdentity; if(id&&P(id)){ fitAll(root,0); select(root,id,false); flyTo(root,id,1,900) } else { deselect(root,false); fitAll(root,0); setTimeout(()=>root.isConnected&&!focus&&fitFamily(root,1300),500) }
  root._key=e=>{ const t=e.target; if(t&&t.matches&&t.matches('input,textarea')) return false; const cur=focus;
    const sib=d=>{ const p=cur&&P(cur); const f=p&&p.famc[0]&&F(p.famc[0]); if(!f) return; const i=f.c.indexOf(cur), n=f.c[i+d]; n&&refocus(root,n) };
    switch(e.key){
      case 'ArrowUp': { const [h,w]=cur?parentsOf(cur):[F('F2').h,null]; const n=e.shiftKey?(w||h):(h||w); n&&refocus(root,n); return true }
      case 'ArrowDown': { const k=cur?childrenOf(cur)[0]:F('F2').c[0]; k&&refocus(root,k); return true }
      case 'ArrowLeft': sib(-1); return true; case 'ArrowRight': sib(1); return true;
      case '+': case '=': d3.select(stage).transition().duration(250).call(Z.scaleBy,1.4); return true; case '-': d3.select(stage).transition().duration(250).call(Z.scaleBy,1/1.4); return true;
      case '0': fitAll(root,800); return true; case 'h': case 'H': if(location.hash!=='#tree') location.hash='tree'; else fitFamily(root,800); return true; case 'f': case 'F': q.focus(); return true }
    return false };
  const q=root.querySelector('#ftq'), res=root.querySelector('#ftr');
  q.addEventListener('keydown',e=>{ if(e.key==='Escape'){ q.value=''; res.hidden=true; stage.focus(); e.stopPropagation() } if(e.key==='Enter'){ const b=res.querySelector('[data-go]'); b&&b.click() } });
  q.addEventListener('input',()=>{ const s=q.value.trim().toLowerCase(); if(!s){ res.hidden=true; return }
    const hits=Object.values(TREE.people).filter(p=>(full(p)+' '+(p.aka||[]).join(' ')+' '+(p.bp||'')+' '+marriedNames(p).join(' ')).toLowerCase().includes(s)).sort((a,b)=>(a.by||0)-(b.by||0)).slice(0,40);
    res.innerHTML=hits.map(p=>`<button data-go="${p.id}"><span style="display:inline-flex;align-items:center;gap:8px;color:var(--ink)"><i style="width:8px;height:8px;border-radius:50%;background:${LINES[lineOf(p.id)].color};flex:none"></i>${E(full(p))}</span><span>${E(yrs(p))}</span></button>`).join('')||'<button disabled>No one by that name</button>'; res.hidden=false;
    res.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ res.hidden=true; q.value=''; refocus(root,b.dataset.go) }) });
};
let _genP=null; window.ftPortrait=function(id){ if(!GEN){ if(!_genP) _genP=fetch('genealogy.json').then(r=>r.json()).then(g=>{ if(!GEN) GEN=g }).catch(()=>{}); return '' } const p=TREE&&TREE.people&&TREE.people[id]; if(p){ const r=portraitFor(p); return r?r.src:'' } return (GEN.faceImg&&GEN.faceImg[id])||'' };
window.treeNameList=function(){ if(!TREE) return []; const out=[]; for(const p of Object.values(TREE.people)){ if(!p.by||p.by<1900) continue; const g=(p.g||'').split(' ')[0]; out.push(g+' '+(p.s||'')); for(const a of p.aka||[]) out.push(a+' '+(p.s||'')); out.push(...marriedNames(p)) } return [...new Set(out.map(x=>x.trim()).filter(x=>x.length>3))] };
window.treeSearch=async function(words){ if(!TREE){ try{ TREE=await (await fetch('tree.json')).json() }catch(e){ return [] } }
  return Object.values(TREE.people).filter(p=>words.every(w=>(full(p)+' '+(p.aka||[]).join(' ')).toLowerCase().includes(w))).slice(0,12).map(p=>({id:p.id,name:full(p),yrs:yrs(p),bp:place(p.bp)})) };
})();
