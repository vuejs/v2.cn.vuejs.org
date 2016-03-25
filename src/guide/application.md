---
title: 构建大型应用
type: guide
order: 18
---

> **新：** 使用脚手架工具 [vue-cli](https://github.com/vuejs/vue-cli) 可以快速地构建项目：单文件 Vue 组件，热加载，保存时检查代码，单元测试等。

Vue.js 的设计思想是专注与灵活——它只是一个界面库，不强制使用哪个架构。它能很好地与已有项目整合，不过对于经验欠缺的开发者，从头开始构建大型应用可能是一个挑战。

Vue.js 生态系统提供了一系列的工具与库，用于构建大型单页应用。这些部分会感觉开始更像一个『框架』，但是它们本质上只是一套推荐的技术栈而已 - 你依然可以对各个部分进行选择和替换。

## 模块化

对于大型项目，为了更好地管理代码使用模块构建系统非常必要。推荐代码使用 CommonJS 或 ES6 模块，然后使用 [Webpack](http://webpack.github.io/) 或 [Browserify](http://browserify.org/) 打包。

Webpack 和 Browserify 不只是模块打包器。两者都提供了源码转换 API，通过它可以用其它预处理器转换源码。例如，借助 [babel-loader](https://github.com/babel/babel-loader) 或 [babelify](https://github.com/babel/babelify) 代码可以使用 ES2015/2016 语法。

如果你之前没有用过它们，我强烈推荐你阅读一些教程，了解模块打包器，然后使用最新的 ECMAScript 特性写 JavaScript。

## 单文件组件

在典型的 Vue.js 项目中，我们会把界面拆分为多个小组件，每个组件在同一地方封装它的 CSS 样式，模板和 JavaScript 定义，这么做比较好。如上所述，使用 Webpack 或 Browserify 以及合适的源码转换器，我们可以这样写组件：

<img src="/images/vue-component.png">

如果你喜欢预处理器，甚至可以这么做：

<img src="/images/vue-component-with-pre-processors.png">

你可以使用 Webpack + [vue-loader](https://github.com/vuejs/vue-loader) 或 Browserify + [vueify](https://github.com/vuejs/vueify) 构建这些单文件 Vue 组件。你也可以在 [Webpackbin.com](http://www.webpackbin.com/vue) 上在线尝试！

选择哪种构建工具取决于你的经验和需求。Webpack 的功能更强大，如代码分割，将静态资源当作模块，提取组件的 CSS 到单独的一个文件等，不过它的配置相对复杂一点。如果你不需要 Webpack 的那些功能，使用 Browserify 更简单，

最快的构建方式是使用官方出品的脚手架工具 [vue-cli](https://github.com/vuejs/vue-cli)。你也可以在 GitHub 上查看官方的构建模板：

- [Webpack + vue-loader](https://github.com/vuejs-templates/webpack)
- [Browserify + vueify](https://github.com/vuejs-templates/browserify)

## 路由

对于单页应用，推荐使用[官方库 vue-router](https://github.com/vuejs/vue-router)。详细请查看它的[文档](http://vuejs.github.io/vue-router/)。

如果你只需要非常简单的路由逻辑，可以这么做，监听 `hashchange` 事件并使用动态组件：

**示例：**

``` html
<div id="app">
  <component :is="currentView"></component>
</div>
```

``` js
Vue.component('home', { /* ... */ })
Vue.component('page1', { /* ... */ })
var app = new Vue({
  el: '#app',
  data: {
    currentView: 'home'
  }
})
// 在路由处理器中切换页面
app.currentView = 'page1'
```

利用这种机制也可以非常容易地配合其它路由库，如 [Page.js](https://github.com/visionmedia/page.js) 或 [Director](https://github.com/flatiron/director)。

## 与服务器通信

Vue 实例的原始数据 `$data` 能直接用 `JSON.stringify()` 序列化。社区贡献了一个插件 [vue-resource](https://github.com/vuejs/vue-resource)，提供一种容易的方式与 RESTful APIs 配合。也可以使用任何自己喜欢的 Ajax 库，如 `$.ajax` 或 [SuperAgent](https://github.com/visionmedia/superagent)。Vue.js 也能很好地与无后端服务配合，如 Firebase 和 Parse。

## 状态管理

在大型应用中，状态管理常常变得复杂，因为状态分散在许多组件内。常常忽略 Vue.js 应用的来源是原生的数据对象—— Vue 实例代理访问它。因此，如果一个状态要被多个实例共享，应避免复制它：

``` js
var sourceOfTruth = {}

var vmA = new Vue({
  data: sourceOfTruth
})

var vmB = new Vue({
  data: sourceOfTruth
})
```

现在每当 `sourceOfTruth` 被修改后，`vmA` 与 `vmB` 将自动更新它们的视图。扩展这个思路，我们可以实现 **store 模式**：

``` js
var store = {
  state: {
    message: 'Hello!'
  },
  actionA: function () {
    this.state.message = 'action A triggered'
  },
  actionB: function () {
    this.state.message = 'action B triggered'
  }
}

var vmA = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})

var vmB = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})
```

我们把所有的 action 放在 store 内，action 修改 store 的状态。集中管理状态更易于理解状态将怎样变化。组件仍然可以拥有和管理它的私有状态。

![状态管理](/images/state.png)

有一点要注意，不要在 action 中替换原始的状态对象——为了观察到变化，组件和 store 需要共享这个对象。

如果我们约定，组件不可以直接修改 store 的状态，而应当派发事件，通知 store 执行 action，那么我们基本上实现了 [Flux](https://facebook.github.io/flux/) 架构。此约定的好处是，我们能记录 store 所有的状态变化，并且在此之上实现高级的调试帮助函数，如修改日志，快照，历史回滚等。

Flux 架构常用于 React 应用中，但它的核心理念也可以适用于 Vue.js 应用。比如 [Vuex](https://github.com/vuejs/vuex/) 就是一个借鉴于 Flux，但是专门为 Vue.js 所设计的状态管理方案。React 生态圈中最流行的 Flux 实现 [Redux](https://github.com/rackt/redux/) 也可以通过[简单的绑定](https://github.com/egoist/revue)和 Vue 一起使用。

## 单元测试

任何支持模块构建系统的单元测试工具都可以。推荐使用 [Karma](http://karma-runner.github.io/0.12/index.html)。它有许多插件，支持 [Webpack](https://github.com/webpack/karma-webpack) 和 [Browserify](https://github.com/Nikku/karma-browserify)。用法见它们的文档。

代码测试的最佳实践是导出组件模块的选项/函数。例如：

``` js
// my-component.js
module.exports = {
  template: '<span>{{msg}}</span>',
  data: function () {
    return {
      msg: 'hello!'
    }
  },
  created: function () {
    console.log('my-component created!')
  }
}
```

在入口模块中使用这个模块：

``` js
// main.js
var Vue = require('vue')
var app = new Vue({
  el: '#app',
  data: { /* ... */ },
  components: {
    'my-component': require('./my-component')
  }
})
```

测试这个模块：

``` js
// Jasmine 2.0 测试
describe('my-component', function () {
  // require source module
  var myComponent = require('../src/my-component')
  it('should have a created hook', function () {
    expect(typeof myComponent.created).toBe('function')
  })
  it('should set correct default data', function () {
    expect(typeof myComponent.data).toBe('function')
    var defaultData = myComponent.data()
    expect(defaultData.msg).toBe('hello!')
  })
})
```

Karma 的示例配置：[Webpack](https://github.com/vuejs/vue-loader-example/blob/master/build/karma.conf.js), [Browserify](https://github.com/vuejs/vueify-example/blob/master/karma.conf.js)。

<p class="tip">因为 Vue.js 指令是异步更新，如果想在修改数据之后修改 DOM ，应当在 `Vue.nextTick` 的回调中操作。</p>

## 生产发布

为了更小的文件体积，Vue.js 的压缩版本删除所有的警告，但是在使用 Browserify 或 Webpack 等工具构建 Vue.js 应用时，压缩需要一些配置。

### Webpack

使用插件 [DefinePlugin](http://webpack.github.io/docs/list-of-plugins.html#defineplugin) 将当前环境指定为生产环境，警告将在 UglifyJS 压缩代码过程中被删除。配置示例：

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

### Browserify

将 NODE_ENV 设置为 "production"，然后运行打包命令。Vue 会自动应用 [envify](https://github.com/hughsk/envify) 并让警告块不能运行。例如：

``` bash
NODE_ENV=production browserify -e main.js | uglifyjs -c -m > build.js
```

## 应用示例

[Vue.js Hackernews Clone](https://github.com/vuejs/vue-hackernews) 这个应用示例使用 Webpack + vue-loader 组织代码，使用 vue-router 作为路由器，HackerNews 官方的 Firebase API 作为后端。它当然不是大应用，但是它综合演示了本页讨论的概念。
