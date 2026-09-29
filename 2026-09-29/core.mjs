const segmenter = new Intl.Segmenter('zh', { granularity: 'grapheme' });
export const length = text => [...segmenter.segment(text)].length;
export function parse(text) {
  if (!text.trim()) return [];
  if (text.length > 3000) throw new Error('内容过长，最多输入10桌。');
  const tables = [], seen = new Set();
  for (const [i, raw] of text.split(/\r?\n/).entries()) {
    if (!raw.trim()) continue;
    const names = raw.split(/[|｜]/).map(s => s.trim().normalize('NFC'));
    if (names.length !== 2 || names.some(s => !s)) throw new Error(`第${i + 1}行需要两个人，用 | 分开。`);
    for (const name of names) {
      if (length(name) > 12 || /[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(name)) throw new Error(`第${i + 1}行的称呼需为1—12字，不能含控制字符。`);
      if (seen.has(name)) throw new Error(`“${name}”出现了两次。同名请加一个不同的后缀。`);
      seen.add(name);
    }
    tables.push(names);
  }
  if (tables.length < 2 || tables.length > 10) throw new Error('需要2—10桌，每桌恰好2人（共4—20人）。');
  return tables;
}
// Assign the new pairs to existing tables, maximizing people who stay put.
// A bitmask DP is exact for the supported maximum of ten tables.
export function seat(previous, pairs) {
  const count = pairs.length, memo = new Map();
  function solve(table, mask) {
    if (table === count) return { score: 0, order: [] };
    if (memo.has(mask)) return memo.get(mask);
    let best = { score: -1, order: [] };
    for (let p = 0; p < count; p++) {
      if (mask & (1 << p)) continue;
      const tail = solve(table + 1, mask | (1 << p));
      const score = tail.score + pairs[p].filter(name => previous[table].includes(name)).length;
      if (score > best.score) best = { score, order: [p, ...tail.order] };
    }
    memo.set(mask, best);
    return best;
  }
  return solve(0, 0).order.map((p, table) => {
    const pair = pairs[p];
    // Put the stationary participant first for easy reading.
    return previous[table].includes(pair[0]) ? [...pair] : [pair[1], pair[0]];
  });
}
export function plan(tables) {
  if (!tables.length) return [];
  const n = tables.length * 2;
  let ring = [...tables.map(pair => pair[0]), ...tables.map(pair => pair[1]).reverse()];
  const rounds = [tables.map(pair => [...pair])];
  for (let r = 1; r < n - 1; r++) {
    ring = [ring[0], ring.at(-1), ...ring.slice(1, -1)];
    const pairs = Array.from({ length: n / 2 }, (_, i) => [ring[i], ring[n - 1 - i]]);
    rounds.push(seat(rounds.at(-1), pairs));
  }
  return rounds;
}
export function changes(previous, next) {
  const from = new Map(previous.flatMap((pair, i) => pair.map(name => [name, i + 1])));
  return next.flatMap((pair, i) => pair.map(name => ({ name, from: from.get(name), to: i + 1 }))).sort((a, b) => a.from - b.from);
}
export function announcement(rounds, index) {
  const moves = changes(rounds[index - 1], rounds[index]);
  return [`换半边｜第${index}轮 → 第${index + 1}轮`, '按顺序执行本方案，搭档不重复。', '', '需要换桌：',
    ...moves.filter(p => p.from !== p.to).map(p => `${p.name}：第${p.from}桌 → 第${p.to}桌`), '', '下一轮各桌：',
    ...rounds[index].map((pair, i) => `第${i + 1}桌：${pair.join(' / ')}`)].join('\n');
}
export function allText(rounds) {
  return ['换半边 · 完整换桌方案', '须按轮次顺序执行；只覆盖本次名单，不含活动前的见面历史。改名单需重新开始。', '', '第1轮（输入的座位）', ...rounds[0].map((p, i) => `第${i + 1}桌：${p.join(' / ')}`), '', ...rounds.slice(1).map((_, i) => announcement(rounds, i + 1) + '\n')].join('\n');
}
