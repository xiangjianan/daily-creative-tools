# 2026-09-28 · 折座

**名字朝大家，重点留给自己。** 会前输入“称呼 | 一句发言提示”，立即生成可下载的A4折叠桌牌：对面看到姓名，自己看到提示。自动配对、倒转、分页并放好裁切/折线，省去复制文字、旋转文本框和逐张对齐。

[当天预览](https://xiangjianan.github.io/daily-creative-tools/2026-09-28/) · [源码](https://github.com/xiangjianan/daily-creative-tools/tree/main/2026-09-28)

|参考|巧思|借鉴转化|原创差异|
|---|---|---|---|
|[impose-pdf](https://github.com/eduardofrank/impose-pdf)，8/31创建、[9/26实质更新](https://github.com/eduardofrank/impose-pdf/commit/104588d4324482ad8996a212dbde7210a83d9f95)|按成品裁切过程反推拼版|自动分页与切线/折线|从文字直接出A4桌牌，不需专业PDF/印刷机参数|
|[Avery自动翻转](https://www.avery.com/help/article/print-on-both-sides-of-tent-cards)，成熟机制|工具处理文字方向|一面自动转180°|两侧分别服务认名与自我提示|
|[Bob Pike双面姓名牌](https://www.bobpikegroup.com/training-icebreaker-activity-four-quadrant-name-tent)，2024年|不同侧承载不同内容|双视角正常阅读预览|从四象限破冰变成一句会前提示|

近期日期由GitHub API核实，impose-pdf无release，引用创建/提交时间。Avery官方说明和[Word用户旋转求助](https://www.reddit.com/r/MicrosoftWord/comments/1clsbbb/)支持方向排版痛点；自己的提示用途是设计推断，未做访谈。不宣称桌牌或拼版算法首创。

本地静态页，无登录/API/上传，最多12张、每页4张。下载SVG需浏览器打开单面打印；不兼容指定预切纸模板，字体随设备变化。提示在外侧，不保密。9项规则测试及示例、切换、错误/空值、多页、实际下载文件解析、手机布局通过，控制台无错误。未做实体打印和折纸、真机或跨浏览器验证。

**可迁移方法：** 先观察成品如何被拿起、翻转或折叠，再把这些动作需要的变换提前藏进生成过程；一件物品可以服务两种视角。

[调研](research.md) · [设计](design.md) · [测试](tests.md)

发布：功能提交 `ad8a899` 已通过 [Pages 部署](https://github.com/xiangjianan/daily-creative-tools/actions/runs/36363006287)。线上自定义两张、切换配对与实际SVG下载通过；首页六个历史入口完整。[线上截图](preview.png)。
