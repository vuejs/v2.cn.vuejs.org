---
title: Class 与 Style 绑定
type: guide
order: 6
---

数据绑定一个常见需求是操作元素的 class 列表和它的内联样式。因为它们都是 attribute，我们可以用 `v-bind` 处理它们：只需要计算出表达式最终的字符串。不过，字符串拼接麻烦又易错。因此，在 `v-bind` 用于 `class` 和 `style` 时，Vue.js 专门增强了它。表达式的结果类型除了字符串之外，还可以是对象或数组。

## 绑定 HTML Class

<p class="tip">尽管可以用 Mustache 标签绑定 class，比如 `{% raw %}class="{{ className }}"{% endraw %}`，但是我们不推荐这种写法和 `v-bind:class` 混用。两者只能选其一！</p>

### 对象语法

我们可以传给 `v-bind:class` 一个对象，以动态地切换 class。注意  `v-bind:class` 指令可以与普通的 `class` 特性共存：

``` html
<div class="static" v-bind:class="{ 'class-a': isA, 'class-b': isB }"></div>
```
``` js
data: {
  isA: true,
  isB: false
}
```

渲染为：

``` html
<div class="static class-a"></div>
```

当 `isA` 和 `isB` 变化时，class 列表将相应地更新。例如，如果 `isB` 变为 `true`，class 列表将变为 `"static class-a class-b"`。

你也可以直接绑定数据里的一个对象：

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  classObject: {
    'class-a': true,
    'class-b': false
  }
}
```

我们也可以在这里绑定一个返回对象的[计算属性](computed.html)。这是一个常用且强大的模式。

### 数组语法

我们可以把一个数组传给 `v-bind:class`，以应用一个 class 列表：

``` html
<div v-bind:class="[classA, classB]">
```
``` js
data: {
  classA: 'class-a',
  classB: 'class-b'
}
```

渲染为：

``` html
<div class="class-a class-b"></div>
```

如果你也想根据条件切换列表中的 class，可以用三元表达式：

``` html
<div v-bind:class="[classA, isB ? classB : '']">
```

此例始终添加 `classA`，但是只有在 `isB` 是 `true` 时添加 `classB` 。

不过，当有多个条件 class 时这样写有些繁琐。在 1.0.19+ 中，可以在数组语法中使用对象语法：

``` html
<div v-bind:class="[classA, { classB: isB, classC: isC }]">
```


## 绑定内联样式

### 对象语法

`v-bind:style` 的对象语法十分直观——看着非常像 CSS，其实它是一个 JavaScript 对象。CSS 属性名可以用驼峰式（camelCase）或短横分隔命名（kebab-case）：

``` html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```
``` js
data: {
  activeColor: 'red',
  fontSize: 30
}
```

<p class="tip">尽管可以用 v-bind:style 绑定 style，比如 `{ color: activeColor, fontSize: fontSize + 'px' }`。但是要注意， 如果css属性名称中包含`-`等特殊字符，css属性名称需要使用*单引号*，比如 `{'background-color': color}`。</p>

直接绑定到一个样式对象通常更好，让模板更清晰：

``` html
<div v-bind:style="styleObject"></div>
```
``` js
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```

同样的，对象语法常常结合返回对象的计算属性使用。

### 数组语法

`v-bind:style` 的数组语法可以将多个样式对象应用到一个元素上：

``` html
<div v-bind:style="[styleObjectA, styleObjectB]">
```

### 自动添加前缀

当 `v-bind:style` 使用需要厂商前缀的 CSS 属性时，如 `transform`，Vue.js 会自动侦测并添加相应的前缀。
