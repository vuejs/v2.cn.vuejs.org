---
title: 迁移至 Vue 2.7
type: guide
order: 704
---

Vue 2.7 是 Vue 2 最新的次级版本。其提供了内置的[组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html#composition-api-faq) 支持。

尽管 Vue 3 是当前的默认主版本，我们非常理解许多由于依赖的兼容性、浏览器的兼容性需求、或精力有限不足以完成升级等因素，仍然留在 Vue 2 的用户。在 Vue 2.7 中，我们从 Vue 3 移植回了最重要的一些特性，使得 Vue 2 用户也可以享有这些便利。

## 移植回来的特性

- [组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- 单文件组件内的 [`<script setup>`](https://cn.vuejs.org/api/sfc-script-setup.html)
- 单文件组件内的 [CSS v-bind](https://cn.vuejs.org/api/sfc-css-features.html#v-bind-in-css)

此外我们还支持了以下 API：

- `defineComponent()` 以改善类型推断 (较之于 `Vue.extend`)
- `h()`、`useSlot()`、`useAttrs()`、`useCssModules()`
- `set()`、`del()` 和 `nextTick()` 也在 ESM 构建版本中被导出为具名 API。
- 支持 `emits` 选项，但仅以类型检查为目的 (并不会影响运行时的行为)

  2.7 也在模板表达式中支持了 ESNext 语法。当配合构建系统使用时，编译后的模板渲染函数将会经过和处理普通 JavaScript 相同配置的 loader / 插件。这意味着如果你为 `.js` 文件配置了 Babel，这些配置也会应用在单文件组件的模板表达式中。

### 关于被导出的 API 的注意事项

- 在 ESM 构建版本中，这些 API 会 (且仅会) 被导出为具名 API：

  ```js
  import Vue, { ref } from "vue";

  Vue.ref; // undefined，请换为使用具名导出的 API
  ```

- 在 UMD 和 CJS 构建版本里，这些 API 会被导出为全局对象 `Vue` 的属性。

- 当调用外置的 CJS 版本进行打包时，打包工具应该有能力处理与 ESM 模块的互操作 (ESM interop)。

### 与 Vue 3 的行为差异

组合式 API 使用了 Vue 2 中基于 getter/setter 的响应式系统，以确保浏览器的兼容性。这意味着其行为和 Vue 3 中基于代理的系统相比有一些重要的区别：

- 所有 [Vue 2 检测变化的注意事项](https://v2.cn.vuejs.org/v2/guide/reactivity.html#%E6%A3%80%E6%B5%8B%E5%8F%98%E5%8C%96%E7%9A%84%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)依然存在。

- `reactive()`、`ref()` 和 `shallowReactive()` 会直接转换原始的对象而不是创建代理。这意味着：

  ```js
  // 2.7 中为 true，3.x 中为 false
  reactive(foo) === foo;
  ```

- `readonly()` **会**创建一个独立的对象，但是其不会追踪新添加的属性，也不会对数组生效。

- 避免将数组作为 `reactive()` 的根值。因为无法访问属性，数组的变更不会被追踪到 (这样做会产生一则警告)。

- 响应式 API 会忽略以 symbol 作为 key 的属性。

此外，我们**并没有**移植回以下特性：

- ❌ `createApp()` (Vue 2 不支持相互隔离的应用 scope)
- ❌ `<script setup>` 中的顶层 `await` (Vue 2 不支持异步组件初始化)
- ❌ 模板表达式中的 TypeScript 语法 (与 Vue 2 parser 不兼容)
- ❌ 响应性语法糖 (仍处于试验阶段)
- ❌ 选项式组件不支持 `expose` (但是在 `<script setup>` 中支持 `defineExpose()`)。

## 升级指南

### Vue CLI / webpack

1. 将本地的 `@vue/cli-xxx` 依赖升级至所在主版本范围内的最新版本 (如有)：

   - v4 升级至 `~4.5.18`
   - v5 升级至 `~5.0.6`

2. 将 `vue` 升级至 `^2.7.0`。同时你可以从依赖中移除 `vue-template-compiler`——它在 2.7 中已经不再需要了。

   注意：如果你在使用 `@vue/test-utils`，那么 `vue-template-compiler` 需要保留，因为该测试工具集依赖了一些只有这个包会暴露的 API。

3. 检查包管理工具的版本锁定文件，以确保以下依赖的版本符合要求。它们可能是间接依赖所以未必罗列在了 `package.json` 中。

   - `vue-loader`: `^15.10.0`
   - `vue-demi`: `^0.13.1`

   否则，你需要移除整个 `node_modules` 和版本锁定文件，然后重新安装，以确保它们都升到了最新版本。

4. 如果你曾经使用了 [`@vue/composition-api`](https://github.com/vuejs/composition-api)，将其导入语句切换至 `vue` 即可。注意有些之前通过插件暴露的 API，例如 `createApp`，并没有被移植回 2.7。

5. 如果你在 `<script setup>` 中遇到了未使用变量的 lint 错误，请更新 `eslint-plugin-vue` 至最新版本 (9+)。

6. 2.7 的单文件组件编译器使用了 PostCSS 8 (从 7 升级而来)。PostCSS 8 应该向下兼容了绝大多数插件，但是该升级**可能**在你使用了一些只支持 PostCSS 7 的自定义插件时遇到问题。这种情况下，你需要升级相应的插件至其兼容 PostCSS 8 的版本。

### Vite

2.7 通过一个新的插件提供对 Vite 的支持：[@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)。这个新的插件需要 Vue 2.7 或更高版本，并取代了已有的 [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2)。

注意这个新插件刻意不会处理 Vue 特有的 JSX / TSX 转换。在 Vite 中，Vue 2 的 JSX / TSX 转换是通过一个独立的插件进行处理的：[@vitejs/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx)。

### Volar 兼容性

2.7 的发布改进了类型定义，所以我们不必再只为支持 Volar 的模板类型推断而安装 `@vue/runtime-dom`。你现在只需要在 `tsconfig.json` 中进行以下配置：

```json
{
  // ...
  "vueCompilerOptions": {
    "target": 2.7
  }
}
```

### 开发者工具支持

Vue Devtools 6.2.0 已经支持了 2.7 组合式 API 状态的审查，但该扩展可能仍然需要几天时间在各自的发布平台上通过审核。

## 2.7 发布的后续

如我们之前所提到的，2.7 是 Vue 2.x 的最后一个次级版本。在此发布之后，Vue 2 将会进入长期技术支持 (LTS：long-term support) 状态，该状态从现在起计算会持续 18 个月，且不再提供新特性。

这意味着 **Vue 2 的终止支持时间将会是 2023 年 12 月 31 日**。我们相信这将为生态系统的绝大部分提供充足的时间迁移至 Vue 3。然而，我们也理解有些团队或项目可能无法在这个时间段内升级，同时还要满足安全和合规等要求。如果你的团队希望在 2023 年底之后继续使用Vue 2，请确保提前做好计划并了解你的可选项：了解更多关于 [Vue 2 LTS 及其延长版服务](/lts/)。
