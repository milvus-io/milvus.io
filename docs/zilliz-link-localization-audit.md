# 简体中文固定导航链接修改清单

核验日期：2026-10-12。仅当当前页面语言为 `zh` 时转换已确认的固定导航目的地；`zh-hant` 和其他语言继续使用国际站。保留原有查询参数（包括 UTM）、fragment 和尾部斜杠。精确匹配主机和路径，未来新增链接需要先核验中文目的地并扩充白名单。

本次范围是页面写死的导航、按钮、广告和联系入口。文档、博客、FAQ 与教程正文没有修改；未增加正文 HTML 转换、MDX 链接替换或全局点击拦截。没有修改 docs/blogs 子模块、API endpoint、资源地址或 canonical metadata。

## 修改文件与入口

| 文件 | 具体修改 |
| --- | --- |
| `src/utils/localize-zilliz-links.ts` | 共用纯 URL 转换函数，仅简中和精确白名单转换，保留 URL 参数与锚点。 |
| `src/utils/zilliz-chinese-destinations.json` | 下表 9 条已确认固定导航目的地。 |
| `src/components/localizedLinks/index.tsx` | 普通 anchor 与 Next Link 包装，读取当前全局语言，响应语言切换。 |
| `src/components/customButton/index.tsx` | 所有复用按钮的外链按白名单转换，包括首页中央 CTA、试用区、部署区、教程 Demo CTA、博客广告等。 |
| `src/components/header/index.tsx` | 桌面与移动菜单右侧 Cloud 注册入口。 |
| `src/components/header/Logos.tsx` | 页头 Zilliz 官网 Logo。 |
| `src/components/banner/index.tsx` | 顶部 Cloud 注册横幅。 |
| `src/components/footer/index.tsx` | Zilliz 官网 Logo、品牌介绍中的官网链接及产品导航 Cloud 链接。 |
| `src/components/card/advCard/index.tsx` | 文档侧栏/AI FAQ 侧栏广告未传语言时回退当前页面语言；简中自定义 CTA 也按白名单转换并保留自定义参数。 |
| `src/hooks/use-inkeep-settings.ts` | Inkeep 默认与销售意向检测触发的两个联系销售动作。 |
| `src/parts/home/deploySection/index.tsx` | 首页 Zilliz Cloud 产品文字链接；试用按钮由共用按钮覆盖。 |
| `src/parts/contact/Contact.tsx` | 联系页面内 Zilliz 官网/Cloud 注册固定链接。 |
| `src/parts/intro/UseCase.tsx` | 客户故事区域分享故事入口。 |
| `src/parts/blogs/zillizAdv/index.tsx` | 博客首页及四个容量工具底部广告 CTA。 |
| `src/parts/sizingCommon/resultSection.tsx` | CPU 容量估算结果中的价格计算器、超出范围联系销售入口。 |
| `src/parts/sizingGpu/resultSection.tsx` | GPU 容量估算结果价格计算器入口。 |
| `src/pages/tools/sizing.tsx` | 工具标题中的容量工具介绍文章固定链接。 |
| `src/pages/tools/sizing-v250.tsx` | v2.5 工具标题中的介绍文章固定链接。 |
| `src/pages/tools/sizing-enterprise.tsx` | Enterprise 工具标题中的介绍文章固定链接。 |
| `src/pages/tools/sizing-v250-enterprise.tsx` | v2.5 Enterprise 工具标题中的介绍文章固定链接。 |
| `tests/zh-zilliz-links.test.js` | URL 白名单、固定业务目的地、语言切换、参数/fragment 保留和未知 URL 回归测试。 |
| `docs/zilliz-link-localization-audit.md` | 本次完整修改与核验清单。 |

## 已确认目的地

以下源/目标均为 HTTPS；中文目的地已核验 HTTP 200。Cloud signup/signin 也与仓库已有中国站登录注册配置一致。

| 国际站源 | 简体中文目的地 |
| --- | --- |
| `cloud.zilliz.com/` | `cloud.zilliz.com.cn/` |
| `cloud.zilliz.com/signup` | `cloud.zilliz.com.cn/signup` |
| `cloud.zilliz.com/signin` | `cloud.zilliz.com.cn/signin` |
| `zilliz.com/` | `zilliz.com.cn/` |
| `zilliz.com/cloud` | `zilliz.com.cn/cloud` |
| `zilliz.com/contact-sales` | `zilliz.com.cn/contact-sales` |
| `zilliz.com/pricing` | `zilliz.com.cn/pricing` |
| `zilliz.com/share-your-story` | `zilliz.com.cn/share-your-story` |
| `zilliz.com/blog/demystify-milvus-sizing-tool` | `zilliz.com.cn/blog/demystify-milvus-sizing-tool` |

## 保留和排除

首页 Meetup 与 Demo/FAQ 卡片中的 Inkeep 介绍文章在中文站同路径返回 404，且未确认其他同用途中文目的地，因此保留国际链接。白名单外的所有路径保留原链接，包括 `docs.zilliz.com` 正文链接。

旧 `/gui` 在 `conf/conf.d/client.conf` 中的固定 301 跳转保持原样，本次没有调整历史服务端重定向或语言路由规则。

## 验证

`npx playwright test tests/zh-zilliz-links.test.js --reporter=line`：3/3 通过。`npx tsc --noEmit --incremental false` 与 `git diff --check`：通过。

系统 Chrome 浏览器链接断言通过：首页、英文→简中→繁中动态切换、联系页面、CPU/GPU 容量工具、v2.5 容量工具、案例、Demo、博客首页及移动菜单。

浏览器链接断言全部通过。在未修改的 `origin/preview=1b707c9` 临时快照上，sizing（向量数量 / Number of Vectors）、Demo（试用演示 / Try Demo）、Blog（公告 / Announcements）三页 HTTP 200，并复现相同翻译文本 hydration 提示，属于原有问题，本次没有扩范围修复。
