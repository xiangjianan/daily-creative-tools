export function occurrences(source,term){const found=[];if(!term)return found;let pos=0;while((pos=source.indexOf(term,pos))!==-1){found.push({start:pos,end:pos+term.length});pos+=term.length;}return found;}
export function transform(source,rules){
 if(source.length>12000)throw Error('原文最多 12,000 字，请分段处理。');
 if(rules.length>8)throw Error('一次最多联动 8 组内容。');
 const seen=new Set(),spans=[],counts=[];
 rules.forEach((r,i)=>{if(!r.from.trim()||r.from.length>100)throw Error('原词需要 1–100 字，不能全是空白。');if(seen.has(r.from))throw Error('这个原词已经绑定了。');seen.add(r.from);if(!r.to.trim()||r.to.length>200)throw Error(`「${r.from}」的新内容需要 1–200 字，不能留空。`);const hits=occurrences(source,r.from);counts.push(hits.length);hits.forEach(h=>spans.push({...h,index:i}));});
 spans.sort((a,b)=>a.start-b.start||b.end-a.end);
 for(let i=1;i<spans.length;i++)if(spans[i].start<spans[i-1].end)throw Error('两组原词的匹配范围重叠了，请移除其中一组或选择更完整的片段。');
 const parts=[];let pos=0,changed=0;
 spans.forEach(s=>{if(s.start>pos)parts.push({text:source.slice(pos,s.start)});const r=rules[s.index];parts.push({text:r.to,index:s.index,changed:r.from!==r.to});if(r.from!==r.to)changed++;pos=s.end;});
 if(pos<source.length)parts.push({text:source.slice(pos)});
 return {parts,text:parts.map(p=>p.text).join(''),counts,changed,total:spans.length,missing:counts.map((n,i)=>n===0?i:-1).filter(i=>i>=0)};
}
export function addRule(source,rules,from){
 from=from.trim();if(!from||from.length>100)throw Error('先选中或填写原文中的 1–100 字。');
 if(!occurrences(source,from).length)throw Error('原文里没有这段内容，请按原文逐字填写。');
 const next=[...rules,{from,to:from}];transform(source,next);return next;
}
