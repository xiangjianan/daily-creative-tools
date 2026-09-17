export const normalize = value => value.normalize('NFKC').trim().toLocaleLowerCase('en-US');
export function inspect(text, files) {
  if (text.length > 12000) return { error: '清单太长了，请控制在 12,000 字以内。' };
  const lines = text.split(/\r?\n/).map(s => s.trim().replace(/^(?:[-*•]\s+|\d+[.、)）]\s*)/, '').trim()).filter(Boolean);
  if (lines.length > 60) return { error: '一次最多核对 60 项，请拆成两批。' };
  if (files.length > 200) return { error: '一次最多核对 200 个文件。' };
  if (lines.some(s => normalize(s).length < 2)) return { error: '每项至少写 2 个字符，让文件名匹配更明确。' };
  const keys = lines.map(normalize);
  if (new Set(keys).size !== keys.length) return { error: '清单有重复项，请删除重复关键词后再核对。' };
  const names = files.map(f => normalize(f.name));
  const rows = lines.map((label, i) => ({ label, matches: files.map((f,j) => names[j].includes(keys[i]) ? j : -1).filter(j => j >= 0) }));
  const uses = files.map((_,j) => rows.filter(r => r.matches.includes(j)).length);
  rows.forEach(r => { r.status = r.matches.length === 0 ? 'missing' : r.matches.length > 1 ? 'multiple' : uses[r.matches[0]] > 1 ? 'shared' : files[r.matches[0]].size === 0 ? 'empty' : 'found'; });
  const extras = files.map((_,j) => j).filter(j => uses[j] === 0);
  const counts = Object.fromEntries(['found','missing','multiple','shared','empty'].map(s => [s, rows.filter(r => r.status === s).length]));
  return { rows, extras, counts, ready: rows.length > 0 && counts.found === rows.length && extras.length === 0 };
}
export const labels = { found:'已对应', missing:'缺一份', multiple:'需选一份', shared:'匹配重叠', empty:'空文件' };
export function receipt(result, files, sample) {
  if (result.error || !result.rows?.length) return '';
  return [`齐件 · 文件名核对${sample ? '（示例）' : ''}`, '仅核对文件名与大小；未验证内容、版本正确性或实际发送。', '', ...result.rows.map(r => `${labels[r.status]}｜${r.label}${r.matches.length ? ' → ' + r.matches.map(j => files[j].name + (files[j].size === 0 ? '（0 B）' : '')).join(' / ') : ''}`), ...(result.extras.length ? ['', '清单外文件：', ...result.extras.map(j => files[j].name)] : []), '', `核对 ${result.rows.length} 项 · 已对应 ${result.counts.found} 项 · 清单外 ${result.extras.length} 份`].join('\n');
}
