---
title: 单文件组件
type: guide
order: 401
---

## 介绍

在很多 Vue 项目中，我们使用 `Vue.component` 来定义全局组件，紧接着用 `new Vue({ el: '#container '})` 在每个页面内指定一个容器元素。

这种方式在很多中小规模的项目中运作的很好，在这些项目里 JavaScript 只被用来加强特定的视图。但当在更复杂的项目中，或者你的前端完全由 JavaScript 驱动的时候，下面这些缺点将变得非常明显：

- **全局定义 (Global definitions)** 强制要求每个 component 中的命名不得重复
- **字符串模板 (String templates)** 缺乏语法高亮，在 HTML 有多行的时候，需要用到丑陋的 `\`
- **不支持 CSS (No CSS support)** 意味着当 HTML 和 JavaScript 组件化时，CSS 明显被遗漏
- **没有构建步骤 (No build step)** 限制只能使用 HTML 和 ES5 JavaScript,  而不能使用预处理器，如 Pug (formerly Jade) 和 Babel

文件扩展名为 `.vue` 的 **single-file components(单文件组件)** 为以上所有问题提供了解决方法，并且还可以使用 webpack 或 Browserify 等构建工具。

这是一个文件名为 `Hello.vue` 的简单实例：

<a href="https://gist.github.com/chrisvfritz/e2b6a6110e0829d78fa4aedf7cf6b235" target="_blank" rel="noopener noreferrer"><img src="/images/vue-component.png" alt="单文件组件的示例 (点击查看文本版的代码)" style="display: block; margin: 30px auto;"></a>

现在我们获得：

- [完整语法高亮](https://github.com/vuejs/awesome-vue#source-code-editing)
- [CommonJS 模块](https://webpack.js.org/concepts/modules/#what-is-a-webpack-module)
- [组件作用域的 CSS](https://vue-loader.vuejs.org/zh-cn/features/scoped-css.html)

正如我们说过的，我们可以使用预处理器来构建简洁和功能更丰富的组件，比如 Pug，Babel (with ES2015 modules)，和 Stylus。

<a href="https://gist.github.com/chrisvfritz/1c9f2daea9bc078dcb47e9a82e5f7587" target="_blank" rel="noopener noreferrer"><img src="/images/vue-component-with-preprocessors.png" alt="带预处理器的单文件组件的示例 (点击查看文本版的代码)" style="display: block; margin: 30px auto;"></a>

这些特定的语言只是例子，你可以只是简单地使用 Babel，TypeScript，SCSS，PostCSS - 或者其他任何能够帮助你提高生产力的预处理器。如果搭配 `vue-loader` 使用 webpack，它也能为 CSS Modules 提供头等支持。

### 怎么看待关注点分离？

一个重要的事情值得注意，**关注点分离不等于文件类型分离。**在现代 UI 开发中，我们已经发现相比于把代码库分离成三个大的层次并将其相互交织起来，把它们划分为松散耦合的组件再将其组合起来更合理一些。在一个组件里，其模板、逻辑和样式是内部耦合的，并且把他们搭配在一起实际上使得组件更加内聚且更可维护。

即便你不喜欢单文件组件，你仍然可以把 JavaScript、CSS 分离成独立的文件然后做到热重载和预编译。

``` html
<!-- my-component.vue -->
<template>
  <div>This will be pre-compiled</div>
</template>
<script src="./my-component.js"></script>
<style src="./my-component.css"></style>
```

## 起步

### 例子沙箱

如果你希望深入了解并开始使用单文件组件，请来 CodeSandbox [看看这个简单的 todo 应用](https://codesandbox.io/s/o29j95wx9)。

### 针对刚接触 JavaScript 模块开发系统的用户

有了 `.vue` 组件，我们就进入了高级 JavaScript 应用领域。如果你没有准备好的话，意味着还需要学会使用一些附加的工具：

- **Node Package Manager (NPM)**：阅读 [Getting Started guide](https://docs.npmjs.com/getting-started/what-is-npm) 直到 *10: Uninstalling global packages*章节。

- **Modern JavaScript with ES2015/16**：阅读 Babel 的 [Learn ES2015 guide](https://babeljs.io/docs/learn-es2015/)。你不需要立刻记住每一个方法，但是你可以保留这个页面以便后期参考。

在你花一天时间了解这些资源之后，我们建议你参考 [Vue CLI 3](https://cli.vuejs.org/zh/)。只要遵循指示，你就能很快地运行一个带有 `.vue` 组件、ES2015、webpack 和热重载 (hot-reloading) 的 Vue 项目!

### 针对高级用户

CLI 会为你搞定大多数工具的配置问题，同时也支持细粒度自定义[配置项](https://cli.vuejs.org/zh/config/)。

有时你会想从零搭建你自己的构建工具，这时你需要通过 [Vue Loader](https://vue-loader.vuejs.org/zh/) 手动配置 webpack。关于学习更多 webpack 的内容，请查阅[其官方文档](https://webpack.js.org/configuration/) 和 [Webpack Academy](https://webpack.academy/p/the-core-concepts)。
