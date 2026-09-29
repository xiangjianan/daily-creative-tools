# 换半边 · 调研记录

核实日：2026-09-29（北京时间）。近30天窗口：2026-08-30—2026-09-29；未扩大至90天。远端main与本地初始均为091cc57，只有9/17、9/24—9/28六日目录，9/29没有已交付项目。GitHub认证与push权限已核实。

## 近期参考：Bracket Engine

- 仓库：https://github.com/nedhmn/bracket-engine
- GitHub API `created_at`：2026-09-05T10:54:11Z。
- 实质公开功能提交：[242c3e1](https://github.com/nedhmn/bracket-engine/commit/242c3e1fb7b37bf0e8150eb466f8ff75c92c8aa4)，committer时间2026-09-05T13:38:03Z，标题为initial public release。核查文件包括瑞士配对、standings、配对测试、网页demo，非纯文档/依赖变动。
- [v0.1.0](https://github.com/nedhmn/bracket-engine/releases/tag/v0.1.0) published_at：2026-09-05T13:53:51Z；v0.1.1为同日14:09:44Z。不是把创建日期等同产品发布时间。
- 最近9/28提交是knip/drizzle依赖更新，不作为创意新功能证据。
- 读取README和[Swiss配对代码](https://github.com/nedhmn/bracket-engine/blob/main/packages/core/src/swiss/pairing.ts)：用大惩罚权重避免重复对手，以匹配而非不停洗牌处理约束。工具主场景为赛事、积分、淘汰、轮空，含数据库示例。
- 借鉴：让“不重遇”进入生成规则；本demo没有积分、排名、blossom或依赖它的代码，用经典圆圈法生成完整不重复搭档，再独立优化物理桌号。

## 公开网络与成熟机制补充

### Social Mixer Rotation Generator

https://www.generaterandom.app/g/social-mixer-rotation-generator

页面说明经典round-robin、固定一人其余轮转、每对只见一次、确定性结果，支持奇数轮空和3—40人。页面未提供可靠发布/实质更新日期，所以只作为成熟机制与对照，不宣称近30天新品。

借鉴把“大家都能见到新伙伴”变成确定性保证。差异：本demo以已坐下的桌对为第1轮；不是让n−1人按圆圈移动，而是在每次生成新配对后重新分配桌号，使每桌保留一人，只移动n/2人；直接产出“第几桌→第几桌”的口令。经典配对法本身并非原创。

### Liberating Structures · Impromptu Networking

https://www.liberatingstructures.com/impromptu-networking

官方活动说明要求短轮次两人交流，在第2/3轮找新伙伴；在线场景明确指出手动重分组增加过渡时间。它证明“活动里连续换搭档”是具体已有流程，不是市场规模证据。未核实页面发布时间，只作为成熟场景依据。

设计推断：线下已坐好的人也要辨认下一位搭档与桌号，保留每桌一位成员可降低现场换位负担。没有做主持人访谈或真实活动对照试验，不能宣称实际节约了多少时间。

## 搜索与取舍

先查近期工具、配对与色彩方向。`gh search repos`组合查询返回了重复宽泛结果，没有把它当作可靠定向筛选；改用GitHub Search API的明确q参数核对具体项目。也查阅IzyColors（9/18创建）的README、ToolSahla 9/21对比度修色文章，最终未选色彩方向：自动修色已有直接实现，容易变成小幅换皮。

配对工具本身同样常见，因此“少功能”不是原创依据。本次新组合限定在现有座位→不重复配对→最少人数换桌→可念的指令，原创主张仅限这个具体交互与实现组合，不宣称全球首创，不引用星数/热度，不编造用户数量。
