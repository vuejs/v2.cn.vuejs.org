---
title: 自定义指令
type: guide
order: 14
---

## 基础

除了内置指令，Vue.js 也允许注册自定义指令。自定义指令提供一种机制将数据的变化映射为 DOM 行为。

可以用 `Vue.directive(id, definition)` 方法注册一个全局自定义指令，它接收两个参数**指令 ID** 与**定义对象**。也可以用组件的 `directives` 选项注册一个局部自定义指令。

### 钩子函数

定义对象可以提供几个钩子函数（都是可选的）：

- **bind**：只调用一次，在指令第一次绑定到元素上时调用。

- **update**： 在 `bind` 之后立即以初始值为参数第一次调用，之后每当绑定值变化时调用，参数为新值与旧值。

- **unbind**：只调用一次，在指令从元素上解绑时调用。

**示例**

``` js
Vue.directive('my-directive', {
  bind: function () {
    // 准备工作
    // 例如，添加事件处理器或只需要运行一次的高耗任务
  },
  update: function (newValue, oldValue) {
    // 值更新时的工作
    // 也会以初始值为参数调用一次
  },
  unbind: function () {
    // 清理工作
    // 例如，删除 bind() 添加的事件监听器
  }
})
```

在注册之后，便可以在 Vue.js 模板中这样用（记着添加前缀 `v-`）：

``` html
<div v-my-directive="someValue"></div>
```

当只需要 `update` 函数时，可以传入一个函数替代定义对象：

``` js
Vue.directive('my-directive', function (value) {
  // 这个函数用作 update()
})
```

### 指令实例属性

所有的钩子函数将被复制到实际的**指令对象**中，钩子内 `this` 指向这个指令对象。这个对象暴露了一些有用的属性：

- **el**: 指令绑定的元素。
- **vm**: 拥有该指令的上下文 ViewModel。
- **expression**: 指令的表达式，不包括参数和过滤器。
- **arg**: 指令的参数。
- **name**: 指令的名字，不包含前缀。
- **modifiers**: 一个对象，包含指令的修饰符。
- **descriptor**: 一个对象，包含指令的解析结果。

<p class="tip">你应当将这些属性视为只读的，不要修改它们。你也可以给指令对象添加自定义属性，但是注意不要覆盖已有的内部属性。</p>

示例：

``` html
<div id="demo" v-demo:hello.a.b="msg"></div>
```

``` js
Vue.directive('demo', {
  bind: function () {
    console.log('demo bound!')
  },
  update: function (value) {
    this.el.innerHTML =
      'name - '       + this.name + '<br>' +
      'expression - ' + this.expression + '<br>' +
      'argument - '   + this.arg + '<br>' +
      'modifiers - '  + JSON.stringify(this.modifiers) + '<br>' +
      'value - '      + value
  }
})
var demo = new Vue({
  el: '#demo',
  data: {
    msg: 'hello!'
  }
})
```

**结果**

<div id="demo" v-demo:hello.a.b="msg"></div>
<script>
Vue.directive('demo', {
  bind: function () {
    console.log('demo bound!')
  },
  update: function (value) {
    this.el.innerHTML =
      'name - ' + this.name + '<br>' +
      'expression - ' + this.expression + '<br>' +
      'argument - ' + this.arg + '<br>' +
      'modifiers - '  + JSON.stringify(this.modifiers) + '<br>' +
      'value - ' + value
  }
})
var demo = new Vue({
  el: '#demo',
  data: {
    msg: 'hello!'
  }
})
</script>

### 对象字面量

如果指令需要多个值，可以传入一个 JavaScript 对象字面量。记住，指令可以使用任意合法的 JavaScript 表达式：

``` html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

``` js
Vue.directive('demo', function (value) {
  console.log(value.color) // "white"
  console.log(value.text) // "hello!"
})
```

### 字面修饰符

当指令使用了字面修饰符，它的值将按普通字符串处理并传递给 `update` 方法。`update` 方法将只调用一次，因为普通字符串不能响应数据变化。

``` html
<div v-demo.literal="foo bar baz">
```
``` js
Vue.directive('demo', function (value) {
  console.log(value) // "foo bar baz"
})
```

### 元素指令

有时我们想以自定义元素的形式使用指令，而不是以特性的形式。这与 Angular 的 “E” 指令非常相似。元素指令可以看做是一个轻量组件。可以像下面这样注册一个自定义元素指令：

``` js
Vue.elementDirective('my-directive', {
  // API 同普通指令
  bind: function () {
    // 操作 this.el...
  }
})
```

不这样写：

``` html
<div v-my-directive></div>
```

这样写：

``` html
<my-directive></my-directive>
```

元素指令不能接受参数或表达式，但是它可以读取元素的特性从而决定它的行为。

迥异于普通指令，元素指令是**终结性**的，这意味着，一旦 Vue 遇到一个元素指令，它将跳过该元素及其子元素——只有该元素指令本身可以操作该元素及其子元素。

## 高级选项

### params

自定义指令可以接收一个 `params` 数组，指定一个特性列表，Vue 编译器将自动提取绑定元素的这些特性。例如：

``` html
<div v-example a="hi"></div>
```
``` js
Vue.directive('example', {
  params: ['a'],
  bind: function () {
    console.log(this.params.a) // -> "hi"
  }
})
```

此 API 也支持动态属性。`this.params[key]` 会自动保持更新。另外，可以指定一个回调，在值变化时调用：

``` html
<div v-example v-bind:a="someValue"></div>
```
``` js
Vue.directive('example', {
  params: ['a'],
  paramWatchers: {
    a: function (val, oldVal) {
      console.log('a changed!')
    }
  }
})
```

<p class="tip">类似于 props，指令参数的名字在 JavaScript 中使用 camelCase 风格，在 HTML 中对应使用 kebab-case 风格。例如，假设在模板里有一个参数 `disable-effect`，在 JavaScript 里以 `disableEffect` 访问它。</p>

### deep

如果自定义指令用在一个对象上，当对象内部属性变化时要触发 `update`，则在指令定义对象中指定 `deep: true`。

``` html
<div v-my-directive="obj"></div>
```

``` js
Vue.directive('my-directive', {
  deep: true,
  update: function (obj) {
    // 在 `obj` 的嵌套属性变化时调用
  }
})
```

### twoWay

如果指令想向 Vue 实例写回数据，则在指令定义对象中指定 `twoWay: true` 。该选项允许在指令中使用 `this.set(value)`:

``` js
Vue.directive('example', {
  twoWay: true,
  bind: function () {
    this.handler = function () {
      // 将数据写回 vm
      // 如果指令这样绑定 v-example="a.b.c"
      // 它将用给定值设置 `vm.a.b.c`
      this.set(this.el.value)
    }.bind(this)
    this.el.addEventListener('input', this.handler)
  },
  unbind: function () {
    this.el.removeEventListener('input', this.handler)
  }
})
```

### acceptStatement

传入 `acceptStatement:true` 可以让自定义指令接受内联语句，就像 `v-on` 那样：

``` html
<div v-my-directive="a++"></div>
```

``` js
Vue.directive('my-directive', {
  acceptStatement: true,
  update: function (fn) {
    // 传入值是一个函数
    // 在调用它时将在所属实例作用域内计算 "a++" 语句
  }
})
```

明智地使用，因为通常你要在模板中避免副效应。

### terminal

> 1.0.19+

Vue 通过递归遍历 DOM 树来编译模块。但是当它遇到 **terminal** 指令时会停止遍历这个元素的后代元素。这个指令将接管编译这个元素及其后代元素的任务。`v-if` 和 `v-for` 都是 terminal 指令。

编写自定义 terminal 指令是一个高级话题，需要较好的理解 Vue 的编译流程，但这不是说不可能编写自定义 terminal 指令。用 `terminal: true` 指定自定义 terminal 指令，可能还需要用 `Vue.FragmentFactory` 来编译 partial。下面是一个自定义 terminal 指令，它编译它的内容模板并将结果注入到页面的另一个地方：

``` js
var FragmentFactory = Vue.FragmentFactory
var remove = Vue.util.remove
var createAnchor = Vue.util.createAnchor

Vue.directive('inject', {
  terminal: true,
  bind: function () {
    var container = document.getElementById(this.arg)
    this.anchor = createAnchor('v-inject')
    container.appendChild(this.anchor)
    remove(this.el)
    var factory = new FragmentFactory(this.vm, this.el)
    this.frag = factory.create(this._host, this._scope, this._frag)
    this.frag.before(this.anchor)
  },
  unbind: function () {
    this.frag.remove()
    remove(this.anchor)
  }
})
```

``` html
<div id="modal"></div>
...
<div v-inject:modal>
  <h1>header</h1>
  <p>body</p>
  <p>footer</p>
</div>
```

如果你想编写自定义 terminal 指令，建议你通读内置 terminal 指令的源码，如 `v-if` 和 `v-for`，以便更好地了解 Vue 的内部机制。

### priority

可以给指令指定一个优先级。如果没有指定，普通指令默认是 `1000`， terminal 指令默认是 `2000`。同一个元素上优先级高的指令会比其它指令处理得早一些。优先级一样的指令按照它在元素特性列表中出现的顺序依次处理，但是不能保证这个顺序在不同的浏览器中是一致的。

可以在 [API](/api/#指令) 中查看内置指令的优先级。另外，流程控制指令 `v-if` 和 `v-for` 在编译过程中始终拥有最高的优先级。
