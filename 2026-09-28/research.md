# 折座 · 2026-09-28 调研

窗口：近30天，自2026-08-29起，未扩大90天。先搜索GitHub和公开网络近期diff、排版、打印等工具，选中印后加工这个具体场景；通过GitHub API核实仓库与提交时间，而非引用网页抓取时间。

## 新近工具及更新证据

[impose-pdf](https://github.com/eduardofrank/impose-pdf)仓库创建于2026-08-31T09:19:27Z，在本次30天窗口内出现。没有GitHub release，因此不编造版本发布时间。核实到[2026-09-26提交104588d](https://github.com/eduardofrank/impose-pdf/commit/104588d4324482ad8996a212dbde7210a83d9f95)，committer时间12:54:20Z，增加每个成品的裁切轮廓和完整控制条；文件变动包含finishing.py、marks.py、render.py与test_finishing.py，是实质功能而非仅README更新。

README介绍骑马订、胶装、n-up、cut-and-stack等商用拼版，以及输出位置随印后裁切/翻面方式而变。借鉴的是“按纸最终如何被使用，反推打印前的排列”，而非把PDF缩小排满。另查看DiffMasterPro近期文本比较候选，未用于最终产品，不将其README日期作为已核实发布依据。

## 成熟机制补充

[Avery：Print on Both Sides of Tent Cards](https://www.avery.com/help/article/print-on-both-sides-of-tent-cards)明确说明背面文字自动翻转，手工再旋转反而可能出错；并支持按桌牌切换编辑。这项成熟机制减少了用户对方向的思考。本作不使用Avery预切纸规格、模板或界面，不声称它是近期功能。

[Bob Pike Group双面信息姓名桌牌活动](https://www.bobpikegroup.com/training-icebreaker-activity-four-quadrant-name-tent)页面标注2024-05-15：前侧姓名，背侧填写其他信息，说明一块桌牌的不同面可服务不同内容。它是培训活动方法，非近期软件新品。

## 需求证据与设计推断

Avery官方专门解释文字翻转，[Word用户的旋转求助](https://www.reddit.com/r/MicrosoftWord/comments/1clsbbb/)也直接描述找不到上半部分文字旋转180度的方法，支持“会前做桌牌时，方向与重复排版容易卡住”这个具体痛点。Bob Pike的活动说明支持桌牌双面承载不同信息的真实用途。

将另一面收窄为自己的发言提示，是本次设计推断，未做访谈验证，也不承诺改善发言表现或保密。提示在外侧，可被旁人看见。没有热度、用户规模或全球首创声明。

## 对应表

|参考|功能巧思|借鉴转化|实质差异|
|---|---|---|---|
|impose-pdf：裁切轮廓与拼版|从折、切、叠的成品动作倒推排版|A4上自动分组、放裁切线和折线|不用专业PDF、印刷机参数；直接从一对文字生成桌牌SVG|
|Avery自动翻转桌牌文字|把方向错误交给工具处理|自己一侧自动180°旋转，并提供正常阅读预览|两面有不同目的：对面认名字，自己记重点，不是姓名复制两遍|
|Bob Pike姓名牌双面信息|同一物件的不同视角承担不同内容|一面公开称呼，一面简短提示|从四象限破冰活动转为会前即时打印的小工具|

常见拼版、桌牌和提示卡机制的独立组合，不宣称发明折叠桌牌或排版算法，不复制参考代码。
