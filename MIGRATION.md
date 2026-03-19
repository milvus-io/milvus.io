# 前端样式与框架升级计划

## 一、已完成：Less → CSS Modules 迁移

### 改动概述

将项目中所有 Less CSS Modules (`.module.less`) 迁移为标准 CSS Modules (`.module.css`)，彻底移除 Less 依赖。

### 改动范围

| 类别 | 数量 | 说明 |
|---|---|---|
| `.module.less` → `.module.css` | 93 个 | 自动转换 + 删除原文件 |
| `docsStyle.less` → `docsStyle.css` | 1 个 | 全局文档样式，手动转换 |
| 组件 import 更新 | 111 个 | `.tsx/.jsx/.ts/.js` 文件 |
| 总影响文件 | ~210 个 | 净减少 ~11,000 行 |

### 具体转换内容

**1. Less 变量 → CSS 自定义属性**
- 新增 `src/styles/variables.css`：定义 31 个颜色变量 + 布局变量
- `@color-primary` → `var(--color-primary)` 等

**2. Less 媒体查询变量 → `@custom-media`**
- 新增 `src/styles/media.css`：定义 6 个断点
- `@media @phone` → `@media (--phone)` 等
- 使用 `@csstools/postcss-global-data` 注入全局定义，确保 CSS Modules 独立处理时可解析

**3. Less Mixin 调用 → 内联 CSS**
- `.heading2()`, `.paragraph4-regular()` 等 mixin 调用全部内联为实际 CSS 规则
- 来源文件：`mixin.module.less`, `responsive.module.less`

**4. Less `&` 嵌套 → `postcss-nested` 处理**
- `&:hover`, `&.active`, `&-title` 等嵌套语法保持不变
- 由 `postcss-nested` 插件在构建时展开

**5. Less `//` 注释 → CSS `/* */` 注释**

### 新增依赖

```json
// devDependencies
"@csstools/postcss-global-data": "^4.0.0"   // 注入 @custom-media 到所有 CSS Module
"postcss-custom-media": "^12.0.1"           // 处理 @custom-media 断点变量
"postcss-nested": "^7.0.2"                  // 处理 CSS & 嵌套语法
```

### 移除依赖

```json
"less": "^4.3.0"
"less-loader": "^11.1.4"
"next-with-less": "^3.0.1"
```

### 配置文件变更

- `postcss.config.js`：新增 `postcss-global-data` → `postcss-custom-media` → `postcss-nested` 插件链
- `next.config.js`：移除 `withLess` 包装，直接返回 Next.js 配置
- `src/pages/_app.tsx`：新增 `variables.css` 和 `media.css` 全局引入

### 关键文件

| 文件 | 作用 |
|---|---|
| `src/styles/variables.css` | 全局 CSS 自定义属性（颜色、布局尺寸） |
| `src/styles/media.css` | `@custom-media` 断点定义 |
| `postcss.config.js` | PostCSS 插件链配置 |

---

## 二、待完成：React 18 → 19 升级

### 阶段 1：升级 MUI 到 v6（前置条件）

MUI v5 对 React 19 支持有限，必须先升级。

- [ ] `@mui/material` v5 → v6
- [ ] `@emotion/react` → 最新版
- [ ] `@emotion/styled` → 最新版
- [ ] 修复 MUI v6 Breaking Changes（API 变化较小）

### 阶段 2：升级 React

- [ ] `react` 18.3.1 → 19
- [ ] `react-dom` 18.3.1 → 19
- [ ] `@types/react` → 19 对应版本

### 阶段 3：修复 React 19 Breaking Changes

- [ ] 全局搜索 `forwardRef` → 改为直接 ref prop（React 19 废弃 forwardRef）
- [ ] 全局搜索 `defaultProps` → 改为函数参数默认值（React 19 废弃函数组件 defaultProps）
- [ ] 检查 `useEffect` 清理函数（React 19 卸载时同步执行清理）
- [ ] 检查 `ReactDOM.render` / `ReactDOM.hydrate` 是否有直接调用
- [ ] 检查 `useLayoutEffect` SSR 警告

### 风险提示

| 风险点 | 影响 | 应对 |
|---|---|---|
| MUI v5 + React 19 不兼容 | 运行时报错 | 必须先升 MUI |
| `@emotion/react` v11 SSR hydration 问题 | 页面闪烁 | 升级 emotion 到 v12+ |
| 第三方组件未适配 React 19 | 编译/运行错误 | 逐个检查依赖兼容性 |
| `forwardRef` 废弃 | 控制台警告 | 批量替换 |

---

## 三、可选：CSS Modules → Tailwind 渐进迁移

当前策略：**新组件用 Tailwind，旧组件按需迁移**。不需要一次性全量替换。

- `docsStyle.css`（1200+ 行全局文档样式）建议保持全局 CSS，不强制转 Tailwind
- 改动某个组件时顺手将其 `.module.css` 转为 Tailwind utility classes
- Tailwind 配置中已有 `phone`/`tablet` 自定义断点，与 `@custom-media` 定义一致
