import {parse,pages,sheet} from './core.mjs';
const $=id=>document.getElementById(id);
let cards=[],urls=[];
function clearURLs(){urls.forEach(URL.revokeObjectURL);urls=[]}
function view(){const card=cards[Number($('person').value)];if(card){$('name-view').textContent=card.name;$('cue-view').textContent=card.cue}}
function render(){
  const selected=$('person').selectedIndex;
  clearURLs();$('sheets').replaceChildren();$('person').replaceChildren();cards=[];
  $('views').hidden=true;$('empty').hidden=false;$('count').textContent='0 张';
  try{
    cards=parse($('input').value);
    $('status').className='';
    if(!cards.length){$('status').textContent='先输入一行，或试试示例。';return}
    const groups=pages(cards);$('status').textContent=`已排好 ${cards.length} 张桌牌，${groups.length} 页 A4。提示方向已自动倒转。`;
    $('count').textContent=`${cards.length} 张 / ${groups.length} 页`;
    $('views').hidden=false;$('empty').hidden=true;
    cards.forEach((c,i)=>{const option=document.createElement('option');option.value=i;option.textContent=`${i+1} · ${c.name}`;$('person').append(option)});
    $('person').selectedIndex=Math.max(0,Math.min(selected,cards.length-1));view();
    groups.forEach((group,i)=>{
      const url=URL.createObjectURL(new Blob([sheet(group,i+1,groups.length)],{type:'image/svg+xml;charset=utf-8'}));urls.push(url);
      const card=document.createElement('article');card.className='sheet';
      const img=document.createElement('img');img.src=url;img.alt=`第${i+1}页：${group.map(c=>c.name).join('、')}的单面打印排版`;
      const footer=document.createElement('footer'),label=document.createElement('span'),a=document.createElement('a');label.textContent=`A4 · 第 ${i+1} / ${groups.length} 页`;
      a.href=url;a.download=`折座-A4-${i+1}.svg`;a.className='download';a.textContent=`下载第${i+1}页 SVG`;
      footer.append(label,a);card.append(img,footer);$('sheets').append(card);
    });
  }catch(e){cards=[];$('status').textContent=e.message;$('status').className='error'}
}
$('input').addEventListener('input',render);$('person').addEventListener('change',view);
$('sample').onclick=()=>{$('input').value='小林 | 先听完，再问一个具体问题\n阿宁 | 用一个例子说明，不急着给结论\n陈老师 | 留一分钟，让安静的人开口\nMia | 先说目标，再说需要的帮助';render()};
render();
