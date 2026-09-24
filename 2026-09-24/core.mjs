export function parse(text) {
 if (text.length>6000) throw Error('一次最多 6,000 字，请缩短清单。');
 const lines=text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
 if (!lines.length) throw Error('先写一件事，或点「载入示例」。');
 if (lines.length>20) throw Error('一次最多 20 件事。');
 return lines.map((line,index)=>{
  const m=line.normalize('NFKC').match(/^(.+?)\s+(\d+)\s*\+\s*(\d+)$/);
  if(!m) throw Error(`第 ${index+1} 行格式不对。请写：事情名称  动手分钟+等待分钟`);
  const name=m[1].trim(), hands=Number(m[2]), wait=Number(m[3]);
  if(!name || name.length>60) throw Error(`第 ${index+1} 行：名称请控制在 1–60 字。`);
  if(hands<1 || hands>240 || wait>720) throw Error(`第 ${index+1} 行：动手填 1–240，等待填 0–720 的整数分钟。`);
  return {name,hands,wait,id:index};
 });
}
export function schedule(tasks) {
 let cursor=0;
 const rows=tasks.map(t=>{const start=cursor;cursor+=t.hands;return {...t,start,release:cursor,end:cursor+t.wait};});
 return {rows,total:Math.max(0,...rows.map(r=>r.end)),hands:cursor};
}
export function plan(text) {
 const tasks=parse(text);
 if(tasks.reduce((s,t)=>s+t.hands,0)>720) throw Error('动手时间合计不能超过 720 分钟，请拆成几批。');
 const before=schedule(tasks);
 const after=schedule([...tasks].sort((a,b)=>b.wait-a.wait || a.id-b.id));
 return {before,after,saved:before.total-after.total};
}
export function clock(start,offset) {
 if(!/^\d{2}:\d{2}$/.test(start)) throw Error('请填写有效的开始时间。');
 const [h,m]=start.split(':').map(Number);
 if(h>23||m>59) throw Error('请填写有效的开始时间。');
 const n=h*60+m+offset,day=Math.floor(n/1440),time=`${String(Math.floor(n%1440/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
 return `${day?day===1?'次日 ':'第 '+(day+1)+' 天 ':''}${time}`;
}
export function receipt(p,start) {
 return ['顺手排 · 一人动手，等待重叠',`从 ${clock(start,0)} 开始 · 全部完成 ${clock(start,p.after.total)}`,`原顺序 ${p.before.total} 分钟 → 新顺序 ${p.after.total} 分钟 · 少等 ${p.saved} 分钟`,'',...p.after.rows.map((r,i)=>`${i+1}. ${clock(start,r.start)}–${clock(start,r.release)} ${r.name}（动手 ${r.hands} 分钟）${r.wait?`；随后独立等待 ${r.wait} 分钟，${clock(start,r.end)} 完成`:'；完成'}`),'','仅适用于互不依赖、等待时不占用人手和共享设备、结束后无需再动手的任务。时间为估算；不是闹钟。'].join('\n');
}
