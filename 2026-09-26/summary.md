# 2026-09-26 · 留住

**框一次，三种封面都不丢主角。** 活动图临发前要适配横、方、竖，反复裁切容易丢标题。留住把逐个设比例、挪位置、查内容缩成“框住不能丢的部分”：即时生成三份PNG；放不下就自动保全整图并留白。

[当天预览](https://xiangjianan.github.io/daily-creative-tools/2026-09-26/) · [源码](https://github.com/xiangjianan/daily-creative-tools/tree/main/2026-09-26)

|具体参考|巧思|转化|差异|
|---|---|---|---|
|[Image Toolbox 4.2.0](https://github.com/T8RIN/ImageToolbox/releases/tag/4.2.0)，9月4日|导出配置省去重复设尺寸|三个通用画幅同时产出|只处理一张活动图，无大全菜单|
|[Sanity Image](https://www.sanity.io/docs/studio/image-type)，成熟机制|共享热点与多比例预览|一个保护框驱动三份结果|本地独立页，不依赖CMS|
|[Cloudinary自定义区域](https://cloudinary.com/documentation/custom_focus_areas)，成熟机制|区域表达重点|按整个保护框判断能否裁切|放不下自动整图留白，拒绝静默丢内容|

Image Toolbox创建于2022年，本次引用是近30天的实质更新，不冒称新品。一个[内容编辑者的求助](https://www.reddit.com/r/webdev/comments/1klqbbu/no_web_dev_background_any_suggestions_please/)佐证多比例损伤海报的痛点；本产品场景仍是设计推断，未做访谈。原创性在保护约束与自动保全的任务组合，不宣称裁切算法首创。

本地处理、无登录/后台/API；固定三比例，≤15MiB/2400万像素。只保护框内内容，放不下时可能留白较多，小图可能放大；不自动识别人脸、不扩图。7项规则测试（含900组几何组合）及浏览器选框、输入错误、损坏图片、真PNG下载/读取和移动布局通过。未测真机、跨浏览器、EXIF旋转、大图性能。

**可迁移方法：** 找重复设置背后那个不变的约束，让用户只表达一次；当约束无法满足时，把降级结果做成明确、可用的输出。

[调研](research.md) · [设计](design.md) · [测试](tests.md)

发布：待线上验证。
