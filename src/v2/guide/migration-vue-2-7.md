---
title: 迁移至 Vue 2.7
type: guide
order: 704
---

Vue 2.7 是 Vue 2 最新的次级版本。其提供了内置的[组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html#composition-api-faq) 支持。

尽管 Vue 3 是当前的默认主版本，我们非常理解许多由于依赖的兼容性、浏览器的兼容性需求、或精力有限不足以完成升级等因素，仍然留在 Vue 2 的用户。在 Vue 2.7 中，我们从 Vue 3 带回了最重要的一些特性，使得 Vue 2 用户也可以享有这些便利。

## 带回的特性

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

- 当从外部构建 CJS 版本时，打包工具应该有能力在内部对 ESM 进行转换 (ESM interop)。

### 和 Vue 3 不同的行为

组合式 API 使用了 Vue 2 中基于 getter/setter 的响应式系统，以确保浏览器的兼容性。这意味着其行为和 Vue 3 中基于代理的系统相比有一些重要的区别：

- 所有 [Vue 2 检测变化的注意事项](https://v2.cn.vuejs.org/v2/guide/reactivity.html#%E6%A3%80%E6%B5%8B%E5%8F%98%E5%8C%96%E7%9A%84%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)依然存在。

- `reactive()`、`ref()` 和 `shallowReactive()` 会直接转换原始的对象而不是创建代理。这意味着：

  ```js
  // 2.7 中为 true，3.x 中为 false
  reactive(foo) === foo;
  ```

- `readonly()` **会**创建一个独立的对象，但是其不会追踪新添加的属性，也不会在数组上工作。

- 避免将数组作为 `reactive()` 的根值。因为无法访问属性，数组的变更不会被追踪到 (这样做会产生一则警告)。

- 响应式 API 会忽略以 symbol 作为 key 的属性。

此外，我们**并没有**带回以下特性：

- ❌ `createApp()` (Vue 2 不支持相互隔离的应用 scope)
- ❌ `<script setup>` 中的顶级 `await` (Vue 2 不支持异步组件初始化)
- ❌ 模板表达式中的 TypeScript 语法 (与 Vue 2 parser 不兼容)
- ❌ 响应性语法糖 (仍处于试验阶段)
- ❌ 选项式组件不支持 `expose` (但是在 `<script setup>` 中支持 `defineExpose()`)。

## Upgrade Guide

### Vue CLI / webpack

1. Upgrade local `@vue/cli-xxx` dependencies the latest version in your major version range (if applicable):

   - `~4.5.18` for v4
   - `~5.0.6` for v5

2. Upgrade `vue` to `^2.7.0`. You can also remove `vue-template-compiler` from the dependencies - it is no longer needed in 2.7.

   Note: if you are using `@vue/test-utils`, you will need to keep `vue-template-compiler` in the dependencies because test utils rely on some APIs only exposed in this package.

3. Check your package manager lockfile to ensure the following dependencies meet the version requirements. They may be transitive dependencies not listed in `package.json`.

   - `vue-loader`: `^15.10.0`
   - `vue-demi`: `^0.13.1`

   If not, you will need to remove `node_modules` and the lockfile and perform a fresh install to ensure they are bumped to the latest version.

4. If you were previously using [`@vue/composition-api`](https://github.com/vuejs/composition-api), update imports from it to `vue` instead. Note that some APIs exported by the plugin, e.g. `createApp`, are not ported in 2.7.

5. Update `eslint-plugin-vue` to latest version (9+) if you run into unused variable lint errors when using `<script setup>`.

6. The SFC compiler for 2.7 now uses PostCSS 8 (upgraded from 7). PostCSS 8 should be backwards compatible with most plugins, but the upgrade **may** cause issues if you were previously using a custom PostCSS plugin that can only work with PostCSS 7. In such cases, you will need to upgrade the relevant plugins to their PostCSS 8 compatible versions.

### Vite

2.7 support for Vite is provided via a new plugin: [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2). This new plugin requires Vue 2.7 or above and supersedes the existing [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2).

Note that the new plugin does not handle Vue-specific JSX / TSX transform, which is intentional. Vue 2 JSX / TSX transform for Vite is handled in a separate, dedicated plugin: [@vitejs/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx).

### Volar Compatibility

2.7 ships improved type definitions so it is no longer necessary to install `@vue/runtime-dom` just for Volar template type inference support. All you need now is the following config in `tsconfig.json`:

```json
{
  // ...
  "vueCompilerOptions": {
    "target": 2.7
  }
}
```

### Devtools Support

Vue Devtools 6.2.0 has added support for inspecting 2.7 Composition API state, but the extensions may still need a few days to go through review on respective publishing platforms.

## Implications of the 2.7 Release

As stated before, 2.7 is the final minor release of Vue 2.x. After this release, Vue 2 has entered LTS (long-term support) which lasts for 18 months from now, and will no longer receive new features.

This means **Vue 2 will reach End of Life on December 31st, 2023**. We believe this should provide plenty of time for most of the ecosystem to migrate over to Vue 3. However, we also understand that there could be teams or projects that cannot upgrade by this timeline while still need to fullfil security and compliance requirements. If your team expects to be using Vue 2 beyond end of 2023, make sure to plan head and understand your options: learn more about [Vue 2 LTS and Extended Support](/lts/).
