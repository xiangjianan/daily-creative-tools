import test from 'node:test';
import assert from 'node:assert/strict';
import { chars, validate, compare, describe, visible, instruction, explanation, applyEdit } from './core.mjs';
test('sample identifies two lookalikes and a trailing space',()=>{
 const r=compare('Room-Ol8','Room-018 '); assert.equal(r.distance,3);
 assert.deepEqual(r.edits.map(e=>[e.kind,e.actualIndex,e.expected,e.actual]),[['replace',5,'O','0'],['replace',6,'l','1'],['remove',8,null,' ']]);
 assert.match(instruction(r.edits[0]),/第6位.*数字零.*大写字母 O/); assert.match(instruction(r.edits[1]),/小写字母 L/);
});
test('missing middle character aligns the remaining suffix',()=>{
 const r=compare('ABCD-1234','ACD-1234');assert.equal(r.distance,1);assert.equal(r.matches,8);
 assert.deepEqual(r.edits[0],{kind:'insert',expected:'B',actual:null,expectedIndex:1,actualIndex:1});
 assert.equal(applyEdit('ACD-1234',r.edits[0]),'ABCD-1234');
});
test('start/end insertion and removal produce correct one-step repairs',()=>{
 for(const [a,b] of [['AB','B'],['AB','A'],['AB','XAB'],['AB','ABX'],['AB','AXB']]){
  const r=compare(a,b);assert.equal(r.distance,1);assert.equal(applyEdit(b,r.edits[0]),a);
 }
});
test('identity, whitespace-only and empty core comparisons are exact',()=>{
 assert.equal(compare('aA 0\n','aA 0\n').distance,0);assert.equal(compare(' ','').distance,1);
 assert.equal(compare('','').distance,0);assert.equal(compare('','abc').distance,3);assert.equal(compare('abc','').distance,3);
 assert.equal(compare('A','a').distance,1);assert.equal(compare('A','Ａ').distance,1);
});
test('Unicode code points counted without normalization or trimming',()=>{
 assert.equal(chars('😀').length,1);assert.equal(compare('é','e\u0301').distance,2);
 const r=compare('A😀B','A😀b');assert.equal(r.edits[0].actualIndex,2);
 assert.equal(compare('AB','A\u200bB').distance,1);
 assert.doesNotThrow(()=>validate('😀'.repeat(64),' '));assert.throws(()=>validate('😀'.repeat(65),''));
 assert.throws(()=>validate('','a'.repeat(65)));
});
test('character identities and invisible displays are unambiguous',()=>{
 assert.equal(describe('l'),'小写字母 L');assert.equal(describe('I'),'大写字母 I');assert.equal(describe('0'),'数字零（0）');
 assert.equal(describe('Ｏ'),'全角大写字母 O');assert.equal(describe('\u200b'),'零宽空格');
 assert.match(describe('\u202e'),/不可见字符.*U\+202E/);assert.match(describe('\u0301'),/组合附加符/);
 assert.equal(visible('\n'),'↵');assert.equal(visible(' '),'␠');assert.equal(visible(null),'∅');assert.equal(visible('\u202e'),'◌');
});
test('diagnoses case, width, lookalike and invisible differences',()=>{
 assert.match(explanation(compare('O','0').edits[0]),/长得像/);
 assert.match(explanation(compare('A','a').edits[0]),/大小写/);
 assert.match(explanation(compare('A','Ａ').edits[0]),/宽度/);
 assert.match(explanation(compare(' ','\u200b').edits[0]),/不可见/);
});
test('all short strings: alignments reconstruct both inputs and each repair reduces distance',()=>{
 const alphabet=['A','0',' '], words=[''];let level=[''];
 for(let size=1;size<=3;size++){level=level.flatMap(w=>alphabet.map(c=>w+c));words.push(...level);}
 for(const a of words)for(const b of words){
  const r=compare(a,b);assert.equal(r.columns.map(c=>c.expected??'').join(''),a);assert.equal(r.columns.map(c=>c.actual??'').join(''),b);
  assert.equal(r.distance,r.edits.length);
  for(const e of r.edits)assert.equal(compare(a,applyEdit(b,e)).distance,r.distance-1,JSON.stringify([a,b,e]));
  let fixed=b;for(let step=0;step<r.distance;step++)fixed=applyEdit(fixed,compare(a,fixed).edits[0]);assert.equal(fixed,a);
 }
});
test('HTML-like data preserved; repeated characters yield a valid minimal suggestion',()=>{
 const r=compare('<b>','<B>');assert.equal(r.distance,1);assert.equal(applyEdit('<B>',r.edits[0]),'<b>');
 assert.equal(compare('AAAA','AAA').distance,1);assert.equal(compare('AB','BA').distance,2);
});
