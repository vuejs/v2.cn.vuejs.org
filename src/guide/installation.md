---
title: 安装
type: guide
order: 0
vue_version: 1.0.23
dev_size: "264.81"
min_size: "74.59"
gz_size: "25.81"
---

### 兼容性

Vue.js 不支持 IE8 及其以下版本，因为 Vue.js 使用了 IE8 不能实现的 ECMAScript 5 特性。 Vue.js 支持所有[兼容 ECMAScript 5 的浏览器](http://caniuse.com/#feat=es5)。

### 更新日志

每个版本的更新日志见 [GitHub](https://github.com/vuejs/vue/releases)。

## 独立版本

直接下载并用 `<script>` 标签引入，`Vue` 会被注册为一个全局变量。**重要提示：在开发时请用开发版本，遇到常见错误它会给出友好的警告。**

<div id="downloads">
<a class="button" href="/js/vue.js" download>开发版本</a><span class="light info">包含完整的警告和调试模式</span>

<a class="button" href="/js/vue.min.js" download>生产版本</a><span class="light info">删除了警告，{{gz_size}}kb min+gzip</span>
</div>

### CDN

可以从 [jsdelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.min.js) 或 [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.min.js) 获取（版本更新可能略滞后）。

### CSP 兼容版本

有些环境，如 Google Chrome Apps，强制应用内容安全策略 (CSP) ，不能使用 `new Function()` 对表达式求值。这时可以用 [CSP 兼容版本](https://github.com/vuejs/vue/tree/csp/dist)。

## NPM

在用 Vue.js 构建大型应用时推荐使用 NPM 安装，NPM 能很好地和诸如 [Webpack](http://webpack.github.io/) 或 [Browserify](http://browserify.org/) 的 CommonJS 模块打包器配合使用。Vue.js 也提供配套工具来开发[单文件组件](application.html#单文件组件)。

``` bash
# 最新稳定版本
$ npm install vue
# 最新稳定 CSP 兼容版本
$ npm install vue@csp
```

## 命令行工具

Vue.js 提供一个[官方命令行工具](https://github.com/vuejs/vue-cli)，可用于快速搭建大型单页应用。该工具提供开箱即用的构建工具配置，带来现代化的前端开发流程。只需一分钟即可启动带热重载、保存时静态检查以及可用于生产环境的构建配置的项目：

``` bash
# 全局安装 vue-cli
$ npm install -g vue-cli
# 创建一个基于 "webpack" 模板的新项目
$ vue init webpack my-project
# 安装依赖，走你
$ cd my-project
$ npm install
$ npm run dev
```

## 开发版本

**重要**：发布到 NPM 上的 CommonJS 包 (`vue.common.js`) 只在发布新版本时签入 master 分支，所以这些文件在 dev 分支下跟稳定版本是一样的。想使用 GitHub 上最新的源码，需要自己编译：

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

``` bash
# 最新稳定版本
$ bower install vue
```

## AMD 模块加载器

独立版本或通过 Bower 安装的版本已用 [UMD](https://github.com/umdjs/umd#readme) 包装，因此它们可以直接用作 AMD 模块。
