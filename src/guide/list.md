---
title: 列表渲染
type: guide
order: 8
---

## v-for

可以使用 `v-for` 指令基于一个数组渲染一个列表。这个指令使用特殊的语法，形式为 `item in items`，`items` 是数据数组，`item` 是当前数组元素的**别名**：

**示例：**

``` html
<ul id="example-1">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>
```

``` js
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

**结果：**

{% raw %}
<ul id="example-1" class="demo">
  <li v-for="item in items">
    {{item.message}}
  </li>
</ul>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(null, '#example-1')
    }
  }
})
</script>
{% endraw %}

在 `v-for` 块内我们能完全访问父组件作用域内的属性，另有一个特殊变量 `$index`，正如你猜到的，它是当前数组元素的索引：

``` html
<ul id="example-2">
  <li v-for="item in items">
    {{ parentMessage }} - {{ $index }} - {{ item.message }}
  </li>
</ul>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

**结果：**

{% raw%}
<ul id="example-2" class="demo">
  <li v-for="item in items">
    {{ parentMessage }} - {{ $index }} - {{ item.message }}
  </li>
</ul>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  },
  watch: {
    items: function () {
      smoothScroll.animateScroll(null, '#example-2')
    }
  }
})
</script>
{% endraw %}

另外，你可以为索引指定一个别名（如果 `v-for` 用于一个对象，则可以为对象的键指定一个别名）：

``` html
<div v-for="(index, item) in items">
  {{ index }} {{ item.message }}
</div>
```

从 1.0.17 开始可以使用 `of` 分隔符，更接近 JavaScript 遍历器语法：

``` html
<div v-for="item of items"></div>
```

## template v-for

类似于 template `v-if`，也可以将 `v-for` 用在 `<template>` 标签上，以渲染一个包含多个元素的块。例如：

``` html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>
```

## 数组变动检测

### 变异方法

Vue.js 包装了被观察数组的变异方法，故它们能触发视图更新。被包装的方法有：

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

你可以打开浏览器的控制台，用这些方法修改上例的 `items` 数组。例如：`example1.items.push({ message: 'Baz' })`。

### 替换数组

变异方法，如名字所示，修改了原始数组。相比之下，也有非变异方法，如 `filter()`, `concat()` 和 `slice()`，不会修改原始数组而是返回一个新数组。在使用非变异方法时，可以直接用新数组替换旧数组：

``` js
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```

可能你觉得这将导致 Vue.js 弃用已有 DOM 并重新渲染整个列表——幸运的是并非如此。 Vue.js 实现了一些启发算法，以最大化复用 DOM 元素，因而用另一个数组替换数组是一个非常高效的操作。

### track-by

有时需要用全新对象（例如通过 API 调用创建的对象）替换数组。因为 `v-for` 默认通过数据对象的特征来决定对已有作用域和 DOM 元素的复用程度，这可能导致重新渲染整个列表。但是，如果每个对象都有一个唯一 ID 的属性，便可以使用 `track-by` 特性给 Vue.js 一个提示，Vue.js 因而能尽可能地复用已有实例。

例如，假定数据为：

``` js
{
  items: [
    { _uid: '88f869d', ... },
    { _uid: '7496c10', ... }
  ]
}
```

然后可以这样给出提示：

``` html
<div v-for="item in items" track-by="_uid">
  <!-- content -->
</div>
```

然后在替换数组 `items` 时，如果 Vue.js 遇到一个包含 `_uid: '88f869d'` 的新对象，它知道它可以复用这个已有对象的作用域与 DOM 元素。

### track-by $index

如果没有唯一的键供追踪，可以使用 `track-by="$index"`，它强制让 `v-for` 进入原位更新模式：片断不会被移动，而是简单地以对应索引的新值刷新。这种模式也能处理数据数组中重复的值。

这让数据替换非常高效，但是也会付出一定的代价。因为这时 DOM 节点不再映射数组元素顺序的改变，不能同步临时状态（比如 `<input>` 元素的值）以及组件的私有状态。因此，如果 `v-for` 块包含 `<input>` 元素或子组件，要小心使用 `track-by="$index"`

### 问题

因为 JavaScript 的限制，Vue.js **不能**检测到下面数组变化：

1. 直接用索引设置元素，如 `vm.items[0] = {}`；
2. 修改数据的长度，如 `vm.items.length = 0`。

为了解决问题 (1)，Vue.js 扩展了观察数组，为它添加了一个 `$set()` 方法：

``` js
// 与 `example1.items[0] = ...` 相同，但是能触发视图更新
example1.items.$set(0, { childMsg: 'Changed!'})
```

至于问题 (2)，只需用一个空数组替换 `items`。

除了 `$set()`， Vue.js 也为观察数组添加了 `$remove()` 方法，用于从目标数组中查找并删除元素，在内部它调用 `splice()` 。因此，不必这样：

``` js
var index = this.items.indexOf(item)
if (index !== -1) {
  this.items.splice(index, 1)
}
```

只用这样：

``` js
this.items.$remove(item)
```

#### 使用 `Object.freeze()`

在遍历一个数组时，如果数组元素是对象并且对象用 `Object.freeze()` 冻结，你需要明确指定 `track-by`。在这种情况下如果 Vue.js 不能自动追踪对象，将给出一条警告。

## 对象 v-for

也可以使用 `v-for` 遍历对象。除了 `$index` 之外，作用域内还可以访问另外一个特殊变量 `$key`。

``` html
<ul id="repeat-object" class="demo">
  <li v-for="value in object">
    {{ $key }} : {{ value }}
  </li>
</ul>
```

``` js
new Vue({
  el: '#repeat-object',
  data: {
    object: {
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30
    }
  }
})
```

**结果：**

{% raw %}
<ul id="repeat-object" class="demo">
  <li v-for="value in object">
    {{ $key }} : {{ value }}
  </li>
</ul>
<script>
new Vue({
  el: '#repeat-object',
  data: {
    object: {
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30
    }
  }
})
</script>
{% endraw %}

也可以给对象的键提供一个别名：

``` html
<div v-for="(key, val) in object">
  {{ key }} {{ val }}
</div>
```

<p class="tip">在遍历对象时，是按 `Object.keys()` 的结果遍历，但是不能保证它的结果在不同的 JavaScript 引擎下是一致的。</p>

## 值域 v-for

`v-for` 也可以接收一个整数，此时它将重复模板数次。

``` html
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```

结果：

{% raw %}
<div id="range" class="demo">
  <span v-for="n in 10">{{ n }} </span>
</div>
<script>
new Vue({ el: '#range' })
</script>
{% endraw %}

## 显示过滤/排序的结果

有时我们想显示过滤/排序过的数组，同时不实际修改或重置原始数据。有两个办法：

1. 创建一个计算属性，返回过滤/排序过的数组；
2. 使用内置的过滤器 `filterBy` 和 `orderBy`。

计算属性有更好的控制力，也更灵活，因为它是全功能 JavaScript。但是通常过滤器更方便，详细见 [API](/api/#filterBy)。
