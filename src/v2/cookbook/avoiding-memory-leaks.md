---
title: 避免内存泄漏
type: cookbook
order: 10
---

## 简介

如果你在用 Vue 开发应用，那么就要当心内存泄漏的问题。这个问题在单页应用 (SPA) 中尤为重要，因为在 SPA 的设计中，用户使用它时是不需要刷新浏览器的，所以 JavaScript 应用需要自行清理组件来确保垃圾回收以预期的方式生效。

内存泄漏在 Vue 应用中通常不是来自 Vue 自身的，更多地发生于把其它库集成到应用中的时候。

## 基本的示例

接下来的示例展示了一个由于在一个 Vue 组件中使用 [Choices.js](https://github.com/jshjohnson/Choices) 库而没有将其及时清除导致的内存泄漏。等一下我们再交代如何移除这个 Choices.js 的足迹进而避免内存泄漏。

下面的示例中，我们加载了一个带有非常多选项的选择框，然后我们用到了一个显示/隐藏按钮，通过一个 [v-if](/v2/guide/conditional.html) 指令从虚拟 DOM 中添加或移除它。这个示例的问题在于这个 `v-if` 指令会从 DOM 中移除父级元素，但是我们并没有清除由 Choices.js 新添加的 DOM 片段，从而导致了内存泄漏。

```html
<link rel="stylesheet prefetch" href="https://joshuajohnson.co.uk/Choices/assets/styles/css/choices.min.css?version=3.0.3">
<script src="https://joshuajohnson.co.uk/Choices/assets/scripts/dist/choices.min.js?version=3.0.3"></script>

<div id="app">
  <button
    v-if="showChoices"
    @click="hide"
  >Hide</button>
  <button
    v-if="!showChoices"
    @click="show"
  >Show</button>
  <div v-if="showChoices">
    <select id="choices-single-default"></select>
  </div>
</div>
```

```js
new Vue({
  el: "#app",
  data: function () {
    return {
      showChoices: true
    }
  },
  mounted: function () {
    this.initializeChoices()
  },
  methods: {
    initializeChoices: function () {
      let list = []
      // 我们来为选择框载入很多选项
      // 这样的话它会占用大量的内存
      for (let i = 0; i < 1000; i++) {
        list.push({
          label: "Item " + i,
          value: i
        })
      }
      new Choices("#choices-single-default", {
        searchEnabled: true,
        removeItemButton: true,
        choices: list
      })
    },
    show: function () {
      this.showChoices = true
      this.$nextTick(() => {
        this.initializeChoices()
      })
    },
    hide: function () {
      this.showChoices = false
    }
  }
})
```

为了实际观察一下这个内存泄露，请使用 Chrome 打开这个 [CodePen 示例](https://codepen.io/freeman-g/pen/qobpxo)然后打开 Chrome 的任务管理器。Mac 下打开 Chrome 任务管理器的方式是选择 Chrome 顶部导航 > 窗口 > 任务管理；在 Windows 上则是 Shift + Esc 快捷键。现在点击展示/隐藏按钮 50 次左右。你应该在 Chrome 任务管理中发现内存的使用在增加并且从未被回收。

![内存泄漏示例](/images/memory-leak-example.png)

## 解决这个内存泄漏问题

在上述的示例中，我们可以用 `hide()` 方法在将选择框从 DOM 中移除之前做一些清理工作，来解决内存泄露问题。为了做到这一点，我们会在 Vue 实例的数据对象中保留一个 property，并会使用 [Choices API 中的](https://github.com/jshjohnson/Choices) `destroy()` 方法将其清除。

通过这个[更新之后的 CodePen 示例](https://codepen.io/freeman-g/pen/mxWMor)可以再重新看看内存的使用情况。

```js
new Vue({
  el: "#app",
  data: function () {
    return {
      showChoices: true,
      choicesSelect: null
    }
  },
  mounted: function () {
    this.initializeChoices()
  },
  methods: {
    initializeChoices: function () {
      let list = []
      for (let i = 0; i < 1000; i++) {
        list.push({
          label: "Item " + i,
          value: i
        })
      }
      // 在我们的 Vue 实例的数据对象中设置一个 `choicesSelect` 的引用
      this.choicesSelect = new Choices("#choices-single-default", {
        searchEnabled: true,
        removeItemButton: true,
        choices: list
      })
    },
    show: function () {
      this.showChoices = true
      this.$nextTick(() => {
        this.initializeChoices()
      })
    },
    hide: function () {
      // 现在我们可以让 Choices 使用这个引用
      // 在从 DOM 中移除这些元素之前进行清理工作
      this.choicesSelect.destroy()
      this.showChoices = false
    }
  }
})
```

## 这样做的价值

内存管理和性能测试在快速交付的时候是很容易被忽视的，然而，保持小内存开销仍然对整体的用户体验非常重要。

考虑一下你的用户使用的设备类型，以及他们通常情况下的使用方式。他们使用的是内存很有限的上网本或移动设备吗？你的用户通常会做很多应用内的导航吗？如果其中之一是的话，那么良好的内存管理实践会帮助你避免糟糕的浏览器崩溃的场景。即便都不是，因为一个不小心，你的应用在经过持续的使用之后，仍然有潜在的性能恶化的问题。

## 实际的例子

在上述示例中，我们使用了一个 `v-if` 指令产生内存泄漏，但是一个更常见的实际的场景是使用 [Vue Router](https://router.vuejs.org/) 在一个单页应用中路由到不同的组件。

就像这个 `v-if` 指令一样，当一个用户在你的应用中导航时，Vue Router 从虚拟 DOM 中移除了元素，并替换为了新的元素。Vue 的 `beforeDestroy()` [生命周期钩子](/v2/guide/instance.html#生命周期图示)是一个解决基于 Vue Router 的应用中的这类问题的好地方。

我们可以将清理工作放入 `beforeDestroy()` 钩子，像这样：

```js
beforeDestroy: function () {
  this.choicesSelect.destroy()
}
```

## 替代方案

我们已经讨论了移除元素时的内存管理，但是如果你打算在内存中保留状态和元素该怎么做呢？这种情况下，你可以使用内建的 [keep-alive](/v2/api/#keep-alive) 组件。

当你用 `keep-alive` 包裹一个组件后，它的状态就会保留，因此就留在了内存里。

```html
<button @click="show = false">Hide</button>
<keep-alive>
  <!-- `<my-component>` 即便被删除仍会刻意保留在内存里 -->
  <my-component v-if="show"></my-component>
</keep-alive>
```

这个技巧可以用来提升用户体验。例如，设想一个用户在一个文本框中输入了评论，之后决定导航离开。如果这个用户之后导航回来，那些评论应该还保留着。

一旦你使用了 `keep-alive`，那么你就可以访问另外两个生命周期钩子：`activated` 和 `deactivated`。如果你想要在一个 `keep-alive` 组件被移除的时候进行清理或改变数据，可以使用 `deactivated` 钩子。

```js
deactivated: function () {
  // 移除任何你不想保留的数据
}
```

## 总结

Vue 让开发非常棒的响应式的 JavaScript 应用程序变得非常简单，但是你仍然需要警惕内存泄漏。这些内存泄漏往往会发生在使用 Vue 之外的其它进行 DOM 操作的三方库时。请确保测试应用的内存泄漏问题并在适当的时机做必要的组件清理。
