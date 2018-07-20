---
title: 在 VS Code 和 Chrome 中调试
type: cookbook
order: 8
---

每个应用，不论大小，都需要理解程序是如何运行失败的。在本案例中，我们会探索一些使用 Chrome 来进行测试的 VS Code 用户的工作流程。

这个案例展示了在通过 [Vue CLI](https://github.com/vuejs/vue-cli) 生成的 Vue.js 应用程序中，如何使用 VS Code 的 [Debugger for Chrome](https://github.com/Microsoft/VSCode-chrome-debug) 扩展进行调试。

## 先决条件

你必须安装好 Chrome 和 VS Code。同时请确保自己在 VS Code 中安装了 [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) 扩展的最新版本。

请通过 [Vue CLI](https://github.com/vuejs/vue-cli)，遵循它的 README 中的安装文档安装并创建一个项目。然后进入这个新创建的应用的目录，打开 VS Code。

### 在 Chrome Devtools 中展示源代码

在可以从 VS Code 调试你的 Vue 组件之前，你需要更新 webpack 配置以构建 source map。做了这件事之后，我们的调试器就有机会将一个被压缩的文件中的代码对应回其源文件相应的位置。这会确保你可以在一个应用中调试，即便你的资源已经被 webpack 优化过了也没关系。

打开 `config/index.js` 并找到 `devtool` 属性。将其更新为：

```json
devtool: 'source-map',
```

如果使用 Vue CLI 3 你需要设置 `vue.config.js` 内的 `devtool` 属性：

```js
module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  }
}
```

### 从 VS Code 启动应用

点击在 Activity Bar 里的 Debugger 图标来到 Debug 视图，然后点击那个齿轮图标来配置一个 `launch.json` 的文件，选择 **Chrome** 环境。然后将生成的 `launch.json` 的内容替换成为接下来的两段配置：

![添加 Chrome 配置](/images/config_add.png)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "vuejs: chrome",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```

## 设置一个断点

1. 在 **`src/components/HelloWorld.vue`** 的 `line90` 的地方设置一个断点，这里的 `data` 函数返回一个字符串。

  ![断点渲染器](/images/breakpoint_set.png)

2. 在根目录打开你惯用的终端并使用 Vue CLI 开启这个应用：

  ```
  npm start
  ```

3. 来到 Debug 视图，选择 **'vuejs: chrome'** 配置，然后按 <kbd>F5</kbd> 或点击那个绿色的 play 按钮。

4. 随着一个新的 Chrome 实例打开 `http://localhost:8080`，你的断点现在应该被命中了。

  ![命中断点](/images/breakpoint_hit.png)

## 替代方案

### Vue Devtools

我们还有一些其它的调试方法，复杂度不尽相同。其中最流行和简单的是使用非常棒的 [vue-devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)。使用 devtools 有很多好处，比如它可以让你能够实时编辑数据属性并立即看到其反映出来的变化。另一个主要的好处是能够为 Vuex 提供时间旅行式的调试体验。

![Devtools Timetravel Debugger](/images/devtools-timetravel.gif)

<p class="tip">请留意如果页面使用了一个生产环境/压缩后的 Vue.js 构建版本 (例如来自一个 CDN 的标准的链接)，devtools 的审查功能是默认被禁用的，所以 Vue 面板不会出现。如果你切换到一个非压缩版本，你可能需要强制刷新该页面来看到它。</p>

### Vuetron

[Vuetron](http://vuetron.io/) 是一个非常好的项目，它对 vue-devtools 的工作做了一些扩展。除了普通的 devtools 工作流程，你还可以：

* 快速查阅 API 请求/响应：如果你使用 fetch API 来发送请求，那么这个功能会将所有发出的请求都展示出来。这个扩展出来的卡片展示了请求的数据和响应的数据。
* 订阅你的应用的某个具体部分的状态，以便快速调试
* 组件依赖可视化，且允许你收起/展开某个具体的依赖树视图

![Vuetron 层级结构](/images/vuetron-heirarchy.gif)

### 简单的 debugger 语句

上述示例的工作流程非常好。不过这里还有一个替代选项，就是你可以直接在代码中使用[原生的 `debugger` 语句](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/debugger)。如果你选择了这种方式，请千万记得当你调试完毕之后把这个语句移除。

```js
<script>
export default {
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    const hello = 'Hello World!'
    debugger
    this.message = hello
  }
};
</script>
```

## 致谢

这个案例是基于 [Kenneth Auchenberg](https://twitter.com/auchenberg) 贡献在[这里](https://github.com/Microsoft/VSCode-recipes/tree/master/vuejs-cli)的文章而撰写的。
