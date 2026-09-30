# 2026-09-30 · 对码

**看着一样，错在哪一位？** 放入基准与抄下的短口令，直接得到“第6位，把数字零改为大写字母O”的修正指令。先对齐再找差异，少一位不会让后面整串全红；空格、全角和零宽字符也被显出来。

[预览](https://xiangjianan.github.io/daily-creative-tools/2026-09-30/) · [源码](https://github.com/xiangjianan/daily-creative-tools/tree/main/2026-09-30)

|参考|巧思|借鉴转化|原创差异|
|---|---|---|---|
|[Diff](https://github.com/sagardstar/diff)，9/20创建，[实质构建提交](https://github.com/sagardstar/diff/commit/59424ed396dc27c675b7f06531f42083f5790d00)|本地对齐两份文本再显示差异|短串按码点对齐，不忽略空白|从行/词高亮变成中文逐处修正，支持撤销|
|[apg-go](https://github.com/wneessen/apg-go)，成熟参考|排除形近字、拼读生成口令|用明确字符身份解释差异|不生成新口令，只核对已存在文本中的那一处|

[Bitwarden具体问题](https://github.com/bitwarden/clients/issues/12098)与[Google官方首尾空格提醒](https://support.google.com/googlehome/answer/6273434?hl=en)提供痛点依据。逐处纠错的实际效率仍为设计推断，未做用户访谈或节时实验，不宣称全球首创。

每份最多64码点。输入即结果，手动单处修正只改B，可撤销、原样复制；本地明文处理、无上传存储。A也可能有误，工具不验证服务或设备；重复字符可能有多种最少方案，组合字按码点计数，浏览器可能统一换行形式。

9项测试通过，含1600组短串重建及修正不变量。真实浏览器通过增删改/撤销、隐藏字符、空/超限、原样复制粘贴及320/390布局；无控制台错误。未验证真机、跨浏览器或真实现场效率。

**可迁移方法：** 把“哪里不同”的检测结果，再翻译成用户能直接执行的一句话；先消除位置错位，再解释真正的差别。

[调研](research.md) · [设计](design.md) · [测试](tests.md)

发布：待线上核验。
