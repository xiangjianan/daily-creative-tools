import { parse, plan, changes, announcement, allText } from './core.mjs';
const $ = id => document.getElementById(id);
let rounds = [], index = 1, downloadURL = '', revision = 0;
const example = '小林 | 阿宁\n陈老师 | Mia\n小舟 | 阿禾\n大可 | 阿月';
function el(tag, text, className) { const node = document.createElement(tag); node.textContent = text; if (className) node.className = className; return node; }
function render() {
  revision++;
  $('copy-status').textContent = ''; $('copy-fallback').hidden = true;
  const current = rounds[index], movement = changes(rounds[index - 1], current), movers = movement.filter(p => p.from !== p.to);
  $('round-title').textContent = `第${index}轮 → 第${index + 1}轮`;
  $('round-count').textContent = `共${rounds.length}轮`;
  $('round-note').textContent = `以下指令从第${index}轮的座位出发。翻页只预览，请在现场按轮次执行。`;
  $('move-count').textContent = movers.length; $('stay-count').textContent = movement.length - movers.length;
  $('tables').replaceChildren(...current.map((pair, table) => {
    const card = el('div', '', 'table-card'); card.append(el('span', `第 ${table + 1} 桌`, 'table-no'));
    for (const name of pair) { const person = movement.find(p => p.name === name); const row = el('div', '', 'person'); row.append(el('b', name), el('span', person.from === person.to ? '留在这里' : `从${person.from}桌来`, `tag${person.from === person.to ? '' : ' arrive'}`)); card.append(row); }
    return card;
  }));
  $('moves').replaceChildren(...movers.map(p => { const li = el('li', ''); li.append(el('b', p.name), el('span', `第${p.from}桌 → 第${p.to}桌`, 'route')); return li; }));
  $('prev').disabled = index === 1; $('next').disabled = index === rounds.length - 1;
  $('coverage').textContent = index === rounds.length - 1 ? `方案到此结束：每人恰好与其他${rounds.length}人各聊过一轮。` : `执行完第${index + 1}轮后，每人会与${index + 1}位不同搭档聊过；还可继续${rounds.length - index - 1}轮。`;
}
function update() {
  revision++; rounds = []; index = 1;
  if (downloadURL) URL.revokeObjectURL(downloadURL); downloadURL = '';
  $('download').removeAttribute('href'); $('result').hidden = true; $('empty').hidden = false; $('status').className = '';
  try {
    const tables = parse($('people').value);
    if (!tables.length) { $('status').textContent = '输入当前座位，立即看下一轮。'; return; }
    rounds = plan(tables); $('status').textContent = `已排好${tables.length * 2}人、${rounds.length}轮。修改名单会从第1轮重新排。`;
    downloadURL = URL.createObjectURL(new Blob([allText(rounds)], { type: 'text/plain;charset=utf-8' })); $('download').href = downloadURL;
    $('result').hidden = false; $('empty').hidden = true; render();
  } catch (error) { $('status').textContent = error.message; $('status').className = 'error'; }
}
$('people').addEventListener('input', update);
$('sample').addEventListener('click', () => { $('people').value = example; update(); });
$('prev').addEventListener('click', () => { if (index > 1) { index--; render(); } });
$('next').addEventListener('click', () => { if (index < rounds.length - 1) { index++; render(); } });
$('copy').addEventListener('click', async () => {
  const text = announcement(rounds, index), rev = revision;
  try { await navigator.clipboard.writeText(text); if (rev === revision) $('copy-status').textContent = '已复制本轮换桌指令。'; }
  catch { if (rev !== revision) return; $('copy-fallback').value = text; $('copy-fallback').hidden = false; $('copy-fallback').focus(); $('copy-fallback').select(); $('copy-status').textContent = '浏览器未允许自动复制，请复制下方已选中的文字。'; }
});
