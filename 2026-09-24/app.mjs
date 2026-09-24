import {plan,clock,receipt} from './core.mjs';
const $=id=>document.getElementById(id);
const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
let current;
function render(){
 $('summary').replaceChildren();$('summary').className='summary';$('timeline').replaceChildren();$('comparison').replaceChildren();$('comparison').hidden=true;$('copy').disabled=true;$('copy-status').textContent='';$('fallback').hidden=true;$('explanation').textContent='';current=null;
 try{
  const p=plan($('tasks').value),start=$('start').value;clock(start,0);current=p;
  $('summary').append(node('h2','按照你给的时长，换个动手顺序'),node('h3',p.saved?`少等 ${p.saved} 分钟。`:'已经很顺手了。'),node('p',`${clock(start,0)} 开始 → ${clock(start,p.after.total)} 全部完成 · 共 ${p.after.total} 分钟`));
  if(!p.saved)$('summary').append(node('p','原顺序已达到这个模型下的最短总时长。'));
  [['原顺序',p.before],['顺手排',p.after]].forEach(([label,s])=>{const d=node('div');d.append(node('small',label),node('strong',clock(start,s.total)),node('span',`${s.total} 分钟后完成`));$('comparison').append(d);});$('comparison').hidden=false;
  p.after.rows.forEach((r,i)=>{const li=node('li');const top=node('div',undefined,'task-top');top.append(node('strong',`${i+1}. ${r.name}`),node('time',clock(start,r.start)));const rail=node('div',undefined,'rail');rail.setAttribute('aria-hidden','true');const gap=node('span'),active=node('span',undefined,'active'),wait=node('span',undefined,'wait');gap.style.width=`${r.start/p.after.total*100}%`;active.style.width=`${r.hands/p.after.total*100}%`;wait.style.width=`${r.wait/p.after.total*100}%`;rail.append(gap,active,wait);li.append(top,rail,node('p',`动手 ${r.hands} 分钟，${clock(start,r.release)} 腾出双手${r.wait?`；独立等待 ${r.wait} 分钟`:'，无需等待'} · ${clock(start,r.end)} 完成`,'task-note'));$('timeline').append(li);});
  $('explanation').textContent=`所有横条共用同一起点和比例。动手共 ${p.after.hands} 分钟，最后还需等待 ${p.after.total-p.after.hands} 分钟；等待中的任务不会占用双手。`;$('copy').disabled=false;
 }catch(err){const empty=!$('tasks').value.trim();$('summary').classList.add(empty?'neutral':'error');$('summary').append(node('h3',empty?'让等待，重叠起来。':'先调整一下输入'),node('p',err.message));}
}
$('tasks').addEventListener('input',render);$('start').addEventListener('input',render);
$('example').addEventListener('click',()=>{$('tasks').value='收拾桌面 15+0\n启动洗碗机 10+20\n启动洗衣机 5+40';$('start').value='18:00';render();});
$('clear').addEventListener('click',()=>{$('tasks').value='';render();$('tasks').focus();});
$('copy').addEventListener('click',async()=>{if(!current)return;const text=receipt(current,$('start').value);try{await navigator.clipboard.writeText(text);$('copy-status').textContent='已复制，粘贴到备忘录就能照着做。';}catch{$('fallback').value=text;$('fallback').hidden=false;$('fallback').focus();$('fallback').select();$('copy-status').textContent='请手动复制下方已选中的开工卡。';}});
render();
