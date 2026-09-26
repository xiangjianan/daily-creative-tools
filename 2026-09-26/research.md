# 留住 · 2026-09-26 调研

检索窗口：北京时间2026-09-26向前30天（8月27日起）。通过公开网页搜索发现候选，再用GitHub API核验发布日期和仓库创建时间；没有扩大到90天。未以搜索抓取时间代替发布日期，未用星数推断需求。

## 近期工具与可借鉴细节

[Image Toolbox](https://github.com/T8RIN/ImageToolbox)仓库创建于2022-04-06T20:06:28Z，是老项目的近期实质更新。GitHub releases API返回[4.2.0](https://github.com/T8RIN/ImageToolbox/releases/tag/4.2.0)发布时间2026-09-04T20:59:32Z。该版本列出保存自定义比例、61个社交网络导出配置、裁切撤销重做等新增功能。这些是“大工具里值得拆出的小机制”：把反复记尺寸变成直接选输出意图。本作不采用其平台规格表，只固定三个通用比例，不保证任何平台现行上传规范。

另检索到[ZenCrop 9月23日更新日志](https://github.com/melody0709/zencrop/blob/master/doc/CHANGELOG.md)的翻译窗口改进与[Butterfly 9月24日候选版](https://github.com/LinwoodDev/Butterfly/blob/develop/CHANGELOG.md)的导出边界修复。它们未进入最终方案；日期仅为其公开日志标注，未再做发布API核验。

## 成熟机制补充（不冒称近期新品）

[Sanity Image](https://www.sanity.io/docs/studio/image-type)将图片资产与hotspot/crop等上下文分离，便于同一图片在多个场景复用；其[热点比例预览更新](https://www.sanity.io/docs/changelog/e3c45559-6c5d-4bf7-ab68-28b973e4a9db)是已有机制。参考的是“一次表达重点，多种结果共享”。文档近期更新不等于这项机制近期诞生。

[Cloudinary自定义焦点区域](https://cloudinary.com/documentation/custom_focus_areas)允许用坐标定义裁切关注区域；[裁切文档](https://cloudinary.com/documentation/resizing_and_cropping)说明按人物、文字或自定义区域选取内容。参考的是区域语义，不调用其云API，也不复制其实现。

## 需求证据及边界

[一位网站内容编辑者的公开求助](https://www.reddit.com/r/webdev/comments/1klqbbu/no_web_dev_background_any_suggestions_please/)描述海报被要求适配多种比例而画面受损。这是单个具体痛点佐证，不是市场规模或访谈结论。Sanity/Cloudinary的现有机制也说明一图多比例需表达焦点。

本产品把场景收窄为：活动负责人已有一张完成的活动图，要交横、方、竖三个封面，担心标题或人被切掉。该用户角色和操作设计是本次设计推断，未做本产品用户访谈。

## 参考→巧思→转化→差异

|参考|功能巧思|借鉴转化|原创差异|
|---|---|---|---|
|Image Toolbox 4.2.0|导出配置避免重复设置尺寸|三个明确通用画幅同时产出|无大全菜单和平台规格，聚焦一张活动图|
|Sanity热点/比例预览|一份重点信息服务多种构图|一个保护框驱动三个结果|独立本地页，直接下载PNG，不依赖CMS|
|Cloudinary自定义区域|用区域表达要保留的内容|保护整个矩形，不只保留中心点|当比例几何上放不下时明示留白、保全整图，不强裁、不AI扩图|

不是发明裁切或焦点算法。原创性是具体任务中“保护区域→可行性判定→裁切/保全切换→三份可交付文件”的组合与交互实现，不宣称全球首创。
