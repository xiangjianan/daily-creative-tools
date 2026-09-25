import {transform,addRule,occurrences} from './core.mjs';
const $=id=>document.getElementById(id),el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
let rules=[],current=null;
function drawPreview(){
 $('preview').replaceChildren();$('summary').replaceChildren();$('error').textContent='';$('copy-status').textContent='';$('fallback').hidden=true;$('copy').disabled=true;current=null;
 try{const source=$('source').value,r=transform(source,rules);current=r;
 $('summary').append(el('strong',!source.trim()?'先放入一段文稿':!rules.length?'选一次，绑定每一处':`已联动 ${r.changed} 处`),el('p',!rules.length?'从原文选中片段，或在左侧输入原词。':`${rules.length} 组内容 · 命中 ${r.total} 处${r.missing.length?` · ${r.missing.length} 组在原文中已消失，请移除或检查`:''}`));
 r.parts.forEach(p=>{const n=el(p.index===undefined?'span':'mark',p.text);if(p.index!==undefined){n.dataset.tone=String(p.index%4);n.title=`原文：${rules[p.index].from}`;}$('preview').append(n);});
 rules.forEach((_,i)=>{const counter=document.querySelector(`[data-count="${i}"]`);if(counter)counter.textContent=`${r.counts[i]} 处`;});
 $('copy').disabled=!source.trim()||r.missing.length>0;
 }catch(err){$('summary').append(el('strong','先调整一下内容'));$('error').textContent=err.message;}
}
function drawRules(){
 $('rules').replaceChildren();$('rule-count').textContent=`${rules.length} / 8 组`;$('rules-empty').hidden=!!rules.length;
 rules.forEach((r,i)=>{const block=el('div',undefined,'rule'),head=el('div',undefined,'rule-head'),count=el('span',`${occurrences($('source').value,r.from).length} 处`,'count');count.dataset.count=String(i);const remove=el('button','×','remove');remove.setAttribute('aria-label',`移除绑定 ${r.from}`);remove.addEventListener('click',()=>{rules.splice(i,1);drawRules();drawPreview();});head.append(el('span',`「${r.from}」`,'from'),count,remove);const label=el('label');label.append(el('span','统一改成'));const input=el('input');input.value=r.to;input.setAttribute('aria-label',`将 ${r.from} 改为`);input.addEventListener('input',()=>{r.to=input.value;drawPreview();});label.append(input);block.append(head,label);$('rules').append(block);});
}
function selected(){const s=$('source');if(s.selectionEnd>s.selectionStart)$('phrase').value=s.value.slice(s.selectionStart,s.selectionEnd);}
$('source').addEventListener('select',selected);$('source').addEventListener('pointerup',selected);$('source').addEventListener('keyup',selected);$('source').addEventListener('input',()=>{$('bind-status').textContent='';drawPreview();});
function bind(){try{rules=addRule($('source').value,rules,$('phrase').value);$('bind-status').textContent=`已绑定「${rules.at(-1).from}」，在下面填写新内容。`;$('phrase').value='';drawRules();drawPreview();$('rules').lastElementChild.querySelector('input').focus();$('rules').lastElementChild.querySelector('input').select();}catch(err){$('bind-status').textContent=err.message;}}
$('bind').addEventListener('click',bind);$('phrase').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();bind();}});
$('example').addEventListener('click',()=>{$('source').value='林女士，您好：\n\n星河咖啡的方案将在9月28日发给您。我们会为星河咖啡准备两版视觉稿。\n\n如果9月28日不方便，请告诉我新的时间。期待和星河咖啡一起完成这次改版。';rules=[{from:'星河咖啡',to:'山岚书店'},{from:'9月28日',to:'10月8日'}];$('phrase').value='';$('bind-status').textContent='示例已绑定客户名与日期，试着改动下面的输入框。';drawRules();drawPreview();});
$('copy').addEventListener('click',async()=>{if(!current)return;const text=current.text;try{await navigator.clipboard.writeText(text);$('copy-status').textContent='已复制纯文本。';}catch{$('fallback').value=text;$('fallback').hidden=false;$('fallback').focus();$('fallback').select();$('copy-status').textContent='请手动复制下方已选中的新文稿。';}});
drawRules();drawPreview();
