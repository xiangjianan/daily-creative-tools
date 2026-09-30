[English](README.md) | **简体中文**

# 每日原创创意小工具

每天只解决一个具体的小麻烦：真实痛点 + 极简交互 + 惊喜感 + 即时结果。

[打开首页](https://xiangjianan.github.io/daily-creative-tools/)

| 日期 | 工具 | 巧思 | 记录 |
| --- | --- | --- | --- |
| 2026-09-30 | [对码](https://xiangjianan.github.io/daily-creative-tools/2026-09-30/) | 少字先对齐，形近字说清楚；差异直接变成修正指令 | [总结](2026-09-30/summary.md) · [调研](2026-09-30/research.md) · [设计](2026-09-30/design.md) · [测试](2026-09-30/tests.md) |
| 2026-09-29 | [换半边](https://xiangjianan.github.io/daily-creative-tools/2026-09-29/) | 每桌留一人，搭档全换新；配对直接变成换桌指令 | [总结](2026-09-29/summary.md) · [调研](2026-09-29/research.md) · [设计](2026-09-29/design.md) · [测试](2026-09-29/tests.md) |
| 2026-09-28 | [折座](https://xiangjianan.github.io/daily-creative-tools/2026-09-28/) | 姓名朝别人，提示朝自己；单面打印自动配方向 | [总结](2026-09-28/summary.md) · [调研](2026-09-28/research.md) · [设计](2026-09-28/design.md) · [测试](2026-09-28/tests.md) |
| 2026-09-27 | [多一袋](https://xiangjianan.github.io/daily-creative-tools/2026-09-27/) | 只补当前短板，解锁下一批完整礼袋 | [总结](2026-09-27/summary.md) · [调研](2026-09-27/research.md) · [设计](2026-09-27/design.md) · [测试](2026-09-27/tests.md) |
| 2026-09-26 | [留住](https://xiangjianan.github.io/daily-creative-tools/2026-09-26/) | 框一次保护主体，三画幅自动构图，装不下则留白 | [总结](2026-09-26/summary.md) · [调研](2026-09-26/research.md) · [设计](2026-09-26/design.md) · [测试](2026-09-26/tests.md) |
| 2026-09-25 | [联改](https://xiangjianan.github.io/daily-creative-tools/2026-09-25/) | 选一次生成联动填空，改一处全篇同步 | [总结](2026-09-25/summary.md) · [调研](2026-09-25/research.md) · [设计](2026-09-25/design.md) · [测试](2026-09-25/tests.md) |
| 2026-09-24 | [顺手排](https://xiangjianan.github.io/daily-creative-tools/2026-09-24/) | 一人动手，等待重叠；即时看见换顺序少等多久 | [总结](2026-09-24/summary.md) · [调研](2026-09-24/research.md) · [设计](2026-09-24/design.md) · [测试](2026-09-24/tests.md) |
| 2026-09-17 | [齐件](https://xiangjianan.github.io/daily-creative-tools/2026-09-17/) | 一次拖入文件，让文件自己给应交清单打勾 | [总结](2026-09-17/summary.md) · [调研](2026-09-17/research.md) · [设计](2026-09-17/design.md) · [测试](2026-09-17/tests.md) |

## 本地运行

原生 HTML/CSS/JavaScript，无第三方依赖与构建步骤。ES modules 需要 HTTP 服务：

```sh
python3 -m http.server 8765
# 浏览器打开 http://localhost:8765/2026-09-17/
node --test 2026-09-17/core.test.mjs
```

## 维护约定

日期目录不可覆盖。先检查当天是否已交付，再续做未完成内容或追加新日期。每次保留 research.md、design.md、tests.md、summary.md，维护首页索引。只在用户主动选择后本地读取必要内容，不上传用户文件，不持久保存输入，不强推历史。

GitHub Pages 从 main 分支根目录发布。

新增作品时，请同步维护英文和中文 README。
