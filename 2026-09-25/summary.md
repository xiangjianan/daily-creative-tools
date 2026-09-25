# 2026-09-25 · 联改

**今天的巧思：让一封写好的消息，临时长出几个填空。** 复用旧消息给新客户时，选中一处客户名或日期，绑定所有相同片段；填一次新值，全篇同步更新，立即复制纯文本。

| 参考工具 | 功能巧思 | 借鉴转化 | 原创差异 |
| --- | --- | --- | --- |
| [Text Blaze联动表单](https://blaze.today/guides/forms/) | 同名字段同步更新 | 将重复片段收成一个输入框 | 直接从成稿选词生成，不预写模板语法、不装扩展 |
| [Censgate Redact](https://github.com/censgate/redact) | 明确转换范围，关注实体误判 | 让用户点名原词，显示每组命中数 | 用于临时改稿，逐字替换、不猜姓名、不做自动脱敏 |

9月25日核实：Censgate是2025年已有项目，[9月12日v0.12.4](https://github.com/censgate/redact/releases/tag/v0.12.4)有实质更新；[9月6日v0.12.3](https://github.com/censgate/redact/releases/tag/v0.12.3)修复疑问词被误判成人名。Text Blaze作为成熟机制参考，不冒称近期新品。

[Customer.io对错误称呼和动态字段的说明](https://customer.io/learn/personalization/personalization-fallbacks)支持这个具体痛点；临时复用成稿是设计推断，尚无本产品用户访谈。取舍是只处理用户已绑定的逐字片段：不检查未绑定旧信息、不群发、不保存模板，不宣称全球首创。

验证：11项规则测试通过；浏览器亲测选中→绑定→联动编辑、移除恢复、重叠/空值/失效绑定、复制并回读剪贴板；390/320px布局与控制台通过。手机真机选词、跨浏览器、复制拒绝回退与跨应用粘贴未测。

**可迁移方法：** 别让用户先从零搭模板；从一份已经完成的作品里，让他圈出会变化的部分，再把重复劳动变成一组可见、可核对的联动关系。

[当天预览](https://xiangjianan.github.io/daily-creative-tools/2026-09-25/) · [源码](https://github.com/xiangjianan/daily-creative-tools/tree/main/2026-09-25) · [调研](research.md) · [设计](design.md) · [测试](tests.md)

发布状态：Pages部署成功，线上示例与自定义两处绑定、预览、复制回读通过，控制台无错误；系列首页保留全部历史入口。详见[部署验证](tests.md#部署验证)。
