import test from 'node:test';
import assert from 'node:assert/strict';
import { parse, plan, changes, announcement, allText, length } from './core.mjs';
const input = '甲|乙\n丙|丁';
test('parse trims, accepts fullwidth separator and preserves table order', () => {
 assert.deepEqual(parse(' 甲 ｜乙 \n\n丙|丁'), [['甲','乙'],['丙','丁']]); assert.deepEqual(parse(' \n'), []);
});
test('reject missing fields, odd people, too few tables and ambiguous duplicate names', () => {
 for(const s of ['甲|乙','甲|乙\n丙','甲|乙\n丙|','甲|乙|丙\n丁|戊','甲|乙\n丙|甲']) assert.throws(()=>parse(s));
 assert.throws(()=>parse('甲|乙\n\n丙'),/第3行/);
 assert.throws(()=>parse('é|甲\né|乙'),/出现了两次/);
});
test('validate graphemes, controls, maximum tables and total size', () => {
 const emoji='👩🏽‍💻'; assert.equal(length(emoji),1);
 assert.doesNotThrow(()=>parse(`${emoji.repeat(12)}|乙\n丙|丁`));
 assert.throws(()=>parse(`${emoji.repeat(13)}|乙\n丙|丁`));
 assert.throws(()=>parse('甲\t甲|乙\n丙|丁'));
 assert.throws(()=>parse('甲\u202e|乙\n丙|丁'));
 assert.throws(()=>parse('a'.repeat(3001)));
 assert.throws(()=>parse(Array.from({length:11},(_,i)=>`a${i}|b${i}`).join('\n')));
});
test('all even sizes 4–20: every pair occurs exactly once, everyone appears once per round', () => {
 for(let n=4;n<=20;n+=2) {
  const tables=Array.from({length:n/2},(_,i)=>[`a${i}`,`b${i}`]);
  const before=structuredClone(tables), rounds=plan(tables), names=tables.flat().sort(), met=new Set();
  assert.equal(rounds.length,n-1); assert.deepEqual(rounds[0],tables);
  for(const round of rounds) {
   assert.deepEqual(round.flat().sort(),names);
   for(const pair of round) { const key=JSON.stringify([...pair].sort()); assert.ok(!met.has(key),`${n}: repeated ${key}`); met.add(key); }
  }
  assert.equal(met.size,n*(n-1)/2); assert.deepEqual(tables,before);
 }
});
test('every transition: exactly half move, exactly one remains at every table', () => {
 for(let n=4;n<=20;n+=2) {
  const rounds=plan(Array.from({length:n/2},(_,i)=>[`a${i}`,`b${i}`]));
  for(let r=1;r<rounds.length;r++) {
   const movements=changes(rounds[r-1],rounds[r]);
   assert.equal(movements.filter(p=>p.from!==p.to).length,n/2);
   for(let t=0;t<n/2;t++) assert.equal(rounds[r][t].filter(p=>rounds[r-1][t].includes(p)).length,1);
   for(const p of movements){assert.ok(rounds[r-1][p.from-1].includes(p.name));assert.ok(rounds[r][p.to-1].includes(p.name));}
  }
 }
});
test('sample first transition matches known partner and movement expectations',()=>{
 const rounds=plan(parse('小林|阿宁\n陈老师|Mia\n小舟|阿禾\n大可|阿月'));
 assert.deepEqual(rounds[1],[['小林','Mia'],['陈老师','阿月'],['阿禾','阿宁'],['大可','小舟']]);
 assert.deepEqual(changes(rounds[0],rounds[1]).filter(p=>p.from!==p.to).map(p=>[p.name,p.from,p.to]),[['阿宁',1,3],['Mia',2,1],['小舟',3,4],['阿月',4,2]]);
});
test('announcements and full export keep every round with correct directions',()=>{
 const rounds=plan(parse(input)); const one=announcement(rounds,1), all=allText(rounds);
 assert.match(one,/第1轮 → 第2轮/); assert.match(one,/乙：第1桌 → 第2桌/);assert.match(one,/丁：第2桌 → 第1桌/);
 assert.match(all,/第1轮（输入的座位）/);assert.match(all,/第2轮 → 第3轮/);assert.doesNotMatch(all,/undefined|NaN/);
});
test('names are data, deterministic planning and empty plan',()=>{
 const tables=parse('<b>甲</b>|乙&\n丙|丁');assert.equal(tables[0][0],'<b>甲</b>');
 assert.deepEqual(plan(tables),plan(tables)); assert.deepEqual(plan([]),[]);
});
