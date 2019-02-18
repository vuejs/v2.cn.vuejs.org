---
title: 条件渲染
type: guide
order: 7
---

## `v-if`

`v-if` 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回 truthy 值的时候被渲染。

``` html
<h1 v-if="awesome">Vue is awesome!</h1>
```

也可以用 `v-else` 添加一个“else 块”：

``` html
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

### 在 `<template>` 元素上使用 `v-if` 条件渲染分组

因为 `v-if` 是一个指令，所以必须将它添加到一个元素上。但是如果想切换多个元素呢？此时可以把一个 `<template>` 元素当做不可见的包裹元素，并在上面使用 `v-if`。最终的渲染结果将不包含 `<template>` 元素。

``` html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

### `v-else`

你可以使用 `v-else` 指令来表示 `v-if` 的“else 块”：

``` html
<div v-if="Math.random() > 0.5">
  Now you see me
</div>
<div v-else>
  Now you don't
</div>
```

`v-else` 元素必须紧跟在带 `v-if` 或者 `v-else-if` 的元素的后面，否则它将不会被识别。

### `v-else-if`

> 2.1.0 新增

`v-else-if`，顾名思义，充当 `v-if` 的“else-if 块”，可以连续使用：

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

类似于 `v-else`，`v-else-if` 也必须紧跟在带 `v-if` 或者 `v-else-if` 的元素之后。

### 用 `key` 管理可复用的元素

Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。这么做除了使 Vue 变得非常快之外，还有其它一些好处。例如，如果你允许用户在不同的登录方式之间切换：

``` html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
```

那么在上面的代码中切换 `loginType` 将不会清除用户已经输入的内容。因为两个模板使用了相同的元素，`<input>` 不会被替换掉——仅仅是替换了它的 `placeholder`。

自己动手试一试，在输入框中输入一些文本，然后按下切换按钮：

{% raw %}
<div id="no-key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Username</label>
      <input placeholder="Enter your username">
    </template>
    <template v-else>
      <label>Email</label>
      <input placeholder="Enter your email address">
    </template>
  </div>
  <button @click="toggleLoginType">Toggle login type</button>
</div>
<script>
new Vue({
  el: '#no-key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

这样也不总是符合实际需求，所以 Vue 为你提供了一种方式来表达“这两个元素是完全独立的，不要复用它们”。只需添加一个具有唯一值的 `key` 属性即可：

``` html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```

现在，每次切换时，输入框都将被重新渲染。请看：

{% raw %}
<div id="key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Username</label>
      <input placeholder="Enter your username" key="username-input">
    </template>
    <template v-else>
      <label>Email</label>
      <input placeholder="Enter your email address" key="email-input">
    </template>
  </div>
  <button @click="toggleLoginType">Toggle login type</button>
</div>
<script>
new Vue({
  el: '#key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

注意，`<label>` 元素仍然会被高效地复用，因为它们没有添加 `key` 属性。

## `v-show`

另一个用于根据条件展示元素的选项是 `v-show` 指令。用法大致一样：

``` html
<h1 v-show="ok">Hello!</h1>
```

不同的是带有 `v-show` 的元素始终会被渲染并保留在 DOM 中。`v-show` 只是简单地切换元素的 CSS 属性 `display`。

<p class="tip">注意，`v-show` 不支持 `<template>` 元素，也不支持 `v-else`。</p>

## `v-if` vs `v-show`

`v-if` 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。

`v-if` 也是**惰性的**：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

相比之下，`v-show` 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。

一般来说，`v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 `v-show` 较好；如果在运行时条件很少改变，则使用 `v-if` 较好。

## `v-if` 与 `v-for` 一起使用

<p class="tip">**不推荐**同时使用 `v-if` 和 `v-for`。请查阅[风格指南](/v2/style-guide/#避免-v-if-和-v-for-用在一起-必要)以获取更多信息。</p>

当 `v-if` 与 `v-for` 一起使用时，`v-for` 具有比 `v-if` 更高的优先级。请查阅[列表渲染指南](list.html#v-for-with-v-if) 以获取详细信息。
