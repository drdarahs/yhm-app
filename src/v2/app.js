
/* ================= app ================= */
const NATIVE = window.YHMNative || null;
const IOS = !!(NATIVE&&NATIVE.platform==="ios");
const HC = IOS?"Apple Health":"Health Connect";
const RACE_DATE = "2027-01-03";
const REG_URL = "https://www.yavatmalhealthmarathon.com/";
const UPDATE_URLS = ["https://drdarahs.github.io/yhm-app/updates.json","https://www.yavatmalhealthmarathon.com/updates.json"];
const EMBED_UPDATES = [
 {date:"2026-10-21",title:"Register on the YHM website",body:"Registration for YHM 2027 is open at www.yavatmalhealthmarathon.com. Early bird: 25% off till 30 November 2026."},
 {date:"2026-10-15",title:"Race date and venue",body:"Yavatmal Health Marathon 2027, 5th edition: Sunday 3 January 2027 at Nehru Stadium, Godhani Road, Yavatmal."},
 {date:"2026-10-15",title:"Dose-T is our Training Partner",body:"Dose-T is the official Training Partner for YHM 2027."}
];
const AVC = ["#ef7e14","#01a0e2","#0c9a77","#c0359a","#1b4074","#e0243f","#7c5cd6"];
const GOAL_NAME = {5:"Fitness Run",10:"Power Run",21:"Half Marathon",42:"Marathon"};
const LEVELS = [["new","New to running","Can't run 2 km non-stop yet"],["beg","Beginner","Can run 2–5 km"],["int","Regular runner","5–10 km comfortably"],["adv","Experienced","Raced 21 km or more"]];
const TL = {run:"Run",walk:"Walk / walk-run",strength:"Strength",mobility:"Yoga / mobility",cycle:"Cycling",other:"Activity"};
const TT = {run:"ty-primary",walk:"ty-easy",strength:"ty-strength",mobility:"ty-mobility",cycle:"ty-long",other:"ty-rest"};
const RUNLIKE = t => t==="run"||t==="walk";
const EMO = {easy:"🏃",quality:"⚡",long:"🛣️",strength:"💪",mobility:"🧘",rest:"😴",recovery:"🚶",race:"🏅"};
const TOM_TIP = {
  easy:d=>"Easy run tomorrow. Keep it conversational. Lay out your shoes tonight.",
  quality:d=>"Hard session tomorrow. Eat a good dinner, sleep by 10 and warm up properly.",
  long:d=>"Long run tomorrow: extra rice or chapati tonight, keep water ready, sleep early.",
  strength:d=>"Strength & core tomorrow, 30 min. No equipment needed.",
  mobility:d=>"Yoga & mobility tomorrow, 20 min. A good recovery day.",
  rest:d=>"Rest day tomorrow. Recovery is when you get fitter.",
  recovery:d=>"Easy recovery walk tomorrow.",
  race:d=>"RACE DAY tomorrow! Bib, shoes, breakfast plan. Early dinner, early night. You're ready."
};
const hm = s => { const m=/^(\d{1,2}):(\d{2})/.exec(s||""); return m?[+m[1],+m[2]]:[5,45]; };
const firstName = n => String(n||"Runner").trim().split(/\s+/)[0];
const initials = n => String(n||"R").trim().split(/\s+/).map(x=>x[0]).join("").slice(0,2).toUpperCase();
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.hidden=false; clearTimeout(toast._t); toast._t=setTimeout(()=>t.hidden=true,3000); }
function copyText(txt,btn){
  const sel=()=>{ const c=btn&&btn.closest(".contact")&&btn.closest(".contact").querySelector("code"); if(c){ const r=document.createRange(); r.selectNodeContents(c); const s=getSelection(); s.removeAllRanges(); s.addRange(r); toast("Selected. Long-press to copy"); } };
  try{ navigator.clipboard.writeText(txt).then(()=>toast("Copied"),sel); }catch(e){ sel(); }
}
const tile = (cls,i,sz) => '<span class="tile'+(sz?" "+sz:"")+" "+cls+'">'+ic(i,sz==="sm"?"sm":"")+"</span>";

/* ---------- state ---------- */
const LS_KEY = "yhm-coach-v2", LS_V1 = "yhm-coach-v1";
const DEF_REM = {on:false,train:true,tomorrow:true,tomorrowAt:"20:30",water:true,waterEvery:2,sleep:true,sleepAt:"22:00",weekly:true};
function blank(){ return {v:2,active:null,me:null,runners:{},order:[],rem:Object.assign({},DEF_REM),hc:{},stepsHist:{},hcWeight:null,at:0}; }
const newId = () => "r"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function migrateV1(v1){
  const s=blank();
  if(v1&&v1.profile&&!v1.profile.example){
    const id=newId(), p=Object.assign({},v1.profile);
    s.runners[id]={id,profile:p,logs:(v1.logs||[]).filter(l=>!l.ex),checks:v1.checks||{},weights:[],color:AVC[0],created:iso(today())};
    s.order=[id]; s.active=s.me=id;
    if(v1.rem) Object.assign(s.rem,{on:!!v1.rem.on,train:v1.rem.train!==false,water:v1.rem.water!==false,sleep:v1.rem.sleep!==false});
    s.hc=v1.hc&&v1.hc.status==="on"?{status:"on"}:{};
  }
  return s;
}
function normalize(v){
  const s=Object.assign(blank(),v); s.rem=Object.assign({},DEF_REM,v.rem||{}); s.hc=s.hc||{};
  s.order=(s.order||[]).filter(id=>s.runners[id]); Object.keys(s.runners).forEach(id=>{ if(!s.order.includes(id)) s.order.push(id); const r=s.runners[id]; r.logs=r.logs||[]; r.checks=r.checks||{}; r.weights=r.weights||[]; });
  if(!s.runners[s.active]) s.active=s.order[0]||null;
  if(s.me&&!s.runners[s.me]) s.me=null;
  return s;
}
function loadLocal(){
  try{ const raw=localStorage.getItem(LS_KEY); if(raw){ const v=JSON.parse(raw); if(v&&v.v===2) return normalize(v); } }catch(e){}
  try{ const o=localStorage.getItem(LS_V1); if(o) return normalize(migrateV1(JSON.parse(o))); }catch(e){}
  return blank();
}
let S = loadLocal();
let DB=null, UID=null, dbOk=false, saveT=null, IS_OWNER=false;
const R = () => S.runners[S.active];
function trim(){
  const cut=iso(addDays(today(),-120)), cs=iso(addDays(today(),-30));
  for(const r of Object.values(S.runners)) for(const k of Object.keys(r.checks)) if(k<cut&&k!=="race") delete r.checks[k];
  for(const k of Object.keys(S.stepsHist)) if(k<cs) delete S.stepsHist[k];
}
function save(){
  S.at=Date.now(); trim();
  try{ localStorage.setItem(LS_KEY, JSON.stringify(S)); }catch(e){}
  if(dbOk){ clearTimeout(saveT); saveT=setTimeout(()=>{ DB.doc("data/users/"+UID+"/coach").set(JSON.parse(JSON.stringify(S))).catch(()=>{ dbOk=false; }); },1200); }
}
function setCheck(r,k,v,ds){ ds=ds||iso(today()); r.checks[ds]=Object.assign({},r.checks[ds],{[k]:v}); }

/* ---------- analysis ---------- */
let PLAN=null, AD=null, SEL=null;
function findIn(plan,d){ const s=typeof d==="string"?d:iso(d); for(const w of plan.weeks) for(const x of w.days) if(iso(x.date)===s) return x; return null; }
const findDay = d => findIn(PLAN,d);
const weekOf = d => PLAN.weeks.find(w=>d>=w.mon&&d<addDays(w.mon,7));
const dayLogs = (r,ds) => r.logs.filter(l=>l.date===ds);
function kmBetween(r,a,b){ return Math.round(r.logs.filter(l=>l.date>=a&&l.date<=b&&RUNLIKE(l.type)).reduce((s,l)=>s+(+l.km||0),0)*10)/10; }
const weekDoneKm = (r,w) => kmBetween(r,iso(w.mon),iso(addDays(w.mon,6)));
function statusOf(r,d){
  const ds=iso(d.date), t=iso(today());
  if(d.type==="rest") return "rest";
  const L=dayLogs(r,ds), ck=(r.checks[ds]||{}).workout;
  let st=null;
  if(d.km>0){ const km=L.filter(l=>RUNLIKE(l.type)||l.type==="other").reduce((a,l)=>a+(+l.km||0),0);
    if(km>=d.km*0.75||(ck&&!L.length)) st="done"; else if(L.length) st="partial"; }
  else if(L.length||ck) st="done";
  if(st) return st;
  if(ds>t) return "upcoming";
  if(ds===t) return "today";
  if(ds<(r.created||"")) return "before";
  return "missed";
}
function weekScore(r,w){ let n=0,s=0; for(const d of w.days){ const st=statusOf(r,d); if(!["done","partial","missed"].includes(st)) continue; n++; s+=st==="done"?1:st==="partial"?0.5:0; } return {n,s,adh:n?s/n:null}; }
const PAIN_RE = /pain|injur|hurt|sprain|swell|ache|cramp|dard|दर्द|दुख|वेदना|सूज/i;
function adapt(r){
  const p=r.profile, base=buildPlan(p), t=today(), notes=[], ad={};
  const cw=base.weeks.findIndex(w=>t>=w.mon&&t<addDays(w.mon,7));
  if(cw>0&&base.weeks[cw].phase!=="Race"){
    const a1=weekScore(r,base.weeks[cw-1]), a2=cw>1?weekScore(r,base.weeks[cw-2]):{n:0};
    if(a1.n>=2&&a1.adh<0.5){
      ad.week=cw; ad.scale=(a2.n>=2&&a2.adh<0.5)?0.75:0.85;
      notes.push({ty:"ty-warn",ic:"sync",t:"This week is "+Math.round((1-ad.scale)*100)+"% lighter",b:"Last week "+firstName(p.name)+" completed "+(Math.round(a1.s*10)/10)+" of "+a1.n+" sessions. Easing back in protects against injury. Complete this week and the plan steps up again."});
    } else if(a1.n>=2&&a1.adh>=0.9) notes.push({ty:"ty-ok",ic:"medal",t:"Great consistency last week",b:"Every session done. The plan moves up as scheduled."});
  }
  const since=iso(addDays(t,-4));
  const hard=r.logs.filter(l=>l.date>=since&&l.date<=iso(t)&&((+l.rpe||0)>=9||PAIN_RE.test(l.note||"")));
  if(hard.length&&cw>=0&&base.weeks[cw].phase!=="Race"){
    ad.week=cw; ad.soft=true;
    const pain=hard.some(l=>PAIN_RE.test(l.note||""));
    notes.push({ty:"ty-bad",ic:"heart",t:"Speed work swapped for easy runs",b:(pain?"Pain was noted":"A very hard effort was logged")+" on "+fmtD(parse(hard[hard.length-1].date))+", so this week's hard sessions are easy runs. If pain changes how you run, rest and see a doctor."});
  }
  const cut=iso(addDays(t,-42)); let best=null, from=null;
  for(const l of r.logs){ if(l.type!=="run"||l.date<cut||!(+l.km>=3)||!(+l.min>0)) continue;
    const t5=l.min*60*Math.pow(5/l.km,1.06); if(t5>=840&&t5<=3600&&(!best||t5<best)){ best=t5; from=l; } }
  const m=/^(\d{1,2}):(\d{2})$/.exec((p.recent5k||"").trim()), prof=m?(+m[1])*60+(+m[2]):0;
  if(best&&(!prof||best<prof-5)){ ad.fiveK=best;
    notes.push({ty:"ty-primary",ic:"bolt",t:"Paces updated from recent runs",b:"The "+from.km+" km run on "+fmtD(parse(from.date))+" points to about "+fmtTime(best)+" for 5 km"+(prof?", faster than the "+p.recent5k+" in the profile":"")+". Training paces and predicted finish now use it."}); }
  return {ad,notes,base,cw};
}
function readiness(r){
  const t=today(); let n=0,s=0;
  for(let i=1;i<=7;i++){ const pd=findDay(addDays(t,-i)); if(!pd) continue; const st=statusOf(r,pd); if(["done","partial","missed"].includes(st)){ n++; s+=st==="done"?1:st==="partial"?0.6:0; } }
  const adh=n?s/n:0.85;
  let sl=0,sn=0; for(let i=0;i<3;i++){ const c=r.checks[iso(addDays(t,-i))]; if(c&&c.sleep!=null){ sn++; if(c.sleep) sl++; } }
  const sleep=sn?sl/sn:0.75;
  const yd=addDays(t,-1), yc=r.checks[iso(yd)]||{};
  const water=yc.water!=null?clamp(yc.water/nutri(r.profile,findDay(yd)).glasses,0,1):0.75;
  const soft=AD&&AD.ad.soft;
  const score=Math.round(100*(0.45*adh+0.2*sleep+0.15*water+0.2*(soft?0.2:1)));
  return {score,label:score>=75?"Ready":score>=55?"Steady":"Go easy"};
}
function compute(){ const r=R(); if(!r) return; AD=adapt(r); PLAN=buildPlan(r.profile,AD.ad); }

/* ---------- small renderers ---------- */
function stepsHTML(steps){ return '<ol class="steps">'+steps.map(x=>"<li><span>"+esc(x)+"</span></li>").join("")+"</ol>"; }
function mealRow(m){ return '<div class="meal"><span class="fi">'+food(m[0])+'</span><div><b>'+esc(m[1])+'</b><span class="small muted">'+esc(m[2])+"</span></div></div>"; }
const stat = (cls,i,lab,v) => '<div class="stat">'+tile(cls,i,"sm")+'<span class="tiny">'+lab+'</span><span class="v">'+v+"</span></div>";
const banner = (cls,i,html,btn) => '<div class="banner '+cls+'"><div class="ttl-row">'+tile("",i,"sm")+'<span class="small">'+html+"</span></div>"+(btn||"")+"</div>";
const STT = {done:["done","check","Done"],partial:["partial","pulse","Partly"],missed:["missed","warn","Missed"]};
function sttChip(st){ const x=STT[st]; return x?'<span class="stt '+x[0]+'">'+ic(x[1],"xs")+x[2]+"</span>":""; }
function logLine(l){
  const pace=l.km&&l.min&&RUNLIKE(l.type)?" · "+fmtPace(l.min*60/l.km)+" /km":"";
  return (l.km?l.km+" km":"")+(l.min?(l.km?" · ":"")+l.min+" min":"")+pace+(l.hr?" · ♥ "+l.hr:"")+(l.rpe?" · effort "+l.rpe+"/10":"");
}
function srcLabel(l){ return l.ex?"Example":l.src==="hc"?l.srcName||HC:["gpx","tcx","csv"].includes(l.src)?l.src.toUpperCase():l.src==="plan"?"Marked done":""; }
function zonesHTML(s,pc,p){
  if(!["easy","quality","long","race"].includes(s.type)) return "";
  const hr=pc.hrmax, bb=has(p,"htn")||has(p,"heart");
  const z=(cls,i,lab,v)=>'<div class="zone">'+tile(cls,i,"sm")+'<div><span class="tiny">'+lab+'</span><div class="v">'+v+"</div></div></div>";
  return '<div class="zones">'+z("ty-race","heart","Easy heart rate",Math.round(hr*0.6)+"–"+Math.round(hr*0.72)+" bpm")+
    (s.type==="quality"?z("ty-quality","bolt","Hard efforts",Math.round(hr*0.82)+"–"+Math.round(hr*0.92)+" bpm"):"")+
    (pc.easy?z("ty-easy","clock",s.type==="long"?"Long-run pace":"Easy pace",PR(s.type==="long"?pc.long:pc.easy)):"")+"</div>"+
    (bb?'<p class="tiny">On BP medicines like beta-blockers, go by effort instead of heart rate.</p>':"");
}

/* ---------- header & today ---------- */
function renderHeader(){
  const r=R(), p=r.profile, t=today(), h=new Date().getHours();
  const av=$("#avatar"); av.textContent=initials(p.name); av.style.background=r.color; av.style.setProperty("--avc",r.color);
  $("#hello").textContent=(h<12?"Good morning, ":h<17?"Good afternoon, ":"Good evening, ")+firstName(p.name);
  const wk=weekOf(t);
  $("#subhello").textContent=goalLabel(p.goal)+" km · "+(wk?"Week "+wk.n+" of "+PLAN.N:"YHM 2027")+(S.order.length>1?" · "+S.order.length+" runners ▾":" ▾");
  $("#bellDot").hidden=!(NATIVE&&!S.rem.on);
}
function renderWeek(){
  const r=R(), sel=parse(SEL), mon=monday(sel), ts=iso(today());
  let h="";
  for(let i=0;i<7;i++){ const d=addDays(mon,i), ds=iso(d), pd=findDay(d);
    const st=pd?statusOf(r,pd):"none", cls=pd?"ty-"+pd.type:"ty-rest";
    const icn=st==="done"?"check":st==="missed"?"warn":st==="partial"?"pulse":pd?TYPE_IC[pd.type]:"moon";
    h+='<button type="button" role="tab" class="wd '+cls+(ds===ts?" is-today":"")+(ds===SEL?" sel":"")+(["done","missed","partial"].includes(st)?" "+st:"")+'" data-sel="'+ds+'" aria-selected="'+(ds===SEL)+'" aria-label="'+esc(fmtD(d)+(pd?": "+pd.title+(st==="done"?", done":st==="missed"?", missed":""):""))+'">'+
      '<span class="w">'+WD[d.getDay()].slice(0,2)+'</span><span class="n">'+d.getDate()+'</span><span class="st">'+ic(icn)+"</span></button>"; }
  $("#week").innerHTML=h;
}
function renderToday(){
  const r=R(), p=r.profile, t=today(), ts=iso(t), c=r.checks[ts]||{};
  $("#exBanner").innerHTML=p.example?banner("ty-long","user","<b>This is an example runner.</b> Make a plan from your own age, weight, goal and health.",'<button class="btn grad small" type="button" data-act="newPlan">Create my plan</button>'):
    (NATIVE&&S.me===r.id&&(S.hc.status!=="on")?banner("ty-primary","watch","<b>Connect your watch.</b> Runs from Garmin, Samsung, Fitbit, Strava and others are tracked automatically.",'<button class="btn grad small" type="button" data-act="hcConnect">Connect</button>'):"")+
    (NATIVE&&S.me===r.id&&!S.rem.on?banner("ty-water","bell","<b>Turn on reminders</b> for workouts, water and tomorrow's plan.",'<button class="btn ghost small" type="button" data-act="remOn">Turn on</button>'):"");
  renderWeek();
  // hero
  const rd=parse(p.raceDate), dd=dayDiff(t,rd);
  $("#heroDays").innerHTML=(dd>=0?dd:0)+"<small>"+(dd===0?"RACE DAY!":dd===1?"DAY TO GO":dd<0?"DAYS · RACE DONE":"DAYS TO GO")+"</small>";
  $("#heroGoal").textContent=goalLabel(p.goal)+" KM · "+(GOAL_NAME[p.goal]||"").toUpperCase();
  const rdy=readiness(r), C=2*Math.PI*19, col=rdy.score>=75?"#3fd8ad":rdy.score>=55?"#ffc93c":"#ff8a65";
  $("#ready").innerHTML='<svg viewBox="0 0 46 46" aria-hidden="true"><circle cx="23" cy="23" r="19" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="5"/><circle class="arc" cx="23" cy="23" r="19" fill="none" stroke="'+col+'" stroke-width="5" stroke-linecap="round" stroke-dasharray="'+(C*rdy.score/100).toFixed(1)+" "+C.toFixed(1)+'" transform="rotate(-90 23 23)"/><text x="23" y="27.5" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="Barlow Condensed,Arial Narrow,sans-serif">'+rdy.score+"</text></svg><div><b>"+rdy.label+"</b><span>Readiness</span></div>";
  $("#heroSub").innerHTML=p.raceDate===RACE_DATE?"<b>SUN 03 · 01 · 2027</b> · Nehru Stadium, Godhani Road, Yavatmal":"<b>"+esc(fmtD(rd).toUpperCase())+" "+rd.getFullYear()+"</b> · Race day";
  $("#regLink").hidden=p.raceDate!==RACE_DATE||dd<0;
  const f=medFlags(p);
  $("#medFlag").innerHTML=f.length?banner("ty-race","heart","<b>Health check first.</b> "+esc(f.join(" "))):"";
  renderSession();
  $("#coachNote").innerHTML=AD.notes.map(n=>'<div class="banner '+n.ty+'"><div class="ttl-row">'+tile("",n.ic,"sm")+'<span class="small"><b>'+esc(n.t)+".</b> "+esc(n.b)+"</span></div></div>").join("");
  // rings
  const wk=weekOf(t), wkDone=wk?weekDoneKm(r,wk):0, wkPlan=wk?wk.km:0, n=nutri(p,findDay(t)), w=c.water||0;
  const ckKeys=["workout","protein","fruitveg","stretch","sleep"], ckDone=ckKeys.filter(k=>c[k]).length;
  const steps=S.me===r.id&&S.stepsHist[ts]!=null?S.stepsHist[ts]:null;
  $("#rings").innerHTML=ring(wkPlan?wkDone/wkPlan:0,"var(--primary)","shoe",wkDone+"/"+wkPlan,"km this week")+
    ring(w/n.glasses,"var(--c-water)","drop",w+"/"+n.glasses,"glasses")+
    (steps!=null?ring(steps/8000,"var(--c-long)","steps",steps.toLocaleString("en-IN"),"steps today"):ring(ckDone/ckKeys.length,"var(--c-easy)","check",ckDone+"/"+ckKeys.length,"habits"));
  // habits
  $("#todayDate").textContent=fmtD(t);
  const day=findDay(t);
  const items=[["workout",day&&day.type!=="rest"?"Today's session done":"Rest well today",day?TYPE_IC[day.type]:"moon","ty-primary"],["protein","Protein in every meal","egg","ty-strength"],["fruitveg","5 servings of fruit and vegetables","leaf","ty-food"],["stretch","10 min stretching","lotus","ty-mobility"],["sleep","7+ hours sleep last night","moon","ty-quality"]];
  if(has(p,"t2dm")||has(p,"t1dm")) items.push(["sugar","Checked blood sugar","drop","ty-race"]);
  if(has(p,"thyroid")) items.push(["med","Took thyroid tablet before food","pill","ty-long"]);
  if(has(p,"htn")) items.push(["bp","Took BP medicine / checked BP","pulse","ty-race"]);
  $("#checks").innerHTML=items.map(([k,l,i,cl])=>'<label class="check">'+tile(cl,i,"sm")+"<span>"+esc(l)+'</span><input type="checkbox" data-ck="'+k+'"'+(c[k]?" checked":"")+"></label>").join("");
  $("#waterTxt").textContent=w+" of "+n.glasses+" glasses ("+(n.water/1000).toFixed(1)+" L)";
  $("#glasses").innerHTML=Array.from({length:n.glasses},(_,i)=>'<i class="glass'+(i<w?" full":"")+'"></i>').join("");
  // food for selected day
  const sd=findDay(SEL), next=findDay(addDays(parse(SEL),1)), sn=nutri(p,sd);
  $("#todayFuel").innerHTML='<div class="card-h"><div class="ttl-row">'+tile("ty-food","plate","sm")+"<h3>"+(SEL===ts?"Today's food":"Food · "+esc(fmtD(parse(SEL))))+'</h3></div><button class="btn ghost small" type="button" data-tab="fuel">Full plan</button></div>'+
    '<div class="stats">'+stat("ty-long","flame","Energy",sn.kcal+"<small>kcal</small>")+stat("ty-food","grain","Carbs",sn.carb+"<small>g</small>")+stat("ty-strength","egg","Protein",sn.prot==null?"Dr.<small>advice</small>":sn.prot+"<small>g</small>")+"</div>"+
    meals(p,sd,next).slice(0,3).map(mealRow).join("");
}
function renderSession(){
  const r=R(), p=r.profile, ts=iso(today()), sd=parse(SEL), day=findDay(sd), card=$("#todayCard"), pc=PLAN.pc;
  const lbl=SEL===ts?"Today":SEL===iso(addDays(today(),1))?"Tomorrow":SEL===iso(addDays(today(),-1))?"Yesterday":fmtD(sd);
  if(!day){
    const after=sd>PLAN.race;
    card.className="card sess ty-race";
    card.innerHTML='<div class="sess-band">'+tile("",after?"medal":"cal")+'<div><span class="tiny">'+esc(lbl)+'</span><div class="ttl">'+(after?"Race done. Well run!":"Plan starts soon")+'</div></div></div><div class="sess-body"><p class="muted">'+(after?"Set a new goal to build the next plan.":"The plan begins on "+esc(fmtD(PLAN.start))+".")+'</p><div><button class="btn grad small" type="button" data-act="editRunner">Update goal</button></div></div>';
    return;
  }
  const st=statusOf(r,day), wk=weekOf(sd), L=dayLogs(r,SEL);
  card.className="card sess ty-"+day.type;
  const share=firstName(p.name)+"'s YHM training, "+fmtD(sd)+": "+day.title+"\n"+day.steps.join("\n")+"\n\nYHM Coach app: https://play.google.com/store/apps/details?id=com.yavatmalhealthmarathon.coach";
  let act="";
  if(day.type!=="rest"){
    if(st==="done"||st==="partial"){
      act='<div class="done-box">'+tile(st==="done"?"ty-ok":"ty-warn",st==="done"?"check":"pulse","sm")+'<div class="grow"><b>'+(st==="done"?"Done":"Partly done")+"</b>"+
        L.map(l=>'<div class="small muted">'+esc((srcLabel(l)?srcLabel(l)+" · ":"")+TL[l.type]+(logLine(l)?" · "+logLine(l):""))+"</div>").join("")+"</div></div>"+
        '<div class="row"><button class="btn ghost small" type="button" data-act="logSel">'+ic("plus","sm")+" Add details</button>"+shareBtn(share)+"</div>";
    } else if(st==="missed"){
      act=banner("ty-warn","warn","<b>Missed.</b> That's fine: don't double up, just carry on with the next session.")+
        '<div class="row"><button class="btn ghost" type="button" data-act="logSel">'+ic("check","sm")+" I did it, log it</button>"+shareBtn(share)+"</div>";
    } else if(st==="upcoming"){
      act='<div class="row"><span class="chip ty-primary">'+ic("cal","sm")+" In "+dayDiff(today(),sd)+(dayDiff(today(),sd)===1?" day":" days")+"</span>"+shareBtn(share)+"</div>";
    } else {
      act='<div class="row"><button class="btn grad" type="button" data-act="markDone">'+ic("check","sm")+' Mark as done</button><button class="btn ghost" type="button" data-act="logSel">'+ic("plus","sm")+" Log details</button>"+shareBtn(share)+"</div>"+
        (NATIVE&&S.me===r.id&&S.hc.status==="on"?'<p class="tiny">Ran with your watch? It is ticked off automatically after the watch syncs.</p>':"");
    }
  }
  const tipI=(sd.getDate()+sd.getMonth()*31)%TIPS.length;
  card.innerHTML='<div class="sess-band">'+tile("",TYPE_IC[day.type])+'<div style="min-width:0"><span class="tiny">'+esc(lbl)+" · "+esc(TYPE_LABEL[day.type]||"")+(wk?" · Week "+wk.n+" "+esc(wk.phase):"")+'</span><div class="ttl">'+esc(day.title.replace(/ [\d.]+ km$/,""))+"</div></div>"+
    (day.km?'<div class="km">'+day.km+"<small>KM</small></div>":"")+"</div>"+
    '<div class="sess-body">'+stepsHTML(day.steps)+zonesHTML(day,pc,p)+act+
    '<div class="coach">'+tile("ty-long","sun","sm")+'<p class="small"><b>Coach tip</b><br>'+esc(TIPS[tipI])+"</p></div></div>";
}
const shareBtn = txt => '<a class="btn ghost small" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(txt)+'">'+ic("whatsapp","sm")+" Share</a>";

/* ---------- plan ---------- */
function renderPlan(){
  const r=R(), p=r.profile, pc=PLAN.pc, t=today(), g=+p.goal, notes=[];
  if(g===42) notes.push("YHM 2027 has no 42 km race (the longest is the 21 km Half Marathon). Set your marathon's date in the profile.");
  if(g===42&&PLAN.N<16) notes.push("A marathon usually needs 16–20 weeks on top of a solid base. With "+PLAN.N+" weeks, consider the 21 km at YHM first.");
  if(g===21&&p.level==="new"&&PLAN.N<16) notes.push("Going from no running to 21 km in "+PLAN.N+" weeks is a big jump. The 10 km Power Run is a safer first goal.");
  if(p.age<18&&g>=21) notes.push("Under 18: the 5 km or 10 km is the recommended distance.");
  let n=0,s=0; PLAN.weeks.forEach(w=>{ const x=weekScore(r,w); n+=x.n; s+=x.s; });
  $("#planHead").innerHTML='<div class="card-h"><div class="ttl-row">'+tile("ty-primary","flag")+'<div><span class="label">'+esc(firstName(p.name))+"'s plan</span><h2>"+(g===21?"21.1 km Half Marathon":g===42?"42.2 km Marathon":g+" km "+GOAL_NAME[g])+"</h2></div></div>"+
    '<button class="btn ghost small" type="button" data-act="editRunner">Edit</button></div>'+
    '<p class="muted small">'+PLAN.N+" weeks · "+p.days+" run days a week · "+esc(fmtD(PLAN.start))+" to "+esc(fmtD(PLAN.race))+"</p>"+
    '<div class="stats">'+(pc.pred?stat("ty-race","medal","Predicted finish",fmtTime(pc.pred))+stat("ty-quality","clock","Race pace",fmtPace(pc.race)+"<small>/km</small>"):"")+
    stat("ty-long","road","Peak long run",PEAK[g][p.level]+"<small>km</small>")+(n?stat("ty-easy","check","Sessions done",Math.round(s)+"<small>/ "+n+"</small>"):"")+"</div>"+
    notes.map(x=>banner("ty-race","warn",esc(x))).join("");
  $("#adjustCard").innerHTML='<div class="card"><div class="ttl-row">'+tile("ty-quality","sync","sm")+"<h3>Coach adjustments</h3></div>"+
    (AD.notes.length?'<div class="notes">'+AD.notes.map(x=>'<div class="note">'+tile(x.ty,x.ic,"sm")+"<div><b>"+esc(x.t)+'</b><span class="small muted">'+esc(x.b)+"</span></div></div>").join("")+"</div>":'<p class="small muted">No changes this week. The plan runs as scheduled.</p>')+
    '<details><summary class="small" style="cursor:pointer;color:var(--primary);font-weight:600">How the plan adapts</summary><ul class="small muted" style="margin:8px 0 0;padding-left:1.2rem"><li>Fewer than half of last week\'s sessions done: this week is 15% lighter (25% after two light weeks).</li><li>Pain in a note, or effort 9–10/10: this week\'s speed sessions become easy runs.</li><li>A faster run of 3 km or more: training paces and predicted finish update.</li><li>Missed a day? Never double up. Carry on with the next session.</li></ul></details></div>';
  const hr=pc.hrmax, z=(cls,i,name,val,sub)=>'<div class="zone">'+tile(cls,i,"sm")+'<div><span class="tiny">'+name+'</span><div class="v">'+val+'</div><span class="tiny">'+sub+"</span></div></div>";
  $("#paceCard").innerHTML='<div class="ttl-row">'+tile("ty-race","pulse","sm")+'<h3>Training zones</h3></div><div class="zones">'+
    z("ty-easy","shoe","Easy / long",pc.easy?PR(pc.easy):"Talk test",Math.round(hr*.6)+"–"+Math.round(hr*.72)+" bpm · effort 3–4")+
    z("ty-long","flame","Tempo",pc.tempo?PR(pc.tempo):"Short phrases",Math.round(hr*.82)+"–"+Math.round(hr*.88)+" bpm · effort 6–7")+
    z("ty-quality","bolt","Intervals",pc.int?PR(pc.int):"A few words",Math.round(hr*.88)+"–"+Math.round(hr*.94)+" bpm · effort 8")+"</div>"+
    '<p class="tiny">Max heart rate estimated at '+hr+" bpm (208 − 0.7 × age). "+(AD.ad.fiveK?"Paces from recent runs (5 km ≈ "+fmtTime(AD.ad.fiveK)+").":pc.easy?"Paces from the 5 km time of "+esc(p.recent5k)+".":"Add a recent 5 km time, or log runs with time, to get exact paces.")+"</p>";
  $("#weeks").innerHTML=PLAN.weeks.map(w=>{
    const now=t>=w.mon&&t<addDays(w.mon,7), done=weekDoneKm(r,w), past=addDays(w.mon,6)<t;
    return '<details class="wk'+(now?" wk-now":"")+'"'+(now?" open":"")+'><summary><span class="row" style="gap:8px"><span class="wk-n">Week '+w.n+'</span><span class="phase ph-'+w.phase+'">'+esc(w.phase==="Race"?"Race week":w.phase)+"</span>"+(w.cut?'<span class="tiny">easier week</span>':"")+(now&&AD.ad.scale?'<span class="tiny" style="color:var(--warn)">eased '+Math.round((1-AD.ad.scale)*100)+"%</span>":"")+
      '</span><span class="row" style="gap:6px"><span class="tiny">'+esc(fmtD(w.mon))+'</span><b class="num" style="font-size:1.15rem">'+((now||past)&&done?done+"/":"")+w.km+" km</b></span>"+
      ((now||past)?'<div class="wk-dots" aria-hidden="true">'+w.days.map(d=>{ const st=statusOf(r,d); return '<i class="'+(["done","partial","missed","rest"].includes(st)?st:"")+'"></i>'; }).join("")+"</div>":"")+"</summary>"+
      w.days.map(d=>{ const ds=iso(d.date), st=statusOf(r,d);
        return '<div class="day ty-'+d.type+(ds===iso(t)?" today":"")+'" data-sel="'+ds+'" style="cursor:pointer"><div class="d">'+WD[d.date.getDay()]+"<b>"+d.date.getDate()+"</b></div>"+tile("",TYPE_IC[d.type],"sm")+
        '<div style="min-width:0"><div class="ttl">'+esc(d.title)+"</div>"+(STT[st]?sttChip(st):'<div class="tiny">'+esc(d.steps[0])+"</div>")+'</div><span class="km">'+(d.km?d.km+" km":"")+"</span></div>"; }).join("")+"</details>";
  }).join("");
  $("#strengthCard").innerHTML='<div class="ttl-row">'+tile("ty-strength","dumbbell")+'<div><span class="label">Fitness coach</span><h3>Runner strength circuit</h3></div></div><p class="small muted">On strength days, 2–3 rounds with 60 s rest between rounds. No equipment needed.</p>'+
    strengthRoutine(p).map((x,i)=>'<div class="ex"><span class="tile sm ty-strength"><b class="num">'+(i+1)+"</b></span><b>"+esc(x[0])+'</b><span class="small num muted">'+esc(x[1])+"</span></div>").join("")+
    '<div class="note">'+tile("ty-mobility","lotus","sm")+'<p class="small"><b>Mobility day</b><br>6 slow Surya Namaskar, hip-flexor lunge stretch 2 × 30 s, hamstring and calf stretch 2 × 30 s, ankle circles, 5 min legs up the wall.</p></div>';
}

/* ---------- progress ---------- */
function renderProgress(){
  const r=R(), p=r.profile, t=today(), ts=iso(t), g=+p.goal;
  const start=iso(PLAN.start), runs=r.logs.filter(l=>RUNLIKE(l.type));
  const total=Math.round(runs.filter(l=>l.date>=start).reduce((s,l)=>s+(+l.km||0),0)*10)/10;
  let n=0,s=0; PLAN.weeks.forEach(w=>{ const x=weekScore(r,w); n+=x.n; s+=x.s; });
  let streak=0; for(let i=0;i<150;i++){ const d=addDays(t,-i), pd=findDay(d); if(!pd) break; const st=statusOf(r,pd);
    if(st==="done"||st==="partial"||st==="rest") streak++; else if(i===0&&st==="today") continue; else break; }
  const cut28=iso(addDays(t,-28)), longest=Math.max(0,...runs.filter(l=>l.date>=cut28).map(l=>+l.km||0)), peak=PEAK[g][p.level];
  const active30=new Set(r.logs.filter(l=>l.date>=iso(addDays(t,-29))).map(l=>l.date)).size;
  const pct=n?s/n:0, RC=2*Math.PI*34;
  $("#progHead").innerHTML='<div class="phero"><div style="position:relative;z-index:1;min-width:0"><div class="ttl-row"><span class="av" style="background:'+r.color+";--avc:"+r.color+'">'+esc(initials(p.name))+'</span><div style="min-width:0"><span class="label">Progress · '+goalLabel(p.goal)+' km</span><h2 style="font-size:1.4rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(p.name||"Runner")+'</h2></div></div>'+
      '<div class="big" style="margin-top:10px">'+total+'<small>KM</small></div><span class="small" style="opacity:.85">run in the plan so far</span></div>'+
      '<svg viewBox="0 0 84 84" role="img" aria-label="'+Math.round(pct*100)+'% of sessions done"><circle cx="42" cy="42" r="34" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="8"/><circle class="arc" cx="42" cy="42" r="34" fill="none" stroke="#ffc93c" stroke-width="8" stroke-linecap="round" stroke-opacity="'+(pct>0?1:0)+'" stroke-dasharray="'+(RC*pct).toFixed(1)+" "+RC.toFixed(1)+'" transform="rotate(-90 42 42)"/><text x="42" y="44" text-anchor="middle" font-size="19" font-weight="800" fill="#fff" font-family="Barlow Condensed,Arial Narrow,sans-serif">'+Math.round(pct*100)+'%</text><text x="42" y="58" text-anchor="middle" font-size="8.5" fill="rgba(255,255,255,.8)" font-family="Mukta,sans-serif">sessions</text></svg></div>'+
    '<div class="stats">'+stat("ty-primary","road","Distance in plan",total+"<small>km</small>")+stat("ty-easy","check","Sessions done",(n?Math.round(s/n*100):0)+"<small>% · "+Math.round(s)+"/"+n+"</small>")+
    stat("ty-race","flame","On-plan streak",streak+"<small>days</small>")+stat("ty-long","cal","Active days",active30+"<small>/ 30</small>")+
    stat("ty-quality","medal","Predicted finish",PLAN.pc.pred?fmtTime(PLAN.pc.pred):"—")+stat("ty-mobility","bolt","5 km estimate",AD.ad.fiveK?fmtTime(AD.ad.fiveK):PLAN.pc.t5?fmtTime(PLAN.pc.t5):"—")+"</div>"+
    '<div><div class="row" style="justify-content:space-between"><span class="small"><b>Long-run readiness</b></span><span class="small num">'+longest+" / "+peak+' km</span></div><div class="bar" style="margin-top:6px"><i style="width:'+Math.min(100,longest/peak*100)+'%"></i></div><p class="tiny" style="margin-top:4px">Longest run in the last 4 weeks against the peak long run in the plan.</p></div>';
  // weekly chart
  const W=PLAN.weeks, H=170, pl=28, pb=24, cw=Math.max(320,W.length*32), slot=(cw-pl-8)/W.length, bw=Math.min(20,slot*0.62);
  const max=Math.max(5,...W.map(w=>Math.max(w.km,weekDoneKm(r,w)))), step=max>40?20:max>20?10:5, top=Math.ceil(max/step)*step, y=v=>H-pb-(v/top)*(H-pb-10);
  let svg='<svg viewBox="0 0 '+cw+" "+H+'" width="'+cw+'" height="'+H+'" role="img" aria-label="Planned and completed km per week" style="display:block;max-width:none">';
  for(let v=0;v<=top;v+=step) svg+='<line x1="'+pl+'" x2="'+cw+'" y1="'+y(v)+'" y2="'+y(v)+'" stroke="var(--line)"/><text x="'+(pl-5)+'" y="'+(y(v)+4)+'" text-anchor="end" font-size="10" fill="var(--ink-3)">'+v+"</text>";
  W.forEach((w,i)=>{ const x=pl+8+i*slot, d=weekDoneKm(r,w), now=t>=w.mon&&t<addDays(w.mon,7), fut=w.mon>t;
    svg+='<rect x="'+x+'" y="'+y(w.km)+'" width="'+bw+'" height="'+(H-pb-y(w.km))+'" fill="var(--surface-2)" stroke="var(--ink-3)" stroke-opacity=".5" stroke-dasharray="'+(fut?"3 2":"0")+'" rx="4"/>';
    if(d>0){ const dd=Math.min(d,top); svg+='<rect x="'+(x+3)+'" y="'+y(dd)+'" width="'+(bw-6)+'" height="'+(H-pb-y(dd))+'" fill="'+(d>=w.km*0.9?"var(--c-easy)":"var(--sky)")+'" rx="3"><title>Week '+w.n+": "+d+" of "+w.km+" km</title></rect>"; }
    svg+='<text x="'+(x+bw/2)+'" y="'+(H-7)+'" text-anchor="middle" font-size="10.5" fill="'+(now?"var(--orange)":"var(--ink-3)")+'" font-weight="'+(now?800:400)+'">'+w.n+"</text>"; });
  $("#weekChart").innerHTML='<div class="card-h"><div class="ttl-row">'+tile("ty-primary","chart","sm")+'<h3>Weekly distance</h3></div><div class="legend"><span><i style="background:var(--surface-2);border:1px solid var(--ink-3)"></i>Planned</span><span><i style="background:var(--sky)"></i>Done</span><span><i style="background:var(--c-easy)"></i>On target</span></div></div><div class="chart-wrap" id="wcWrap">'+svg+"</svg></div>";
  const cwk=PLAN.weeks.findIndex(w=>t>=w.mon&&t<addDays(w.mon,7)); const wrap=$("#wcWrap"); if(wrap&&cwk>4) wrap.scrollLeft=pl+(cwk-4)*slot;
  // pace trend
  const pr=runs.filter(l=>l.type==="run"&&+l.km>=2&&+l.min>0).sort((a,b)=>a.date.localeCompare(b.date)).slice(-14);
  if(pr.length>=2){
    const PW=340, PH=150, l0=40, b0=26, pcs=pr.map(l=>l.min*60/l.km), lo=Math.min(...pcs)-15, hi=Math.max(...pcs)+15;
    const X=i=>l0+6+i*((PW-l0-14)/(pr.length-1)), Y=v=>10+(v-lo)/(hi-lo)*(PH-b0-10);
    let ps='<svg viewBox="0 0 '+PW+" "+PH+'" width="100%" role="img" aria-label="Pace of recent runs, faster is higher">';
    const ticks=[lo+15,(lo+hi)/2,hi-15]; ticks.forEach(v=>{ ps+='<line x1="'+l0+'" x2="'+PW+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="var(--line)"/><text x="'+(l0-5)+'" y="'+(Y(v)+4)+'" text-anchor="end" font-size="10" fill="var(--ink-3)">'+fmtPace(v)+"</text>"; });
    ps+='<polyline fill="none" stroke="var(--sky)" stroke-width="2.5" stroke-linejoin="round" points="'+pr.map((l,i)=>X(i).toFixed(1)+","+Y(pcs[i]).toFixed(1)).join(" ")+'"/>';
    pr.forEach((l,i)=>{ ps+='<circle cx="'+X(i)+'" cy="'+Y(pcs[i])+'" r="'+(3+Math.min(5,l.km/4))+'" fill="var(--primary)" stroke="var(--surface)" stroke-width="2"><title>'+esc(fmtD(parse(l.date))+": "+l.km+" km at "+fmtPace(pcs[i])+" /km")+"</title></circle>"; });
    ps+='<text x="'+X(0)+'" y="'+(PH-6)+'" font-size="10" fill="var(--ink-3)">'+esc(fmtD(parse(pr[0].date)))+'</text><text x="'+X(pr.length-1)+'" y="'+(PH-6)+'" font-size="10" text-anchor="end" fill="var(--ink-3)">'+esc(fmtD(parse(pr[pr.length-1].date)))+"</text></svg>";
    $("#paceChart").innerHTML='<div class="ttl-row">'+tile("ty-quality","bolt","sm")+'<div><h3>Pace trend</h3><span class="tiny">Last '+pr.length+" runs · faster is higher · bigger dot = longer run</span></div></div>"+ps;
  } else $("#paceChart").innerHTML='<div class="ttl-row">'+tile("ty-quality","bolt","sm")+'<h3>Pace trend</h3></div><p class="small muted">Log two or more runs with distance and time to see your pace improve.</p>';
  // steps
  const sc=$("#stepsChart"), days14=Array.from({length:14},(_,i)=>iso(addDays(t,i-13)));
  const sv=days14.map(d=>S.stepsHist[d]||0);
  if(S.me===r.id&&sv.some(v=>v>0)){
    sc.hidden=false; const SW=340, SH=130, smax=Math.max(10000,...sv), bwd=(SW-20)/14;
    let ss='<svg viewBox="0 0 '+SW+" "+SH+'" width="100%" role="img" aria-label="Daily steps, last 14 days">';
    const gy=SH-22-(8000/smax)*(SH-34);
    sv.forEach((v,i)=>{ const h=(v/smax)*(SH-34); ss+='<rect x="'+(10+i*bwd+2)+'" y="'+(SH-22-h)+'" width="'+(bwd-4)+'" height="'+Math.max(h,1)+'" rx="3" fill="'+(v>=8000?"var(--c-long)":"var(--c-long-soft)")+'"><title>'+esc(fmtD(parse(days14[i]))+": "+v.toLocaleString("en-IN")+" steps")+"</title></rect>"+
      (i%2===1||i===13?'<text x="'+(10+i*bwd+bwd/2)+'" y="'+(SH-8)+'" font-size="10" text-anchor="middle" fill="'+(i===13?"var(--orange)":"var(--ink-3)")+'">'+parse(days14[i]).getDate()+"</text>":""); });
    ss+='<line x1="10" x2="'+(SW-10)+'" y1="'+gy+'" y2="'+gy+'" stroke="var(--c-long)" stroke-dasharray="4 3"/><text x="'+(SW-10)+'" y="'+(gy-4)+'" font-size="10" text-anchor="end" fill="var(--c-long)">8,000 goal</text></svg>';
    const avg=Math.round(sv.reduce((a,b)=>a+b,0)/sv.filter(v=>v>0).length);
    sc.innerHTML='<div class="card-h"><div class="ttl-row">'+tile("ty-long","steps","sm")+'<div><h3>Daily steps</h3><span class="tiny">From '+HC+' · average '+avg.toLocaleString("en-IN")+"</span></div></div></div>"+ss;
  } else sc.hidden=true;
  renderWeight(); renderSyncCard(); renderHistory();
}
function renderWeight(){
  const r=R(), p=r.profile, W=r.weights.slice().sort((a,b)=>a.date.localeCompare(b.date)), first=W[0], last=W[W.length-1];
  let spark="";
  if(W.length>=2){ const vs=W.map(w=>w.kg), lo=Math.min(...vs)-1, hi=Math.max(...vs)+1, SW=300, SH=60;
    spark='<svg viewBox="0 0 '+SW+" "+SH+'" width="100%" height="60" role="img" aria-label="Weight trend"><polyline fill="none" stroke="var(--c-strength)" stroke-width="2.5" stroke-linejoin="round" points="'+W.map((w,i)=>(6+i*(SW-12)/(W.length-1)).toFixed(1)+","+(6+(hi-w.kg)/(hi-lo)*(SH-12)).toFixed(1)).join(" ")+'"/></svg>'; }
  const diff=first&&last&&W.length>1?Math.round((last.kg-first.kg)*10)/10:null, hcw=S.me===r.id&&S.hcWeight&&(!last||Math.abs(S.hcWeight-last.kg)>=0.1)?S.hcWeight:null;
  $("#weightCard").innerHTML='<div class="card-h"><div class="ttl-row">'+tile("ty-strength","user","sm")+'<div><h3>Weight</h3><span class="tiny">BMI '+bmi(p).toFixed(1)+" · nutrition targets use "+p.weight+" kg</span></div></div>"+
    (diff!=null?'<span class="chip '+(diff<=0?"ty-ok":"ty-warn")+'">'+(diff>0?"+":"")+diff+" kg since "+esc(fmtD(parse(first.date)))+"</span>":"")+"</div>"+spark+
    '<form id="wForm" class="row" style="flex-direction:row;flex-wrap:nowrap;align-items:flex-end"><div class="field grow"><label for="wKg">Today\'s weight (kg)</label><input id="wKg" type="number" inputmode="decimal" step="0.1" min="25" max="200" placeholder="'+p.weight+'"></div><button class="btn grad" type="submit">Save</button></form>'+
    (hcw?'<button class="linkbtn" type="button" data-act="useHcWeight">Use '+hcw+" kg from "+HC+"</button>":"");
}
function renderHistory(){
  const r=R(), L=r.logs.slice().sort((a,b)=>b.date.localeCompare(a.date)||String(b.id).localeCompare(String(a.id))).slice(0,60);
  $("#historyCard").innerHTML='<div class="card-h"><div class="ttl-row">'+tile("ty-primary","pulse","sm")+'<div><h3>Activity history</h3><span class="tiny">'+r.logs.length+' total</span></div></div><button class="btn grad small" type="button" data-act="logNew">'+ic("plus","sm")+" Add</button></div>"+
    (L.length?L.map(l=>{ const src=srcLabel(l);
      return '<div class="log">'+tile(TT[l.type]||"ty-rest",TYPE_IC[l.type]||"pulse","sm")+'<div style="min-width:0"><b>'+esc(TL[l.type]||"Activity")+"</b>"+(src?'<span class="src">'+esc(src)+"</span>":"")+
        '<div class="meta">'+esc(fmtD(parse(l.date))+(logLine(l)?" · "+logLine(l):""))+"</div>"+(l.note?'<div class="meta">'+esc(l.note)+"</div>":"")+
        '</div><button class="del" type="button" data-del="'+esc(l.id)+'" aria-label="Delete activity">'+ic("trash","sm")+"</button></div>"; }).join("")
    :'<p class="small muted">No activities yet. Mark a session done, add one, sync your watch or import a file.</p>');
}

/* ---------- Health Connect ---------- */
let syncing=false;
const APPS=["Garmin Connect","Samsung Health","Fitbit","Strava","Google Fit","Mi Fitness","Zepp","COROS","Noise","boAt"];
function renderSyncCard(){
  const el=$("#syncCard"); if(!el||!R()) return;
  const hc=S.hc||{}, me=S.runners[S.me], r=R(), D=hc.diag||{};
  const imp='<label class="drop" id="drop">'+tile("ty-mobility","upload")+'<span class="grow"><b>Import a file</b><br><span class="small muted">GPX, TCX or CSV exported from Garmin Connect, Strava or other apps</span></span><input type="file" id="fileIn" accept=".gpx,.tcx,.csv" multiple hidden></label><p class="tiny" id="importMsg" role="status"></p>';
  if(!NATIVE){
    el.innerHTML='<div class="ttl-row">'+tile("ty-easy","sync")+'<div><h3>Watch & app sync</h3><span class="tiny">Automatic in the YHM Coach app for Android and iPhone</span></div></div><p class="small muted">The phone apps read runs from Health Connect (Android) or Apple Health (iPhone), which these apps share to. Here in the browser, import exported files.</p><div class="apps">'+APPS.map(a=>'<span class="app-b">'+a+"</span>").join("")+"</div>"+imp;
    return;
  }
  if(S.me!==r.id){
    el.innerHTML='<div class="ttl-row">'+tile("ty-easy","sync")+'<div><h3>Watch sync</h3><span class="tiny">'+(me?"This phone's watch data goes to "+esc(me.profile.name):"No runner is set for this phone")+'</span></div></div><p class="small muted">Activities for '+esc(firstName(r.profile.name))+" are added with the Add button or by importing a file.</p>"+
      '<div class="row"><button class="btn ghost small" type="button" data-act="setMe">Use this phone for '+esc(firstName(r.profile.name))+"</button></div>"+imp;
    return;
  }
  const on=hc.status==="on", when=hc.last?new Date(hc.last).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"}):"";
  const stTxt=syncing?"Syncing…":on?"Connected · last sync "+when:hc.status==="missing"?IOS?"Apple Health is not available on this device":"Health Connect is not installed":hc.status==="denied"?"Permission needed":hc.status==="error"?"Last sync failed":"Not connected";
  const srcs=D.sources&&Object.keys(D.sources).length?Object.entries(D.sources).map(([k,v])=>k+" ("+v+")").join(", "):"none";
  const PN={workouts:"Exercise",distance:"Distance",heartRate:"Heart rate",steps:"Steps",weight:"Weight"};
  const gr=D.granted?Object.keys(PN).map(k=>(D.granted.includes(k)?"✓ ":"✗ ")+PN[k]).join("  "):"—";
  el.innerHTML='<div class="card-h"><div class="ttl-row">'+tile("ty-easy","sync")+'<div><h3>'+HC+'</h3><span class="tiny">'+esc(stTxt)+"</span></div></div>"+(on?'<span class="chip ty-ok">'+ic("check","sm")+" On</span>":"")+"</div>"+
    '<p class="small muted">Runs, walks and workouts from your watch app arrive automatically when you open YHM Coach.</p><div class="apps">'+APPS.map(a=>'<span class="app-b">'+a+"</span>").join("")+"</div>"+
    (on&&D.found===0?banner("ty-warn","warn","<b>No workouts found in the last 30 days.</b> Your watch app is probably not sharing yet. Open <b>Connect your watch</b> below and follow the steps for your app."):"")+
    '<div class="row">'+(hc.status==="missing"?'<a class="btn grad" href="https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata">Get Health Connect</a>':'<button class="btn grad" type="button" data-act="hcSync"'+(syncing?" disabled":"")+">"+ic("sync","sm")+(on?" Sync now":" Connect")+"</button>")+
    '<button class="btn ghost small" type="button" data-act="hcSettings">'+(IOS?"Open Apple Health":"Health Connect settings")+'</button><button class="btn ghost small" type="button" data-act="watchHelp">Connect your watch</button></div>'+
    (D.at?'<details><summary class="small" style="cursor:pointer;color:var(--primary);font-weight:600">Sync details</summary><div class="diag" style="margin-top:8px"><b>Permissions</b><span>'+esc(gr)+"</span><b>Workouts (30 days)</b><span>"+(D.found!=null?D.found:"—")+"</span><b>From</b><span>"+esc(srcs)+"</span><b>New this sync</b><span>"+(D.added||0)+"</span><b>Steps</b><span>"+(D.stepsErr?"not available":"ok")+"</span>"+(D.error?"<b>Error</b><span>"+esc(D.error)+"</span>":"")+"</div></details>":"")+imp;
}
async function healthSync(manual){
  if(!NATIVE||syncing) return;
  const me=S.runners[S.me]; if(!me){ if(manual) toast("Choose which runner uses this phone in Settings"); return; }
  syncing=true; renderSyncCard();
  const D={at:Date.now()};
  try{
    const av=await NATIVE.health.available(); D.available=!!(av&&av.available);
    if(!D.available){ S.hc={status:"missing",diag:D}; save(); if(manual) toast(IOS?"Apple Health is not available on this device":"Install Health Connect from the Play Store first"); return; }
    if(manual){ try{ await NATIVE.health.connect(); }catch(e){} }
    let g=[]; try{ g=await NATIVE.health.granted(); }catch(e){} D.granted=g;
    if(!g.includes("workouts")){ S.hc={status:"denied",diag:D}; save(); if(manual) toast(IOS?"Allow Workouts for YHM Coach: Health app → Profile → Apps → YHM Coach":"Allow 'Exercise' for YHM Coach in Health Connect"); return; }
    const since=S.hc&&S.hc.last?new Date(Math.max(S.hc.last-7*864e5,addDays(today(),-30).getTime())):addDays(today(),-30);
    const ws=await NATIVE.health.workouts(since.toISOString());
    D.found=ws.length; D.sources={};
    let added=0, fixed=0, hrLeft=20;
    for(const w of ws){
      const src=srcName(w.sourceId,w.sourceName); D.sources[src]=(D.sources[src]||0)+1;
      const pid=w.platformId||(w.startDate+"|"+w.duration), km=w.totalDistance?Math.round(w.totalDistance/10)/100:0;
      const old=me.logs.find(l=>l.pid===pid);
      if(old){ if(!old.km&&km){ old.km=km; fixed++; } continue; }
      const type=HC_TYPE[w.workoutType]||"other", ds=iso(new Date(w.startDate));
      if(me.logs.some(l=>l.src!=="hc"&&l.src!=="plan"&&l.date===ds&&km&&Math.abs((+l.km||0)-km)<0.15)) continue;
      const quick=me.logs.find(l=>l.src==="plan"&&l.date===ds&&RUNLIKE(l.type)===RUNLIKE(type));
      if(quick) me.logs=me.logs.filter(l=>l!==quick);
      let hr=null; if(hrLeft-->0){ try{ hr=await NATIVE.health.avgHr(w.startDate,w.endDate); }catch(e){} }
      me.logs.push({id:"h"+Date.now().toString(36)+"-"+added,pid,date:ds,type,km,min:Math.round(w.duration/60)||null,hr,rpe:null,note:"",src:"hc",srcName:src});
      added++;
    }
    try{ Object.assign(S.stepsHist,await NATIVE.health.stepsHistory(14)); }catch(e){ D.stepsErr=true; }
    try{ const wt=await NATIVE.health.latestWeight(); if(wt) S.hcWeight=Math.round(wt*10)/10; }catch(e){}
    D.added=added;
    if(added&&dayLogs(me,iso(today())).length) setCheck(me,"workout",true);
    S.hc={status:"on",last:Date.now(),diag:D};
    save(); syncing=false; renderAll();
    if(manual) toast(added?added+" new "+(added===1?"activity":"activities")+" synced":fixed?fixed+" activities updated with distance":ws.length?"Up to date · "+ws.length+" workouts in 30 days":"Connected. No workouts shared yet");
  }catch(e){
    D.error=String(e&&e.message||e).slice(0,160);
    S.hc=Object.assign({},S.hc,{status:S.hc&&S.hc.status==="on"?"on":"error",diag:D}); save();
    if(manual) toast("Sync didn't work: "+D.error);
  }finally{ syncing=false; renderSyncCard(); }
}

/* ---------- fuel ---------- */
function renderFuel(){
  const p=R().profile, t=today(), day=findDay(t)||{type:"rest",km:0,title:"Rest day"};
  let longDay=null; for(let i=0;i<7&&!longDay;i++){ const d=findDay(addDays(t,i)); if(d&&(d.type==="long"||d.type==="race")) longDay=d; }
  const rest=nutri(p,{type:"rest",km:0}), lg=longDay?nutri(p,longDay):null, n=nutri(p,day), b=rest.bmi;
  $("#fuelHead").innerHTML='<div class="ttl-row">'+tile("ty-food","leaf")+'<div><span class="label">Nutrition coach · '+esc(firstName(p.name))+'</span><h2>Daily targets</h2></div></div>'+
    '<p class="small muted">'+esc((p.sex==="f"?"Female":"Male")+", "+p.age+" y, "+p.weight+" kg, "+p.height+" cm · BMI "+b.toFixed(1)+(b>=25?" (above the healthy range: small deficit on easy days only)":b<18.5?" (below the healthy range: eat a little more)":" (healthy)"))+"</p>"+
    '<div class="stats">'+stat("ty-rest","moon","Rest day",rest.kcal+"<small>kcal</small>")+(lg?stat("ty-long","road",esc(longDay.type==="race"?"Race day":"Long run "+WD[longDay.date.getDay()]),lg.kcal+"<small>kcal</small>"):"")+
    stat("ty-strength","egg","Protein",n.prot==null?"Per doctor":n.prot+"<small>g/day</small>")+stat("ty-water","drop","Water today",(n.water/1000).toFixed(1)+"<small>L</small>")+"</div>"+
    (function(){ const kc=n.carb*4+(n.prot||p.weight)*4+n.fat*9, c=n.carb*4/kc*100, pr=(n.prot||p.weight)*4/kc*100, f=100-c-pr;
      return '<div><div class="row" style="justify-content:space-between"><span class="small"><b>Today\'s energy split</b></span><span class="small num">'+n.kcal+' kcal</span></div><div class="macro" style="margin-top:6px" role="img" aria-label="Carbs '+Math.round(c)+'%, protein '+Math.round(pr)+'%, fat '+Math.round(f)+'%"><i style="width:'+c+'%;background:var(--c-food)"></i><i style="width:'+pr+'%;background:var(--c-strength)"></i><i style="width:'+f+'%;background:var(--c-long)"></i></div>'+
        '<div class="legend" style="margin-top:6px"><span><i style="background:var(--c-food)"></i>Carbs '+n.carb+' g</span><span><i style="background:var(--c-strength)"></i>Protein '+(n.prot==null?"per doctor":n.prot+" g")+'</span><span><i style="background:var(--c-long)"></i>Fat '+n.fat+' g</span></div></div>'; })()+
    '<p class="tiny">Carbs today '+n.carb+" g · fat about "+n.fat+" g. Energy from the Mifflin–St Jeor formula plus the day's training. More carbs on long and hard days, fewer on rest days.</p>";
  const next=findDay(addDays(t,1));
  $("#mealCard").innerHTML='<div class="card-h"><h3>Sample day: '+esc(day.title)+'</h3><span class="chip ty-food">'+esc({veg:"Veg",egg:"Egg",nonveg:"Non-veg"}[p.diet]||"Veg")+"</span></div>"+meals(p,day,next).map(mealRow).join("");
  const cn=(p.conditions||[]).filter(k=>COND_NOTES[k]), hn=(p.habits||[]).filter(k=>HAB_NOTES[k]);
  $("#healthNotes").innerHTML='<div class="ttl-row">'+tile("ty-race","heart","sm")+"<h3>Health and habits</h3></div>"+
    (cn.length||hn.length?'<div class="notes">'+cn.map(k=>'<div class="note">'+tile("ty-race",COND_IC[k],"sm")+"<div><b>"+esc(COND_NOTES[k][0])+'</b><span class="small muted">'+esc(COND_NOTES[k][1])+"</span></div></div>").join("")+
      hn.map(k=>'<div class="note">'+tile("ty-long",HAB_IC[k]==="bowl"?"plate":HAB_IC[k],"sm")+"<div><b>"+esc(HAB_NOTES[k][0])+'</b><span class="small muted">'+esc(HAB_NOTES[k][1])+"</span></div></div>").join("")+"</div>"
     :'<p class="small muted">No conditions or habits selected. Add them in the profile for specific advice.</p>')+
    '<p class="tiny">General guidance for runners. Your own doctor\'s advice comes first.</p>';
  const g=+p.goal, rf={5:["Light breakfast 2 h before: a banana with toast, or 2 idli.","300–500 ml water before the start. No food needed during the race."],
    10:["Light breakfast 2 h before: 2–3 idli or poha with a banana.","300–500 ml water before; sip at aid stations if thirsty. No gels needed."],
    21:["Breakfast 2.5–3 h before: 3 idli or poha + banana + water.","15 min before: half a banana or 2 dates.","During: water at aid stations; a gel or 3–4 dates around 8–10 km and 15 km.","Practise this exact routine on two long runs first."],
    42:["Carb-load for 2 days before: rice, chapati, potato, banana, about 7–8 g carbs per kg.","Breakfast 3 h before the start.","During: 30–60 g carbs an hour from 45 min (gels, dates, banana) and electrolytes every hour.","Rehearse every detail on your 28–32 km runs."]}[g];
  $("#raceFuel").innerHTML='<div class="ttl-row">'+tile("ty-race","medal","sm")+"<h3>Race-day fuelling · "+goalLabel(p.goal)+' km</h3></div><div class="ty-race">'+stepsHTML(rf)+'</div><p class="tiny">Nothing new on race day: no new shoes, food or gel.</p>';
}

/* ---------- race ---------- */
let UPDATES=EMBED_UPDATES.slice();
function renderCountdown(){
  const el=$("#cd"); if(!el) return;
  const ms=new Date(2027,0,3,0,0,0)-new Date();
  if(ms<=0){ el.innerHTML='<div style="grid-column:1/-1"><b>'+(ms>-864e5?"RACE DAY!":"THANK YOU")+"</b><span>"+(ms>-864e5?"Run strong, Yavatmal":"See you at YHM 2028")+"</span></div>"; return; }
  const d=Math.floor(ms/864e5), h=Math.floor(ms%864e5/36e5), m=Math.floor(ms%36e5/6e4);
  el.innerHTML="<div><b>"+d+"</b><span>Days</span></div><div><b>"+pad(h)+"</b><span>Hours</span></div><div><b>"+pad(m)+"</b><span>Minutes</span></div>";
}
function renderRace(){
  renderCountdown();
  const rt=$("#regText"); if(rt) rt.innerHTML=iso(today())<="2026-11-30"?"<b>Early bird: 25% off till 30 November 2026.</b> Register at www.yavatmalhealthmarathon.com":"<b>Registration is open</b> at www.yavatmalhealthmarathon.com";
  $("#updList").innerHTML=UPDATES.slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))).map((u,i)=>'<div class="upd">'+tile(["ty-race","ty-quality","ty-long","ty-easy"][i%4],"megaphone","sm")+'<div><span class="tiny">'+esc(u.date?fmtD(parse(u.date))+" "+u.date.slice(0,4):"")+"</span><b>"+esc(u.title)+'</b><span class="small muted">'+esc(u.body)+"</span>"+(u.link?' <a href="'+esc(u.link)+'" target="_blank" rel="noopener" class="small">Open ↗</a>':"")+"</div></div>").join("");
  const rc=(R()&&R().checks.race)||{};
  const items=[["Bib pinned to the front of your T-shirt, timing chip attached","id"],["Shoes and socks you have already run in","shoe"],["Throwaway layer for the cool January morning","shirt"],["Breakfast 2–3 h before; water bottle","bottle"],["Reach Nehru Stadium 45 min before your start","clock"],["Emergency contact written on the back of your bib","phone"]];
  $("#raceChecks").innerHTML=items.map((x,i)=>'<label class="check">'+tile("ty-easy",x[1],"sm")+"<span>"+esc(x[0])+'</span><input type="checkbox" data-rc="'+i+'"'+(rc[i]?" checked":"")+"></label>").join("");
  $("#contactCard").innerHTML='<div class="ttl-row">'+tile("ty-primary","phone","sm")+"<h3>Contact the organisers</h3></div>"+
    '<div class="contact"><span><span class="tiny">Website & registration</span><br><code>www.yavatmalhealthmarathon.com</code></span><a class="btn ghost small" target="_blank" rel="noopener" href="'+REG_URL+'">'+ic("globe","sm")+" Open</a></div>"+
    '<div class="contact"><span><span class="tiny">Phone / WhatsApp</span><br><code>9225183880</code></span><span class="row">'+
      (NATIVE?'<a class="btn ghost small" href="tel:+919225183880">'+ic("phone","sm")+" Call</a>":'<button class="btn ghost small" type="button" data-copy="9225183880">Copy</button>')+
      '<a class="btn ghost small" target="_blank" rel="noopener" href="https://wa.me/919225183880">'+ic("whatsapp","sm")+" WhatsApp</a></span></div>"+
    '<div class="contact"><span><span class="tiny">Phone</span><br><code>9405166099</code></span>'+(NATIVE?'<a class="btn ghost small" href="tel:+919405166099">'+ic("phone","sm")+" Call</a>":'<button class="btn ghost small" type="button" data-copy="9405166099">Copy</button>')+"</div>"+
    '<div class="contact"><span><span class="tiny">Email</span><br><code>yavatmalhealthmarathon@gmail.com</code></span>'+
      (NATIVE?'<a class="btn ghost small" href="mailto:yavatmalhealthmarathon@gmail.com">'+ic("mail","sm")+" Email</a>":'<button class="btn ghost small" type="button" data-copy="yavatmalhealthmarathon@gmail.com">Copy</button>')+"</div>"+
    '<p class="tiny">Training Partner: Dose-T</p>';
}
async function loadUpdates(){
  const urls=NATIVE?UPDATE_URLS.concat(["updates.json"]):["updates.json"];
  for(const u of urls){ try{ const r=await fetch(u,{cache:"no-store"}); if(r.ok){ const v=await r.json(); if(Array.isArray(v)&&v.length){ UPDATES=v; renderRace(); return; } } }catch(e){} }
}

/* ---------- reminders ---------- */
const WATER_MSG=["Time for a glass of water 💧","Water break 💧 Sip, don't gulp.","Hydration check 💧 Pale yellow urine means you're doing well.","A glass of water now. Add a pinch of salt and lemon after a long run.","Keep a bottle on your desk 💧"];
function waterHours(){ const e=+S.rem.waterEvery||2, out=[]; for(let h=8;h<=20;h+=e) out.push(Math.floor(h)); return out; }
async function scheduleNative(interactive){
  if(!NATIVE) return false;
  try{
    if(!S.rem.on){ await NATIVE.notify.clear(); return false; }
    const ok=await NATIVE.notify.permit(interactive);
    if(!ok){ if(interactive) toast(IOS?"Allow notifications: iPhone Settings → YHM Coach → Notifications":"Allow notifications: phone Settings → Apps → YHM Coach → Notifications"); return false; }
    const me=S.runners[S.me]||R(); if(!me) return false;
    const p=me.profile, plan=me.id===S.active?PLAN:buildPlan(p,adapt(me).ad), now=new Date(), list=[], [h,m]=hm(p.remind), [th,tm]=hm(S.rem.tomorrowAt), nm=firstName(p.name);
    for(let i=0;i<(IOS?14:21);i++){
      const d=addDays(today(),i), s=findIn(plan,d);
      if(S.rem.train&&s){ const at=new Date(d); at.setHours(h,m,0,0);
        if(at>now) list.push({id:1000+i,title:s.type==="rest"?"Rest day today "+EMO.rest:"Today: "+s.title+" "+(EMO[s.type]||""),body:s.type==="rest"?"Recover well, "+nm+". A relaxed walk is fine.":s.steps[0],at:at.toISOString()}); }
      const nx=findIn(plan,addDays(d,1));
      if(S.rem.tomorrow&&nx){ const at=new Date(d); at.setHours(th,tm,0,0);
        if(at>now) list.push({id:3000+i,title:"Tomorrow: "+nx.title+" "+(EMO[nx.type]||""),body:(TOM_TIP[nx.type]||TOM_TIP.easy)(nx),at:at.toISOString()}); }
    }
    if(S.rem.water) waterHours().forEach((hh,k)=>list.push({id:2001+k,title:WATER_MSG[k%WATER_MSG.length],body:"Target today about "+(nutri(p,{type:"easy",km:0}).water/1000).toFixed(1)+" L. Tap + in YHM Coach to count glasses.",hour:hh,minute:k?0:30}));
    if(S.rem.sleep){ const [sh,sm]=hm(S.rem.sleepAt); list.push({id:2100,title:"Lights out 🌙",body:"7–8 h sleep makes you fitter. Lay out your kit for the morning.",hour:sh,minute:sm}); }
    if(S.rem.weekly){ for(let j=0;j<3;j++){ const sun=addDays(monday(today()),6+7*j), at=new Date(sun); at.setHours(19,0,0,0); if(at<=now) continue;
      const w=plan.weeks.find(x=>sun>=x.mon&&sun<addDays(x.mon,7)), nw=plan.weeks.find(x=>x.mon.getTime()===addDays(sun,1).getTime());
      list.push({id:4000+j,title:"Your week in review 📊",body:(w?"Week "+w.n+" plan was "+w.km+" km. ":"")+(nw?"Next week: "+nw.phase+", "+nw.km+" km. ":"")+"Tap to see your progress.",at:at.toISOString()}); } }
    await NATIVE.notify.schedule(list);
    S.rem.count=list.length; S.rem.at=Date.now(); save();
    if(interactive) toast("Reminders set · "+list.length+" scheduled");
    return true;
  }catch(e){ if(interactive) toast("Couldn't set reminders: "+String(e&&e.message||e).slice(0,80)); return false; }
}
async function remindersOn(){ S.rem.on=true; const ok=await scheduleNative(true); if(!ok) S.rem.on=false; save(); renderAll(); if(ok) try{ await NATIVE.notify.test(); }catch(e){} }
function gcal(title,details,time,until){
  const [h,m]=hm(time), s=today(); s.setHours(h,m,0,0); const e=new Date(s.getTime()+15*60000);
  const f=d=>d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+"T"+pad(d.getHours())+pad(d.getMinutes())+"00";
  return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(title)+"&dates="+f(s)+"/"+f(e)+"&ctz=Asia/Kolkata&details="+encodeURIComponent(details)+"&recur="+encodeURIComponent("RRULE:FREQ=DAILY;UNTIL="+until.replace(/-/g,""));
}
let DL=null;
function renderReminders(){
  const el=$("#remCard"), Rm=S.rem, me=S.runners[S.me]||R(), p=me.profile;
  const head='<div class="card-h"><div class="ttl-row">'+tile("ty-long","bell")+'<div><h3>Reminders & notifications</h3><span class="tiny">For '+esc(p.name)+(NATIVE?" on this phone":"")+"</span></div></div>"+(NATIVE&&Rm.on?'<span class="chip ty-ok">'+ic("check","sm")+" On</span>":"")+"</div>";
  if(NATIVE){
    const sw=(id,i,cls,title,sub,extra,checked)=>'<div class="switch">'+tile(cls,i,"sm")+'<div class="grow"><label for="'+id+'"><b>'+title+'</b><span class="tiny">'+sub+"</span></label>"+(extra?'<div class="sw-x">'+extra+"</div>":"")+'</div><input type="checkbox" id="'+id+'"'+(checked?" checked":"")+"></div>";
    el.innerHTML=head+'<p class="small muted">Notifications work offline. The plan is re-checked every time you open the app.</p><div>'+
      sw("rTrain","shoe","ty-primary","Today's workout","Every morning with the day's session",'<input type="time" id="rTrainAt" value="'+esc(p.remind||"05:45")+'" aria-label="Morning reminder time">',Rm.train)+
      sw("rTom","cal","ty-quality","Tomorrow's plan","Each evening: what's tomorrow and how to prepare",'<input type="time" id="rTomAt" value="'+esc(Rm.tomorrowAt)+'" aria-label="Evening reminder time">',Rm.tomorrow)+
      sw("rWater","drop","ty-water","Drink water","8 am to 8 pm",'<select id="rWaterEvery" aria-label="How often">'+[[1,"Every hour"],[2,"Every 2 h"],[3,"Every 3 h"]].map(([v,l])=>'<option value="'+v+'"'+(+Rm.waterEvery===v?" selected":"")+">"+l+"</option>").join("")+"</select>",Rm.water)+
      sw("rSleep","moon","ty-rest","Sleep","Lights out, lay out your kit",'<input type="time" id="rSleepAt" value="'+esc(Rm.sleepAt)+'" aria-label="Sleep reminder time">',Rm.sleep)+
      sw("rWeek","chart","ty-easy","Weekly summary","Sundays at 7 pm","",Rm.weekly)+"</div>"+
      '<div class="row"><button class="btn grad" type="button" data-act="remSave">'+ic("bell","sm")+(Rm.on?" Save reminders":" Turn on reminders")+"</button>"+(Rm.on?'<button class="btn ghost small" type="button" data-act="remTest">Send a test</button><button class="btn ghost small" type="button" data-act="remOff">Turn off</button>':"")+"</div>"+
      (Rm.on&&Rm.count?'<p class="tiny">'+Rm.count+" reminders scheduled for the next "+(IOS?"2 weeks. If they don't arrive, allow notifications in iPhone Settings → YHM Coach → Notifications.":"3 weeks. If they don't arrive, allow notifications and turn off battery optimisation for YHM Coach in phone settings.")+"</p>":"");
    return;
  }
  const until=p.raceDate||RACE_DATE;
  el.innerHTML=head+'<p class="small muted">Each link opens Google Calendar with a daily reminder till race day. Tap Save there. The Android app sends these as phone notifications.</p><div class="row">'+
    '<a class="btn grad small" target="_blank" rel="noopener" href="'+gcal("YHM: today's workout","Open YHM Coach to see today's run, strength or rest day.",p.remind||"05:45",until)+'">'+ic("shoe","sm")+" Workout "+esc(p.remind||"05:45")+"</a>"+
    '<a class="btn ghost small" target="_blank" rel="noopener" href="'+gcal("YHM: tomorrow's plan","Check tomorrow's session in YHM Coach and lay out your kit.","20:30",until)+'">'+ic("cal","sm")+" Tomorrow's plan 8:30 pm</a>"+
    '<a class="btn ghost small" target="_blank" rel="noopener" href="'+gcal("YHM: drink water","A glass of water. Count it in YHM Coach.","11:00",until)+'">'+ic("drop","sm")+" Water 11 am</a>"+
    '<a class="btn ghost small" target="_blank" rel="noopener" href="'+gcal("YHM: drink water","A glass of water. Count it in YHM Coach.","16:00",until)+'">'+ic("drop","sm")+" Water 4 pm</a>"+
    '<a class="btn ghost small" target="_blank" rel="noopener" href="'+gcal("YHM: lights out","Sleep 7–8 h. Lay out your running kit for tomorrow.","22:00",until)+'">'+ic("moon","sm")+" Sleep 10 pm</a>"+
    (DL?'<button class="btn ghost small" type="button" data-act="ics">'+ic("cal","sm")+" Full plan (.ics)</button>":"")+"</div>";
}
function downloadIcs(){
  const p=R().profile, [h,m]=hm(p.remind), t=today();
  const L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//YHM Coach//EN","CALSCALE:GREGORIAN"];
  const stamp=new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z", utc=x=>x.toISOString().replace(/[-:]/g,"").slice(0,15)+"Z";
  const icsEsc=s=>String(s).replace(/[\\,;]/g,x=>"\\"+x).replace(/\n/g,"\\n");
  for(const w of PLAN.weeks) for(const d of w.days){ if(d.date<t||d.type==="rest") continue;
    const s=new Date(d.date); s.setHours(h,m,0,0);
    L.push("BEGIN:VEVENT","UID:yhm-"+R().id+"-"+iso(d.date)+"@yhmcoach","DTSTAMP:"+stamp,"DTSTART:"+utc(s),"DTEND:"+utc(new Date(s.getTime()+30*60000)),"SUMMARY:"+icsEsc("YHM: "+d.title),"DESCRIPTION:"+icsEsc(d.steps.join("\n")),"BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+icsEsc(d.title),"TRIGGER:-PT5M","END:VALARM","END:VEVENT"); }
  L.push("END:VCALENDAR");
  DL.save({filename:"yhm-training-plan.ics",data:L.join("\r\n")}).then(()=>toast("Saved. Open the file to add it to your calendar"),e=>{ if(e&&e.code!=="cancelled"&&e.code!=="declined") toast("Couldn't save the file here. Use the reminder links instead"); });
}

/* ---------- me / settings ---------- */
const WATCH_HELP_IOS=[
 ["Apple Watch","watch",["Record runs with the Workout app (Outdoor Run, Indoor Run, Walk).","They go to Apple Health automatically.","Open YHM Coach and tap Sync now."],""],
 ["Garmin","watch",["Open the Garmin Connect app on this iPhone.","Tap More (☰) → Settings → Connected Apps → Apple Health.","Turn on sharing and allow Workouts, Steps, Heart rate and Weight.","Sync your watch with Garmin Connect, then tap Sync now in YHM Coach."],"Garmin shares activities after the watch syncs to Garmin Connect. Activities recorded before you turned sharing on may not appear."],
 ["Strava","shoe",["Open Strava → You → Settings (gear) → Applications, Services and Devices.","Choose Health → Connect, and allow Workouts.","Tap Sync now in YHM Coach."],"Recording runs on your iPhone with Strava works even without a watch."],
 ["Amazfit (Zepp), Mi, Noise, boAt and others","watch",["Open your watch app → Profile → Add accounts / Third-party access → Apple Health.","Turn it on and allow Workouts, Steps and Heart rate.","Tap Sync now in YHM Coach."],"Fitbit doesn't share workouts to Apple Health. Export a TCX or GPX file and import it on the Progress tab, or add runs by hand."],
 ["Check Apple Health itself","sync",["Open the Health app → your profile picture (top right) → Apps.","Tap YHM Coach → Turn On All.","Tap your watch app there too and make sure it can write Workouts."],""]
];
const WATCH_HELP=[
 ["Garmin","watch",["Open the Garmin Connect app on this phone.","Tap More (☰ or ••• at the bottom) → Settings.","Open Health Connect (on some versions: Connected Apps → Health Connect).","Turn sharing on and tap Allow all.","Sync your watch with Garmin Connect, then tap Sync now in YHM Coach."],"Garmin shares activities after the watch syncs to Garmin Connect. Activities recorded before you turned sharing on may not appear."],
 ["Samsung Galaxy Watch","watch",["Open Samsung Health → ⋮ (top right) → Settings.","Tap Health Connect, then allow Samsung Health to write Exercise, Distance, Heart rate and Steps.","Tap Sync now in YHM Coach."],""],
 ["Fitbit / Pixel Watch","watch",["Open the Fitbit app → your profile picture → Health Connect (or App settings → Health Connect).","Turn on syncing and allow all data types.","Tap Sync now in YHM Coach."],""],
 ["Strava","shoe",["Open Strava → You → Settings (gear) → Applications, Services and Devices.","Choose Health Connect → Connect, and allow Exercise and Distance.","Tap Sync now in YHM Coach."],"Recording runs on your phone with Strava works even without a watch."],
 ["Amazfit (Zepp), Mi, Noise, boAt and others","watch",["Open your watch app's settings and look for Health Connect (sometimes under Third-party access or Data sharing).","Turn it on and allow Exercise, Distance, Heart rate and Steps.","Tap Sync now in YHM Coach."],"If your watch app has no Health Connect option, export a GPX or CSV file and import it on the Progress tab."],
 ["Check Health Connect itself","sync",["Tap Health Connect settings in YHM Coach (Progress tab).","Open App permissions → YHM Coach and make sure Exercise, Distance, Heart rate, Steps and Weight are allowed.","Open App permissions → your watch app and make sure it is allowed to write those types."],""]
];
function renderMe(){
  const el=$("#runnersCard");
  el.innerHTML='<div class="card-h"><div class="ttl-row">'+tile("ty-primary","user")+'<div><h3>Runners</h3><span class="tiny">Each runner has their own plan, logs and progress</span></div></div><button class="btn grad small" type="button" data-act="addRunner">'+ic("plus","sm")+" Add</button></div>"+
    S.order.map(id=>{ const r=S.runners[id], p=r.profile;
      return '<div class="runner'+(id===S.active?" active":"")+'"><span class="av" style="background:'+r.color+";--avc:"+r.color+'">'+esc(initials(p.name))+'</span><div style="min-width:0"><b>'+esc(p.name)+"</b>"+(id===S.me?' <span class="chip ty-easy" style="font-size:.66rem">This phone</span>':"")+
        '<div class="tiny">'+goalLabel(p.goal)+" km · "+esc((LEVELS.find(x=>x[0]===p.level)||[])[1]||"")+" · "+p.age+" y"+(p.example?" · example":"")+'</div></div><span class="row" style="gap:4px">'+
        (id!==S.active?'<button class="btn ghost small" type="button" data-switch="'+id+'">Open</button>':"")+'<button class="btn ghost small" type="button" data-edit="'+id+'">Edit</button><button class="del" type="button" data-delr="'+id+'" aria-label="Delete runner">'+ic("trash","sm")+"</button></span></div>"; }).join("")+
    (S.order.length>1?'<div class="field"><label for="meSel">Watch sync and phone reminders are for</label><select id="meSel">'+S.order.map(id=>'<option value="'+id+'"'+(id===S.me?" selected":"")+">"+esc(S.runners[id].profile.name)+"</option>").join("")+"</select></div>":"")+
    '<p class="tiny">Coaches and families: add each runner to track their plan and progress separately.</p>';
  renderReminders();
  $("#watchCard").innerHTML='<div class="ttl-row">'+tile("ty-easy","watch")+'<div><h3>Connect your watch</h3><span class="tiny">'+(NATIVE?"Through "+HC+" on this phone":"In the YHM Coach app for Android and iPhone")+"</span></div></div>"+
    (IOS?WATCH_HELP_IOS:WATCH_HELP).map(([n,i,steps,note])=>'<details class="wk" style="box-shadow:none"><summary><span class="row" style="gap:10px;flex-wrap:nowrap">'+tile("ty-primary",i,"sm")+"<b>"+esc(n)+"</b></span><span></span></summary><div style=\"padding:4px 14px 14px\">"+stepsHTML(steps)+(note?'<p class="tiny" style="margin-top:6px">'+esc(note)+"</p>":"")+"</div></details>").join("")+
    (NATIVE?'<div class="row"><button class="btn grad" type="button" data-act="hcSync">'+ic("sync","sm")+' Sync now</button><button class="btn ghost small" type="button" data-act="hcSettings">'+(IOS?"Open Apple Health":"Health Connect settings")+'</button></div>':"");
  $("#dataCard").innerHTML='<div class="ttl-row">'+tile("ty-rest","id","sm")+'<h3>Your data</h3></div><p class="small muted">Everything stays '+(NATIVE?"on this phone. Nothing is sent to any server.":"in this browser"+(dbOk?" and your Claude account, so it follows you across devices.":"."))+"</p>"+
    '<div class="row">'+(NATIVE?'<a class="btn ghost small" href="privacypolicy.html">Privacy policy</a>':"")+'<button class="btn ghost small" type="button" data-act="resetAll" id="resetBtn">Delete all data</button></div><p class="tiny">YHM Coach · Cotton City Runners Foundation, Yavatmal</p>';
}

/* ---------- sheets ---------- */
function openSheet(html,mount){
  $("#sheetRoot").innerHTML='<div class="scrim" id="scrim"><div class="sheet" role="dialog" aria-modal="true"><span class="grab"></span>'+html+"</div></div>";
  const sc=$("#scrim"); sc.addEventListener("click",e=>{ if(e.target===sc) closeSheet(); });
  paintIcons(sc); if(mount) mount(sc);
}
function closeSheet(){ $("#sheetRoot").innerHTML=""; }
function logSheet(date,prefill){
  const r=R(), pd=findDay(date), pf=prefill||{};
  const defType=pf.type||(pd&&pd.type==="strength"?"strength":pd&&pd.type==="mobility"?"mobility":walkRun(r.profile)?"walk":"run");
  openSheet('<h3>Log an activity · '+esc(firstName(r.profile.name))+'</h3><form id="logForm"><div class="grid2"><div class="field"><label for="lDate">Date</label><input type="date" id="lDate" value="'+date+'" max="'+iso(today())+'" required></div>'+
    '<div class="field"><label for="lType">Type</label><select id="lType">'+Object.entries(TL).map(([k,v])=>'<option value="'+k+'"'+(k===defType?" selected":"")+">"+v+"</option>").join("")+"</select></div></div>"+
    '<div class="grid2"><div class="field"><label for="lKm">Distance (km)</label><input type="number" id="lKm" inputmode="decimal" step="0.01" min="0" max="300" value="'+(pf.km!=null?pf.km:pd&&pd.km&&!pf.km?pd.km:"")+'"></div><div class="field"><label for="lMin">Time (minutes)</label><input type="number" id="lMin" inputmode="numeric" min="0" max="1500" value="'+(pf.min||"")+'"></div></div>'+
    '<div class="field"><label for="lRpe">How hard did it feel? <b id="rpeV">5</b>/10</label><input type="range" id="lRpe" min="1" max="10" value="5"><span class="tiny">1–3 easy · 4–6 steady · 7–8 hard · 9–10 all-out</span></div>'+
    '<div class="field"><label for="lNote">Notes (pain, how you felt, route)</label><input id="lNote" maxlength="140" placeholder="Felt good, slight calf tightness"></div>'+
    '<div class="row"><button class="btn grad grow" type="submit">'+ic("check","sm")+' Save activity</button><button class="btn ghost" type="button" data-act="closeSheet">Cancel</button></div></form>',
  sc=>{ const rp=sc.querySelector("#lRpe"); rp.oninput=()=>sc.querySelector("#rpeV").textContent=rp.value;
    sc.querySelector("#logForm").onsubmit=e=>{ e.preventDefault();
      const l={id:"l"+Date.now().toString(36),date:$("#lDate").value||iso(today()),type:$("#lType").value,km:+$("#lKm").value||0,min:+$("#lMin").value||null,rpe:+$("#lRpe").value||null,note:$("#lNote").value.trim(),src:"manual"};
      if(!l.km&&!l.min){ toast("Add a distance or a time"); return; }
      r.logs=r.logs.filter(x=>!(x.src==="plan"&&x.date===l.date&&RUNLIKE(x.type)===RUNLIKE(l.type)));
      r.logs.push(l); if(l.date===iso(today())) setCheck(r,"workout",true);
      save(); closeSheet(); renderAll();
      toast(l.rpe>=9||PAIN_RE.test(l.note)?"Saved. The coach will ease this week's hard sessions":"Saved. Nice work!"); }; });
}
function whoSheet(){
  openSheet('<h3>Runners</h3><div>'+S.order.map(id=>{ const r=S.runners[id], p=r.profile;
    return '<button type="button" class="runner'+(id===S.active?" active":"")+'" data-switch="'+id+'" style="width:100%;border:0;border-bottom:1px solid var(--line);background:none;text-align:left;cursor:pointer;color:inherit"><span class="av" style="background:'+r.color+";--avc:"+r.color+'">'+esc(initials(p.name))+'</span><span><b>'+esc(p.name)+'</b><span class="tiny" style="display:block">'+goalLabel(p.goal)+" km"+(id===S.me?" · this phone":"")+"</span></span><span>"+(id===S.active?ic("check"):"")+"</span></button>"; }).join("")+"</div>"+
    '<div class="row"><button class="btn grad" type="button" data-act="addRunner">'+ic("plus","sm")+' Add runner</button><button class="btn ghost" type="button" data-act="editRunner">Edit '+esc(firstName(R().profile.name))+'</button><button class="btn ghost" type="button" data-act="openMe">Settings</button></div>');
}

/* ---------- onboarding wizard ---------- */
let OB=null;
const DRAFT = () => ({name:"",age:"",sex:"",weight:"",height:"",goal:"21",level:"beg",days:4,recent5k:"",raceDate:RACE_DATE,diet:"veg",conditions:[],habits:[],remind:"05:45"});
function startWizard(mode,id){
  const r=id&&S.runners[id];
  OB={mode,id:r?r.id:null,step:mode==="first"?0:1,err:"",d:r?Object.assign(DRAFT(),JSON.parse(JSON.stringify(r.profile))):DRAFT(),isMe:r?S.me===r.id:(!S.me||mode==="first")};
  if(r&&r.profile.example){ OB.mode="first"; OB.id=null; OB.d=DRAFT(); OB.step=1; OB.isMe=true; }
  closeSheet(); renderOB();
}
const OB_STEPS=["Welcome","About you","Goal","Health","Reminders","Ready"];
function obField(id,label,val,attrs){ return '<div class="field"><label for="'+id+'">'+label+'</label><input id="'+id+'" value="'+esc(val)+'" '+attrs+"></div>"; }
function cboxes(name,opts,cur,cls){ return '<div class="choice '+cls+'" role="radiogroup">'+opts.map(([v,b,s])=>'<label class="cbox"><input type="radio" name="'+name+'" value="'+v+'"'+(String(cur)===String(v)?" checked":"")+"><b>"+b+"</b>"+(s?"<span>"+s+"</span>":"")+"</label>").join("")+"</div>"; }
function renderOB(){
  const root=$("#obRoot"); if(!OB){ root.innerHTML=""; document.body.style.overflow=""; return; }
  document.body.style.overflow="hidden";
  const d=OB.d, st=OB.step; let body="";
  if(st===0){
    body='<div class="welcome"><div class="logo-card"><img src="img/yhm-logo.webp" alt="Yavatmal Health Marathon" width="640" height="427"></div><span class="pill" style="align-self:flex-start">5th edition · Sunday 3 January 2027</span><h1>Train for YHM 2027</h1>'+
      '<p style="opacity:.92">A personal running, fitness and nutrition coach for the 5, 10 and 21 km races, built for your age, weight, health and habits.</p>'+
      '<div class="feat"><div>'+ic("cal","sm")+"Plan that adapts to you</div><div>"+ic("watch","sm")+"Garmin & watch sync</div><div>"+ic("bell","sm")+"Workout & water reminders</div><div>"+ic("chart","sm")+"Progress tracking</div></div></div>";
  } else if(st===1){
    body='<span class="label">Step 1 of 4</span><h2>'+(OB.mode==="edit"?"Profile":OB.mode==="add"?"New runner":"About you")+"</h2>"+
      obField("oName","Name",d.name,'autocomplete="name" maxlength="40" placeholder="e.g. Priya Deshmukh"')+
      '<div class="field"><label>Gender</label>'+cboxes("oSex",[["m","Male",""],["f","Female",""]],d.sex,"c2")+"</div>"+
      '<div class="grid3">'+obField("oAge","Age",d.age,'type="number" inputmode="numeric" min="10" max="90"')+obField("oWt","Weight (kg)",d.weight,'type="number" inputmode="decimal" step="0.1" min="25" max="200"')+obField("oHt","Height (cm)",d.height,'type="number" inputmode="numeric" min="100" max="220"')+"</div>";
  } else if(st===2){
    body='<span class="label">Step 2 of 4</span><h2>Goal</h2><div class="field"><label>Race distance</label>'+cboxes("oGoal",[["5","5","km Fitness"],["10","10","km Power"],["21","21","km Half"],["42","42","km Full"]],d.goal,"c4")+'<span class="tiny" id="oGoalNote"></span></div>'+
      '<div class="field"><label>Running level</label>'+cboxes("oLvl",LEVELS.map(([v,b,s])=>[v,'<span style="font-size:1.05rem">'+b+"</span>",s]),d.level,"c2")+"</div>"+
      '<div class="field"><label>Run days a week</label>'+cboxes("oDays",[[3,"3",""],[4,"4",""],[5,"5",""],[6,"6",""]],d.days,"c4")+"</div>"+
      '<div class="grid2">'+obField("o5k","Recent 5 km time (optional)",d.recent5k,'placeholder="mm:ss e.g. 32:30" inputmode="numeric" pattern="\\d{1,2}:\\d{2}"')+obField("oRace","Race date",d.raceDate,'type="date"')+"</div>";
  } else if(st===3){
    body='<span class="label">Step 3 of 4</span><h2>Health & habits</h2><p class="small muted">Used to make training and food advice safe. Stays on this device.</p>'+
      '<div class="field"><label>Health conditions</label><div class="opts">'+CONDITIONS.map(([k,l])=>'<label class="opt"><input type="checkbox" name="oCond" value="'+k+'"'+(d.conditions.includes(k)?" checked":"")+">"+esc(l)+"</label>").join("")+"</div></div>"+
      '<div class="field"><label>Habits</label><div class="opts">'+HABITS.map(([k,l])=>'<label class="opt"><input type="checkbox" name="oHab" value="'+k+'"'+(d.habits.includes(k)?" checked":"")+">"+esc(l)+"</label>").join("")+"</div></div>"+
      '<div class="field"><label>Diet</label>'+cboxes("oDiet",[["veg","Veg",""],["egg","Egg",""],["nonveg","Non-veg",""]],d.diet,"c3")+"</div>";
  } else if(st===4){
    body='<span class="label">Step 4 of 4</span><h2>Reminders</h2>'+obField("oRem","Morning workout reminder",d.remind,'type="time"')+
      '<div class="switch">'+tile("ty-easy","phone","sm")+'<label class="grow" for="oMe"><b>'+esc(firstName(d.name))+" uses this phone</b><span class=\"tiny\">Watch sync and phone reminders go to this runner. Turn off when adding a family member or a student.</span></label><input type=\"checkbox\" id=\"oMe\""+(OB.isMe?" checked":"")+"></div>"+
      (NATIVE?'<p class="small muted">You\'ll be asked to allow notifications. Reminders: today\'s workout every morning, tomorrow\'s plan every evening, water through the day and sleep at night.</p>':"");
  } else {
    const pp=profileFromDraft(), pl=buildPlan(pp), n=nutri(pp,{type:"rest",km:0}), first=findIn(pl,today())||pl.weeks[0].days.find(x=>x.date>=today());
    body='<span class="label">All set</span><h2>'+esc(firstName(pp.name))+"'s plan is ready</h2>"+
      '<div class="summary">'+stat("ty-primary","cal","Weeks",pl.N+"")+stat("ty-long","road","Peak long run",PEAK[+pp.goal][pp.level]+"<small>km</small>")+
      stat("ty-race","medal",pl.pc.pred?"Predicted finish":"Race",pl.pc.pred?fmtTime(pl.pc.pred):goalLabel(pp.goal)+"<small>km</small>")+stat("ty-food","flame","Rest-day food",n.kcal+"<small>kcal</small>")+"</div>"+
      (first?'<div class="card sess ty-'+first.type+'"><div class="sess-band">'+tile("",TYPE_IC[first.type])+'<div><span class="tiny">First session · '+esc(fmtD(first.date))+'</span><div class="ttl">'+esc(first.title)+"</div></div></div></div>":"")+
      (medFlags(pp).length?banner("ty-race","heart","<b>Health check first.</b> "+esc(medFlags(pp).join(" "))):"");
  }
  const pct=st===0?0:Math.min(100,st/5*100);
  root.innerHTML='<div class="ob" role="dialog" aria-modal="true" aria-label="Set up a runner"><div class="ob-in">'+
    (st>0?'<div class="ob-top"><button class="iconbtn" type="button" data-ob="back" aria-label="Back"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><div class="ob-prog"><i style="width:'+pct+'%"></i></div>'+(OB.mode!=="first"||S.order.length?'<button class="iconbtn" type="button" data-ob="close" aria-label="Close">✕</button>':"")+"</div>":"")+
    '<div class="ob-step">'+body+(OB.err?'<p class="small" style="color:var(--bad)" role="alert">'+esc(OB.err)+"</p>":"")+"</div>"+
    '<div class="ob-nav">'+(st===0?'<button class="btn ghost" type="button" data-ob="example">Explore an example</button><button class="btn grad" type="button" data-ob="next">Create my plan</button>':
      st===5?'<button class="btn grad" type="button" data-ob="finish">'+ic("check","sm")+(OB.mode==="edit"?" Save changes":" Start training")+"</button>":'<button class="btn grad" type="button" data-ob="next">Next</button>')+"</div></div></div>";
  if(st===2){ const gn=()=>{ const g=(root.querySelector('input[name="oGoal"]:checked')||{}).value; root.querySelector("#oGoalNote").textContent=g==="42"?"YHM 2027 has no full marathon. Set the date of the marathon you're training for.":g==="5"?"YHM 5 km Fitness Run.":g==="10"?"YHM 10 km Power Run.":"YHM 21 km Half Marathon."; };
    root.querySelectorAll('input[name="oGoal"]').forEach(x=>x.onchange=gn); gn(); }
  const f=root.querySelector(".ob-step input"); if(f&&st===1&&!d.name) setTimeout(()=>{ try{ f.focus(); }catch(e){} },50);
  root.querySelector(".ob").scrollTop=0;
}
function readOB(){
  const d=OB.d, q=s=>$("#obRoot").querySelector(s), v=s=>(q(s)||{}).value, chk=n=>(q('input[name="'+n+'"]:checked')||{}).value;
  const st=OB.step;
  if(st===1){ d.name=(v("#oName")||"").trim(); d.sex=chk("oSex")||""; d.age=v("#oAge"); d.weight=v("#oWt"); d.height=v("#oHt");
    if(!d.name) return "Enter a name."; if(!d.sex) return "Choose a gender.";
    if(!(+d.age>=10&&+d.age<=90)) return "Enter an age between 10 and 90."; if(!(+d.weight>=25&&+d.weight<=200)) return "Enter weight in kg (25–200)."; if(!(+d.height>=100&&+d.height<=220)) return "Enter height in cm (100–220)."; }
  if(st===2){ d.goal=chk("oGoal")||"21"; d.level=chk("oLvl")||"beg"; d.days=+(chk("oDays")||4); d.recent5k=(v("#o5k")||"").trim(); d.raceDate=v("#oRace")||RACE_DATE;
    if(d.recent5k&&!/^\d{1,2}:\d{2}$/.test(d.recent5k)) return "Write the 5 km time as minutes:seconds, e.g. 32:30.";
    if(parse(d.raceDate)<=addDays(today(),7)) return "Pick a race date at least a week away."; }
  if(st===3){ d.conditions=$$('#obRoot input[name="oCond"]:checked').map(x=>x.value); d.habits=$$('#obRoot input[name="oHab"]:checked').map(x=>x.value); d.diet=chk("oDiet")||"veg"; }
  if(st===4){ d.remind=v("#oRem")||"05:45"; OB.isMe=!!(q("#oMe")&&q("#oMe").checked); }
  return "";
}
function profileFromDraft(){ const d=OB.d; return {name:d.name||"Runner",age:+d.age,sex:d.sex||"m",weight:+d.weight,height:+d.height,goal:String(d.goal),level:d.level,days:+d.days,recent5k:d.recent5k,raceDate:d.raceDate,diet:d.diet,conditions:d.conditions.slice(),habits:d.habits.slice(),remind:d.remind,planStart:d.planStart||iso(monday(today()))}; }
async function finishOB(){
  const p=profileFromDraft(), wasFirst=!S.order.some(id=>!S.runners[id].profile.example);
  if(OB.mode==="edit"&&S.runners[OB.id]){
    const r=S.runners[OB.id], old=r.profile, reset=old.goal!==p.goal||old.level!==p.level||old.raceDate!==p.raceDate||old.days!==p.days;
    p.planStart=reset?iso(monday(today())):old.planStart||p.planStart; r.profile=p;
    if(+old.weight!==+p.weight) r.weights.push({date:iso(today()),kg:+p.weight});
    if(OB.isMe) S.me=r.id; else if(S.me===r.id) S.me=null;
    S.active=r.id; toast(reset?"Plan rebuilt":"Profile saved");
  } else {
    for(const id of S.order.slice()) if(S.runners[id].profile.example){ delete S.runners[id]; S.order=S.order.filter(x=>x!==id); if(S.me===id) S.me=null; }
    const id=newId(), used=S.order.map(x=>S.runners[x].color);
    S.runners[id]={id,profile:p,logs:[],checks:{},weights:[{date:iso(today()),kg:+p.weight}],color:AVC.find(c=>!used.includes(c))||AVC[S.order.length%AVC.length],created:iso(today())};
    S.order.push(id); S.active=id; if(OB.isMe||!S.me) S.me=id;
    toast("Plan ready. Let's go, "+firstName(p.name)+"!");
  }
  OB=null; renderOB(); SEL=iso(today()); save(); renderAll(); go("today");
  if(NATIVE&&S.me===S.active){
    if(!S.rem.on&&wasFirst) await remindersOn(); else if(S.rem.on) scheduleNative(false);
  }
}
function exploreExample(){
  const id=newId(), start=addDays(monday(today()),-14);
  const p={name:"Example Runner",age:38,sex:"m",weight:78,height:172,goal:"21",level:"int",days:4,recent5k:"28:30",raceDate:RACE_DATE,planStart:iso(start),diet:"veg",conditions:[],habits:["tea","sitting"],remind:"05:45",example:true};
  const r={id,profile:p,logs:[],checks:{},weights:[{date:iso(start),kg:79.4},{date:iso(addDays(start,7)),kg:78.6},{date:iso(today()),kg:78}],color:AVC[1],created:iso(start)};
  const pl=buildPlan(p);
  for(let i=14;i>=1;i--){ const d=addDays(today(),-i), pd=findIn(pl,d); if(!pd||pd.type==="rest"||i===4) continue;
    const ds=iso(d);
    if(pd.km) r.logs.push({id:"ex"+i,date:ds,type:"run",km:Math.round(pd.km*(0.95+((i*7)%10)/100)*100)/100,min:Math.round(pd.km*(pd.type==="quality"?5.6:6.4)-i*0.15),hr:pd.type==="quality"?158:141,rpe:pd.type==="quality"?7:4,note:"",src:"hc",srcName:i%2?"Garmin":"Strava",ex:true});
    else r.logs.push({id:"ex"+i,date:ds,type:pd.type,km:0,min:30,rpe:5,note:"",src:"manual",ex:true});
    r.checks[ds]={water:6+(i%3),sleep:i%3!==0,protein:true,workout:true}; }
  S.runners[id]=r; S.order.push(id); S.active=id;
  OB=null; renderOB(); SEL=iso(today()); save(); renderAll(); go("today");
}

/* ---------- navigation & events ---------- */
const TABS=["today","plan","progress","fuel","race","me"];
function go(tab){
  if(!TABS.includes(tab)) tab="today";
  $$("[data-panel]").forEach(s=>s.hidden=s.dataset.panel!==tab);
  $$("nav.tabs button").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.tab===tab)));
  if(tab==="me") renderMe();
  try{ history.replaceState(null,"","#"+tab); }catch(e){}
  window.scrollTo({top:0});
}
function renderAll(){
  if(!R()){ PLAN=null; return; }
  if(!SEL) SEL=iso(today());
  compute(); renderHeader(); renderToday(); renderPlan(); renderProgress(); renderFuel(); renderRace();
  if(!$("#me").hidden) renderMe();
  paintIcons();
}
function switchRunner(id){ if(!S.runners[id]) return; S.active=id; SEL=iso(today()); closeSheet(); save(); renderAll(); toast("Now showing "+firstName(S.runners[id].profile.name)); }
function deleteRunner(id){
  delete S.runners[id]; S.order=S.order.filter(x=>x!==id);
  if(S.me===id) S.me=S.order.find(x=>!S.runners[x].profile.example)||null;
  if(S.active===id) S.active=S.order[0]||null;
  save();
  if(!S.order.length){ startWizard("first"); return; }
  renderAll(); toast("Runner deleted");
}
const ACT={
  newPlan:()=>startWizard("first"),
  addRunner:()=>startWizard("add"),
  editRunner:()=>startWizard("edit",S.active),
  openMe:()=>{ closeSheet(); go("me"); },
  closeSheet,
  markDone:()=>{ const r=R(), day=findDay(SEL); if(!day) return;
    if(day.km>0) r.logs.push({id:"p"+Date.now().toString(36),date:SEL,type:walkRun(r.profile)?"walk":"run",km:day.km,min:null,rpe:null,note:day.title,src:"plan"});
    else r.logs.push({id:"p"+Date.now().toString(36),date:SEL,type:day.type==="mobility"?"mobility":"strength",km:0,min:day.type==="mobility"?20:30,rpe:null,note:day.title,src:"plan"});
    setCheck(r,"workout",true,SEL); save(); renderAll(); toast("Logged. Nice work! Tap Add details to record time and effort"); },
  logSel:()=>logSheet(SEL>iso(today())?iso(today()):SEL),
  logNew:()=>logSheet(iso(today())),
  hcSync:()=>healthSync(true),
  hcConnect:()=>{ go("progress"); healthSync(true); },
  hcSettings:()=>{ if(IOS){ try{ location.href="x-apple-health://"; }catch(e){} return; } NATIVE&&NATIVE.health.settings().catch(()=>toast("Open Health Connect from your phone settings")); },
  watchHelp:()=>{ go("me"); setTimeout(()=>{ const w=$("#watchCard"); if(w){ w.scrollIntoView({behavior:"smooth"}); const dd=w.querySelector("details"); if(dd) dd.open=true; } },50); },
  setMe:()=>{ S.me=S.active; save(); renderAll(); if(S.rem.on) scheduleNative(false); toast("This phone now syncs for "+firstName(R().profile.name)); },
  remOn:()=>remindersOn(),
  remSave:async()=>{ const me=S.runners[S.me]||R();
    Object.assign(S.rem,{train:$("#rTrain").checked,tomorrow:$("#rTom").checked,tomorrowAt:$("#rTomAt").value||"20:30",water:$("#rWater").checked,waterEvery:+$("#rWaterEvery").value||2,sleep:$("#rSleep").checked,sleepAt:$("#rSleepAt").value||"22:00",weekly:$("#rWeek").checked});
    me.profile.remind=$("#rTrainAt").value||"05:45";
    if(!S.rem.on){ await remindersOn(); } else { await scheduleNative(true); }
    save(); renderMe(); renderHeader(); },
  remTest:()=>NATIVE.notify.test().then(()=>toast("A test notification arrives in 5 seconds"),e=>toast("Couldn't send: "+(e&&e.message||e))),
  remOff:async()=>{ S.rem.on=false; await scheduleNative(false); save(); renderAll(); renderMe(); toast("Reminders off"); },
  ics:()=>downloadIcs(),
  useHcWeight:()=>{ const r=R(); r.weights.push({date:iso(today()),kg:S.hcWeight}); r.profile.weight=S.hcWeight; save(); renderAll(); toast("Weight updated"); },
  resetAll:function(el){ if(!el.classList.contains("arm")){ el.classList.add("arm"); el.textContent="Tap again to delete every runner"; return; }
    S=blank(); if(NATIVE) NATIVE.notify.clear().catch(()=>{}); save(); startWizard("first"); }
};
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-tab],[data-act],[data-copy],[data-del],[data-sel],[data-switch],[data-edit],[data-delr],[data-ob]"); if(!t) return;
  const ds=t.dataset;
  if(ds.ob){ const a=ds.ob;
    if(a==="example") return exploreExample();
    if(a==="close"){ OB=null; renderOB(); if(!R()) startWizard("first"); return; }
    if(a==="back"){ OB.err=""; if(OB.step<=1&&OB.mode!=="first"){ OB=null; renderOB(); return; } OB.step=Math.max(OB.mode==="first"?0:1,OB.step-1); renderOB(); return; }
    if(a==="next"){ const err=OB.step?readOB():""; OB.err=err; if(!err) OB.step++; renderOB(); return; }
    if(a==="finish") return finishOB();
    return; }
  if(ds.tab) go(ds.tab);
  else if(ds.act&&ACT[ds.act]) ACT[ds.act](t);
  else if(ds.copy) copyText(ds.copy,t);
  else if(ds.sel){ SEL=ds.sel; if($("#today").hidden) go("today"); renderToday(); paintIcons(); }
  else if(ds.switch) switchRunner(ds.switch);
  else if(ds.edit) startWizard("edit",ds.edit);
  else if(ds.delr){ if(!t.classList.contains("arm")){ $$(".del.arm").forEach(x=>{x.classList.remove("arm");x.innerHTML=ic("trash","sm");}); t.classList.add("arm"); t.textContent="Delete "+firstName(S.runners[ds.delr].profile.name)+"?"; return; } deleteRunner(ds.delr); }
  else if(ds.del){ if(!t.classList.contains("arm")){ $$(".del.arm").forEach(x=>{x.classList.remove("arm");x.innerHTML=ic("trash","sm");}); t.classList.add("arm"); t.textContent="Tap to delete"; return; }
    const r=R(); r.logs=r.logs.filter(l=>l.id!==ds.del); save(); renderAll(); toast("Activity deleted"); }
});
document.addEventListener("change",e=>{
  const el=e.target, r=R(); if(!r) return;
  if(el.dataset.ck){ setCheck(r,el.dataset.ck,el.checked); save(); renderToday(); renderWeek(); paintIcons(); }
  else if(el.dataset.rc!=null){ r.checks.race=Object.assign({},r.checks.race,{[el.dataset.rc]:el.checked}); save(); }
  else if(el.id==="meSel"){ S.me=el.value; save(); renderAll(); if(S.rem.on) scheduleNative(false); toast("Watch sync and reminders now for "+firstName(S.runners[S.me].profile.name)); }
  else if(el.id==="fileIn"&&el.files.length){ importFiles(Array.from(el.files)); el.value=""; }
});
document.addEventListener("submit",e=>{
  if(e.target.id==="wForm"){ e.preventDefault(); const kg=+$("#wKg").value; if(!(kg>=25&&kg<=200)){ toast("Enter weight in kg"); return; }
    const r=R(); r.weights=r.weights.filter(w=>w.date!==iso(today())); r.weights.push({date:iso(today()),kg}); r.profile.weight=kg; save(); renderAll(); toast("Weight saved. Nutrition targets updated"); }
});
$("#wPlus").onclick=()=>{ const r=R(), ts=iso(today()); setCheck(r,"water",Math.min(20,((r.checks[ts]||{}).water||0)+1)); save(); renderToday(); paintIcons(); };
$("#wMinus").onclick=()=>{ const r=R(), ts=iso(today()); setCheck(r,"water",Math.max(0,((r.checks[ts]||{}).water||0)-1)); save(); renderToday(); paintIcons(); };
$("#whoBtn").onclick=()=>whoSheet();
$("#bellBtn").onclick=()=>{ go("me"); setTimeout(()=>{ const c=$("#remCard"); if(c) c.scrollIntoView({behavior:"smooth"}); },50); };
document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&$("#scrim")) closeSheet(); });

/* ---------- file import ---------- */
async function importFiles(files){
  const r=R(); let added=0,skipped=0; const bad=[];
  for(const f of files){
    try{ const txt=await f.text(), n=f.name.toLowerCase();
      const acts=n.endsWith(".gpx")?parseGPX(txt):n.endsWith(".tcx")?parseTCX(txt):n.endsWith(".csv")?parseCSV(txt):(()=>{throw new Error("type")})();
      for(const a of acts){ if(r.logs.some(l=>l.date===a.date&&Math.abs((+l.km||0)-a.km)<0.05)){ skipped++; continue; }
        r.logs.push(Object.assign({id:"i"+Date.now().toString(36)+"-"+added,rpe:null,note:f.name},a)); added++; }
    }catch(e){ bad.push(f.name); }
  }
  save(); renderAll();
  const msg=((added?added+" "+(added===1?"activity":"activities")+" imported. ":"")+(skipped?skipped+" already in the log. ":"")+(bad.length?"Couldn't read "+bad.join(", ")+". Export as GPX, TCX or CSV and try again.":""))||"No activities found in that file.";
  const m=$("#importMsg"); if(m) m.textContent=msg; toast(msg);
}
document.addEventListener("dragover",e=>{ if(e.target.closest&&e.target.closest("#drop")) e.preventDefault(); });
document.addEventListener("drop",e=>{ if(e.target.closest&&e.target.closest("#drop")){ e.preventDefault(); if(e.dataTransfer.files.length) importFiles(Array.from(e.dataTransfer.files)); } });

/* ---------- Claude page extras: account sync, coach, organiser posts ---------- */
async function connectStore(){
  try{
    const [db,user]=await Promise.all([claude.use("db"),claude.use("user")]);
    if(user){ try{ if(await user.isOwner()){ IS_OWNER=true; $("#postForm").hidden=false; } }catch(e){} }
    if(!db||!user) return;
    const id=await user.id(); if(!id) return;
    DB=db; UID=id;
    const snap=await db.doc("data/users/"+id+"/coach").get();
    dbOk=true;
    if(snap.exists){ const v=snap.data();
      if(v&&v.v===2&&(v.at||0)>(S.at||0)){ S=normalize(v); if(OB&&S.order.length){ OB=null; renderOB(); } renderAll(); }
      else if(v&&v.profile&&!S.order.length){ S=normalize(migrateV1(v)); if(S.order.length){ OB=null; renderOB(); renderAll(); save(); } } }
    else if(S.order.length) save();
  }catch(e){ dbOk=false; }
}
let SAMPLE=null, coachCtl=null;
$("#coachForm").addEventListener("submit",async e=>{
  e.preventDefault(); const q=$("#coachQ").value.trim(); if(!q||!SAMPLE) return;
  const r=R(), p=r.profile, day=findDay(today()), out=$("#coachOut"), btn=$("#coachGo");
  out.hidden=false; out.textContent="Thinking…"; btn.disabled=true;
  if(coachCtl) coachCtl.abort(); coachCtl=new AbortController();
  const recent=r.logs.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6).map(l=>l.date+" "+l.type+" "+(l.km||0)+"km"+(l.min?" "+l.min+"min":"")+(l.rpe?" effort "+l.rpe:"")+(l.note?" ("+l.note+")":"")).join("; ");
  const prompt="You are the running and fitness coach in the YHM Coach app for runners training for the Yavatmal Health Marathon 2027 (3 Jan 2027, Yavatmal, Maharashtra; races 21K, 10K, 5K, 3K). "+
    "Reply in the same language as the question (English, Hindi or Marathi), in under 150 words, practical and kind. Suggest Indian foods where food is relevant. "+
    "If the question describes chest pain, fainting, severe breathlessness, very high or low sugar, or injury with swelling, tell them to stop training and see a doctor today. You are not a substitute for their doctor.\n\n"+
    "Runner: "+p.age+" y "+(p.sex==="f"?"female":"male")+", "+p.weight+" kg, "+p.height+" cm, goal "+p.goal+" km, level "+p.level+", "+p.days+" run days/week, diet "+p.diet+
    ", conditions: "+((p.conditions||[]).join(", ")||"none")+", habits: "+((p.habits||[]).join(", ")||"none")+".\n"+
    "Today's session: "+(day?day.title+" ("+day.steps.join(" ")+")":"none")+". Days to race: "+dayDiff(today(),parse(p.raceDate))+". Plan adjustments: "+(AD.notes.map(n=>n.t).join("; ")||"none")+".\nRecent activities: "+(recent||"none")+".\n\nQuestion: "+q;
  try{ const res=await SAMPLE(prompt,{cache:false,signal:coachCtl.signal,onText:({text})=>{ out.textContent=text; }}); out.textContent=res.text; }
  catch(err){ if(err&&err.code==="cancelled"){} else if(err&&["not_granted","sampling_disabled","capability_disabled"].includes(err.code)) $("#coachCard").hidden=true;
    else out.textContent=err&&err.code==="rate_limited"?"The coach is busy. Try again in a minute.":"Couldn't get an answer just now. Try again shortly."; }
  finally{ btn.disabled=false; }
});
$("#postForm").addEventListener("submit",async e=>{
  e.preventDefault(); const msg=$("#pMsg"), btn=$("#pGo");
  const u={date:iso(today()),title:$("#pTitle").value.trim(),body:$("#pBody").value.trim()}; if(!u.title||!u.body) return;
  btn.disabled=true; msg.textContent="Posting…";
  try{ const art=await claude.use("artifact"); if(!art) throw {code:"unavailable"};
    const next=[u].concat(UPDATES);
    await art.publish({"updates.json":{content:JSON.stringify(next,null,2),contentType:"application/json"}});
    UPDATES=next; renderRace(); $("#pTitle").value=""; $("#pBody").value=""; msg.textContent="Posted here. Ask Claude to add it to the Android app's updates too.";
  }catch(err){ const c=err&&err.code;
    msg.textContent=c==="capability_disabled"?"Posting is off while the page is shared by public link. Send the update to Claude in your YHM Training App project instead."
      :c==="conflict"?"Someone else just posted. The page is reloading; post again after it loads.":"Couldn't post here. Send the update to Claude in your YHM Training App project instead.";
  }finally{ btn.disabled=false; }
});

/* ---------- boot ---------- */
paintIcons();
if(NATIVE){ document.addEventListener("click",e=>{ const a=e.target.closest('a[target="_blank"]'); if(a) a.removeAttribute("target"); },true); }
function routeHash(){
  const h=(location.hash||"").slice(1);
  if(h==="tomorrow"){ SEL=iso(addDays(today(),1)); if(R()){ renderAll(); go("today"); } return; }
  if(TABS.includes(h)&&R()) go(h);
}
if(R()){ renderAll(); routeHash(); try{ if(!localStorage.getItem(LS_KEY)) save(); }catch(e){} }
else startWizard("first");
window.addEventListener("hashchange",()=>{ const h=(location.hash||"").slice(1); if(h==="tomorrow"||(TABS.includes(h)&&$('[data-panel="'+h+'"]').hidden)) routeHash(); });
loadUpdates();
if(NATIVE){
  if(S.hc&&S.hc.status==="on") healthSync(false);
  if(S.rem.on) scheduleNative(false);
  document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible"&&R()){ renderAll(); if(S.hc&&S.hc.status==="on") healthSync(false); if(S.rem.on) scheduleNative(false); } });
  NATIVE.ready&&NATIVE.ready();
} else if(window.claude&&claude.use){
  connectStore();
  claude.use("sample").then(s=>{ if(s){ SAMPLE=s; $("#coachCard").hidden=false; paintIcons($("#coachCard")); } }).catch(()=>{});
  claude.use("downloads").then(d=>{ if(d){ DL=d; if(!$("#me").hidden) renderMe(); } }).catch(()=>{});
}
setInterval(()=>{ renderCountdown(); const n=iso(today()); if(n!==renderAll._d){ if(SEL===renderAll._d) SEL=n; renderAll._d=n; if(R()) renderAll(); if(NATIVE&&S.rem.on) scheduleNative(false); } },60000); renderAll._d=iso(today());
