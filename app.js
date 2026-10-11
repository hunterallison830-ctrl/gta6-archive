const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let D,tab='home',sub='all',bf='all',q='';
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const LISTS=['characters','locations','weapons','vehicles'];
const SUBKEY={characters:'tier',locations:'region',weapons:'type',vehicles:'type'};
const OBJ={weapons:1,vehicles:1};
setInterval(()=>{const d=new Date();$('#clock').textContent=d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})},1000);
function countdown(){if(!D)return;const t=new Date('2026-11-19T00:00:00-05:00')-new Date();
  $('#countdown').textContent=t>0?`${Math.floor(t/864e5)}D ${Math.floor(t/36e5)%24}H ${Math.floor(t/6e4)%60}M ${Math.floor(t/1e3)%60}S TO RELEASE`:'OUT NOW (check rockstargames.com/VI)';}
setInterval(countdown,1000);
const pic=(img,name)=>img?`<img src="${img}" alt="${esc(name)}" loading="lazy">`:`<span class="fb">${esc(name.split(/\s+/).slice(0,2).map(w=>w[0]).join(''))}</span>`;
const badge=b=>`<span class="b ${b}">${b}</span>`;
function subLabel(x,t=tab){if(t==='characters')return x.tier;if(t==='locations')return x.region;return x.type+(x.unnamed?' · name TBC':'')}
function filtered(){return D[tab].filter(x=>(sub==='all'||x[SUBKEY[tab]]===sub)&&(bf==='all'||x.badge===bf)&&(!q||JSON.stringify(x).toLowerCase().includes(q)))}
function setTab(t,noScroll){tab=t;sub='all';$$('#nav [data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));
  render.stage=true;render();
  const mark=$('.marquee');const y=mark?mark.offsetTop:$('.postcard').offsetHeight;if(!noScroll&&(scrollY>y||innerWidth<=700))scrollTo({top:y,behavior:reduceMotion?'auto':'smooth'});history.replaceState(null,'','#'+t)}
function render(){
  render._pendingStage=!!render.stage;render.stage=false;
  const isList=LISTS.includes(tab);$('#controls').hidden=!(isList||tab==='gallery');
  if(isList){const vals=[...new Set(D[tab].map(x=>x[SUBKEY[tab]]))];
    $('#subf').innerHTML=['all',...vals].map(v=>`<button data-s="${esc(v)}" class="${v===sub?'on':''}">${esc(v)}</button>`).join('');$('#badgef').style.display=''}
  else{$('#subf').innerHTML='';$('#badgef').style.display='none'}
  const m=$('#main');
  if(tab==='home')return home(m);
  if(tab==='timeline')return timeline(m);
  if(tab==='trailers')return trailers(m);
  if(tab==='gallery')return gallery(m);
  if(tab==='intel')return intel(m);
  const L=filtered();$('#cnt').textContent=`${L.length} OF ${D[tab].length} ${tab.toUpperCase()} · ${D[tab].filter(x=>x.badge==='CONFIRMED').length} CONFIRMED / ${D[tab].filter(x=>x.badge==='RUMOR').length} RUMOR`;
  const title={characters:'The Players',locations:'State of Leonida',weapons:'Arsenal',vehicles:'Rides'}[tab];
  m.innerHTML=`<h2 class="sec-title">${title}</h2><div class="grid">${L.map(x=>`<button class="card ${OBJ[tab]?'obj':''}" data-id="${x.id}"><div class="pic">${pic(x.img,x.name)}</div>${badge(x.badge)}<div class="meta"><div class="nm">${esc(x.name)}</div><div class="sub">${esc(subLabel(x))}</div></div></button>`).join('')||'<p>No matches. Try another search.</p>'}</div>`;
}
function home(m){$('#cnt').textContent='';
  const feat=D.locations.filter(l=>l.featured);const g=D.gallery;const hero=g.find(x=>/Vice City/.test(x.tag))||g[0];
  m.innerHTML=`<div class="loading"><img src="${hero.img}" alt=""><div class="cap"><h3>Vice City, USA.</h3><p>Lucia, Jason and the State of Leonida: everything Rockstar has officially shown, tagged CONFIRMED vs RUMOR.</p></div></div>
  <h2 class="sec-title">Meet the Players</h2><div class="grid">${D.characters.filter(c=>c.tier!=='Supporting'&&c.tier!=='Group / Band').map(x=>`<button class="card" data-tab2="characters" data-id="${x.id}"><div class="pic">${pic(x.img,x.name)}</div>${badge(x.badge)}<div class="meta"><div class="nm">${esc(x.name)}</div><div class="sub">${esc(x.tier)}</div></div></button>`).join('')}</div>
  <h2 class="sec-title">Explore Leonida</h2><div class="cruise"><div class="cruise-label"><span>Cruise the coast</span><span>Slide sideways</span></div><div class="tiles">${feat.map(l=>`<button class="tile" data-tab2="locations" data-id="${l.id}"><img src="${(l.gallery.find(x=>x.img.includes('/a/'))||l.gallery[0]||{}).img||l.img}" alt="" loading="lazy"><span>${esc(l.name)}</span></button>`).join('')}</div></div>
  <h2 class="sec-title">By the Numbers</h2><div class="facts">${[['Characters',D.characters.length],['Locations',D.locations.length],['Weapons',D.weapons.length],['Vehicles',D.vehicles.length],['Official trailers',D.trailers.length],['Official images',D.gallery.length]].map(([a,b])=>`<div class="fact stat"><b>${a}</b><span class="num">${b}</span></div>`).join('')}</div>`}
function timeline(m){const now=new Date();
  m.innerHTML=`<h2 class="sec-title">Road to Release</h2><p class="note">Official Rockstar / Take-Two milestones. Items tagged RUMOR are leaks or unofficial statements.</p><div class="tl">${D.timeline.map(e=>`<div class="ev ${new Date(e.date)>now?'future':''}"><div class="d">${new Date(e.date+'T12:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} ${badge(e.badge)}</div><h4>${esc(e.title)}</h4><p>${esc(e.text)}</p></div>`).join('')}</div>`}
function trailers(m){m.innerHTML=`<h2 class="sec-title">Official Trailers</h2><p class="note">Embedded from Rockstar Games' official YouTube channel. Click to load (privacy-enhanced mode; nothing autoplays until you click).</p><div class="vids">${D.trailers.map(t=>`<div class="vid"><button class="yt" data-yt="${t.id}" aria-label="Play ${esc(t.title)}"><img src="https://i.ytimg.com/vi/${t.id}/hqdefault.jpg" alt="" loading="lazy"><span class="play">▶</span></button><div class="vm"><h4>${esc(t.title)}</h4>${badge('CONFIRMED')} <span class="note">${t.date}</span><p>${esc(t.note)}</p></div></div>`).join('')}</div>`}
function gallery(m){const tags=[...new Set(D.gallery.map(g=>g.tag))];$('#subf').innerHTML=['all',...tags].map(v=>`<button data-s="${esc(v)}" class="${v===sub?'on':''}">${esc(v)}</button>`).join('');
  const L=D.gallery.filter(g=>(sub==='all'||g.tag===sub)&&(!q||g.tag.toLowerCase().includes(q)));$('#cnt').textContent=`${L.length} OFFICIAL IMAGES`;
  m.innerHTML=`<h2 class="sec-title">Official Screenshots</h2><div class="gal">${L.map(g=>`<button data-full="${g.img}"><img src="${g.img}" alt="${esc(g.tag)}" loading="lazy"><span>${esc(g.tag)} · ${esc(g.kind)}</span></button>`).join('')}</div>`}
function intel(m){m.innerHTML=`<h2 class="sec-title">Field Intel</h2><p class="note">What Rockstar has officially shown about how GTA VI plays, condensed from the wiki. Leak-sourced claims are removed.</p>${D.intel.map(s=>`<div class="intel-sec"><h3>${esc(s.h)}</h3>${s.p.map(p=>`<p>${p.badge==='RUMOR'?badge('RUMOR')+' ':''}${esc(p.t)}</p>`).join('')}</div>`).join('')}`}
const fact=(k,v)=>v?`<div class="fact"><b>${k}</b>${esc(v)}</div>`:'';
const stCls=s=>/deceas|dead/i.test(s)?'dead':/alive|active|incarcerat/i.test(s)?'alive':'unknown';
const story=s=>(s||[]).map(x=>`<h4>${esc(x.h)}</h4>${x.p.map(p=>`<p>${esc(p)}</p>`).join('')}`).join('');
const strip=g=>g&&g.length?`<h3>Official images</h3><div class="strip">${g.map(x=>`<img src="${x.img}" data-full="${x.img}" alt="" loading="lazy">`).join('')}</div>`:'';
function open(t,id){const x=D[t].find(y=>y.id===id);if(!x)return;let h;
  const bg=(x.gallery&&x.gallery.length)?`<img class="bg" src="${x.gallery[0].img}" alt="">`:'';
  const head=`<div class="hero">${bg}<div class="hin"><div class="face ${OBJ[t]?'obj':''}">${pic(x.img,x.name)}</div><div>${badge(x.badge)}${x.leaked?' <span class="note">some leak-sourced details hidden</span>':''}<h2>${esc(x.name)}</h2><div>${esc(subLabel(x,t))}</div></div></div></div>`;
  const quotes=(x.quotes||[]).map(q=>`<div class="official">${esc(q.text)}<small>— ${esc(q.src||'Rockstar Games')} · official</small></div>`).join('');
  if(t==='characters'){
    const s=x.status||'Unknown';
    h=`${head}<div class="body"><div class="st ${stCls(s)}">${/deceas/i.test(s)?'DECEASED':stCls(s)==='alive'?'ALIVE':'UNKNOWN'}</div> <span class="note">Wiki status: ${esc(s)}${/deceas/i.test(s)?' (per in-trailer social media post)':''}. No spoilers beyond official material.</span>
    <div class="facts">${fact('Affiliations',x.affiliations)}${fact('Also known as',x.aka)}${fact('Home',x.home)}${fact('Occupation',x.occupation)}${fact('Vehicles seen',x.vehicles)}</div>
    ${quotes}<h3>Bio</h3><p>${esc(x.bio)||'Little is officially known yet.'}</p>${x.story.length?`<h3>Story so far</h3>${story(x.story)}`:''}${strip(x.gallery)}`;
  }else if(t==='locations'){
    h=`${head}<div class="body"><div class="facts">${fact('Region',x.region)}${fact('Type',x.kind)}${fact('County',x.county)}</div>${quotes}<h3>Overview</h3><p>${esc(x.desc)}</p>${story(x.notes)}${strip(x.gallery)}`;
  }else{
    h=`${head}<div class="body"><div class="facts">${fact('Type',x.type)}${Object.entries(x.stats||{}).map(([k,v])=>fact(k,v)).join('')}${t==='vehicles'?fact('Series',x.returning?'Returning model from earlier GTA games':'New to GTA VI'):''}</div>
    ${x.unnamed?'<p class="note">Official in-game name not yet revealed; named after its real-world inspiration.</p>':''}${x.badge==='RUMOR'?'<p class="official">⚠ This item has only appeared in leaked development footage, not in official Rockstar material. It may change or be cut.</p>':''}
    <h3>Overview</h3><p>${esc(x.desc)||'No official description yet.'}</p>${story(x.notes)}`;
  }
  $('#mbody').innerHTML=h+`<div class="body" style="padding-top:0"><a href="${x.wiki}" target="_blank" rel="noopener">Full article on the GTA Wiki ↗</a></div>`;
  $('#modal').hidden=false;$('#modal').scrollTop=0;document.body.style.overflow='hidden';history.replaceState(null,'',`#${t}/${id}`)}
function close(){$('#modal').hidden=true;document.body.style.overflow='';history.replaceState(null,'','#'+tab)}
document.addEventListener('click',e=>{
  const n=e.target.closest('#nav [data-tab]');if(n)return setTab(n.dataset.tab);
  const c=e.target.closest('[data-id]');if(c&&!e.target.closest('.modal')){return open(c.dataset.tab2||tab,c.dataset.id)}
  const s=e.target.closest('#subf button');if(s){sub=s.dataset.s;return render()}
  const b=e.target.closest('#badgef button');if(b){bf=b.dataset.b;$$('#badgef button').forEach(x=>x.classList.toggle('on',x===b));return render()}
  const y=e.target.closest('.yt');if(y&&!y.querySelector('iframe')){y.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${y.dataset.yt}?autoplay=1&rel=0" title="Rockstar trailer" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;return}
  const f=e.target.closest('[data-full]');if(f){const l=document.createElement('div');l.className='lb';l.innerHTML=`<img src="${f.dataset.full}" alt="">`;l.onclick=()=>l.remove();document.body.append(l);return}
  if(e.target.id==='modal'||e.target.closest('.x'))close();
});
addEventListener('keydown',e=>{if(e.key==='Escape'){const l=$('.lb');l?l.remove():close()}});
$('#q').addEventListener('input',e=>{q=e.target.value.trim().toLowerCase();render()});
fetch('data.json').then(r=>r.json()).then(d=>{D=d;$('#statusTxt').textContent=d.status.text;countdown();
  const [t,id]=location.hash.slice(1).split('/');if(t&&(LISTS.includes(t)||['timeline','trailers','gallery','intel','home'].includes(t)))setTab(t);else{render.stage=true;render()}if(id)open(t,id)});
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
(function(){
  const main=$('#main'),nav=$('#nav'),tube=$('.scroll-tube i');
  const REVEAL='.card,.tile,.ev,.vid,.intel-sec,.gal button,.stat';
  if(!reduceMotion){
    document.documentElement.classList.add('js-reveal');
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target)});
    },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    const arm=(root,immediate)=>root.querySelectorAll(REVEAL).forEach((el,i)=>{
      if(immediate){el.classList.add('in');return}
      el.style.setProperty('--d',(i%5)*50+'ms');io.observe(el);
    });
    new MutationObserver(()=>{
      const stage=render._pendingStage;render._pendingStage=false;
      if(stage){main.classList.remove('stage-in');void main.offsetWidth;main.classList.add('stage-in')}
      arm(main,!stage);
    }).observe(main,{childList:true});
    let ticking=false;
    const onScroll=()=>{
      if(ticking)return;ticking=true;
      requestAnimationFrame(()=>{
        document.documentElement.style.setProperty('--py',Math.min(scrollY,640)+'px');
        nav.classList.toggle('is-scrolled',scrollY>24);
        const max=document.documentElement.scrollHeight-innerHeight;
        if(tube)tube.style.transform=`scaleY(${max>0?Math.min(1,scrollY/max):0})`;
        ticking=false;
      });
    };
    addEventListener('scroll',onScroll,{passive:true});
    onScroll();
  }
})();
