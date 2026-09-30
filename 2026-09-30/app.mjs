import { chars, validate, compare, describe, visible, codepoint, explanation, instruction, applyEdit } from './core.mjs';
const $ = id => document.getElementById(id);
let previous = null, revision = 0;
function el(tag, text, cls) { const n = document.createElement(tag); n.textContent = text; if (cls) n.className = cls; return n; }
function render(resetUndo = true) {
  revision++; if (resetUndo) previous = null;
  $('undo').disabled = previous === null;
  $('copy-status').textContent = ''; $('copy-fallback').hidden = true; $('inspect').hidden = true;
  const a = $('reference').value, b = $('entered').value;
  $('reference-count').textContent = `${chars(a).length} / 64 字符`; $('entered-count').textContent = `${chars(b).length} / 64 字符`;
  $('result').hidden = true; $('badge').hidden = true; $('status').className = '';
  $('alignment').replaceChildren(); $('edits').replaceChildren();
  try { validate(a, b); } catch (e) { $('status').textContent = e.message; $('status').className = 'error'; $('detail').textContent = '超限时不生成部分结果，也不会截断你的输入。'; return; }
  if (!a || !b) { $('status').textContent = !a && !b ? '先放入两份短口令。' : `还缺${a ? ' B 待核对' : ' A 基准'}口令。`; $('detail').textContent = '空格不是空输入；它会被保留并单独显示。'; return; }
  const result = compare(a, b);
  $('result').hidden = false; $('badge').hidden = false;
  $('badge').textContent = result.distance ? `${result.distance} 次增删改` : '逐字符一致';
  $('status').textContent = result.distance ? `有${result.distance}处需要核对，不必整串重输。` : '两份完全一致。';
  if (!result.distance) $('status').className = 'success';
  $('detail').textContent = result.distance ? `已对齐${result.matches}个相同字符。下面是一种最少修改方案，先核实 A，再逐处修改 B。` : '大小写、空格和隐藏字符也相同；这不代表口令已通过设备或服务验证。';
  for (const [index, c] of result.columns.entries()) {
    const cell = el('button', '', `cell ${c.kind === 'same' ? 'same' : 'changed'}`);
    cell.setAttribute('aria-label', `第${index + 1}列：A ${describe(c.expected)}，B ${describe(c.actual)}`);
    cell.append(el('span', visible(c.expected), 'glyph'), el('span', visible(c.actual), 'glyph'), el('span', c.actual === null ? 'B 缺位' : `B ${c.actualIndex + 1}`, 'position'));
    cell.addEventListener('click', () => {
      for (const n of $('alignment').children) n.classList.remove('selected'); cell.classList.add('selected');
      $('inspect').hidden = false;
      $('inspect').textContent = `A：${describe(c.expected)} ${codepoint(c.expected)}${c.expected === null ? '' : ` · 第${c.expectedIndex + 1}位`}\nB：${describe(c.actual)} ${codepoint(c.actual)}${c.actual === null ? '' : ` · 第${c.actualIndex + 1}位`}`;
    });
    $('alignment').append(cell);
  }
  for (const edit of result.edits) {
    const card = el('div', '', 'edit'), body = el('div', '');
    body.append(el('h3', instruction(edit)), el('p', explanation(edit)), el('p', `B ${codepoint(edit.actual) || '缺位'} → A ${codepoint(edit.expected) || '无此字符'}`, 'codepoints'));
    const fix = el('button', '按 A 修正这一处'); fix.setAttribute('aria-label', `按A修正：${instruction(edit)}`);
    fix.addEventListener('click', () => { previous = $('entered').value; $('entered').value = applyEdit(previous, edit); render(false); ($('edits').querySelector('button') || $('copy')).focus({ preventScroll: true }); });
    card.append(body, fix); $('edits').append(card);
  }
}
for (const id of ['reference', 'entered']) $(id).addEventListener('input', () => render());
$('example').addEventListener('click', () => { $('reference').value = 'Room-Ol8'; $('entered').value = 'Room-018 '; render(); });
$('missing').addEventListener('click', () => { $('reference').value = 'ABCD-1234'; $('entered').value = 'ACD-1234'; render(); });
$('clear').addEventListener('click', () => { $('reference').value = ''; $('entered').value = ''; render(); $('reference').focus(); });
$('undo').addEventListener('click', () => { if (previous !== null) { $('entered').value = previous; previous = null; render(false); ($('edits').querySelector('button') || $('copy')).focus({ preventScroll: true }); } });
$('copy').addEventListener('click', async () => {
  const rev = revision, text = $('entered').value;
  try { await navigator.clipboard.writeText(text); if (rev === revision) $('copy-status').textContent = '已原样复制 B，包含其中的空白。'; }
  catch { if (rev !== revision) return; $('copy-fallback').hidden = false; $('copy-fallback').value = text; $('copy-fallback').focus(); $('copy-fallback').select(); $('copy-status').textContent = '请手动复制下方已选中的文字。'; }
});
