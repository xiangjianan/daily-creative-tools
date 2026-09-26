import test from 'node:test';import assert from 'node:assert/strict';import{plan,destination,formats}from'./core.mjs';
test('示例横版裁切、方形竖版留白',()=>assert.deepEqual(formats.map(f=>plan(1200,800,[.12,.34,.88,.74],f.w/f.h).mode),['crop','pad','pad']));
test('靠右主体不会被中心裁掉',()=>{const p=plan(1200,800,[.85,.2,1,.7],1);assert.equal(p.x,400);assert.equal(p.w,800)});
test('高主体无法装入横版时保全整图',()=>assert.deepEqual(plan(800,1200,[.1,.1,.9,.9],16/9),{mode:'pad',x:0,y:0,w:800,h:1200}));
test('恰好容纳不误报留白',()=>assert.equal(plan(1200,800,[1/3,0,1,1],1).mode,'crop'));
test('无效与空数值拒绝',()=>{for(const b of [[0,0,0,1],[0,0,1,0],[-.1,0,1,1],[0,0,1.1,1],[.5,0,.4,1],[NaN,0,1,1]])assert.throws(()=>plan(1200,800,b,1));assert.throws(()=>plan(0,800,[0,0,1,1],1))});
test('留白图居中且不变形',()=>assert.deepEqual(destination({w:1200,h:800},900,1200),{x:0,y:300,w:900,h:600}));
test('大范围组合：裁切必含保护框，始终在原图内',()=>{let count=0;for(const [w,h]of[[1200,800],[800,1200],[100,100],[4000,300]])for(const f of formats)for(let l=0;l<.9;l+=.2)for(let t=0;t<.9;t+=.2)for(const size of[.05,.2,.5]){const b=[l,t,Math.min(1,l+size),Math.min(1,t+size)],p=plan(w,h,b,f.w/f.h);if(p.mode==='crop'){assert.ok(p.x<=l*w+1e-6&&p.y<=t*h+1e-6);assert.ok(p.x+p.w>=b[2]*w-1e-6&&p.y+p.h>=b[3]*h-1e-6);assert.ok(p.x>=-1e-6&&p.y>=-1e-6&&p.x+p.w<=w+1e-6&&p.y+p.h<=h+1e-6);assert.ok(Math.abs(p.w/p.h-f.w/f.h)<1e-6)}count++}assert.equal(count,900)});
