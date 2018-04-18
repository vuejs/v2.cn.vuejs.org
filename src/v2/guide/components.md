---
title: 组件基础
type: guide
order: 11
---

## 基本示例

这里有一个 Vue 组件的示例：

``` js
// 定义一个名为 button-counter 的新组件
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
```

组件是可复用的 Vue 实例，且带有一个名字：在这个例子中是 `<button-counter>`。我们在一个通过 `new Vue` 创建的 Vue 根实例中可以作为一个自定义元素来使用这个组件：

```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

```js
new Vue({ el: '#components-demo' })
```

{% raw %}
<div id="components-demo" class="demo">
  <button-counter></button-counter>
</div>
<script>
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count += 1">You clicked me {{ count }} times.</button>'
})
new Vue({ el: '#components-demo' })
</script>
{% endraw %}

因为组件是可复用的 Vue 实例，它们接收和 `new Vue` 相同的选项，例如 `data`、`computed`、`watch`、`methods` 以及生命周期钩子等。也有少数 `el` 这样的根特有的例外选项。

## 复用组件

组件是你想复用多少次就可以复用多少次的：

```html
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

{% raw %}
<div id="components-demo2" class="demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
<script>
new Vue({ el: '#components-demo2' })
</script>
{% endraw %}

注意当点击按钮时，每个组件都会各自独立维护它的 `count`。因为你每用一次组件，就会有一个它的新**实例**被创建。

### `data` 必须是一个函数

当我们定义这个 `<button-counter>` 组件时，你可能会发现它的 `data` 并不是像这样直接提供一个对象：

```js
data: {
  count: 0
}
```

取而代之的是，**一个组件的 `data` 选项必须是一个函数**，因此每个实例可以维护一份被返回对象的独立的拷贝：

```js
data: function () {
  return {
    count: 0
  }
}
```

如果 Vue 没有这条规则，点击一个按钮就可能会像如下代码一样影响到_其它所有实例_：

{% raw %}
<div id="components-demo3" class="demo">
  <button-counter2></button-counter2>
  <button-counter2></button-counter2>
  <button-counter2></button-counter2>
</div>
<script>
var buttonCounter2Data = {
  count: 0
}
Vue.component('button-counter2', {
  data: function () {
    return buttonCounter2Data
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
new Vue({ el: '#components-demo3' })
</script>
{% endraw %}

## 组织组件

通常一个应用都会被组织成为一个嵌套到组件树：

![Component Tree](/images/components.png)

例如，你可能会有页头的组件、侧边栏的组件以及内容区的组件等，每个组件又包含了其它的像导航链接、博文之类的组件。

为了在模板中使用这些组件，它们必须被注册以便被 Vue 认出来。这里有两种组件的注册类型：**全局**和**局部**。至此，我们的组件都只是通过 `Vue.component` 全局注册的：

```js
Vue.component('my-component-name', {
  // ... options ...
})
```

全局注册的组件可以用在任何在此之后 (通过 `new Vue`) 创建的 Vue 根实例，也包括其组件树中的所有子组件的模板中。

到这里，你需要了解的注册方法大概就是这些了，如果你阅读完整篇文章并掌握了它的内容，我们会推荐你再回来把[组件注册](components-registration.html)读完。

## 通过 Prop 向子组件传递数据

早些时候，我们提到了创建一个博文组件的事情。问题是如果你不能向这个组件传递某一篇博文的标题或内容之类的我们想展示的数据的话，它是没有办法使用的。这也正是 prop 的由来。

Prop 是你可以在组件上注册一些的自定义特性。当一个值传递给一个 prop 特性的时候，它就变成了那个组件实例的一个属性。为了给我们的博文组件传递一个标题，我们可以用一个 `props` 选项将其包含在该组件可接受的 prop 列表中：

```js
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
```

一个组件默认可以拥有你想拥有的任意数量的 prop，任何值都可以传递给任何 prop。在上述模板中，你会发现我们能够在组件实例中访问这个值，就像访问 `data` 中的值一样。

一个 prop 被注册之后，你就可以像这样把数据作为一个自定义特性传递进来：

```html
<blog-post title="My journey with Vue"></blog-post>
<blog-post title="Blogging with Vue"></blog-post>
<blog-post title="Why Vue is so fun"></blog-post>
```

{% raw %}
<div id="blog-post-demo" class="demo">
  <blog-post1 title="My journey with Vue"></blog-post1>
  <blog-post1 title="Blogging with Vue"></blog-post1>
  <blog-post1 title="Why Vue is so fun"></blog-post1>
</div>
<script>
Vue.component('blog-post1', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
new Vue({ el: '#blog-post-demo' })
</script>
{% endraw %}

然而在一个典型的应用中，你可能在 `data` 里有一个博文的数组：

```js
new Vue({
  el: '#blog-post-demo',
  data: {
    posts: [
      { id: 1, title: 'My journey with Vue' },
      { id: 2, title: 'Blogging with Vue' },
      { id: 3, title: 'Why Vue is so fun' },
    ]
  }
})
```

并想要为每篇博文渲染一个组件：

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title"
></blog-post>
```

如上所示，你会发现我们可以使用 `v-bind` 来动态传递 prop。这在你一开始不清楚要渲染的具体内容，比如[从一个 API 获取博文列表](https://jsfiddle.net/chrisvfritz/sbLgr0ad)的时候，是非常有用的。

到这里，你需要了解的 prop 大概就是这些了，如果你阅读完整篇文章并掌握了它的内容，我们会推荐你再回来把 [prop](components-props.html) 读完。

## 单个根元素

当构建一个 `<blog-post>` 组件时，你的模板最终会包含的东西远不止一个标题：

```html
<h3>{{ post.title }}</h3>
```

最最起码，你会包含着篇博文的正文：

```html
<h3>{{ post.title }}</h3>
<div v-html="post.content"></div>
```

然而如果你在你的模板中尝试这样写，Vue 会显示一个错误，并解释道 **every component must have a single root element (每个组件必须只有一个根元素)**。你可以将模板的内容包裹在一个父元素内，来修复这个问题，例如：

```html
<div class="blog-post">
  <h3>{{ post.title }}</h3>
  <div v-html="post.content"></div>
</div>
```

## 通过事件向父级组件发送消息

在我们开发 `<blog-post>` 组件时，它的一些功能可能要求我们和父级组件进行沟通。例如我们可能会引入一个可访问性的功能来放大博文的字号，同时让页面的其它部分保持默认的字号。

在其父组件中，我们可以通过添加一个 `postFontSize` 数据属性来支持这个功能：

```js
new Vue({
  el: '#blog-posts-events-demo',
  data: {
    posts: [/* ... */],
    postFontSize: 1
  }
})
```

它可以在模板中用来控制所有博文的字号：

```html
<div id="blog-posts-events-demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      v-bind:key="post.id"
      v-bind:post="post"
    ></blog-post>
  </div>
</div>
```

现在我们在每篇博文正文之前添加一个按钮来放大字号：

```js
Vue.component('blog-post', {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <button>
        Enlarge text
      </button>
      <div v-html="post.content"></div>
    </div>
  `
})
```

<p class="tip">上述的这个和一些接下来的示例使用了 JavaScript 的[模板字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals)来让多行的模板更易读。它们在 IE 下并没有被支持，所以如果你需要在不 (经过 Babel 或 TypeScript 之类的工具) 编译的情况下支持 IE，请使用[折行转义字符](https://css-tricks.com/snippets/javascript/multiline-string-variables-in-javascript/)取而代之。</p>

问题是这个按钮不会做任何事：

```html
<button>
  Enlarge text
</button>
```

当我们点击这个按钮时，我们需要告诉父级组件放大所有博文的文本。幸好 Vue 实例提供了一个自定义事件的系统来解决这个问题。我们可以调用内建的 [**$emit** 方法](../api/实例方法-事件)并传入事件的名字，来向父级组件触发一个事件：

```html
<button v-on:click="$emit('enlarge-text')">
  Enlarge text
</button>
```

然后在我们可以用 `v-on` 在博文组件上监听这个事件，就像我们监听一个原生 DOM 事件一样：

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += 0.1"
></blog-post>
```

{% raw %}
<div id="blog-posts-events-demo" class="demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      v-bind:key="post.id"
      v-bind:post="post"
      v-on:enlarge-text="postFontSize += 0.1"
    ></blog-post>
  </div>
</div>
<script>
Vue.component('blog-post', {
  props: ['post'],
  template: '\
    <div class="blog-post">\
      <h3>{{ post.title }}</h3>\
      <button v-on:click="$emit(\'enlarge-text\')">\
        Enlarge text\
      </button>\
      <div v-html="post.content"></div>\
    </div>\
  '
})
new Vue({
  el: '#blog-posts-events-demo',
  data: {
    posts: [
      { id: 1, title: 'My journey with Vue', content: '...content...' },
      { id: 2, title: 'Blogging with Vue', content: '...content...' },
      { id: 3, title: 'Why Vue is so fun', content: '...content...' }
    ],
    postFontSize: 1
  }
})
</script>
{% endraw %}

### 在事件中抛出一个值

有的时候在事件中抛出一个具体的值是非常有用的。例如我们可能想让 `<blog-post>` 组件决定他的文本要放大多少。这时我们可以使用 `$emit` 的第二个参数来提供这个值：

```html
<button v-on:click="$emit('enlarge-text', 0.1)">
  Enlarge text
</button>
```

然后当我们在父级组件监听这个事件的时候，我们可以通过 `$event` 访问到被抛出的这个值：

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
```

或者，如果这个事件处理函数是一个方法：

```html
<blog-post
  ...
  v-on:enlarge-text="onEnlargeText"
></blog-post>
```

那么这个值将会作为第一个参数传入这个方法：

```js
methods: {
  onEnlargeText: function (enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

### 在组件上使用 `v-model`

自定义事件也可以用于创建支持 `v-model` 的自定义控件。记住：

```html
<input v-model="searchText">
```

等价于：

```html
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```

当用在一个组件上时，`v-model` 会换做这个：

``` html
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```

为了让它正常工作，这个组件内的 `<input>` 必须：

- 将其 `value` 特性绑定到一个名叫 `value` 的 prop 上
- 在其 `input` 事件被触发时，以新的值在该组件触发名为 `input` 的自定义事件

写成代码之后是这样的：

```js
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)
    >
  `
})
```

现在 `v-model` 就应该可以在这个组件上完美工作起来了：

```html
<custom-input v-model="searchText"></custom-input>
```

到这里，你需要了解的组件自定义事件大概就是这些了，如果你阅读完整篇文章并掌握了它的内容，我们会推荐你再回来把[自定义事件](components-custom-events.html)读完。

## 通过插槽分发内容

和 HTML 元素一样，我们经常需要向一个组件传递内容，像这样：

``` html
<alert-box>
  Something bad happened.
</alert-box>
```

可能会渲染出这样的东西：

{% raw %}
<div id="slots-demo" class="demo">
  <alert-box>
    Something bad happened.
  </alert-box>
</div>
<script>
Vue.component('alert-box', {
  template: '\
    <div class="demo-alert-box">\
      <strong>Error!</strong>\
      <slot></slot>\
    </div>\
  '
})
new Vue({ el: '#slots-demo' })
</script>
<style>
.demo-alert-box {
  padding: 10px 20px;
  background: #f3beb8;
  border: 1px solid #f09898;
}
</style>
{% endraw %}

幸好这件事可以通过 Vue 的自定义元素 `<slot>` 轻松解决：

```js
Vue.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot></slot>
    </div>
  `
})
```

如你在上面所看到的，我们只是在我们想要放置内容的地方添加了这个插槽——就这么简单。搞定！

到这里，你需要了解的插槽大概就是这些了，如果你阅读完整篇文章并掌握了它的内容，我们会推荐你再回来把[插槽](components-slots.html)读完。

## 动态组件

有的时候，在不同组件之间进行动态切换是非常有用的，就像在一个多标签的界面里：

{% raw %}
<div id="dynamic-component-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    class="dynamic-component-demo-tab-button"
    v-bind:class="{ 'dynamic-component-demo-tab-button-active': tab === currentTab }"
    v-on:click="currentTab = tab"
  >
    {{ tab }}
  </button>
  <component
    v-bind:is="currentTabComponent"
    class="dynamic-component-demo-tab"
  ></component>
</div>
<script>
Vue.component('tab-home', { template: '<div>Home component</div>' })
Vue.component('tab-posts', { template: '<div>Posts component</div>' })
Vue.component('tab-archive', { template: '<div>Archive component</div>' })
new Vue({
  el: '#dynamic-component-demo',
  data: {
    currentTab: 'Home',
    tabs: ['Home', 'Posts', 'Archive']
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
</script>
<style>
.dynamic-component-demo-tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.dynamic-component-demo-tab-button:hover {
  background: #e0e0e0;
}
.dynamic-component-demo-tab-button-active {
  background: #e0e0e0;
}
.dynamic-component-demo-tab {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
{% endraw %}

上述内容可以通过 Vue 的 `<component>` 元素加一个特殊的 `is` 特性来实现：

```html
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component v-bind:is="currentTabComponent"></component>
```

In the example above, `currentTabComponent` can contain either:
在上述示例中，`currentTabComponent` 可以包括

- 已注册组件的名字，或
- 一个组件的选项对象

你可以在[这里](https://jsfiddle.net/chrisvfritz/o3nycadu/)查阅并体验完整的代码，或在[这个版本](https://jsfiddle.net/chrisvfritz/b2qj69o1/)了解绑定组件选项对象，而不是已注册组件名的示例。

到这里，你需要了解的动态组件大概就是这些了，如果你阅读完整篇文章并掌握了它的内容，我们会推荐你再回来把[动态和异步组件](components-dynamic-async.html)读完。

## 解析 DOM 模板时的注意事项

有些 HTML 元素，诸如 `<ul>`、`<ol>`、`<table>` 和 `<select>`，对于哪些元素可以出现在其内部是有严格限制的，而有些元素，诸如 `<li>`、`<tr>` 和 `<option>`，只能出现在某些其它的元素内部。

这会导致我们使用这些有约束条件的元素时遇到一些问题。例如：

``` html
<table>
  <blog-post-row></blog-post-row>
</table>
```

这个自定义组件 `<blog-post-row>` 会被看作无效内容，并导致最终渲染结果出错。幸好这个特殊的 `is` 特性给了我们一个变通的办法：

``` html
<table>
  <tr is="blog-post-row"></tr>
</table>
```

我们应该注意到**如果我们从以下来源使用模板的话，这条限制是_不存在_的**：

- 字符串 (例如：`template: '...'`)
- [单文件组件 (`.vue`)](single-file-components.html)
- [`<script type="text/x-template">`](components-edge-cases.html#X-Templates)

到这里，你需要了解的解析 DOM 模板时的注意事项——实际上也是 Vue 的全部_必要内容_，大概就是这些了。恭喜你！接下来还有很多东西要去学习，不过首先，我们推荐你先休息一下，试用一下 Vue，自己随意做些好玩的东西。

如果你感觉已经掌握了这些知识，我们推荐你再回来把完整的组件指南，包括侧边栏中组件深入章节的所有页面读完，
