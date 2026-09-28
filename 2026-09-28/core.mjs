export const glyphs = s => Array.from(new Intl.Segmenter('zh', {granularity:'grapheme'}).segment(s), v=>v.segment);
export const escapeXML = s => s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function parse(text){
  if(text.length>3000) throw Error('输入过长，请控制在3000字以内。');
  const lines=text.split(/\r?\n/).map((s,i)=>({value:s.trim(),line:i+1})).filter(s=>s.value);
  if(!lines.length) return [];
  if(lines.length>12) throw Error('一次最多12张桌牌，请分批制作。');
  return lines.map(({value:line,line:number})=>{
    const i=number-1;
    const parts=line.split(/[|｜]/);
    if(parts.length!==2) throw Error(`第${i+1}行请用一个 | 分开称呼和提示。`);
    const [name,cue]=parts.map(s=>s.trim());
    if(!name||glyphs(name).length>12)throw Error(`第${i+1}行：称呼需为1—12个字符。`);
    if(!cue||glyphs(cue).length>36)throw Error(`第${i+1}行：提示需为1—36个字符。`);
    if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(line))throw Error(`第${i+1}行含不支持的控制字符。`);
    return {name,cue};
  });
}
export function pages(cards){return Array.from({length:Math.ceil(cards.length/4)},(_,i)=>cards.slice(i*4,i*4+4))}
export function cueLines(cue){const chars=glyphs(cue);return [chars.slice(0,18).join(''),chars.slice(18).join('')].filter(Boolean)}
export function sheet(cards,page=1,total=1){
  const blocks=cards.map((c,i)=>{
    const y=14+i*66,cy=y+15.5,lines=cueLines(c.cue),font=glyphs(c.name).length>8?6:glyphs(c.name).length>4?8:11;
    return `<g data-card="${i+1}"><rect x="10" y="${y}" width="190" height="62" fill="white" stroke="#777" stroke-width="0.25"/><path d="M10 ${y+31}H200" fill="none" stroke="#999" stroke-width="0.25" stroke-dasharray="2 2"/><g transform="rotate(180 105 ${cy})"><text x="105" y="${y+6.5}" font-size="2.6" fill="#777">${escapeXML(c.name)} · 给自己的提示</text>${lines.map((line,j)=>`<text x="105" y="${cy+(lines.length===1?3:0)+j*6}" font-size="4.2">${escapeXML(line)}</text>`).join('')}</g><text x="105" y="${y+51}" font-size="${font}" font-weight="700">${escapeXML(c.name)}</text></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297" role="img" aria-label="折座 A4 第${page}页"><rect width="210" height="297" fill="white"/><g font-family="Arial, PingFang SC, Microsoft YaHei, sans-serif" text-anchor="middle" fill="#222"><text x="105" y="7" font-size="2.8" fill="#666">折座 · 实线裁开 / 虚线对折 · 单面打印 · 第 ${page} / ${total} 页</text>${blocks}<text x="105" y="289" font-size="2.6" fill="#777">A4 纵向 · 100% 实际大小 · 每张展开 190 × 62 mm · 字面朝外折起</text></g></svg>`;
}
