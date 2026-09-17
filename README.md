# 每日原创创意小工具

每天只解决一个具体的小麻烦：真实痛点 + 极简交互 + 惊喜感 + 即时结果。

[打开首页](https://xiangjianan.github.io/daily-creative-tools/)

| 日期 | 工具 | 巧思 | 记录 |
| --- | --- | --- | --- |
| 2026-09-17 | [齐件](https://xiangjianan.github.io/daily-creative-tools/2026-09-17/) | 一次拖入文件，让文件自己给应交清单打勾 | [总结](2026-09-17/summary.md) · [调研](2026-09-17/research.md) · [设计](2026-09-17/design.md) · [测试](2026-09-17/tests.md) |

## 本地运行

原生 HTML/CSS/JavaScript，无第三方依赖与构建步骤。ES modules 需要 HTTP 服务：

```sh
python3 -m http.server 8765
# 浏览器打开 http://localhost:8765/2026-09-17/
node --test 2026-09-17/core.test.mjs
```

## 维护约定

日期目录不可覆盖。先检查当天是否已交付，再续做未完成内容或追加新日期。每次保留 research.md、design.md、tests.md、summary.md，维护首页索引。不读取或上传用户文件内容，不保存用户清单，不强推历史。

GitHub Pages 从 main 分支根目录发布。
