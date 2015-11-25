---
title: 数据绑定语法
type: guide
order: 4
---

Vue.js 使用基于 DOM 的模板。这意味着所有的 Vue.js 模板是合法的、可解析的、使用一些特殊特性增强的 HTML。Vue 模板因而从根本上不同于基于字符串的模板，请记住这点。

## 插值

### 文本

数据绑定最基础的形式是文本插值，使用 "Mustache" 语法（双大括号）：

``` html
<span>Message: {{ msg }}</span>
```

Mustache 标签会被相应数据对象的 `msg` 属性的值替换。每当这个属性变化时它也会更新。

也可以是单次插值，数据变化时不更新：

``` html
<span>This will never change: {{* msg }}</span>
```

### 原生 HTML

双 Mustache 标签将数据解析为纯文本而不是 HTML。为了输出真的 HTML 字符串，需要用三 Mustache 标签：

``` html
<div>{{{ raw_html }}}</div>
```

内容以 HTML 字符串插入——数据绑定将被忽略。如果需要复用模板片断，应当使用 [partials](/api/#partial)。

<p class="tip">在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。记住，只对可信内容使用 HTML 插值，**永不**用于用户提交的内容。</p>

### HTML 属性 (Attributes)

Mustache 标签也可以用在 HTML 属性内：

``` html
<div id="item-{{ id }}"></div>
```

注意在 Vue.js 指令和特殊属性内不能用插值。不必担心，如果 Mustache 标签用错了地方 Vue.js 会给出警告。

## 绑定表达式

放在 Mustache 标签内的文本称为**绑定表达式**。在 Vue.js 中，一个绑定表达式包含一个 JavaScript 表达式以及随后一个或多个可选的过滤器。

### JavaScript 表达式

到目前为止，我们的模板只绑定到简单的属性键。不过实际上 Vue.js 在数据绑定内支持全功能的 JavaScript表达式：

``` html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}
```

这些表达式将在所属的 Vue 实例的作用域内计算。一个限制是每个绑定只能包含**单个表达式**，因此下面的语句是**无效**的：

``` html
<!-- 这是一个语句，不是一个表达式： -->
{{ var a = 1 }}

<!-- 流程控制也不可以，可使用三元表达式 -->
{{ if (ok) { return message } }}
```

### 过滤器 (Filter)

Vue.js 允许在表达式后添加可选的“过滤器”，以“管道符”指示：

``` html
{{ message | capitalize }}
```

这里我们将表达式 `message` 的值“管输”到内置的 `capitalize` 过滤器，这个过滤器其实只是一个 JavaScript 函数，返回大写化的值。Vue.js 提供数个内置过滤器，在后面我们会谈到如何开发自己的过滤器。

注意管道语法不是 JavaScript 语法，因此不能在表达式内使用过滤器，只能添加到表达式的后面。

过滤器可以串联：

``` html
{{ message | filterA | filterB }}
```

过滤器也可以接受参数：

``` html
{{ message | filterA 'arg1' arg2 }}
```

过滤器函数始终以表达式的值作为第一个参数。带引号的参数视为字符串，而不带引号的参数按表达式计算。这里，字符串 `'arg1'` 将传给过滤器作为第二个参数，表达式 `arg2` 的值在计算出来之后作为第三个参数。

## 指令 (Directives)

指令是特殊的带有前缀 `v-` 的属性。指令的值限定为**绑定表达式**，因此上面提到的 JavaScript 表达式及过滤器规则在这里也适用。一个指令的任务是在它的表达式的值变化时响应地应用特定行为到 DOM。我们来回看“概述”里的例子：

``` html
<p v-if="greeting">Hello!</p>
```

这里 `v-if` 指令将根据表达式 `greeting` 值的真假删除/插入 `<p>` 元素。

### 参数 (Arguments)

一些指令可以接受一个参数，以指令名字后面的冒号指示。例如，`v-bind` 指令用于响应地更新 HTML 特性：

``` html
<a v-bind:href="url"></a>
```

这里 `href` 是参数，它告诉 `v-bind` 指令将元素的 `href` 特性跟表达式 `url` 的值绑定。可能你已注意到可以用特性插值 `{% raw %}href="{{url}}"{% endraw %}` 获得同样的结果：这样没错，并且实际上这种属性插值会在 Vue 内部被转为 `v-bind` 绑定。

另一个例子是 `v-on` 指令，它用于监听 DOM 事件：

``` html
<a v-on:click="doSomething">
```

这里参数是被监听的事件的名字。我们也会详细说明事件绑定。

### 修饰符 (Modifiers)

修饰符是用半角句号`.`表示的特殊后缀，用于表示指令应当以特殊方式绑定。例如 `.literal` 修饰符告诉指令将它的值解析为一个字面字符串而不是一个表达式：

``` html
<a v-bind:href.literal="/a/b/c"></a>
```

当然，这似乎没有意义，因为我们只需要使用 `href="/a/b/c"` 而不必使用一个指令。这个例子只是为了演示语法。后面我们将看到修饰符更多的实践用法。

## 缩写

`v-` 前缀是一种标识模板中特定的 Vue 属性的视觉暗示。当你需要在一些现有的代码中应用动态行为时，这些标签十分有用。但你在使用一些常用指令的时候，你会感觉一直这么写实在是啰嗦。而且在构建单页应用时，Vue.js 会管理所有的模板，此时 `v-` 前缀也没那么重要了。因此Vue.js 为两个最常用的指令 `v-bind` 和 `v-on` 提供特别的缩写：

### `v-bind` 缩写

``` html
<!-- 完整语法 -->
<a v-bind:href="url"></a>

<!-- 缩写 -->
<a :href="url"></a>

<!-- 完整语法 -->
<button v-bind:disabled="someDynamicCondition">Button</button>

<!-- 缩写 -->
<button :disabled="someDynamicCondition">Button</button>
```

### `v-on` 缩写

``` html
<!-- 完整语法 -->
<a v-on:click="doSomething"></a>

<!-- 缩写 -->
<a @click="doSomething"></a>
```

它们看起来跟“合法”的 HTML 有点不同，但是它们在所有支持 Vue.js 的浏览器中都能被正确地解析，并且不会出现在最终渲染的标记中。缩写语法完全是可选的，不过等你更熟悉它之后，你可能会感激它。
