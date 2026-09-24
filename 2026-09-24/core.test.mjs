import test from 'node:test';import assert from 'node:assert/strict';import {parse,plan,schedule,clock,receipt} from './core.mjs';
const sample='收拾桌面 15+0\n启动洗碗机 10+20\n启动洗衣机 5+40';
test('示例原序70→45分钟，动手保持30分钟',()=>{const p=plan(sample);assert.equal(p.before.total,70);assert.equal(p.after.total,45);assert.equal(p.saved,25);assert.equal(p.after.hands,30);assert.deepEqual(p.after.rows.map(r=>r.start),[0,5,15]);assert.deepEqual(p.after.rows.map(r=>r.end),[45,35,30]);});
test('全零等待不虚构节省',()=>{assert.equal(plan('甲 5+0\n乙 10+0').saved,0)});
test('相同等待保持用户顺序',()=>{assert.deepEqual(plan('甲 4+10\n乙 3+10').after.rows.map(r=>r.name),['甲','乙'])});
test('单任务、同名任务不丢失',()=>{assert.equal(plan('甲 1+720').after.total,721);assert.equal(plan('甲 2+1\n甲 2+1').after.rows.length,2)});
test('空行、全角输入',()=>{assert.equal(parse('\n测试 ５＋４０\n')[0].wait,40)});
test('拒绝空输入、缺时间、负数、小数、单位混入',()=>{for(const s of ['','名称','甲 -1+5','甲 1.5+2','甲 5分钟+3','甲 0+3','甲 1+721','甲 241+0'])assert.throws(()=>plan(s));});
test('数量、字符及合计限制',()=>{assert.throws(()=>plan('a 1+0\n'.repeat(21)));assert.throws(()=>plan('a'.repeat(6001)));assert.throws(()=>plan('a'.repeat(61)+' 1+0'));assert.throws(()=>plan('甲 240+0\n乙 240+0\n丙 240+0\n丁 1+0'));});
test('钟面跨日不丢日期标识',()=>{assert.equal(clock('23:40',45),'次日 00:25');assert.equal(clock('00:00',1440),'次日 00:00');assert.throws(()=>clock('24:00',0));assert.throws(()=>clock('',0));});
test('开工卡含正确顺序及边界',()=>{const s=receipt(plan(sample),'18:00');assert.match(s,/18:45/);assert.match(s,/少等 25/);assert.ok(s.indexOf('启动洗衣机')<s.indexOf('收拾桌面'));assert.match(s,/不是闹钟/)});
function permutations(xs){return xs.length?xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>i!==j)).map(t=>[x,...t])):[[]];}
test('300组独立小任务穷举所有顺序，核对全局最短总时长',()=>{let seed=924;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed;};for(let k=0;k<300;k++){const n=2+rand()%5;const ts=Array.from({length:n},(_,i)=>({id:i,name:'任务'+i,hands:1+rand()%30,wait:rand()%80}));const p=plan(ts.map(t=>`${t.name} ${t.hands}+${t.wait}`).join('\n'));const min=Math.min(...permutations(ts).map(t=>schedule(t).total));assert.equal(p.after.total,min);assert.ok(p.saved>=0);for(let i=1;i<n;i++)assert.equal(p.after.rows[i].start,p.after.rows[i-1].release);}});
