---
title: 插槽
type: guide
order: 104
---

> 该页面假设你已经阅读过了[组件基础](components.html)。如果你还对组件不太了解，推荐你先阅读它。

## 插槽内容

Vue 实现了一套内容分发的 API，这套 API 基于当前的 [Web Components 规范草案](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md)，将 `<slot>` 元素作为承载分发内容的出口。

它允许你像这样合成组件：

``` html
<navigation-link url="/profile">
  Your Profile
</navigation-link>
```

然后你在 `<navigation-link>` 的模板中可能会写为：

``` html
<a
  v-bind:href="url"
  class="nav-link"
>
  <slot></slot>
</a>
```

当组件渲染的时候，这个 `<slot>` 元素将会被替换为“Your Profile”。插槽内可以包含任何模板代码，包括 HTML：

``` html
<navigation-link url="/profile">
  <!-- 添加一个 Font Awesome 图标 -->
  <span class="fa fa-user"></span>
  Your Profile
</navigation-link>
```

甚至其它的组件：

``` html
<navigation-link url="/profile">
  <!-- 添加一个图标的组件 -->
  <font-awesome-icon name="user"></font-awesome-icon>
  Your Profile
</navigation-link>
```

如果 `<navigation-link>` **没有**包含一个 `<slot>` 元素，则任何传入它的内容都会被抛弃。

## 具名插槽

有些时候我们需要多个插槽。例如，一个假设的 `<base-layout>` 组件的模板如下：

``` html
<div class="container">
  <header>
    <!-- 我们希望把页头放这里 -->
  </header>
  <main>
    <!-- 我们希望把主要内容放这里 -->
  </main>
  <footer>
    <!-- 我们希望把页脚放这里 -->
  </footer>
</div>
```

对于这样的情况，`<slot>` 元素有一个特殊的特性：`name`。这个特性可以用来定义额外的插槽：

``` html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

在向具名插槽提供内容的时候，我们可以在一个父组件的 `<template>` 元素上使用 `slot` 特性：

```html
<base-layout>
  <template slot="header">
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template slot="footer">
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

另一种 `slot` 特性的用法是直接用在一个普通的元素上：

``` html
<base-layout>
  <h1 slot="header">Here might be a page title</h1>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <p slot="footer">Here's some contact info</p>
</base-layout>
```

我们还是可以保留一个未命名插槽，这个插槽是**默认插槽**，也就是说它会作为所有未匹配到插槽的内容的统一出口。上述两个示例渲染出来的 HTML 都将会是：

``` html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

## 插槽的默认内容

有的时候为插槽提供默认的内容是很有用的。例如，一个 `<submit-button>` 组件可能希望这个按钮的默认内容是“Submit”，但是同时允许用户覆写为“Save”、“Upload”或别的内容。

你可以在 `<slot>` 标签内部指定默认的内容来做到这一点。

```html
<button type="submit">
  <slot>Submit</slot>
</button>
```

如果父组件为这个插槽提供了内容，则默认的内容会被替换掉。

## 编译作用域

当你想在插槽内使用数据时，例如：

``` html
<navigation-link url="/profile">
  Logged in as {{ user.name }}
</navigation-link>
```

该插槽可以访问跟这个模板的其它地方相同的实例属性 (也就是说“作用域”是相同的)。但这个插槽**不能**访问 `<navigation-link>` 的作用域。例如尝试访问 `url` 是不会工作的。牢记一条准则：

> 父组件模板的所有东西都会在父级作用域内编译；子组件模板的所有东西都会在子级作用域内编译。

## 作用域插槽

> 2.1.0+ 新增

有的时候你希望提供的组件带有一个可从子组件获取数据的可复用的插槽。例如一个简单的 `<todo-list>` 组件的模板可能包含了如下代码：

```html
<ul>
  <li
    v-for="todo in todos"
    v-bind:key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

但是在我们应用的某些部分，我们希望每个独立的待办项渲染出和 `todo.text` 不太一样的东西。这也是作用域插槽的用武之地。

为了让这个特性成为可能，你需要做的全部事情就是将待办项内容包裹在一个 `<slot>` 元素上，然后将所有和其上下文相关的数据传递给这个插槽：在这个例子中，这个数据是 `todo` 对象：

```html
<ul>
  <li
    v-for="todo in todos"
    v-bind:key="todo.id"
  >
    <!-- 我们为每个 todo 准备了一个插槽，-->
    <!-- 将 `todo` 对象作为一个插槽的 prop 传入。-->
    <slot v-bind:todo="todo">
      <!-- 回退的内容 -->
      {{ todo.text }}
    </slot>
  </li>
</ul>
```

现在当我们使用 `<todo-list>` 组件的时候，我们可以选择为待办项定义一个不一样的 `<template>` 作为替代方案，并且可以通过 `slot-scope` 特性从子组件获取数据：

```html
<todo-list v-bind:todos="todos">
  <!-- 将 `slotProps` 定义为插槽作用域的名字 -->
  <template slot-scope="slotProps">
    <!-- 为待办项自定义一个模板，-->
    <!-- 通过 `slotProps` 定制每个待办项。-->
    <span v-if="slotProps.todo.isComplete">✓</span>
    {{ slotProps.todo.text }}
  </template>
</todo-list>
```

> 在 2.5.0+，`slot-scope` 不再限制在 `<template>` 元素上使用，而可以用在插槽内的任何元素或组件上。

### 解构 `slot-scope`

如果一个 JavaScript 表达式在一个函数定义的参数位置有效，那么这个表达式实际上就可以被 `slot-scope` 接受。也就是说你可以在支持的环境下 ([单文件组件](single-file-components.html)或[现代浏览器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#浏览器兼容))，在这些表达式中使用 [ES2015 解构语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#解构对象)。例如：

```html
<todo-list v-bind:todos="todos">
  <template slot-scope="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```

这会使作用域插槽变得更干净一些。
