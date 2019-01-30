---
title: 生产环境部署
type: guide
order: 404
---

> 以下大多数内容在你使用 [Vue CLI](https://cli.vuejs.org/zh/) 时都是默认开启的。该章节仅跟你自定义的构建设置有关。

## 开启生产环境模式

开发环境下，Vue 会提供很多警告来帮你对付常见的错误与陷阱。而在生产环境下，这些警告语句却没有用，反而会增加应用的体积。此外，有些警告检查还有一些小的运行时开销，这在生产环境模式下是可以避免的。

### 不使用构建工具

如果用 Vue 完整独立版本，即直接用 `<script>` 元素引入 Vue 而不提前进行构建，请记得在生产环境下使用压缩后的版本 (`vue.min.js`)。两种版本都可以在[安装指导](installation.html#直接用-lt-script-gt-引入)中找到。

### 使用构建工具

当使用 webpack 或 Browserify 类似的构建工具时，Vue 源码会根据 `process.env.NODE_ENV` 决定是否启用生产环境模式，默认情况为开发环境模式。在 webpack 与 Browserify 中都有方法来覆盖此变量，以启用 Vue 的生产环境模式，同时在构建过程中警告语句也会被压缩工具去除。这些所有 `vue-cli` 模板中都预先配置好了，但了解一下怎样配置会更好。

#### webpack

在 webpack 4+ 中，你可以使用 `mode` 选项：

``` js
module.exports = {
  mode: 'production'
}
```

但是在 webpack 3 及其更低版本中，你需要使用 [DefinePlugin](https://webpack.js.org/plugins/define-plugin/)：

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}
```

#### Browserify

- 在运行打包命令时将 `NODE_ENV` 设置为 `"production"`。这等于告诉 `vueify` 避免引入热重载和开发相关的代码。
- 对打包后的文件进行一次全局的 [envify](https://github.com/hughsk/envify) 转换。这使得压缩工具能清除掉 Vue 源码中所有用环境变量条件包裹起来的警告语句。例如：

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

- 或者在 Gulp 中使用 [envify](https://github.com/hughsk/envify)：

  ``` js
  // 使用 envify 的自定义模块来定制环境变量
  var envify = require('envify/custom')

  browserify(browserifyOptions)
    .transform(vueify)
    .transform(
      // 必填项，以处理 node_modules 里的文件
      { global: true },
      envify({ NODE_ENV: 'production' })
    )
    .bundle()
  ```

- 或者配合 Grunt 和 [grunt-browserify](https://github.com/jmreidy/grunt-browserify) 使用 [envify](https://github.com/hughsk/envify)：

  ``` js
  // 使用 envify 自定义模块指定环境变量
  var envify = require('envify/custom')
  
  browserify: {
    dist: {
      options: {
        // 该函数用来调整 grunt-browserify 的默认指令
        configure: b => b
          .transform('vueify')
          .transform(
            // 用来处理 `node_modules` 文件
            { global: true },
            envify({ NODE_ENV: 'production' })
          )
          .bundle()
      }
    }
  }
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

## 模板预编译

当使用 DOM 内模板或 JavaScript 内的字符串模板时，模板会在运行时被编译为渲染函数。通常情况下这个过程已经足够快了，但对性能敏感的应用还是最好避免这种用法。

预编译模板最简单的方式就是使用[单文件组件](./single-file-components.html)——相关的构建设置会自动把预编译处理好，所以构建好的代码已经包含了编译出来的渲染函数而不是原始的模板字符串。

如果你使用 webpack，并且喜欢分离 JavaScript 和模板文件，你可以使用 [vue-template-loader](https://github.com/ktsn/vue-template-loader)，它也可以在构建过程中把模板文件转换成为 JavaScript 渲染函数。

## 提取组件的 CSS

当使用单文件组件时，组件内的 CSS 会以 `<style>` 标签的方式通过 JavaScript 动态注入。这有一些小小的运行时开销，如果你使用服务端渲染，这会导致一段“无样式内容闪烁 (fouc)”。将所有组件的 CSS 提取到同一个文件可以避免这个问题，也会让 CSS 更好地进行压缩和缓存。

查阅这个构建工具各自的文档来了解更多：

- [webpack + vue-loader](https://vue-loader.vuejs.org/zh-cn/configurations/extract-css.html) (`vue-cli` 的 webpack 模板已经预先配置好)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://vuejs.github.io/rollup-plugin-vue/#/en/2.3/?id=custom-handler)

## 跟踪运行时错误

如果在组件渲染时出现运行错误，错误将会被传递至全局 `Vue.config.errorHandler` 配置函数 (如果已设置)。利用这个钩子函数来配合错误跟踪服务是个不错的主意。比如 [Sentry](https://sentry.io)，它为 Vue 提供了[官方集成](https://sentry.io/for/vue/)。
