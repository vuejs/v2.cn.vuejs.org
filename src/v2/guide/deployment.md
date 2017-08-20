---
title: 生产环境部署提示
type: guide
order: 20
---

## 开启生产环境模式

开发时，Vue 会提供很多警告来帮你解决常见的错误与陷阱。生产时，这些警告语句却没有用，反而会增加你的载荷量。再次，有些警告检查有小的运行时开销，生产环境模式下是可以避免的。

### 不用打包工具

如果用 Vue 完整独立版本（直接用 `<script>` 元素引入 Vue），生产时应该用精简版本（`vue.min.js`)。请查看[安装指导](installation.html#独立版本)，附有开发与精简版本。

### 用打包工具

如果用 Webpack 或 Browserify 类似的打包工具时，生产状态会在 Vue 源码中由 `process.env.NODE_ENV` 决定，默认在开发状态。Webpack 与 Browserify 两个打包工具都提供方法来覆盖此变量并使用生产状态，警告语句也会被精简掉。每一个 `vue-cli` 模板有预先配置好的打包工具，但了解怎样配置会更好。

#### Webpack

使用 Webpack 的 [DefinePlugin](http://webpack.github.io/docs/list-of-plugins.html#defineplugin) 来指定生产环境，以便在压缩时可以让 UglifyJS 自动删除代码块内的警告语句。例如配置：

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
```

#### Browserify

- 运行打包命令，设置 `NODE_ENV` 为 `"production"`。等于告诉 `vueify` 避免引入热重载和开发相关代码。
- 使用一个全局 [envify](https://github.com/hughsk/envify) 转换你的 bundle 文件。这可以精简掉包含在 Vue 源码中所有环境变量条件相关代码块内的警告语句。例如：

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

#### Rollup

使用 [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace)：

``` js
const replace = require('rollup-plugin-replace')
rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
}).then(...)
```

## 预编译模板

当你需要处理 DOM 内或 JavaScript 内的模板时，“从模板到渲染函数”的编译就会在线上发生。通常情况下这种处理是足够快的，但是如果你的应用对性能很敏感最好还是回避。

预编译模板最简单的方式就是使用[单文件组件](./single-file-components.html) - 相关的构建设置会自动把预编译处理好，所以构建好的代码已经包含了编译出来的渲染函数而不是原始的模板字符串。

如果你使用 Webpack，并且喜欢分离 JavaScript 和模板文件，你可以使用 [vue-template-loader](https://github.com/ktsn/vue-template-loader)，它也可以在构建过程中把模板文件转换成为 JavaScript 渲染函数。

## 提取 CSS

当使用单文件组件时，组件内的 CSS 会以 `<style>` 标签的方式通过 JavaScript 动态注入。这有一些小小的运行时开销，如果你使用服务端渲染，这会导致一段“无样式的内容瞬间 (fouc)”。横跨所有组件提取 CSS 到同一个文件回避这件事情，这也会更好的压缩和缓存 CSS。

可查阅相关构建工具文档：

- [Webpack + vue-loader](http://vue-loader.vuejs.org/en/configurations/extract-css.html) (the `vue-cli` webpack template has this pre-configured)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://github.com/znck/rollup-plugin-vue#options)

## 跟踪运行时错误

如果在组件渲染时出现运行错误，错误将会被传递至全局 `Vue.config.errorHandler` 配置函数（如果已设置）。利用这个钩子函数和错误跟踪服务（如 [Sentry](https://sentry.io)，它为 Vue 提供[官方集成](https://sentry.io/for/vue/)），可能是个不错的主意。
