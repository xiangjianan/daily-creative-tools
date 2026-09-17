import { inspect, labels, receipt } from './core.mjs';
const $ = id => document.getElementById(id);
let files = [], sample = false, result;
const el = (tag, text, className) => { const n = document.createElement(tag); if(text !== undefined) n.textContent = text; if(className) n.className = className; return n; };
const size = n => n < 1024 ? `${n} B` : n < 1048576 ? `${(n/1024).toFixed(1)} KB` : `${(n/1048576).toFixed(1)} MB`;
function draw() {
  result = inspect($('requirements').value, files);
  $('copy-status').textContent = ''; $('copy-fallback').hidden = true;
  $('clear-files').disabled = !files.length;
  $('file-mode').textContent = files.length ? `${sample ? '示例文件 · 选择真实文件后将替换示例' : '已选择'} · ${files.length} 份` : '';
  $('file-list').replaceChildren(...files.map((f,i) => {
    const li = el('li'); li.append(el('span', f.name, 'filename'), el('small',size(f.size)));
    const remove = el('button', '×','remove'); remove.setAttribute('aria-label',`移除 ${f.name}`);
    remove.addEventListener('click', () => { files.splice(i,1); draw(); }); li.append(remove); return li;
  }));
  $('result-list').replaceChildren(); $('summary').replaceChildren();
  $('copy').disabled = !!result.error || !result.rows?.length;
  $('mode').textContent = sample ? '示例核对' : files.length ? '本地核对' : '等待文件';
  const box = el('div',undefined,'summary-box'); let title, subtitle;
  if (result.error) { title = '先调整一下清单'; subtitle = result.error; box.classList.add('attention'); }
  else if (!result.rows.length) { title = '先写下应交清单'; subtitle = '每行一个关键词，再拖入文件，就能开始核对。'; box.classList.add('neutral'); }
  else if (!files.length) { title = '清单有了，文件呢？'; subtitle = `已列好 ${result.rows.length} 项。拖入准备发送的文件，即时核对。`; box.classList.add('neutral'); }
  else { const c = result.counts; title = result.ready ? '文件名都对上了。' : c.missing ? `还差 ${c.missing} 项，先别急。` : '都找到了，再确认一下。'; subtitle = `${c.found} / ${result.rows.length} 项已对应${c.multiple+c.shared+c.empty ? ` · ${c.multiple+c.shared+c.empty} 项待确认` : ''}${result.extras.length ? ` · ${result.extras.length} 份清单外文件` : ''}`; if(!result.ready) box.classList.add('attention'); }
  box.append(el('h3',title),el('p',subtitle));
  if(!result.error && result.rows.length) { const meter = el('div',undefined,'meter'); meter.setAttribute('aria-hidden','true'); result.rows.forEach(r=>meter.append(el('span',undefined,r.status==='found'?'done':''))); box.append(meter); }
  $('summary').append(box);
  if(result.error) return;
  result.rows.forEach(r=>{
    const row = el('div',undefined,`check-row ${r.status}`); const body = el('div'); body.append(el('strong',r.label));
    const note = {missing:'还没有文件名包含这个关键词。',multiple:'命中多份，请移除不需要的文件，或写更精确的关键词。',shared:'同一文件还命中了其他清单项，请细化关键词。',empty:'这份文件是 0 B，请检查后重新导出。',found:''}[r.status];
    body.append(el('p',[...r.matches.map(j=>files[j].name),note].filter(Boolean).join('\n')));
    row.append(el('span',r.status==='found'?'✓':r.status==='missing'?'−':'!','check-icon'),body,el('span',labels[r.status],'row-label')); $('result-list').append(row);
  });
  if(result.extras.length) { const extra = el('div',undefined,'extra'); extra.append(el('h3',`清单外 · ${result.extras.length} 份`),el('p','可能多带了，也可能清单漏写了。')); result.extras.forEach(j=>extra.append(el('p',files[j].name))); $('result-list').append(extra); }
}
function addFiles(incoming) {
  $('file-error').textContent = '';
  const next = Array.from(incoming, f=>({name:f.name,size:f.size}));
  if (!next.length) { $('file-error').textContent = '没有选到文件，请重试。'; return; }
  if ((sample?0:files.length)+next.length > 200) { $('file-error').textContent = '一次最多 200 份文件。本次未添加，请减少后重试。'; return; }
  files = [...(sample?[]:files),...next]; sample = false; draw();
}
$('requirements').addEventListener('input',draw);
$('example').addEventListener('click',()=>{ $('requirements').value='项目方案\n报价单\n品牌素材\n使用说明'; files=[{name:'秋季项目_项目方案_v3.pdf',size:184320},{name:'秋季项目_报价单_v1.xlsx',size:24576},{name:'秋季项目_报价单_v2.xlsx',size:28672},{name:'秋季项目_品牌素材.zip',size:2641920},{name:'内部讨论记录.txt',size:8192}]; sample=true; $('file-error').textContent=''; draw(); });
$('clear-files').addEventListener('click',()=>{files=[];sample=false;$('file-error').textContent='';draw();});
$('dropzone').addEventListener('click',()=>$('file-input').click());
$('file-input').addEventListener('change',e=>{ if(e.target.files.length) addFiles(e.target.files); e.target.value=''; });
for(const event of ['dragenter','dragover']) $('dropzone').addEventListener(event,e=>{e.preventDefault();$('dropzone').classList.add('dragover');});
$('dropzone').addEventListener('dragleave',()=>$('dropzone').classList.remove('dragover'));
$('dropzone').addEventListener('drop',e=>{e.preventDefault();$('dropzone').classList.remove('dragover');if(Array.from(e.dataTransfer.items).some(i=>i.webkitGetAsEntry?.()?.isDirectory)){$('file-error').textContent='本次未添加：请打开文件夹，选中里面的文件再拖入。';return;}addFiles(e.dataTransfer.files);});
window.addEventListener('dragover',e=>e.preventDefault());window.addEventListener('drop',e=>e.preventDefault());
$('copy').addEventListener('click',async()=>{ const text=receipt(result,files,sample); try {await navigator.clipboard.writeText(text);$('copy-status').textContent='已复制，可粘贴到交付备注里。';}catch{$('copy-fallback').value=text;$('copy-fallback').hidden=false;$('copy-fallback').focus();$('copy-fallback').select();$('copy-status').textContent='浏览器未允许自动复制，请复制下方已选中的小票。';} });
draw();
