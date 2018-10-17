---
title: 单文件组件
type: guide
order: 402
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

这些特定的语言只是例子，你可以只是简单地使用 Babel，TypeScript，SCSS，PostCSS - 或者其他任何能够帮助你提高生产力的预处理器。如果搭配 `vue-loader` 使用 webpack，它也是把 CSS Modules 当作第一公民来对待的。

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

在你花一天时间了解这些资源之后，我们建议你参考 [webpack](https://github.com/vuejs-templates/webpack) 模板。只要遵循指示，你就能很快地运行一个用到 `.vue` 组件，ES2015 和热重载 (hot-reloading) 的 Vue 项目!

想学习更多 webpack 的知识，请移步[它们的官方文档](https://webpack.js.org/configuration/)以及 [webpack learning academy](https://webpack.academy/p/the-core-concepts)。在 webpack 中，每个模块被打包到 bundle 之前都由一个相应的“loader”来转换，Vue 也提供 [vue-loader](https://github.com/vuejs/vue-loader) 插件来执行 `.vue` 单文件组件 的转换。

### 针对高级用户

无论你更钟情 webpack 或是 Browserify，我们为简单的和更复杂的项目都提供了一些文档模板。我们建议浏览 [github.com/vuejs-templates](https://github.com/vuejs-templates)，找到你需要的部分，然后参考 README 中的说明，使用 [vue-cli](https://github.com/vuejs/vue-cli) 工具生成新的项目。

模板中使用 [webpack](https://webpack.js.org/)，一个模块加载器加载多个模块然后构建成最终应用。为了进一步了解 webpack，可以看 [官方介绍视频](https://www.youtube.com/watch?v=WQue1AN93YU)。如果你有基础，可以看 [在 Egghead.io 上的 webpack 进阶教程](https://egghead.io/courses/using-webpack-for-production-javascript-applications)。
