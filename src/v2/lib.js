/* ---------- icons & illustrations ---------- */
const IC = {
 shoe:'<path d="M3 16.5h17a1 1 0 0 0 1-1v-.8a3 3 0 0 0-2.4-2.9L14 10.8 11 7H8.2L7.4 9.5H4.2L3 16.5z"/><path d="M3 19.5h18M10 10l1.5-1M12 12l1.5-1"/>',
 bolt:'<path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z"/>',
 road:'<path d="M8 21L11 3M16 21L13 3M12 6.5v2M12 11.5v2M12 16.5v2"/>',
 dumbbell:'<path d="M6.5 7v10M3.5 9.5v5M17.5 7v10M20.5 9.5v5M6.5 12h11"/>',
 lotus:'<path d="M12 20c-4.5 0-8.2-2.2-9-6.5 3.2 0 6.2 1.4 9 4.3 2.8-2.9 5.8-4.3 9-4.3-.8 4.3-4.5 6.5-9 6.5z"/><path d="M12 17.8c-2.2-2-3.2-5.3-2-9.3 1 .9 1.7 1.9 2 3 .3-1.1 1-2.1 2-3 1.2 4 .2 7.3-2 9.3z"/>',
 moon:'<path d="M20 14.5A8.2 8.2 0 1 1 9.5 4a6.6 6.6 0 0 0 10.5 10.5z"/>',
 medal:'<circle cx="12" cy="15" r="6"/><path d="M8.5 10L6 3h4l2 4 2-4h4l-2.5 7"/><path d="M12 12.3l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3z"/>',
 drop:'<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
 flame:'<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6.3-4-9.3-1 2-2 3-3 3.2.1-2.4-1-4.6-3-6.4.2 4-4 7.3-4 12.5a7 7 0 0 0 7 7z"/>',
 grain:'<path d="M12 21V9"/><path d="M12 9C9.5 9 8 7.4 8 4.5c2.6 0 4 1.6 4 4.5zm0 0c2.5 0 4-1.6 4-4.5-2.6 0-4 1.6-4 4.5zm0 5c-2.5 0-4-1.6-4-4.5 2.6 0 4 1.6 4 4.5zm0 0c2.5 0 4-1.6 4-4.5-2.6 0-4 1.6-4 4.5zm0 5c-2.5 0-4-1.6-4-4.5 2.6 0 4 1.6 4 4.5zm0 0c2.5 0 4-1.6 4-4.5-2.6 0-4 1.6-4 4.5z"/>',
 egg:'<path d="M12 3c3.5 0 6 5 6 10a6 6 0 0 1-12 0c0-5 2.5-10 6-10z"/>',
 heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
 pulse:'<path d="M3 12h4l2-5 4 10 2-5h6"/>',
 bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4l2-2z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
 cal:'<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/><path d="M8.5 14h2M13.5 14h2M8.5 17h2"/>',
 watch:'<rect x="6.5" y="6" width="11" height="12" rx="3.2"/><path d="M9 6l.8-3h4.4L15 6M9 18l.8 3h4.4l.8-3M12 9.5V12l1.8 1.3"/>',
 upload:'<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
 sync:'<path d="M20 11a8 8 0 0 0-14.3-4.4M4 13a8 8 0 0 0 14.3 4.4"/><path d="M20 4v5h-5M4 20v-5h5"/>',
 phone:'<path d="M5 4h3.8l1.9 4.8-2.4 1.5a11 11 0 0 0 5.4 5.4l1.5-2.4L20 15.2V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
 flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 leaf:'<path d="M5 19C5 10 11 5 20 5c0 9-5 15-14 15"/><path d="M5 19l8-8"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 share:'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.9l7.6-3.8M8.2 13.1l7.6 3.8"/>',
 megaphone:'<path d="M3 10v4h3l8 5V5l-8 5H3z"/><path d="M17.5 9a4 4 0 0 1 0 6M20 6.5a7.5 7.5 0 0 1 0 11"/>',
 sun:'<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6L6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
 plate:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>',
 chart:'<path d="M5 19V10M10 19V5M15 19v-6M20 19v-9M3 21h18"/>',
 ticket:'<path d="M3 8.5a2.5 2.5 0 0 0 0 5V17h18v-3.5a2.5 2.5 0 0 1 0-5V7H3v1.5z"/><path d="M14.5 7v10"/>',
 shirt:'<path d="M8.5 3L3.5 6l2 4 2.5-1v12h8V9l2.5 1 2-4-5-3a3.5 3.5 0 0 1-7 0z"/>',
 bottle:'<path d="M10 2h4v3l1.3 2.2V21H8.7V7.2L10 5z"/><path d="M8.7 12h6.6"/>',
 clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 id:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="11" r="2"/><path d="M5.8 16a3.2 3.2 0 0 1 6.4 0M14 10h4M14 13.5h3"/>',
 pill:'<rect x="2.8" y="8.6" width="18.4" height="6.8" rx="3.4" transform="rotate(-45 12 12)"/><path d="M9.6 9.6l4.8 4.8"/>',
 steps:'<path d="M7.5 14C6 14 5 12 5 9.2S6 4.5 7.5 4.5 10 6.4 10 9.2 9 14 7.5 14zM5.5 17h4M16.5 19.5c-1.5 0-2.5-2-2.5-4.8s1-4.7 2.5-4.7 2.5 1.9 2.5 4.7-1 4.8-2.5 4.8zM14.5 22.3h4"/>',
 chat:'<path d="M4 5h16v11H9l-5 4V5z"/><path d="M8 9.5h8M8 12.5h5"/>',
 warn:'<path d="M12 3l9.5 17h-19L12 3z"/><path d="M12 10v4.5M12 17.5v.3"/>',
 whatsapp:'<path d="M4 20l1.2-4A8.5 8.5 0 1 1 8 18.8L4 20z"/><path d="M9 9.2c0 3 2.8 5.8 5.8 5.8l1-1.5-1.8-1-1 .8a4 4 0 0 1-2.3-2.3l.8-1-1-1.8L9 9.2z"/>',
 cycle:'<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16l4-7h5l3 7M10 9l-1-2.5H7M12.5 16L15 9"/>',
 trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'
};
const ic = (n,c) => '<svg class="i'+(c?" "+c:"")+'" viewBox="0 0 24 24" aria-hidden="true">'+(IC[n]||"")+"</svg>";
const TYPE_IC = {easy:"shoe",quality:"bolt",long:"road",strength:"dumbbell",mobility:"lotus",rest:"moon",recovery:"moon",race:"medal",run:"shoe",walk:"steps",cycle:"cycle",other:"pulse"};
const TYPE_LABEL = {easy:"Easy",quality:"Speed",long:"Long run",strength:"Strength",mobility:"Yoga",rest:"Rest",recovery:"Recovery",race:"Race"};

const FOOD = {
 banana:'<path d="M7 27c9 6 22 1 26-13l-3.2-1.2C26.5 23 18 28 9 25z" fill="#ffd23f"/><path d="M9 25c8 2 15-2 19-9" stroke="#e8a900" stroke-width="1.4" fill="none"/><path d="M29.8 12.8l1.6-4 2.6 1-1.6 4.2z" fill="#7a5a1e"/>',
 bowl:'<path d="M5 19h30a15 12 0 0 1-30 0z" fill="#e8743a"/><path d="M5 19h30a15 12 0 0 1-30 0z" fill="#000" fill-opacity=".08" transform="translate(0 3)"/><ellipse cx="20" cy="19" rx="15" ry="4.5" fill="#ffd166"/><circle cx="14" cy="18.2" r="1.5" fill="#2fa84f"/><circle cx="23" cy="19.6" r="1.5" fill="#2fa84f"/><circle cx="19" cy="17.4" r="1.3" fill="#e5294a"/><circle cx="27" cy="17.8" r="1.2" fill="#8a5a2b"/>',
 fruit:'<circle cx="20" cy="22" r="11" fill="#ff9a1f"/><circle cx="16.5" cy="18.5" r="2.5" fill="#fff" fill-opacity=".35"/><path d="M20 11c0-3 2-5 5-5-.3 3-2 5-5 5z" fill="#2fa84f"/><path d="M20 11.5V9" stroke="#6b4a1e" stroke-width="1.6"/>',
 thali:'<circle cx="20" cy="20" r="15.5" fill="#b9c0d0"/><circle cx="20" cy="20" r="13" fill="#e7ebf3"/><circle cx="13.5" cy="15" r="4.2" fill="#f2b33d"/><circle cx="25.5" cy="13.5" r="4" fill="#2fa84f"/><circle cx="27" cy="24.5" r="4" fill="#d9483b"/><ellipse cx="15" cy="25.5" rx="5.6" ry="3.8" fill="#f6e3b4"/><circle cx="13.5" cy="15" r="2.6" fill="#f7c95b"/>',
 tea:'<path d="M8 15h19v7a8 8 0 0 1-8 8h-3a8 8 0 0 1-8-8z" fill="#ffffff" stroke="#c9b6e8" stroke-width="1.2"/><path d="M9.5 17h16v4a6.5 6.5 0 0 1-6.5 6.5h-3A6.5 6.5 0 0 1 9.5 21z" fill="#b8742f"/><path d="M27 17h2.5a3.5 3.5 0 0 1 0 7H27" fill="none" stroke="#c9b6e8" stroke-width="2"/><path d="M14 11c-1-2 1-3 0-5M19 11c-1-2 1-3 0-5" stroke="#b39ddb" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
 roti:'<ellipse cx="20" cy="24" rx="15" ry="7" fill="#d9a35b"/><ellipse cx="20" cy="21" rx="15" ry="7" fill="#f0c27b"/><circle cx="14" cy="20" r="1.6" fill="#a8652a"/><circle cx="22" cy="23" r="1.3" fill="#a8652a"/><circle cx="25" cy="18.5" r="1.8" fill="#a8652a" fill-opacity=".7"/><circle cx="18" cy="17.5" r="1" fill="#a8652a"/>',
 milk:'<path d="M12 9h16l-1.6 23a2 2 0 0 1-2 1.8h-8.8a2 2 0 0 1-2-1.8z" fill="#ffffff" stroke="#c9b6e8" stroke-width="1.2"/><path d="M12.8 16h14.4l-1.1 15.8a1.5 1.5 0 0 1-1.5 1.4h-9.2a1.5 1.5 0 0 1-1.5-1.4z" fill="#ffd25a"/><path d="M30 6a4 4 0 1 0 3 6 4.5 4.5 0 0 1-3-6z" fill="#7c6bd6"/>'
};
const food = n => '<svg viewBox="0 0 40 40" aria-hidden="true">'+(FOOD[n]||"")+"</svg>";

function ring(pct,col,center,label,sub){
  const r=30, C=2*Math.PI*r, v=Math.max(0,Math.min(1,pct));
  return '<div class="ring"><svg viewBox="0 0 76 76" aria-hidden="true"><circle cx="38" cy="38" r="'+r+'" fill="none" stroke="var(--surface-2)" stroke-width="8"/>'+
   '<circle cx="38" cy="38" r="'+r+'" fill="none" stroke="'+col+'" stroke-opacity="'+(v>0?1:0)+'" stroke-width="8" stroke-linecap="round" stroke-dasharray="'+(C*v).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 38 38)"/>'+
   '<g transform="translate(26 26)" stroke="'+col+'" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+IC[center]+'</g></svg>'+
   '<span class="v">'+label+'</span><span class="tiny">'+sub+"</span></div>";
}
function paintIcons(root){ (root||document).querySelectorAll("[data-ic]").forEach(el=>{ if(!el.firstChild) el.innerHTML=ic(el.dataset.ic); }); }
const CONDITIONS = [
 ["t2dm","Type 2 diabetes"],["t1dm","Type 1 diabetes"],["htn","High BP"],["heart","Heart disease"],["chol","High cholesterol"],
 ["thyroid","Hypothyroid"],["asthma","Asthma"],["ckd","Kidney disease"],["pcos","PCOS"],["anaemia","Anaemia / low Hb"],
 ["knee","Knee / joint pain"],["back","Back pain"],["preg","Pregnant"]];
const HABITS = [
 ["smoke","Smoking"],["tobacco","Kharra / gutkha / tobacco"],["alcohol","Alcohol"],["sleep","Under 7 h sleep"],
 ["shift","Night shifts"],["tea","3+ cups tea/coffee"],["sitting","Desk / sitting job"],["skipbf","Skip breakfast"]];
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad = n => String(n).padStart(2,"0");
const iso = d => d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const parse = s => { const [y,m,d]=String(s).split("-").map(Number); return new Date(y,m-1,d); };
const addDays = (d,n) => { const x=new Date(d); x.setDate(x.getDate()+n); return x; };
const dayDiff = (a,b) => Math.round((parse(iso(b))-parse(iso(a)))/864e5);
const monday = d => { const x=parse(iso(d)); return addDays(x,-((x.getDay()+6)%7)); };
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const r05 = v => Math.round(v*2)/2;
const WD = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmtD = d => WD[d.getDay()]+" "+d.getDate()+" "+MON[d.getMonth()];
const fmtPace = s => { s=Math.round(s); return Math.floor(s/60)+":"+pad(s%60); };
const fmtTime = s => { s=Math.round(s); const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60; return (h?h+":"+pad(m):m)+":"+pad(x); };
const has = (p,k) => (p.conditions||[]).includes(k) || (p.habits||[]).includes(k);
const today = () => parse(iso(new Date()));
const goalLabel = g => g==="21"?"21.1":g==="42"?"42.2":g;
const PEAK = {5:{new:5,beg:6,int:8,adv:10},10:{new:9,beg:12,int:14,adv:16},21:{new:16,beg:18,int:20,adv:22},42:{new:28,beg:30,int:32,adv:34}};
const START = {new:2.5,beg:4,int:8,adv:12};
const TAPER = {5:1,10:1,21:2,42:3};
const TEMPLATES = {3:["rest","Q","strength","easy","rest","mobility","long"],
  4:["rest","Q","easy","strength","easy","rest","long"],
  5:["rest","Q","easy","T","strength","easy","long"],
  6:["easy","Q","easy","T","strength","easy","long"]};
function bmi(p){ return p.weight/Math.pow(p.height/100,2); }
function walkRun(p){ return p.level==="new" || bmi(p)>=30 || p.age>=60 || has(p,"knee"); }
function paces(p,fiveK){
  const out={hrmax:Math.round(208-0.7*p.age)};
  const m=/^(\d{1,2}):(\d{2})$/.exec((p.recent5k||"").trim());
  const t0=fiveK||(m?(+m[1])*60+(+m[2]):0);
  if(t0){ const t=t0; if(t>=840&&t<=3600){ const p5=t/5; const g=+p.goal, D=g===21?21.0975:g===42?42.195:g;
    const pred=t*Math.pow(D/5,1.06);
    Object.assign(out,{t5:t,easy:[p5+60,p5+90],long:[p5+70,p5+105],tempo:[p5+20,p5+32],int:[p5-8,p5+2],pred,race:pred/D}); } }
  return out;
}
const PR = a => fmtPace(a[0])+"–"+fmtPace(a[1])+" /km";
function qualityKind(p,w,phase,frac){
  if(has(p,"preg")) return "easywalk";
  if(p.level==="new") return frac<0.5 ? "fartlek" : "tempo";
  if(+p.goal>=21 && phase==="Peak") return w%2 ? "racepace" : "tempo";
  return ["intervals","tempo","hills"][w%3];
}
function session(kind,p,ctx){
  const pc=ctx.pc||{}, g=+p.goal, f=ctx.frac||0, adv=p.level==="adv";
  const easyKm=clamp(r05((ctx.long||6)*0.45),p.level==="new"?2:3,12);
  const wr=walkRun(p);
  switch(kind){
    case "rest": return {type:"rest",title:"Rest day",km:0,steps:["Full rest or a relaxed 20–30 min walk.","Sleep 7–8 hours. Recovery is when you get fitter."]};
    case "easy": return {type:"easy",title:(wr?"Walk-run ":"Easy run ")+easyKm+" km",km:easyKm,
      steps:[wr?"Run 3 min, walk 1 min. Repeat till "+easyKm+" km.":"Conversational pace: you can speak full sentences (effort 3–4/10).",
        pc.easy?"Pace guide "+PR(pc.easy)+".":"Keep it easy; finish feeling you could do more.","Finish with 5 min of stretching."]};
    case "long": { if(has(p,"preg")) return session("easywalk",p,ctx); const km=r05(ctx.long); return {type:"long",title:"Long run "+km+" km",km,
      steps:[wr?"Walk-run: run 4 min, walk 1 min, all at easy effort.":"Easy, steady effort the whole way (4–5/10).",
        pc.long?"Pace guide "+PR(pc.long)+".":"Slow is right. Long runs build endurance, not speed.",
        km>=12?"Carry water. After 60 min take 15–20 g carbs every 30–40 min (2 dates, half a banana or a gel).":"Drink water before and after.",
        g>=21?"Practise race-morning breakfast and shoes on this run.":"Note how you feel in your log."]}; }
    case "fartlek": return {type:"quality",title:"Walk-run intervals",km:clamp(r05(2.5+3*f),2.5,5),
      steps:["10 min brisk walk to warm up.",(6+Math.round(4*f))+" × (1 min easy jog + 2 min walk).","5 min walk to cool down."]};
    case "intervals": { let reps,dist,jog;
      if(g<=10 && !adv){ reps=clamp(Math.round(4+4*f),4,8); dist=0.4; jog="200 m"; }
      else { reps=clamp(Math.round(3+3*f)+(adv?1:0),3,7); dist=g<=10?0.8:1; jog=g<=10?"400 m":"2 min"; }
      const km=r05(2.5+reps*dist+reps*0.25), lab=dist<1?dist*1000+" m":"1 km";
      return {type:"quality",title:"Intervals "+reps+" × "+lab,km,
        steps:["Warm up: 1.5 km easy + 4 strides of 20 s.",reps+" × "+lab+" fast but controlled (effort 8/10), "+jog+" easy jog between."+(pc.int?" Pace "+PR(pc.int)+".":""),"Cool down: 1 km easy jog."]}; }
    case "tempo": { const mins=clamp(Math.round((p.level==="new"?8:12)+(adv?22:16)*f),8,40);
      return {type:"quality",title:"Tempo "+mins+" min",km:r05(3.5+mins/6),
        steps:["Warm up: 2 km easy.",mins+" min continuous at comfortably hard effort; you can say short phrases only (6–7/10)."+(pc.tempo?" Pace "+PR(pc.tempo)+".":""),"Cool down: 1.5 km easy."]}; }
    case "hills": { const n=clamp(Math.round(6+4*f),6,10);
      return {type:"quality",title:"Hill repeats "+n+" × 60 s",km:r05(4+n*0.3),
        steps:["Warm up: 2 km easy.",n+" × 60–90 s uphill on a gentle slope at strong effort, tall posture, short quick steps. Walk or jog down.","Cool down: 1.5 km easy."]}; }
    case "racepace": { const k=g===42?clamp(Math.round(6+8*f),6,14):clamp(Math.round(3+4*f),3,7);
      return {type:"quality",title:"Race-pace "+k+" km",km:r05(3+k),
        steps:["Warm up: 2 km easy.",k+" km at goal race pace"+(pc.race?" ("+fmtPace(pc.race)+" /km)":"")+". Practise drinking on the move.","Cool down: 1 km easy."]}; }
    case "T": return session(p.level==="new"||has(p,"preg")?"easy":"steady",p,ctx);
    case "steady": { const km=clamp(r05(ctx.long*0.4),3,10); return {type:"easy",title:"Steady run "+km+" km",km,
        steps:["First 1 km easy, then a relaxed but purposeful effort (5/10).","Last 1 km easy. Add 4 × 20 s strides at the end."]}; }
    case "easywalk": return {type:"easy",title:"Brisk walk 30 min",km:2.5,steps:["Only as approved by your obstetrician.","Stop if you feel dizzy, breathless or have any pain."]};
    case "strength": return {type:"strength",title:"Strength & core 30 min",km:0,steps:["Runner strength circuit (see the Plan tab).",ctx.withEasy?"Can follow a short easy run.":"Do it on the same day as an easy run if short of time."]};
    case "mobility": return {type:"mobility",title:"Yoga & mobility 20 min",km:0,steps:["6 slow Surya Namaskar, hip-flexor and calf stretches.","Legs up the wall for 5 min."]};
  }
}
function raceWeekDay(p,diff,pc){
  const g=+p.goal, gl=goalLabel(p.goal);
  if(diff===0) return {type:"race",title:"RACE DAY · "+gl+" km",km:+gl,steps:["Breakfast 2–3 h before start. Reach the stadium 45 min early.","Start slower than you feel like. Hold back for the first 2 km.",pc.pred?"Your predicted finish: "+fmtTime(pc.pred)+".":"Run by feel and enjoy Yavatmal cheering you on."]};
  if(diff<0) return diff>=-3?{type:"recovery",title:"Recovery walk",km:0,steps:["20–30 min easy walk. Eat well and sleep.","Easy runs only for the next week."]}:session("rest",p,{});
  if(diff===1) return {type:"easy",title:"Shake-out 2 km",km:2,steps:["10–15 min very easy jog with 3 strides.","Lay out bib, shoes and kit tonight. Early dinner, extra rice or chapati."]};
  if(diff===2||diff===6) return session("rest",p,{});
  if(diff===3) return {type:"easy",title:"Easy 4 km + strides",km:4,steps:["Easy run with 4 × 20 s strides at race effort.","Keep drinking water through the day."]};
  if(diff===4) return session("mobility",p,{});
  return {type:"easy",title:"Easy "+(g>=21?6:4)+" km",km:g>=21?6:4,steps:["Relaxed effort. You are fit now; the job is to stay fresh."]};
}
function buildPlan(p,ad){
  ad=ad||{};
  const race=parse(p.raceDate), raceMon=monday(race);
  let start=parse(p.planStart||iso(monday(today())));
  if(start>raceMon) start=raceMon;
  const N=dayDiff(start,raceMon)/7+1;
  const g=+p.goal, peak=PEAK[g][p.level], st=Math.min(START[p.level],peak*0.7);
  const taper=Math.min(TAPER[g],N-1), B=N-taper, effB=Math.min(B,20), baseW=B-effB;
  const pc=paces(p,ad.fiveK), tpl=TEMPLATES[p.days]||TEMPLATES[4];
  const weeks=[];
  for(let w=0;w<N;w++){
    const mon=addDays(start,7*w); let long, phase, frac=1, cut=false;
    if(w<B){ const wb=w-baseW; frac=wb<0?0:(effB<=1?1:wb/(effB-1)); long=st+(peak-st)*frac;
      cut= wb>=0 && wb%4===3 && wb!==effB-1; if(cut) long*=0.8;
      phase= wb<0||frac<0.34?"Base":frac<0.75?"Build":"Peak"; }
    else { const t=w-B; long= taper>=3?(peak*[0.75,0.55][t]||peak*0.5):peak*0.65; phase="Taper"; frac=1; }
    const isRace=w===N-1, days=[];
    for(let i=0;i<7;i++){
      const date=addDays(mon,i); let s;
      if(isRace) s=raceWeekDay(p,dayDiff(date,race),pc);
      else { let k=tpl[i]; if(k==="Q") k=qualityKind(p,w,phase,frac);
        if(phase==="Taper"&&k==="hills") k="tempo";
        const cur=ad.week===w;
        if(cur&&ad.soft&&(k==="intervals"||k==="tempo"||k==="hills"||k==="racepace")) k="easy";
        s=session(k,p,{long:cur&&ad.scale?long*ad.scale:long,frac,pc,withEasy:p.days>=5});
      }
      days.push(Object.assign({date},s));
    }
    weeks.push({n:w+1,mon,phase:isRace?"Race":phase,cut,days,km:Math.round(days.reduce((a,d)=>a+(d.type==="race"?0:d.km),0)*10)/10});
  }
  return {weeks,N,pc,start,race};
}

function nutri(p,day){
  const w=p.weight, b=bmi(p);
  const bmr=10*w+6.25*p.height-5*p.age+(p.sex==="f"?-161:5);
  let kcal=bmr*(has(p,"sitting")?1.3:1.45);
  const t=day?day.type:"rest", km=day?day.km:0;
  kcal+=w*km*(walkRun(p)?0.85:1);
  if(t==="strength") kcal+=2*w; if(t==="mobility") kcal+=1*w;
  const light=["rest","strength","mobility","recovery","easy"].includes(t);
  if(b>=25&&light&&!has(p,"preg")) kcal-=300;
  if(b<18.5) kcal+=300;
  let cpk={rest:3,recovery:3.5,mobility:3,strength:3.5,easy:4.5,quality:5.5,long:km>=20?7:6,race:7}[t]||4;
  if((has(p,"t2dm")||has(p,"pcos"))&&light) cpk-=0.5;
  const prot=has(p,"ckd")?null:Math.round(w*((p.age>=50||b>=25)?1.6:1.4));
  const carb=Math.round(w*cpk);
  const fat=Math.round(Math.max(0.8*w,(kcal-carb*4-(prot||w)*4)/9));
  kcal=Math.round((carb*4+(prot||w)*4+fat*9)/50)*50;
  const runH=km? km*(walkRun(p)?9:7)/60:0;
  const water=Math.round((35*w+runH*600)/50)*50;
  return {kcal,carb,prot,fat,water,glasses:Math.ceil(water/250),bmi:b,bmr:Math.round(bmr)};
}
function meals(p,day,next){
  const n=nutri(p,day), roti=n.kcal<1800?2:n.kcal<2400?3:4, dm=has(p,"t2dm")||has(p,"t1dm");
  const train=day&&["easy","quality","long","race"].includes(day.type);
  const egg=p.diet!=="veg", nv=p.diet==="nonveg";
  const out=[];
  if(train) out.push(["banana","Before the run","1 banana or 3 dates with a few sips of water, 30–60 min before."+(dm?" Check your sugar first.":"")]);
  out.push(["bowl",train?"After the run":"Breakfast",(dm?"Moong dal or besan chilla with vegetables":"Poha or upma with peanuts and vegetables")+" + 1 bowl curd"+(egg?" + 2 boiled eggs":" or sprouts")+(day&&day.type==="long"?" + 1 glass milk":"")+"."]);
  out.push(["fruit","Mid-morning",dm?"Guava, orange or papaya + buttermilk (chaas).":"Seasonal fruit + buttermilk (chaas)."]);
  out.push(["thali","Lunch",roti+" jowar bhakri or chapati, 1 bowl dal, sabzi, salad"+(dm?"; skip white rice or take 2–3 spoons only":", small bowl rice")+(nv?". Chicken or fish (100–150 g) in place of dal on 3–4 days.":".")]);
  out.push(["tea","Evening","Roasted chana, a handful of peanuts or sprouts chaat; tea or coffee with little sugar."]);
  const bigNext=next&&(next.type==="long"||next.type==="race");
  out.push(["roti","Dinner",Math.max(1,roti-1)+" chapati, "+(egg?"egg bhurji, ":"")+"paneer or soya bhurji, sabzi"+(bigNext?". Long run tomorrow: add a bowl of rice or khichdi for extra carbs.":".")]);
  out.push(["milk","Bedtime","Haldi milk (optional), at least 1 h before sleep."]);
  return out;
}
const COND_NOTES = {
 t2dm:["Type 2 diabetes","Check sugar before and after long runs. On insulin or sulfonylureas (glimepiride, gliclazide) carry glucose tablets; lows can come hours later. Choose jowar, bajra, dal and chana; spread carbs evenly. Skip hard sessions if fasting sugar is above 250 mg/dL."],
 t1dm:["Type 1 diabetes","Plan insulin reductions for long runs with your diabetologist. Carry 15–20 g fast carbs, check sugar every 30–45 min on runs over an hour, and never run with ketones."],
 htn:["High BP","Keep salt near 1 teaspoon (5 g) a day on rest days, but replace sweat salt on runs over 75 min (ORS or nimbu-paani with a pinch of salt). On beta-blockers your heart rate stays low, so train by effort, not heart-rate zones. Don't run if BP is above 180/110."],
 heart:["Heart disease","Get cardiologist clearance and a stress test before starting. Keep every run at easy effort until cleared for faster work. Stop at once for chest pain, unusual breathlessness, palpitations or dizziness."],
 chol:["High cholesterol","More fibre (oats, dal, vegetables), less fried farsan and ghee. A small handful of walnuts or a spoon of flaxseed daily. Regular running raises good HDL cholesterol."],
 thyroid:["Hypothyroid","Take levothyroxine on an empty stomach 30–60 min before tea or food. On early run days take it on waking and eat after the run."],
 asthma:["Asthma","Use your reliever inhaler 15 min before running if your doctor has advised it. Warm up for 10 min. Cold January mornings and dust are triggers; cover nose and mouth with a buff."],
 ckd:["Kidney disease","Don't follow the protein, fluid or salt targets in this app. Use your nephrologist's limits. Avoid painkillers like ibuprofen and diclofenac around runs."],
 pcos:["PCOS","Strength training twice a week improves insulin sensitivity. Prefer low-GI carbs and include protein at every meal."],
 anaemia:["Anaemia","Iron-rich foods (green leafy vegetables, ragi/nachni, peanut-jaggery chikki, dates, eggs or meat if you eat them) with vitamin C (lemon, amla). Keep tea and coffee 1 h away from meals. Tiredness or breathlessness on easy runs means get your Hb checked."],
 knee:["Knee / joint pain","Easy runs are walk-run in your plan. Prefer a track or mud road, do the strength circuit twice weekly. Pain above 3/10, swelling or limping means stop and rest."],
 back:["Back pain","Core work (dead bug, bird-dog) instead of sit-ups. Avoid long downhill running early on."],
 preg:["Pregnancy","Don't start a new race plan now. Hard sessions are replaced with brisk walks; do only what your obstetrician approves."]
};
const HAB_NOTES = {
 smoke:["Smoking","It cuts the oxygen your blood carries. Even cutting down helps within weeks; quitting is the biggest performance gain available to you."],
 tobacco:["Kharra / gutkha","Tobacco raises heart rate and BP and causes mouth cancer. Free help: National Tobacco Quitline 1800-112-356."],
 alcohol:["Alcohol","Avoid alcohol for 48 h before long runs and the race. It dehydrates you and slows recovery."],
 sleep:["Short sleep","Aim for 7–8 h. After a poor night, swap a hard session for an easy one."],
 shift:["Night shifts","After a night duty, rest or walk only. Move the hard session to your next fresh day."],
 tea:["Tea / coffee","Keep to 2–3 cups with less sugar, and not within an hour of iron-rich meals."],
 sitting:["Desk job","Stand and walk for 3–5 min every hour. It adds more daily movement than you'd expect."],
 skipbf:["Skipping breakfast","Don't run long on an empty stomach. Eat a banana or dates before, and a proper breakfast within an hour after."]
};
const COND_IC = {t2dm:"drop",t1dm:"drop",htn:"pulse",heart:"heart",chol:"heart",thyroid:"pill",asthma:"leaf",ckd:"drop",pcos:"leaf",anaemia:"drop",knee:"shoe",back:"lotus",preg:"heart"};
const HAB_IC = {smoke:"warn",tobacco:"warn",alcohol:"warn",sleep:"moon",shift:"clock",tea:"clock",sitting:"steps",skipbf:"bowl"};
function medFlags(p){
  const f=[];
  if(has(p,"heart")||has(p,"preg")) f.push("Get your doctor's written clearance before following this plan.");
  else if((p.age>=40&&(p.level==="new"||p.level==="beg"))||["t2dm","t1dm","htn","ckd","asthma","chol"].some(k=>has(p,k)))
    f.push("Get a basic check-up (BP, blood sugar, ECG) before the harder sessions.");
  if(bmi(p)>=30&&!f.length) f.push("Your BMI is above 30: easy runs are walk-run to protect your joints.");
  return f;
}
const TIPS=["Increase weekly distance by about 10% at most.","Run easy days truly easy. Most runners go too fast on them.","Replace running shoes every 600–800 km.","A 10-minute warm-up walk-jog prevents most early-morning injuries.","Sleep is the cheapest recovery tool you have.","Cadence of 165–180 steps a minute reduces knee load.","Eat protein within an hour after running: curd, eggs, paneer or dal.","Missed a run? Skip it and carry on. Never double up the next day.","Breathing hard on an easy run? Slow down or walk for a minute.","Strong hips and calves keep knees healthy. Don't skip strength day.","Check your urine colour: pale yellow means well hydrated.","Practise race-day breakfast on your long runs, never something new on race day.","Run with a group: Cotton City Runners meet on weekend mornings.","Sharp pain that changes how you run is a stop signal. Dull tiredness is normal.","Wear something bright for dark winter mornings."];
function strengthRoutine(p){
  const k=has(p,"knee"), b=has(p,"back"), easy=p.level==="new"||p.age>=60, r=easy?2:3;
  return [
    [k?"Wall sit":easy?"Chair squats":"Squats", k?r+" × 20–30 s":r+" × 12"],
    [k?"Step-ups (low step)":"Reverse lunges", r+" × 8 each leg"],
    [p.level==="adv"?"Single-leg glute bridge":"Glute bridge", r+" × 12–15"],
    ["Calf raises on a step", r+" × 15"],
    [b?"Dead bug":"Plank", b?r+" × 10":r+" × 30–45 s"],
    ["Side plank", "2 × 20–30 s each side"],
    ["Bird-dog", "2 × 10 each side"],
    ["Clamshells", "2 × 15 each side"]];
}

const SRC_NAMES=[[/garmin/i,"Garmin"],[/shealth|samsung/i,"Samsung Health"],[/fitbit/i,"Fitbit"],[/strava/i,"Strava"],[/google.*fitness|fit$/i,"Google Fit"],[/xiaomi|mi\.health|mifit/i,"Mi Fitness"],[/huami|zepp|amazfit/i,"Zepp"],[/coros/i,"COROS"],[/polar/i,"Polar"],[/suunto/i,"Suunto"],[/noise/i,"NoiseFit"],[/boat/i,"boAt"]];
function srcName(id,name){ const s=(id||"")+" "+(name||""); for(const [re,n] of SRC_NAMES) if(re.test(s)) return n; return name||"Health Connect"; }
const HC_TYPE={running:"run",runningTreadmill:"run",trackAndField:"run",wheelchairRunPace:"run",walking:"walk",hiking:"walk",wheelchairWalkPace:"walk",cycling:"cycle",bikingStationary:"cycle",handCycling:"cycle",
  strengthTraining:"strength",traditionalStrengthTraining:"strength",functionalStrengthTraining:"strength",weightlifting:"strength",calisthenics:"strength",coreTraining:"strength",highIntensityIntervalTraining:"strength",crossTraining:"strength",
  yoga:"mobility",flexibility:"mobility",pilates:"mobility",stretching:"mobility",mindAndBody:"mobility",taiChi:"mobility"};
function hav(a,b){ const R=6371,toR=x=>x*Math.PI/180,dLa=toR(b[0]-a[0]),dLo=toR(b[1]-a[1]);
  const h=Math.sin(dLa/2)**2+Math.cos(toR(a[0]))*Math.cos(toR(b[0]))*Math.sin(dLo/2)**2; return 2*R*Math.asin(Math.sqrt(h)); }
function parseGPX(txt){
  const x=new DOMParser().parseFromString(txt,"application/xml"), pts=Array.from(x.getElementsByTagName("trkpt"));
  if(!pts.length) throw new Error("no track points");
  let km=0; const hrs=[];
  for(let i=0;i<pts.length;i++){ const c=[+pts[i].getAttribute("lat"),+pts[i].getAttribute("lon")];
    if(i) km+=hav([+pts[i-1].getAttribute("lat"),+pts[i-1].getAttribute("lon")],c);
    const hr=pts[i].getElementsByTagNameNS("*","hr")[0]; if(hr) hrs.push(+hr.textContent); }
  const tm=e=>{ const t=e.getElementsByTagName("time")[0]; return t?new Date(t.textContent):null; };
  const t0=tm(pts[0]), t1=tm(pts[pts.length-1]), type=((x.getElementsByTagName("type")[0]||{}).textContent||"").toLowerCase();
  return [{date:t0?iso(t0):iso(today()),km:Math.round(km*100)/100,min:t0&&t1?Math.round((t1-t0)/60000):null,hr:hrs.length?Math.round(hrs.reduce((a,b)=>a+b,0)/hrs.length):null,type:/walk|hik/.test(type)?"walk":/cycl|bik|rid/.test(type)?"cycle":"run",src:"gpx"}];
}
function parseTCX(txt){
  const x=new DOMParser().parseFromString(txt,"application/xml"), acts=Array.from(x.getElementsByTagNameNS("*","Activity"));
  if(!acts.length) throw new Error("no activities");
  return acts.map(a=>{ const laps=Array.from(a.getElementsByTagNameNS("*","Lap")); let m=0,s=0; const hr=[];
    laps.forEach(l=>{ const d=l.getElementsByTagNameNS("*","DistanceMeters")[0], t=l.getElementsByTagNameNS("*","TotalTimeSeconds")[0];
      if(d&&d.parentNode===l) m+=+d.textContent; if(t) s+=+t.textContent;
      const ah=l.getElementsByTagNameNS("*","AverageHeartRateBpm")[0]; if(ah) hr.push(+ah.textContent.trim()); });
    const id=(a.getElementsByTagNameNS("*","Id")[0]||{}).textContent, sp=(a.getAttribute("Sport")||"").toLowerCase();
    return {date:id?iso(new Date(id)):iso(today()),km:Math.round(m/10)/100,min:Math.round(s/60)||null,hr:hr.length?Math.round(hr.reduce((p,c)=>p+c,0)/hr.length):null,type:sp.includes("bik")?"cycle":"run",src:"tcx"}; });
}
function csvRows(t){ const rows=[]; let row=[],f="",q=false;
  for(let i=0;i<t.length;i++){ const c=t[i];
    if(q){ if(c==='"'){ if(t[i+1]==='"'){f+='"';i++;} else q=false; } else f+=c; }
    else if(c==='"') q=true; else if(c===","){ row.push(f); f=""; } else if(c==="\n"||c==="\r"){ if(c==="\r"&&t[i+1]==="\n") i++; row.push(f); rows.push(row); row=[]; f=""; } else f+=c; }
  if(f||row.length){ row.push(f); rows.push(row); } return rows.filter(r=>r.some(x=>x.trim())); }
function parseCSV(txt){
  const R=csvRows(txt); if(R.length<2) throw new Error("empty");
  const h=R[0].map(x=>x.trim().toLowerCase()), fi=re=>h.findIndex(x=>re.test(x));
  const iD=fi(/^date|start time|start_time|^time$/), iK=fi(/distance/), iT=fi(/^time$|duration|elapsed|moving time/), iTy=fi(/activity type|^type|exercise/), iH=fi(/avg hr|average heart|mean_heart|avg heart/);
  if(iD<0||iK<0) throw new Error("no date or distance column");
  const kmFactor=/\(m\)|meters|metres/.test(h[iK])?0.001:/mi/.test(h[iK])?1.609:1, out=[];
  for(const r of R.slice(1)){ const d=new Date((r[iD]||"").replace(" ","T")); if(isNaN(d)) continue;
    let km=parseFloat(String(r[iK]).replace(/,/g,""))*kmFactor; if(!(km>0)) continue; if(km>300) km=km/1000;
    let min=null; if(iT>=0){ const v=String(r[iT]).trim(); if(/:/.test(v)){ const p=v.split(":").map(Number); min=Math.round(p.length===3?p[0]*60+p[1]+p[2]/60:p[0]+p[1]/60); } else if(+v) min=Math.round(+v>600?+v/60:+v); }
    const ty=iTy>=0?String(r[iTy]).toLowerCase():"run";
    out.push({date:iso(d),km:Math.round(km*100)/100,min,hr:iH>=0&&+r[iH]?Math.round(+r[iH]):null,type:/walk|hik/.test(ty)?"walk":/cycl|bik|rid/.test(ty)?"cycle":/strength|gym/.test(ty)?"strength":"run",src:"csv"}); }
  return out;
}