export function calculate(rows) {
  if (!rows.length || rows.length > 12) throw Error('请填写1—12种物品。');
  const seen = new Set();
  const items = rows.map((row, i) => {
    const name = row.name.trim();
    if (!name || name.length > 30) throw Error(`第${i + 1}行：请填写1—30字的物品名。`);
    if (seen.has(name)) throw Error(`「${name}」重复了，请合并现有数量后保留一行。`);
    seen.add(name);
    const integer = (raw, min, max, label) => {
      const text = String(raw).trim();
      if (!/^\d+$/.test(text) || Number(text) < min || Number(text) > max) throw Error(`第${i + 1}行：${label}需为${min}—${max}的整数。`);
      return Number(text);
    };
    const each = integer(row.each, 1, 999, '每袋数量');
    const stock = integer(row.stock, 0, 99999, '现有数量');
    return { name, each, stock, capacity: Math.floor(stock / each) };
  });
  const current = Math.min(...items.map(i => i.capacity));
  const others = items.filter(i => i.capacity > current);
  const next = others.length ? Math.min(...others.map(i => i.capacity)) : current + 1;
  return {
    current, next, gain: next - current, allTied: !others.length,
    items: items.map(i => ({ ...i, limiting: i.capacity === current, remaining: i.stock - current * i.each, add: Math.max(0, next * i.each - i.stock), after: Math.max(i.stock, next * i.each) - next * i.each }))
  };
}
export function note(result) {
  return `礼袋装配单\n现有物料最多装 ${result.current} 袋。\n每袋：${result.items.map(i => `${i.name} × ${i.each}`).join('、')}\n\n只补当前短板：\n${result.items.filter(i => i.add).map(i => `- ${i.name}：补 ${i.add} 个（现有 ${i.stock} 个）`).join('\n')}\n补齐后可装 ${result.next} 袋，比现在多 ${result.gain} 袋。\n${result.allTied ? '所有物品同为短板，此处仅计算再装1袋。' : '这是到下一种物品成为短板为止；继续增加需再次核算。'}\n\n按现有物料装完后的剩余：\n${result.items.map(i => `- ${i.name}：${i.remaining} 个`).join('\n')}\n\n按单件计数，不含损耗、整包购买或价格比较。`;
}
