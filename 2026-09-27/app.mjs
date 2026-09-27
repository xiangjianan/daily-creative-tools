import {calculate,note} from './core.mjs';
const $=id=>document.getElementById(id);
let result=null;
let serial=0;
function addRow(value={name:'',each:'1',stock:'0'}) {
  const row=document.createElement('div'); row.className='item';
  const n=++serial;
  for(const [key,label] of [['name','物品'],['each','每袋几个'],['stock','现有几个']]) {
    const wrap=document.createElement('label'); wrap.textContent=label;
    const input=document.createElement('input');input.dataset.key=key;input.value=value[key];
    input.id=`item-${n}-${key}`;input.setAttribute('aria-label',`${label} 第${n}行`);
    if(key==='name'){input.maxLength=30;input.placeholder='如：贴纸'}
    else{input.type='number';input.min=key==='each'?'1':'0';input.max=key==='each'?'999':'99999';input.step='1';input.inputMode='numeric'}
    input.addEventListener('input',render);wrap.append(input);row.append(wrap);
  }
  const remove=document.createElement('button');remove.className='remove';remove.textContent='×';remove.setAttribute('aria-label',`移除第${n}行`);remove.onclick=()=>{row.remove();render()};row.append(remove);$('rows').append(row);
}
function getRows(){return [...$('rows').children].map(row=>Object.fromEntries([...row.querySelectorAll('input')].map(i=>[i.dataset.key,i.value])))}
function render(){
  [...$('rows').children].forEach((row,i)=>{row.querySelectorAll('input').forEach(input=>input.setAttribute('aria-label',`${{name:'物品',each:'每袋几个',stock:'现有几个'}[input.dataset.key]} 第${i+1}行`));row.querySelector('button').setAttribute('aria-label',`移除第${i+1}行`)});
  const rows=getRows();$('count').textContent=`${rows.length} / 12 种`;$('add').disabled=rows.length>=12;
  $('fallback').hidden=true;$('fallback').value='';$('copy-status').textContent='';
  try{
    result=calculate(rows);$('error').textContent='';$('result').hidden=false;$('empty').hidden=true;
    $('current').textContent=result.current;
    $('bottleneck').textContent=`当前短板：${result.items.filter(i=>i.limiting).map(i=>i.name).join('、')}。即使其他物品有剩，也不能多装完整一袋。`;
    $('gain').textContent=`多装 ${result.gain} 袋，达到 ${result.next} 袋`;
    $('shopping').replaceChildren();
    result.items.filter(i=>i.add).forEach(i=>{const li=document.createElement('li'),name=document.createElement('span'),number=document.createElement('strong');name.textContent=i.name;number.textContent=`补 ${i.add} 个`;li.append(name,number);$('shopping').append(li)});
    $('explain').textContent=result.allTied?'所有物品同时卡住了数量：这里先给出再装1袋的补料量。':`只补上面这些，可一直装到 ${result.next} 袋；再往后，${result.items.filter(i=>!i.limiting&&i.capacity===result.next).map(i=>i.name).join('、')}也会不够。`;
    $('remaining').replaceChildren();result.items.forEach(i=>{const line=document.createElement('div');line.className='balance';const name=document.createElement('span'),amount=document.createElement('span');name.textContent=`${i.name} · 每袋 ${i.each} 个`;amount.textContent=`剩 ${i.remaining} 个`;line.append(name,amount);$('remaining').append(line)});
  }catch(e){result=null;$('result').hidden=true;$('empty').hidden=false;$('error').textContent=rows.length===1&&!rows[0].name.trim()?'填写物品名称后开始计算。':e.message}
}
$('add').onclick=()=>{if(getRows().length>=12)return;addRow();render();$('rows').lastElementChild.querySelector('input').focus()};
$('sample').onclick=()=>{$('rows').replaceChildren();serial=0;[{name:'明信片',each:1,stock:50},{name:'糖果',each:3,stock:130},{name:'贴纸',each:1,stock:38},{name:'纸袋',each:1,stock:45}].forEach(addRow);render()};
$('copy').onclick=async()=>{if(!result)return;const text=note(result);try{await navigator.clipboard.writeText(text);$('copy-status').textContent='已复制装配与补料单。'}catch{$('fallback').value=text;$('fallback').hidden=false;$('fallback').focus();$('fallback').select();$('copy-status').textContent='未能自动复制，请从下方选中文本复制。'}};
addRow();render();
