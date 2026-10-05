/* Settings (ANSWERS, LETTERS, SEA_VIDEO, ...) live in config.js, loaded before this file. */

const $ = id => document.getElementById(id);
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g,"");
const store = {
  get(){ try{ return JSON.parse(localStorage.getItem("opened")||"[]"); }catch(e){ return []; } },
  add(k){ try{ const a=store.get(); if(!a.includes(k)){a.push(k);localStorage.setItem("opened",JSON.stringify(a));} }catch(e){} },
  passed(){ try{ return localStorage.getItem("passed")==="1"; }catch(e){ return false; } },
  pass(){ try{ localStorage.setItem("passed","1"); }catch(e){} }
};

/* Peony drawn from layered petals, each ring blooms open */
const PEONY_COLORS={
  blush:["#d98a9a","#e9a9b5","#f3cfd2","#fbe3e4"],
  rose:["#9e2a45","#c04d68","#de8196","#f3c0ca"],
  wine:["#6e0f28","#8f1d3b","#b9405e","#e38aa0"],
  ivory:["#e8c9c4","#f2dcd6","#faece8","#fff7f3"]
};
function drawPeony(svg,tone="blush",delay=0){
  const ns="http://www.w3.org/2000/svg", cols=PEONY_COLORS[tone];
  const rings=[{n:9,r:34,w:22,h:30},{n:8,r:24,w:18,h:24},{n:7,r:15,w:14,h:18},{n:6,r:7,w:10,h:12}];
  rings.forEach((ring,ri)=>{
    const g=document.createElementNS(ns,"g");
    g.setAttribute("class","ring"); g.style.animationDelay=(delay+ri*.18)+"s";
    for(let i=0;i<ring.n;i++){
      const p=document.createElementNS(ns,"ellipse");
      p.setAttribute("cx",0);p.setAttribute("cy",-ring.r);
      p.setAttribute("rx",ring.w/2);p.setAttribute("ry",ring.h/2);
      p.setAttribute("fill",cols[ri]);p.setAttribute("stroke","#800020");p.setAttribute("stroke-opacity",".25");p.setAttribute("stroke-width",".8");
      p.setAttribute("transform",`rotate(${(i/ring.n)*360+ri*17})`);
      g.appendChild(p);
    }
    svg.appendChild(g);
  });
  const c=document.createElementNS(ns,"circle");c.setAttribute("r",4);c.setAttribute("fill","#d9b27c");
  c.setAttribute("class","ring");c.style.animationDelay=(delay+.75)+"s";svg.appendChild(c);
}

/* Splash: a field of peonies blooms, then all but the center one drift away and it docks as the logo */
(function splash(){
  const field=[ // x%, y%, size px, tone, delay s
    [16,18,110,"rose",.15],[84,14,90,"ivory",.35],[10,62,130,"wine",.5],[88,58,120,"blush",.25],
    [30,88,100,"ivory",.6],[72,90,140,"rose",.45],[52,24,70,"wine",.7],[60,70,80,"ivory",.8]
  ];
  const sp=$("splash");
  field.forEach(([x,y,size,tone,d])=>{
    const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("viewBox","-60 -60 120 120"); svg.setAttribute("class","bloom");
    svg.style.left=x+"%"; svg.style.top=y+"%"; svg.dataset.x=x; svg.dataset.y=y; svg.style.width=svg.style.height=size+"px";
    sp.appendChild(svg); drawPeony(svg,tone,d);
  });
  // Keep the center clear: push any flower that touches the logo or the name outward until it doesn't.
  // Measured after the script font loads, since its swashes are much wider than the fallback.
  function clearCenter(){
    const pad=22;
    const L=$("logo").getBoundingClientRect();
    const T=$("splashName").getBoundingClientRect();
    const fs=parseFloat(getComputedStyle($("splashName")).fontSize);
    const clear=[
      {left:L.left,right:L.right,top:L.top,bottom:L.bottom},
      {left:T.left-fs*.3,right:T.right+fs*.3,top:T.top-fs*.15,bottom:T.bottom+fs*.45} // room for swashes and the loop of the z
    ];
    const cx=innerWidth/2, cy=(clear[0].top+clear[1].bottom)/2;
    sp.querySelectorAll(".bloom").forEach(svg=>{
      const size=parseFloat(svg.style.width);
      let x=parseFloat(svg.dataset.x)/100*innerWidth, y=parseFloat(svg.dataset.y)/100*innerHeight;
      const hits=()=>clear.some(c=>x+size/2+pad>c.left && x-size/2-pad<c.right && y+size/2+pad>c.top && y-size/2-pad<c.bottom);
      let dx=x-cx, dy=y-cy; const len=Math.hypot(dx,dy)||1; dx/=len; dy/=len;
      let n=0; while(hits() && n++<300){ x+=dx*4; y+=dy*4; }
      svg.style.left=x+"px"; svg.style.top=y+"px"; svg.style.visibility="visible";
    });
  }
  let placed=false;
  const place=()=>{ if(!placed){ placed=true; clearCenter(); } };
  (document.fonts && document.fonts.load ? document.fonts.load('3rem "Pinyon Script"').then(()=>document.fonts.ready) : Promise.resolve()).then(place, place);
  setTimeout(place, 900); // don't wait forever on a slow connection
  drawPeony($("logoSvg"),"blush",0);
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let done=false;
  function finish(){
    if(done) return; done=true;
    sp.classList.add("leaving");
    setTimeout(()=>$("logo").classList.add("docked"), reduce?0:500);
    setTimeout(()=>{ sp.classList.add("gone"); show("gate"); }, reduce?0:1500);
    setTimeout(()=>sp.remove(), reduce?0:2600);
  }
  sp.addEventListener("click",finish);
  setTimeout(finish, reduce?0:3200);
})();

function show(id){ ["gate","sea","intro","wall"].forEach(s=>$(s).hidden = s!==id); $(id).classList.remove("fade-in"); void $(id).offsetWidth; $(id).classList.add("fade-in"); }

/* Gate */
let tries=0;
$("gateForm").addEventListener("submit",e=>{
  e.preventDefault();
  const v=norm($("answer").value);
  if(ANSWERS.some(a=>norm(a)===v) && v){
    store.pass(); primeSong(); startSea();
  }else{
    tries++;
    const f=$("gateForm"); f.classList.remove("shake"); void f.offsetWidth; f.classList.add("shake");
    $("gateMsg").textContent = tries>=2 ? HINT : "Hmm, not quite. Try again, Kazel.";
  }
});

/* Sea */
let seaAnim=null;
const song=$("seaSong");
const secs = s => { const [m,ss]=String(s||"").split(":").map(Number); return ss===undefined ? (m||0) : (m||0)*60+(ss||0); };
const songStart = secs(SEA_SONG_START), songEnd = secs(SEA_SONG_END);
// Loop only the chosen part: back to the start at SEA_SONG_END, or when the song ends.
song.addEventListener("timeupdate",()=>{ if(songEnd>songStart && song.currentTime>=songEnd) song.currentTime=songStart; });
song.addEventListener("ended",()=>{ song.currentTime=songStart; song.play().catch(()=>{}); });
song.addEventListener("loadedmetadata",()=>{ if(songStart && song.currentTime<songStart) song.currentTime=songStart; });
// Started inside the "Open the door" tap so phones allow the sound.
function primeSong(){
  if(!SEA_SONG) return;
  song.src=SEA_SONG+(songStart?"#t="+songStart:""); song.volume=0;
  song.play().then(()=>fadeSong(.8,2500)).catch(()=>{});
}
// Timer-based so the fade still runs when frames aren't being drawn (e.g. a backgrounded tab).
function fade(a,to,ms,after){
  clearInterval(a._fade);
  const from=a.volume, t0=performance.now();
  a._fade=setInterval(()=>{
    const k=Math.min(1,(performance.now()-t0)/ms); a.volume=from+(to-from)*k;
    if(k>=1){ clearInterval(a._fade); after&&after(); }
  },30);
}
const fadeSong=(to,ms,after)=>fade(song,to,ms,after);
function startSea(){
  show("sea");
  const v=$("seaVideo");
  let shown=false;
  const reveal=()=>{ if(!shown){ shown=true; $("seaNext").hidden=false; } };
  setTimeout(reveal, SEA_CONTINUE_AFTER*1000);
  if(SEA_SONG){ $("soundBtn").hidden=false; $("soundBtn").textContent = song.paused ? "Sound on" : "Sound off"; }
  if(SEA_VIDEO){
    v.src=SEA_VIDEO; v.hidden=false; $("seaCanvas").hidden=true;
    v.addEventListener("ended",reveal);
    v.addEventListener("error",()=>{ v.hidden=true; $("seaCanvas").hidden=false; $("soundBtn").hidden=true; drawSea(); });
    v.play().then(()=>{ $("soundBtn").hidden=false; }).catch(()=>{ $("soundBtn").hidden=false; });
  }else{
    drawSea();
  }
}
$("soundBtn").addEventListener("click",()=>{
  if(SEA_SONG){
    if(song.paused||song.volume===0){ song.play().catch(()=>{}); fadeSong(.8,600); $("soundBtn").textContent="Sound off"; }
    else { fadeSong(0,400,()=>song.pause()); $("soundBtn").textContent="Sound on"; }
    return;
  }
  const v=$("seaVideo");
  v.muted=!v.muted; if(v.paused) v.play().catch(()=>{});
  $("soundBtn").textContent = v.muted ? "Sound on" : "Sound off";
});
$("seaNext").addEventListener("click",()=>{
  const v=$("seaVideo"); v.pause();
  if(SEA_SONG && !song.paused){ SONG_KEEP_PLAYING ? fadeSong(.3,1500) : fadeSong(0,1500,()=>song.pause()); }
  if(seaAnim) cancelAnimationFrame(seaAnim);
  show("intro");
});

/* Drawn sea at dusk, used until a video is added */
function drawSea(){
  const c=$("seaCanvas"), ctx=c.getContext("2d");
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W,H,dpr;
  function size(){ dpr=Math.min(devicePixelRatio||1,2); W=c.clientWidth; H=c.clientHeight; c.width=W*dpr; c.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
  size(); addEventListener("resize",size);
  const layers=[
    {y:.60,amp:6, len:220,spd:.25,col:"#3d6f86"},
    {y:.68,amp:9, len:260,spd:.35,col:"#2c5a72"},
    {y:.77,amp:12,len:300,spd:.5, col:"#1f4e66"},
    {y:.88,amp:16,len:340,spd:.7, col:"#0f2a3d"}
  ];
  function frame(t){
    t=t/1000;
    const horizon=H*.57;
    const sky=ctx.createLinearGradient(0,0,0,horizon);
    sky.addColorStop(0,"#3a0d18"); sky.addColorStop(.55,"#8a2f45"); sky.addColorStop(1,"#f0b7a4");
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,horizon+2);
    // sun
    const sx=W*.5, sy=horizon-4, sr=Math.min(W,H)*.08;
    const g=ctx.createRadialGradient(sx,sy,0,sx,sy,sr*3);
    g.addColorStop(0,"rgba(255,226,200,.9)"); g.addColorStop(.35,"rgba(255,190,170,.35)"); g.addColorStop(1,"rgba(255,190,170,0)");
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(sx,sy,sr*3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#ffe6d2"; ctx.beginPath(); ctx.arc(sx,sy,sr,Math.PI,0); ctx.fill();
    // sea base
    ctx.fillStyle="#4b7d92"; ctx.fillRect(0,horizon,W,H-horizon);
    // sun reflection
    for(let i=0;i<14;i++){
      const ry=horizon+8+i*(H-horizon)/16, w=sr*(1.6-i*.08)*(1+.15*Math.sin(t*2+i));
      ctx.fillStyle=`rgba(255,220,200,${.35-i*.022})`; ctx.fillRect(sx-w/2,ry,w,2);
    }
    // waves
    layers.forEach((L,i)=>{
      ctx.beginPath(); ctx.moveTo(0,H);
      for(let x=0;x<=W+10;x+=10){
        const y=H*L.y + Math.sin(x/L.len*Math.PI*2 + t*L.spd*2 + i)*L.amp + Math.sin(x/(L.len*.47) - t*L.spd*1.3)*L.amp*.4;
        ctx.lineTo(x,y);
      }
      ctx.lineTo(W,H); ctx.closePath(); ctx.fillStyle=L.col; ctx.fill();
      // foam line
      ctx.strokeStyle="rgba(246,228,225,.18)"; ctx.lineWidth=1.2; ctx.stroke();
    });
    if(!reduce) seaAnim=requestAnimationFrame(frame);
  }
  seaAnim=requestAnimationFrame(frame);
}

/* Sealed letter + typewriter */
let opened=false;
$("sealed").addEventListener("click",()=>{
  if(opened) return; opened=true;
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const env=$("sealed"); $("tapHint").hidden=true;
  const popLetter=()=>{
    $("stage").hidden=true; $("introLetter").hidden=false;
    if(reduce){ $("typed").textContent=INTRO_TEXT; $("enterBtn").hidden=false; return; }
    let i=0; setTimeout(function step(){
      $("typed").textContent=INTRO_TEXT.slice(0,++i);
      if(i<INTRO_TEXT.length) setTimeout(step, INTRO_TEXT[i-1]==="\n"?500:45);
      else $("enterBtn").hidden=false;
    },650);
  };
  if(reduce){ popLetter(); return; }
  env.classList.add("open");                                   // wax melts, flap lifts
  setTimeout(()=>env.classList.add("flap-back"),300);          // flap tucks behind the letter
  setTimeout(()=>env.classList.add("peek"),650);               // letter slides up
  setTimeout(()=>env.classList.add("away"),1400);              // envelope drops away
  setTimeout(popLetter,1800);                                  // letter pops forward
});
$("enterBtn").addEventListener("click",()=>{ show("wall"); startWallSong(); });

/* Envelope page song: the whole song on repeat, with a sound toggle that's remembered */
const wallSong=$("wallSong"), wallSound=$("wallSound");
const wallMuted={
  get(){ try{ return localStorage.getItem("wallMuted")==="1"; }catch(e){ return false; } },
  set(v){ try{ localStorage.setItem("wallMuted",v?"1":"0"); }catch(e){} }
};
function setWallLabel(on){ wallSound.textContent = on ? "♪ Sound off" : "♪ Sound on"; wallSound.setAttribute("aria-pressed", on); }
// Called from the "Come in" tap so phones allow the sound.
function startWallSong(){
  if(SEA_SONG && !song.paused) fadeSong(0,1500,()=>song.pause());
  if(!WALL_SONG) return;
  wallSound.hidden=false;
  if(!wallSong.src) wallSong.src=WALL_SONG;
  if(wallMuted.get()){ setWallLabel(false); return; }
  wallSong.volume=0;
  wallSong.play().then(()=>{ fade(wallSong,.7,2500); setWallLabel(true); }).catch(()=>setWallLabel(false));
}
// Keep the label honest if the phone or browser pauses the music on its own.
wallSong.addEventListener("play",()=>setWallLabel(true));
wallSong.addEventListener("pause",()=>setWallLabel(false));
wallSound.addEventListener("click",()=>{
  if(wallSong.paused){
    wallMuted.set(false); wallSong.volume=0; wallSong.play().catch(()=>{}); fade(wallSong,.7,800); setWallLabel(true);
  }else{
    wallMuted.set(true); fade(wallSong,0,400,()=>wallSong.pause()); setWallLabel(false);
  }
});

/* Envelope wall */
function renderWall(){
  const done=store.get();
  $("envelopes").innerHTML="";
  LETTERS.forEach(L=>{
    const b=document.createElement("button");
    b.className="env"; b.style.setProperty("--tint",L.tint);
    b.setAttribute("aria-label",L.title);
    b.innerHTML=`<span class="dot"></span><span class="label"><span class="ow">open when</span><span class="feel">${L.feel}</span></span>${done.includes(L.key)?'<span class="opened">opened ♡</span>':''}`;
    b.addEventListener("click",()=>openLetter(L));
    $("envelopes").appendChild(b);
  });
}
let lastFocus=null;
function openLetter(L){
  lastFocus=document.activeElement;
  $("letterTitle").textContent=L.title;
  $("letterBody").innerHTML=L.body.map(p=>`<p>${p}</p>`).join("");
  $("overlay").hidden=false; $("closeBtn").focus();
  store.add(L.key);
}
function closeLetter(){ $("overlay").hidden=true; renderWall(); lastFocus&&lastFocus.focus&&lastFocus.focus(); }
$("closeBtn").addEventListener("click",closeLetter);
$("overlay").addEventListener("click",e=>{ if(e.target.id==="overlay") closeLetter(); });
document.addEventListener("keydown",e=>{ if(e.key==="Escape" && !$("overlay").hidden) closeLetter(); });
renderWall();
