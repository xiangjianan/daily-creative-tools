# 2026-09-17 · 齐件

**今天的巧思：让文件自己给应交清单打勾。** 清单准备好后，一次拖入待交付文件，马上看到漏项、多个候选和清单外文件，并复制核对小票。

| 参考工具 | 功能巧思 | 借鉴转化 | 原创差异 |
| --- | --- | --- | --- |
| [FileCompare · 两组清单比较](https://filecompare.org/diff-tools/compare-lists) | 差集让“缺什么”直接出现 | 应交关键词对照本地文件名，文件自动形成第二组输入 | 面向发文件前一刻；不用抄文件名；把结果写成缺件、候选歧义与清单外小票 |
| [PDFCraft](https://github.com/PDFCraftTool/pdfcraft) | 本地处理，并在执行前显露无效组合 | 检查放在交付前；只读取名字和大小 | 不处理 PDF 正文、不搭工作流；多个候选和一文件命中多项都不会自动打勾 |

**近期核实：** 9 月 17 日读取来源。PDFCraft 已有 [9 月 15 日实质修复](https://github.com/PDFCraftTool/pdfcraft/commit/cf714ad88799bdfd395be6fe3c6ef117125e6043)，是持续更新的既有工具；FileCompare 主页显示 9 月 17 日更新，但缺少功能变更日志，不称为新品。

**需求与取舍：** [NexKit 的发送前检查指南](https://blog.nexkit.uk/file-review-checklist-before-sending-to-client/)明确建议核对附件与承诺、排查错版本和空文件。这是具体工作场景证据，不是市场规模验证。齐件只聚焦“这一包是否对应应交清单”，以可解释的文件名匹配替代猜测；不审核内容、不自动挑最新版本，不支持文件夹或 ZIP 内部核对。

**验证：** 12 项规则测试通过；浏览器亲测示例、真实文件多选、移除、空输入、重复/重叠关键词、0B 和特殊文件名；桌面及 390/320px 布局，无控制台错误。跨浏览器真机、原生拖放、跨应用粘贴仍未验证。完整证据见 [tests.md](tests.md)。

**可迁移方法：** 找到用户在“发出去/提交前”还要来回核对的两份信息，让其中一份从现成对象自动生成；优先显露缺口与歧义，再提供可带走的结果。

[当天预览](https://xiangjianan.github.io/daily-creative-tools/2026-09-17/) · [源码](https://github.com/xiangjianan/daily-creative-tools/tree/main/2026-09-17) · [调研](research.md) · [设计](design.md)

发布状态：部署验证中，以 tests.md 后续实测记录为准。
