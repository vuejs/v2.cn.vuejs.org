---
title: 安装
type: guide
order: 1
vue_version: 2.4.0
dev_size: "257.91"
min_size: "79.71"
gz_size: "28.96"
ro_gz_size: "20.18"
---

### 兼容性

Vue.js 不支持 IE8 及其以下版本，因为 Vue.js 使用了 IE8 不能模拟的 ECMAScript 5 特性。 Vue.js 支持所有[兼容 ECMAScript 5 的浏览器](http://caniuse.com/#feat=es5)。

### 更新日志

每个版本的更新日志见 [GitHub](https://github.com/vuejs/vue/releases)。

## 直接 `<script>` 引入

直接下载并用 `<script>` 标签引入，`Vue` 会被注册为一个全局变量。**重要提示：在开发时请用开发版本，遇到常见错误它会给出友好的警告。**

<p class="tip">开发环境不要用最小压缩版，不然就失去了错误提示和警告!</p>

<div id="downloads">
<a class="button" href="https://vuejs.org/js/vue.js" download>开发版本</a><span class="light info">包含完整的警告和调试模式</span>

<a class="button" href="https://vuejs.org/js/vue.min.js" download>生产版本</a><span class="light info">删除了警告，{{gz_size}}kb min+gzip</span>
</div>

### CDN

推荐：[https://unpkg.com/vue](https://unpkg.com/vue), 会保持和 npm 发布的最新的版本一致。可以在 [https://unpkg.com/vue/](https://unpkg.com/vue/) 浏览 npm 包资源。

也可以从 [jsDelivr](//cdn.jsdelivr.net/vue/latest/vue.js) 或 [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js) 获取，不过这两个服务版本更新可能略滞后。

## NPM

在用 Vue.js 构建大型应用时推荐使用 NPM 安装， NPM 能很好地和诸如 [Webpack](https://webpack.js.org/) 或 [Browserify](http://browserify.org/) 模块打包器配合使用。 Vue.js 也提供配套工具来开发[单文件组件](single-file-components.html)。

``` bash
# 最新稳定版
$ npm install vue
```

## 命令行工具 (CLI)

Vue.js 提供一个[官方命令行工具](https://github.com/vuejs/vue-cli)，可用于快速搭建大型单页应用。该工具提供开箱即用的构建工具配置，带来现代化的前端开发流程。只需几分钟即可创建并启动一个带热重载、保存时静态检查以及可用于生产环境的构建配置的项目：

``` bash
# 全局安装 vue-cli
$ npm install --global vue-cli
# 创建一个基于 webpack 模板的新项目
$ vue init webpack my-project
# 安装依赖，走你
$ cd my-project
$ npm install
$ npm run dev
```

<p class="tip">CLI 工具假定用户对 Node.js 和相关构建工具有一定程度的了解。如果你是新手，我们强烈建议先在不用构建工具的情况下通读[指南](/guide/)，熟悉 Vue 本身之后再研究 CLI。</p>

<p class="tip">译者注：对于大陆用户，建议将 npm 的注册表源[设置为国内的镜像](http://riny.net/2014/cnpm/)，可以大幅提升安装速度。</p>

## 对不同构建版本的解释

在 [NPM 包的 `dist/` 目录](https://unpkg.com/vue@latest/dist/)你将会找到很多不同的 Vue.js 构建。这里列出了他们之间的差别：

| | UMD | CommonJS | ES Module |
| --- | --- | --- | --- |
| **完整版** | vue.js | vue.common.js | vue.esm.js |
| **只包含运行时** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |
| **完整版 (生产环境)** | vue.min.js | - | - |
| **只包含运行时 (生产环境)** | vue.runtime.min.js | - | - |

### 术语

- **完整版**：同时包含编译器和运行时的构建。

- **编译器**：用来将模板字符串编译成为 JavaScript 渲染函数的代码。

- **运行时**：用来创建 Vue 实例，渲染并处理 virtual DOM 等行为的代码。基本上就是除去编译器的其他一切。

- **[UMD](https://github.com/umdjs/umd)**：UMD 构建可以直接通过 `<script>` 标签用在浏览器中。Unpkg CDN 的 [https://unpkg.com/vue](https://unpkg.com/vue) 默认文件就是运行时 + 编译器的 UMD 构建 (`vue.js`)。

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**：CommonJS 构建用来配合老的打包工具比如 [browserify](http://browserify.org/) 或 [webpack 1](https://webpack.github.io)。这些打包工具的默认文件 (`pkg.main`) 是只包含运行时的 CommonJS 构建 (`vue.runtime.common.js`)。

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**：ES module 构建用来配合现代打包工具比如 [webpack 2](https://webpack.js.org) 或 [rollup](http://rollupjs.org/)。这些打包工具的默认文件 (`pkg.module`) 是只包含运行时的 ES Module 构建 (`vue.runtime.esm.js`)。

### 运行时 + 编译器 vs. 只包含运行时

如果你需要线上编译模板 (比如传入一个字符串的 `template` 选项，或挂载到一个元素上并以其内部的 HTML 作为模板)，你将需要加上编译器，即完整版的构建：

``` js
// 需要编译器
new Vue({
  template: '<div>{{ hi }}</div>'
})

// 不需要编译器
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

当使用 `vue-loader` 或 `vueify` 的时候，`*.vue` 文件内部的模板会在构建时预编译成 JavaScript。你在最终打好的包里实际上是不需要编译器的，因为只是用运行时构建即可。

因为运行时构建相比完整版缩减了 30% 的体积，你应该尽可能使用这个版本。如果你仍然希望使用完整版构建，你需要在你的打包工具里配置一个别名：

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    }
  }
}
```

#### Rollup

``` js
const alias = require('rollup-plugin-alias')

rollup({
  // ...
  plugins: [
    alias({
      'vue': 'vue/dist/vue.esm.js'
    })
  ]
})
```

#### Browserify

Add to your project's `package.json`:

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

### 开发环境 vs. 生产环境模式

开发环境/生产环境模式是硬编码的 UMD 构建：开发环境下不压缩代码，生产环境下压缩代码。

CommonJS 和 ES Module 构建是用于打包工具的，因此我们不提供压缩后的版本。你有必要在打最终包的时候压缩它们。

CommonJS 和 ES Module 构建同时保留里原始的 `process.env.NODE_ENV` 检测，以决定它们应该运行在什么模式下。你应该使用适当的打包工具配置来替换它们的环境变量以便控制 Vue 所运行的模式。把 `process.env.NODE_ENV` 替换为字符串字面量同样可以让 UglifyJS 之类的压缩工具完全丢掉仅供开发环境的代码段，减少最终的文件尺寸。

#### Webpack

使用 Webpack 的 [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}
```

#### Rollup

使用 [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

``` js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}).then(...)
```

#### Browserify

为你的包提供一个全局的 [envify](https://github.com/hughsk/envify) 转换。

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

也可以移步到[生产环境部署提示](deployment.html).

### CSP 环境

有些环境，如 Google Chrome Apps ，强制应用内容安全策略 (CSP) ，不能使用 new Function() 对表达式求值。这时可以用 CSP 兼容版本。独立的构建取决于该功能编译模板，所以无法使用这些环境。

另一方面，运行时构建的是完全兼容 CSP 的。当通过 [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) 或者 [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple) 构建时，在 CSP 环境中模板将被完美预编译到 `render` 函数中。

## 开发版构建

**重要**: Github 仓库的 `/dist` 文件夹只有在新版本发布时才会更新。如果想要使用 Github 上 Vue 最新的源码，你需要自己构建。

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Bower 只提供 UMD 构建。

``` bash
# 最新稳定版本
$ bower install vue
```

## AMD 模块加载器

所有 UMD 构建都可以直接用作 AMD 模块。

***

> 原文：http://vuejs.org/guide/installation.html

***
