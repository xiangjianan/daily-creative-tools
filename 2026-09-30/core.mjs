export const chars = text => Array.from(text);
export function validate(reference, entered) {
  for (const [label, text] of [['基准口令', reference], ['待核对口令', entered]]) {
    if (chars(text).length > 64) throw new Error(`${label}超过64个字符，请只放入要核对的短口令。`);
  }
}
export function compare(reference, entered) {
  validate(reference, entered);
  const a = chars(reference), b = chars(entered), n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n; i >= 0; i--) for (let j = m; j >= 0; j--) {
    if (i === n) dp[i][j] = m - j;
    else if (j === m) dp[i][j] = n - i;
    else dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] : 1 + Math.min(dp[i + 1][j + 1], dp[i][j + 1], dp[i + 1][j]);
  }
  const columns = []; let i = 0, j = 0;
  while (i < n || j < m) {
    let kind;
    if (i < n && j < m && a[i] === b[j]) kind = 'same';
    else if (i < n && j < m && dp[i][j] === 1 + dp[i + 1][j + 1]) kind = 'replace';
    else if (j < m && dp[i][j] === 1 + dp[i][j + 1]) kind = 'remove';
    else kind = 'insert';
    columns.push({ kind, expected: kind === 'remove' ? null : a[i], actual: kind === 'insert' ? null : b[j], expectedIndex: i, actualIndex: j });
    if (kind !== 'remove') i++; if (kind !== 'insert') j++;
  }
  return { columns, edits: columns.filter(c => c.kind !== 'same'), distance: dp[0][0], matches: columns.filter(c => c.kind === 'same').length };
}
const invisible = new Map([[' ', '半角空格'], ['\t', '制表符'], ['\n', '换行'], ['\r', '回车'], ['\u00a0', '不换行空格'], ['\u200b', '零宽空格'], ['\u200c', '零宽非连字符'], ['\u200d', '零宽连接符'], ['\ufeff', '零宽不换行空格'], ['\u3000', '全角空格'], ['\u2060', '单词连接符']]);
const symbols = { '-':'短横线', '_':'下划线', '.':'英文句点', ',':'英文逗号', ':':'英文冒号', ';':'英文分号', '/':'正斜杠', '\\':'反斜杠', "'":'英文单引号', '"':'英文双引号', '`':'反引号', '~':'波浪号', '!':'英文感叹号', '?':'英文问号', '@':'at符号', '#':'井号', '$':'美元符号', '%':'百分号', '^':'脱字符', '&':'与号', '*':'星号', '+':'加号', '=':'等号', '|':'竖线', '(':'左圆括号', ')':'右圆括号', '[':'左方括号', ']':'右方括号', '{':'左花括号', '}':'右花括号', '<':'小于号', '>':'大于号', '“':'左弯双引号', '”':'右弯双引号', '‘':'左弯单引号', '’':'右弯单引号', '–':'短破折号', '—':'长破折号' };
export const codepoint = ch => ch == null ? '' : `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
export function describe(ch) {
  if (ch == null) return '缺位';
  if (invisible.has(ch)) return invisible.get(ch);
  if (/^[A-Z]$/.test(ch)) return `大写字母 ${ch}`;
  if (/^[a-z]$/.test(ch)) return `小写字母 ${ch.toUpperCase()}`;
  if (/^[0-9]$/.test(ch)) return `数字${'零一二三四五六七八九'[Number(ch)]}（${ch}）`;
  if (symbols[ch]) return symbols[ch];
  if (/^[！-～]$/.test(ch)) return `全角${describe(String.fromCodePoint(ch.codePointAt(0) - 0xfee0))}`;
  if (/\p{M}/u.test(ch)) return `组合附加符（${codepoint(ch)}）`;
  if (/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u.test(ch)) return `不可见字符（${codepoint(ch)}）`;
  return `字符「${ch}」`;
}
export function visible(ch) {
  if (ch == null) return '∅';
  if (invisible.has(ch) || /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u.test(ch)) {
    return ({' ':'␠','\n':'↵','\r':'␍','\t':'⇥','\u3000':'□'})[ch] || '◌';
  }
  if (/\p{M}/u.test(ch)) return '◌' + ch;
  return ch;
}
export function explanation(edit) {
  const { expected:a, actual:b, kind } = edit;
  if (kind === 'insert') return `少了${describe(a)}。后面的字符已重新对齐。`;
  if (kind === 'remove') return `多了${describe(b)}，不是后面整串都错了。`;
  if (a.toLowerCase() === b.toLowerCase()) return '字母相同，大小写不同。';
  if (a.normalize('NFKC') === b.normalize('NFKC')) return '外观接近，但宽度或字符形式不同。';
  if (['0Oo','1Il|','2Zz','5Ss','8B'].some(group => group.includes(a) && group.includes(b))) return '长得像，但它们是不同的字符。';
  if (invisible.has(a) || invisible.has(b)) return '这里有空白或不可见字符，也参与逐字核对。';
  return '这两个字符不同；以你提供的基准为准。';
}
export function instruction(edit) {
  const pos = edit.actualIndex + 1;
  if (edit.kind === 'replace') return `第${pos}位：把${describe(edit.actual)}改为${describe(edit.expected)}`;
  if (edit.kind === 'remove') return `第${pos}位：删除${describe(edit.actual)}`;
  return `第${pos}位补入${describe(edit.expected)}（插在此位置之前；若已到末尾则追加）`;
}
export function applyEdit(text, edit) {
  const list = chars(text);
  if (edit.kind === 'replace') list.splice(edit.actualIndex, 1, edit.expected);
  if (edit.kind === 'remove') list.splice(edit.actualIndex, 1);
  if (edit.kind === 'insert') list.splice(edit.actualIndex, 0, edit.expected);
  return list.join('');
}
