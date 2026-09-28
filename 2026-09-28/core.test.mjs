import test from 'node:test';import assert from 'node:assert/strict';import {parse,pages,sheet,cueLines,glyphs} from './core.mjs';
test('半角全角分隔、首尾空白与空行',()=>assert.deepEqual(parse(' 小林 | 先听完 \n\n阿宁｜先问问题'),[{name:'小林',cue:'先听完'},{name:'阿宁',cue:'先问问题'}]));
test('空输入没有卡',()=>assert.deepEqual(parse(' \n'),[]));
test('错误分隔、缺失与长度限制',()=>{for(const x of['小林','小林||提示','|提示','小林|','名'.repeat(13)+'|提示','小林|'+'字'.repeat(37),'a'.repeat(3001),'名|\u0001'])assert.throws(()=>parse(x));assert.throws(()=>parse(Array(13).fill('名|提示').join('\n')))});
test('组合emoji不从中间截断',()=>{const s='👨‍👩‍👧‍👦'.repeat(19);assert.equal(glyphs(s).length,19);assert.deepEqual(cueLines(s).map(x=>glyphs(x).length),[18,1])});
test('分页保持配对与顺序，不复制空白桌牌',()=>{for(let n=1;n<=12;n++){const c=Array.from({length:n},(_,i)=>({name:'名'+i,cue:'提示'+i}));const p=pages(c);assert.equal(p.length,Math.ceil(n/4));assert.deepEqual(p.flat(),c);assert.ok(p.every(g=>g.length<=4))}});
test('每张卡一条折线，提示旋转180度，姓名不旋转',()=>{const svg=sheet(parse('甲|问问题\n乙|听回答'));assert.equal((svg.match(/rotate\(180/g)||[]).length,2);assert.equal((svg.match(/stroke-dasharray/g)||[]).length,2);assert.ok(svg.includes('width="210mm" height="297mm"'));assert.ok(svg.includes('rotate(180 105 29.5)'));assert.ok(svg.includes('rotate(180 105 95.5)'));assert.ok(svg.includes('y="65" font-size="11"'))});
test('XML特殊字符转义，不能注入SVG元素',()=>{const svg=sheet([{name:'<img>&"',cue:'<script>alert(1)</script>'}]);assert.ok(!svg.includes('<script>'));assert.ok(svg.includes('&lt;img&gt;&amp;&quot;'));assert.ok(!svg.includes('foreignObject'))});
test('第四卡与底注无越界',()=>{const svg=sheet(Array(4).fill({name:'十二个汉字十二个汉字十二',cue:'字'.repeat(36)}));assert.ok(svg.includes('y="212" width="190" height="62"'));assert.ok(svg.includes('font-size="6"'));assert.ok(svg.includes('y="289"'))});

test('空行后的错误保留原始行号',()=>assert.throws(()=>parse('甲|提示\n\n错误'),/第3行/));
