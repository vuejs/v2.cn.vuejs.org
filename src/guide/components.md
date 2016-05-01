---
title: 组件
type: guide
order: 12
---

## 什么是组件？

组件（Component）是 Vue.js 最强大的功能之一。组件可以扩展 HTML 元素，封装可重用的代码。在较高层面上，组件是自定义元素，Vue.js 的编译器为它添加特殊功能。在有些情况下，组件也可以是原生 HTML 元素的形式，以 `is` 特性扩展。

## 使用组件

### 注册

之前说过，我们可以用 `Vue.extend()` 创建一个组件构造器：

``` js
var MyComponent = Vue.extend({
  // 选项...
})
```

要把这个构造器用作组件，需要用 `Vue.component(tag, constructor)` **注册** ：

``` js
// 全局注册组件，tag 为 my-component
Vue.component('my-component', MyComponent)
```

<p class="tip">对于自定义标签名字，Vue.js 不强制要求遵循 [W3C 规则](http://www.w3.org/TR/custom-elements/#concepts)（小写，并且包含一个短杠），尽管遵循这个规则比较好。</p>

组件在注册之后，便可以在父实例的模块中以自定义元素 `<my-component>` 的形式使用。要确保在初始化根实例**之前**注册了组件：

``` html
<div id="example">
  <my-component></my-component>
</div>
```

``` js
// 定义
var MyComponent = Vue.extend({
  template: '<div>A custom component!</div>'
})

// 注册
Vue.component('my-component', MyComponent)

// 创建根实例
new Vue({
  el: '#example'
})
```

渲染为：

``` html
<div id="example">
  <div>A custom component!</div>
</div>
```

{% raw %}
<div id="example" class="demo">
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})
new Vue({ el: '#example' })
</script>
{% endraw %}

注意组件的模板**替换**了自定义元素，自定义元素的作用只是作为一个**挂载点**。可以用实例选项 `replace` 决定是否替换。

### 局部注册

不需要全局注册每个组件。可以让组件只能用在其它组件内，用实例选项 `components` 注册：

``` js
var Child = Vue.extend({ /* ... */ })

var Parent = Vue.extend({
  template: '...',
  components: {
    // <my-component> 只能用在父组件模板内
    'my-component': Child
  }
})
```

这种封装也适用于其它资源，如指令、过滤器和过渡。

### 注册语法糖

为了让事件更简单，可以直接传入选项对象而不是构造器给 `Vue.component()` 和 `component` 选项。Vue.js 在背后自动调用 `Vue.extend()`：

``` js
// 在一个步骤中扩展与注册
Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})

// 局部注册也可以这么做
var Parent = Vue.extend({
  components: {
    'my-component': {
      template: '<div>A custom component!</div>'
    }
  }
})
```

### 组件选项问题

传入 Vue 构造器的多数选项也可以用在 `Vue.extend()` 中，不过有两个特例： `data` 和 `el`。试想如果我们简单地把一个对象作为 `data` 选项传给 `Vue.extend()`：

``` js
var data = { a: 1 }
var MyComponent = Vue.extend({
  data: data
})
```

这么做的问题是 `MyComponent` 所有的实例将共享同一个 `data` 对象！这基本不是我们想要的，因此我们应当使用一个函数作为 `data` 选项，让这个函数返回一个新对象：

``` js
var MyComponent = Vue.extend({
  data: function () {
    return { a: 1 }
  }
})
```

同理，`el` 选项用在 `Vue.extend()` 中时也须是一个函数。

### 模板解析

Vue 的模板是 DOM 模板，使用浏览器原生的解析器而不是自己实现一个。相比字符串模板，DOM 模板有一些好处，但是也有问题，它必须是有效的 HTML 片段。一些 HTML 元素对什么元素可以放在它里面有限制。常见的限制：

- `a` 不能包含其它的交互元素（如按钮，链接）
- `ul` 和 `ol` 只能直接包含 `li`
- `select` 只能包含 `option` 和 `optgroup`
- `table` 只能直接包含 `thead`, `tbody`, `tfoot`, `tr`, `caption`, `col`, `colgroup`
- `tr` 只能直接包含 `th` 和 `td`


在实际中，这些限制会导致意外的结果。尽管在简单的情况下它可能可以工作，但是你不能依赖自定义组件在浏览器验证之前的展开结果。例如 `<my-select><option>...</option></my-select>` 不是有效的模板，即使 `my-select` 组件最终展开为 `<select>...</select>`。

另一个结果是，自定义标签（包括自定义元素和特殊标签，如 `<component>`、`<template>`、 `<partial>` ）不能用在 `ul`, `select`, `table` 等对内部元素有限制的标签内。放在这些元素内部的自定义标签将被提到元素的外面，因而渲染不正确。

对于自定义元素，应当使用 `is` 特性：

``` html
<table>
  <tr is="my-component"></tr>
</table>
```

`<template>` 不能用在 `<table>` 内，这时应使用 `<tbody>`，`<table>` 可以有多个 `<tbody>`：

``` html
<table>
  <tbody v-for="item in items">
    <tr>Even row</tr>
    <tr>Odd row</tr>
  </tbody>
</table>
```

## Props

### 使用 Props 传递数据

**组件实例的作用域是孤立的**。这意味着不能并且不应该在子组件的模板内直接引用父组件的数据。可以使用 **props** 把数据传给子组件。

"prop" 是组件数据的一个字段，期望从父组件传下来。子组件需要显式地用 [`props` 选项](/api/#props) 声明 props：

``` js
Vue.component('child', {
  // 声明 props
  props: ['msg'],
  // prop 可以用在模板内
  // 可以用 `this.msg` 设置
  template: '<span>{{ msg }}</span>'
})
```

然后向它传入一个普通字符串：

``` html
<child msg="hello!"></child>
```

**结果：**

{% raw %}
<div id="prop-example-1" class="demo">
  <child msg="hello!"></child>
</div>
<script>
new Vue({
  el: '#prop-example-1',
  components: {
    child: {
      props: ['msg'],
      template: '<span>{{ msg }}</span>'
    }
  }
})
</script>
{% endraw %}

### camelCase vs. kebab-case

HTML 特性不区分大小写。名字形式为 camelCase 的 prop 用作特性时，需要转为 kebab-case（短横线隔开）：

``` js
Vue.component('child', {
  // camelCase in JavaScript
  props: ['myMessage'],
  template: '<span>{{ myMessage }}</span>'
})
```

``` html
<!-- kebab-case in HTML -->
<child my-message="hello!"></child>
```

### 动态 Props

类似于用 `v-bind` 绑定 HTML 特性到一个表达式，也可以用 `v-bind` 绑定动态 Props 到父组件的数据。每当父组件的数据变化时，也会传导给子组件：

``` html
<div>
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
```

使用 `v-bind` 的缩写语法通常更简单：

``` html
<child :my-message="parentMsg"></child>
```

**结果：**

{% raw %}
<div id="demo-2" class="demo">
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
<script>
new Vue({
  el: '#demo-2',
  data: {
    parentMsg: 'Message from parent'
  },
  components: {
    child: {
      props: ['myMessage'],
      template: '<span>{{myMessage}}</span>'
    }
  }
})
</script>
{% endraw %}

### 字面量语法 vs. 动态语法

初学者常犯的一个错误是使用字面量语法传递数值：

``` html
<!-- 传递了一个字符串 "1" -->
<comp some-prop="1"></comp>
```

因为它是一个字面 prop，它的值以字符串 `"1"` 而不是以实际的数字传下去。如果想传递一个实际的 JavaScript 数字，需要使用动态语法，从而让它的值被当作 JavaScript 表达式计算：

``` html
<!-- 传递实际的数字  -->
<comp :some-prop="1"></comp>
```

### Prop 绑定类型

prop 默认是**单向**绑定：当父组件的属性变化时，将传导给子组件，但是反过来不会。这是为了防止子组件无意修改了父组件的状态——这会让应用的数据流难以理解。不过，也可以使用 `.sync` 或 `.once` **绑定修饰符**显式地强制双向或单次绑定：

比较语法：

``` html
<!-- 默认为单向绑定 -->
<child :msg="parentMsg"></child>

<!-- 双向绑定 -->
<child :msg.sync="parentMsg"></child>

<!-- 单次绑定 -->
<child :msg.once="parentMsg"></child>
```

双向绑定会把子组件的 `msg` 属性同步回父组件的 `parentMsg` 属性。单次绑定在建立之后不会同步之后的变化。

<p class="tip">注意如果 prop 是一个对象或数组，是按引用传递。在子组件内修改它**会**影响父组件的状态，不管是使用哪种绑定类型。</p>

### Prop 验证

组件可以为 props 指定验证要求。当组件给其他人使用时这很有用，因为这些验证要求构成了组件的 API，确保其他人正确地使用组件。此时 props 的值是一个对象，包含验证要求：

``` js
Vue.component('example', {
  props: {
    // 基础类型检测 （`null` 意思是任何类型都可以）
    propA: Number,
    // 多种类型 (1.0.21+)
    propM: [String, Number],
    // 必需且是字符串
    propB: {
      type: String,
      required: true
    },
    // 数字，有默认值
    propC: {
      type: Number,
      default: 100
    },
    // 对象/数组的默认值应当由一个函数返回
    propD: {
      type: Object,
      default: function () {
        return { msg: 'hello' }
      }
    },
    // 指定这个 prop 为双向绑定
    // 如果绑定类型不对将抛出一条警告
    propE: {
      twoWay: true
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        return value > 10
      }
    },
    // 转换函数（1.0.12 新增）
    // 在设置值之前转换值
    propG: {
      coerce: function (val) {
        return val + '' // 将值转换为字符串
      }
    },
    propH: {
      coerce: function (val) {
        return JSON.parse(val) // 将 JSON 字符串转换为对象
      }
    }
  }
})
```

`type` 可以是下面原生构造器：

- String
- Number
- Boolean
- Function
- Object
- Array

`type` 也可以是一个自定义构造器，使用 `instanceof` 检测。

当 prop 验证失败了，Vue 将拒绝在子组件上设置此值，如果使用的是开发版本会抛出一条警告。

## 父子组件通信

### 父链

子组件可以用 `this.$parent` 访问它的父组件。根实例的后代可以用 `this.$root` 访问它。父组件有一个数组 `this.$children`，包含它所有的子元素。

尽管可以访问父链上任意的实例，不过子组件应当避免直接依赖父组件的数据，尽量显式地使用 props 传递数据。另外，在子组件中修改父组件的状态是非常糟糕的做法，因为：

1. 这让父组件与子组件紧密地耦合；

2. 只看父组件，很难理解父组件的状态。因为它可能被任意子组件修改！理想情况下，只有组件自己能修改它的状态。

### 自定义事件

Vue 实例实现了一个自定义事件接口，用于在组件树中通信。这个事件系统独立于原生 DOM 事件，用法也不同。

每个 Vue 实例都是一个事件触发器：

- 使用 `$on()` 监听事件；

- 使用 `$emit()` 在它上面触发事件；

- 使用 `$dispatch()` 派发事件，事件沿着父链冒泡；

- 使用 `$broadcast()` 广播事件，事件向下传导给所有的后代。

<p class="tip">不同于 DOM 事件，Vue 事件在冒泡过程中第一次触发回调之后自动停止冒泡，除非回调明确返回 `true`。</p>

简单例子：

``` html
<!-- 子组件模板 -->
<template id="child-template">
  <input v-model="msg">
  <button v-on:click="notify">Dispatch Event</button>
</template>

<!-- 父组件模板 -->
<div id="events-example">
  <p>Messages: {{ messages | json }}</p>
  <child></child>
</div>
```

``` js
// 注册子组件
// 将当前消息派发出去
Vue.component('child', {
  template: '#child-template',
  data: function () {
    return { msg: 'hello' }
  },
  methods: {
    notify: function () {
      if (this.msg.trim()) {
        this.$dispatch('child-msg', this.msg)
        this.msg = ''
      }
    }
  }
})

// 初始化父组件
// 将收到消息时将事件推入一个数组
var parent = new Vue({
  el: '#events-example',
  data: {
    messages: []
  },
  // 在创建实例时 `events` 选项简单地调用 `$on`
  events: {
    'child-msg': function (msg) {
      // 事件回调内的 `this` 自动绑定到注册它的实例上
      this.messages.push(msg)
    }
  }
})
```

{% raw %}
<script type="x/template" id="child-template">
  <input v-model="msg">
  <button v-on:click="notify">Dispatch Event</button>
</script>

<div id="events-example" class="demo">
  <p>Messages: {{ messages | json }}</p>
  <child></child>
</div>
<script>
Vue.component('child', {
  template: '#child-template',
  data: function () {
    return { msg: 'hello' }
  },
  methods: {
    notify: function () {
      if (this.msg.trim()) {
        this.$dispatch('child-msg', this.msg)
        this.msg = ''
      }
    }
  }
})

var parent = new Vue({
  el: '#events-example',
  data: {
    messages: []
  },
  events: {
    'child-msg': function (msg) {
      this.messages.push(msg)
    }
  }
})
</script>
{% endraw %}

### 使用 v-on 绑定自定义事件

上例非常好，不过从父组件的代码中不能直观的看到 `"child-msg"` 事件来自哪里。如果我们在模板中子组件用到的地方声明事件处理器会更好。为此子组件可以用 `v-on` 监听自定义事件：

``` html
<child v-on:child-msg="handleIt"></child>
```

这样就很清楚了：当子组件触发了 `"child-msg"` 事件，父组件的 `handleIt` 方法将被调用。所有影响父组件状态的代码放到父组件的 `handleIt` 方法中；子组件只关注触发事件。

### 子组件索引

尽管有 props 和 events，但是有时仍然需要在 JavaScript 中直接访问子组件。为此可以使用 `v-ref` 为子组件指定一个索引 ID。例如：

``` html
<div id="parent">
  <user-profile v-ref:profile></user-profile>
</div>
```

``` js
var parent = new Vue({ el: '#parent' })
// 访问子组件
var child = parent.$refs.profile
```

`v-ref` 和 `v-for` 一起用时，ref 是一个数组或对象，包含相应的子组件。

## 使用 Slot 分发内容

在使用组件时，常常要像这样组合它们：

``` html
<app>
  <app-header></app-header>
  <app-footer></app-footer>
</app>
```

注意两点：

1. `<app>` 组件不知道它的挂载点会有什么内容，挂载点的内容是由 `<app>` 的父组件决定的。

2. `<app>` 组件很可能有它自己的模板。

为了让组件可以组合，我们需要一种方式来混合父组件的内容与子组件自己的模板。这个处理称为**内容分发**（或 "transclusion"，如果你熟悉 Angular）。Vue.js 实现了一个内容分发 API，参照了当前 [Web 组件规范草稿](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md)，使用特殊的 `<slot>` 元素作为原始内容的插槽。

### 编译作用域

在深入内容分发 API 之前，我们先明确内容的编译作用域。假定模板为：

``` html
<child-component>
  {{ msg }}
</child-component>
```

`msg` 应该绑定到父组件的数据，还是绑定到子组件的数据？答案是父组件。组件作用域简单地说是：

> 父组件模板的内容在父组件作用域内编译；子组件模板的内容在子组件作用域内编译

一个常见错误是试图在父组件模板内将一个指令绑定到子组件的属性/方法：

``` html
<!-- 无效 -->
<child-component v-show="someChildProperty"></child-component>
```

假定 `someChildProperty` 是子组件的属性，上例不会如预期那样工作。父组件模板不应该知道子组件的状态。

如果要绑定子组件内的指令到一个组件的根节点，应当在它的模板内这么做：

``` js
Vue.component('child-component', {
  // 有效，因为是在正确的作用域内
  template: '<div v-show="someChildProperty">Child</div>',
  data: function () {
    return {
      someChildProperty: true
    }
  }
})
```

类似地，分发内容是在父组件作用域内编译。

### 单个 Slot

父组件的内容将被**抛弃**，除非子组件模板包含 `<slot>`。如果子组件模板只有一个没有特性的 slot，父组件的整个内容将插到 slot 所在的地方并替换它。

`<slot>` 标签的内容视为**回退内容**。回退内容在子组件的作用域内编译，当宿主元素为空并且没有内容供插入时显示这个回退内容。

假定 `my-component` 组件有下面模板：

``` html
<div>
  <h1>This is my component!</h1>
  <slot>
    如果没有分发内容则显示我。
  </slot>
</div>
```

父组件模板：

``` html
<my-component>
  <p>This is some original content</p>
  <p>This is some more original content</p>
</my-component>
```

渲染结果：

``` html
<div>
  <h1>This is my component!</h1>
  <p>This is some original content</p>
  <p>This is some more original content</p>
</div>
```

### 具名 Slot

`<slot>` 元素可以用一个特殊特性 `name` 配置如何分发内容。多个 slot 可以有不同的名字。具名 slot 将匹配内容片段中有对应 `slot` 特性的元素。

仍然可以有一个匿名 slot，它是**默认 slot**，作为找不到匹配的内容片段的回退插槽。如果没有默认的 slot，这些找不到匹配的内容片段将被抛弃。

例如，假定我们有一个 `multi-insertion` 组件，它的模板为：

``` html
<div>
  <slot name="one"></slot>
  <slot></slot>
  <slot name="two"></slot>
</div>
```

父组件模板：

``` html
<multi-insertion>
  <p slot="one">One</p>
  <p slot="two">Two</p>
  <p>Default A</p>
</multi-insertion>
```

渲染结果为：

``` html
<div>
  <p slot="one">One</p>
  <p>Default A</p>
  <p slot="two">Two</p>
</div>
```

在组合组件时，内容分发 API 是非常有用的机制。

## 动态组件

多个组件可以使用同一个挂载点，然后动态地在它们之间切换。使用保留的 `<component>` 元素，动态地绑定到它的 `is` 特性：

``` js
new Vue({
  el: 'body',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
```

``` html
<component :is="currentView">
  <!-- 组件在 vm.currentview 变化时改变 -->
</component>
```
### `keep-alive`

如果把切换出去的组件保留在内存中，可以保留它的状态或避免重新渲染。为此可以添加一个 `keep-alive` 指令参数：

``` html
<component :is="currentView" keep-alive>
  <!-- 非活动组件将被缓存 -->
</component>
```

### `activate` 钩子

在切换组件时，切入组件在切入前可能需要进行一些异步操作。为了控制组件切换时长，给切入组件添加 `activate` 钩子：

``` js
Vue.component('activate-example', {
  activate: function (done) {
    var self = this
    loadDataAsync(function (data) {
      self.someData = data
      done()
    })
  }
})
```

注意 `activate` 钩子只作用于动态组件切换或静态组件初始化渲染的过程中，不作用于使用实例方法手工插入的过程中。

### `transition-mode`

`transition-mode` 特性用于指定两个动态组件之间如何过渡。

在默认情况下，进入与离开平滑地过渡。这个特性可以指定另外两种模式：

- `in-out`：新组件先过渡进入，等它的过渡完成之后当前组件过渡出去。

- `out-in`：当前组件先过渡出去，等它的过渡完成之后新组件过渡进入。

**示例：**

``` html
<!-- 先淡出再淡入 -->
<component
  :is="view"
  transition="fade"
  transition-mode="out-in">
</component>
```

``` css
.fade-transition {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave {
  opacity: 0;
}
```

{% raw %}
<div id="transition-mode-demo" class="demo">
  <input v-model="view" type="radio" value="v-a" id="a" name="view"><label for="a">A</label>
  <input v-model="view" type="radio" value="v-b" id="b" name="view"><label for="b">B</label>
  <component
    :is="view"
    transition="fade"
    transition-mode="out-in">
  </component>
</div>
<style>
  .fade-transition {
    transition: opacity .3s ease;
  }
  .fade-enter, .fade-leave {
    opacity: 0;
  }
</style>
<script>
new Vue({
  el: '#transition-mode-demo',
  data: {
    view: 'v-a'
  },
  components: {
    'v-a': {
      template: '<div>Component A</div>'
    },
    'v-b': {
      template: '<div>Component B</div>'
    }
  }
})
</script>
{% endraw %}

## 杂项

### 组件和 v-for
自定义组件可以像普通元素一样直接使用  `v-for`：

``` html
<my-component v-for="item in items"></my-component>
```

但是，不能传递数据给组件，因为组件的作用域是孤立的。为了传递数据给组件，应当使用 props：

``` html
<my-component
  v-for="item in items"
  :item="item"
  :index="$index">
</my-component>
```

不自动把 `item` 注入组件的原因是这会导致组件跟当前 `v-for` 紧密耦合。显式声明数据来自哪里可以让组件复用在其它地方。

### 编写可复用组件

在编写组件时，记住是否要复用组件有好处。一次性组件跟其它组件紧密耦合没关系，但是可复用组件应当定义一个清晰的公开接口。

Vue.js 组件 API 来自三部分——prop，事件和 slot：

- **prop** 允许外部环境传递数据给组件；

- **事件** 允许组件触发外部环境的 action；

- **slot** 允许外部环境插入内容到组件的视图结构内。

使用 `v-bind` 和 `v-on` 的简写语法，模板的缩进清楚且简洁：

``` html
<my-component
  :foo="baz"
  :bar="qux"
  @event-a="doThis"
  @event-b="doThat">
  <!-- content -->
  <img slot="icon" src="...">
  <p slot="main-text">Hello!</p>
</my-component>
```

### 异步组件

在大型应用中，我们可能需要将应用拆分为小块，只在需要时才从服务器下载。为了让事情更简单，Vue.js 允许将组件定义为一个工厂函数，动态地解析组件的定义。Vue.js 只在组件需要渲染时触发工厂函数，并且把结果缓存起来，用于后面的再次渲染。例如：

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

工厂函数接收一个 `resolve` 回调，在收到从服务器下载的组件定义时调用。也可以调用 `reject(reason)` 指示加载失败。这里 `setTimeout` 只是为了演示。怎么获取组件完全由你决定。推荐配合使用 [Webpack 的代码分割功能](http://webpack.github.io/docs/code-splitting.html)：

``` js
Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 ajax 请求自动下载。
  require(['./my-async-component'], resolve)
})
```

### 资源命名约定

一些资源，如组件和指令，是以 HTML 特性或 HTML 自定义元素的形式出现在模板中。因为 HTML 特性的名字和标签的名字**不区分大小写**，所以资源的名字通常需使用 kebab-case 而不是 camelCase 的形式，这不大方便。

Vue.js 支持资源的名字使用 camelCase 或 PascalCase 的形式，并且在模板中自动将它们转为 kebab-case（类似于 prop 的命名约定）：

``` js
// 在组件定义中
components: {
  // 使用 camelCase 形式注册
  myComponent: { /*... */ }
}
```

``` html
<!-- 在模板中使用 kebab-case 形式 -->
<my-component></my-component>
```

[ES6 对象字面量缩写](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_6) 也没问题：

``` js
// PascalCase
import TextBox from './components/text-box';
import DropdownMenu from './components/dropdown-menu';

export default {
  components: {
    // 在模板中写作 <text-box> 和 <dropdown-menu>
    TextBox,
    DropdownMenu
  }
}
```

### 递归组件

组件在它的模板内可以递归地调用自己，不过，只有当它有 `name` 选项时才可以：

``` js
var StackOverflow = Vue.extend({
  name: 'stack-overflow',
  template:
    '<div>' +
      // 递归地调用它自己
      '<stack-overflow></stack-overflow>' +
    '</div>'
})
```

上面组件会导致一个错误 "max stack size exceeded"，所以要确保递归调用有终止条件。当使用 `Vue.component()` 全局注册一个组件时，组件 ID 自动设置为组件的 `name` 选项。

### 片断实例

在使用 `template` 选项时，模板的内容将替换实例的挂载元素。因而推荐模板的顶级元素始终是单个元素。

不这么写模板：

``` html
<div>root node 1</div>
<div>root node 2</div>
```

推荐这么写：

``` html
<div>
  I have a single root node!
  <div>node 1</div>
  <div>node 2</div>
</div>
```

下面几种情况会让实例变成一个**片断实例**：

1. 模板包含多个顶级元素。
2. 模板只包含普通文本。
3. 模板只包含其它组件（其它组件可能是一个片段实例）。
4. 模板只包含一个元素指令，如 `<partial>` 或 vue-router 的 `<router-view>`。
5. 模板根节点有一个流程控制指令，如 `v-if` 或 `v-for`。

这些情况让实例有未知数量的顶级元素，它将把它的 DOM 内容当作片断。片断实例仍然会正确地渲染内容。不过，它**没有**一个根节点，它的 `$el` 指向一个锚节点，即一个空的文本节点（在开发模式下是一个注释节点）。

但是更重要的是，**组件元素上的非流程控制指令，非 prop 特性和过渡将被忽略**，因为没有根元素供绑定：

``` html
<!-- 不可以，因为没有根元素 -->
<example v-show="ok" transition="fade"></example>

<!-- props 可以 -->
<example :prop="someData"></example>

<!-- 流程控制可以，但是不能有过渡 -->
<example v-if="ok"></example>
```

当然片断实例有它的用处，不过通常给组件一个根节点比较好。它会保证组件元素上的指令和特性能正确地转换，同时性能也稍微好些。

### 内联模板

如果子组件有 `inline-template` 特性，组件将把它的内容当作它的模板，而不是把它当作分发内容。这让模板更灵活。

``` html
<my-component inline-template>
  <p>These are compiled as the component's own template</p>
  <p>Not parent's transclusion content.</p>
</my-component>
```

但是 `inline-template` 让模板的作用域难以理解，并且不能缓存模板编译结果。最佳实践是使用 `template` 选项在组件内定义模板。
