---
title: 从 Vue 1.x 迁移
type: guide
order: 701
---

## FAQ

> 哇，非常长的一页！是否意味着 Vue 2.0 已经完全不同了呢，是否需要从头学起呢，Vue 1.0 的项目是不是没法迁移了？

非常开心地告诉你，并不是！几乎 90% 的 API 和核心概念都没有变。因为本节包含了很多详尽的阐述以及许多迁移的例子，所以显得有点长。不用担心，**你不必从头到尾把本节读一遍！**

> 我该从哪里开始项目迁移呢？

1. 首先，在当前项目下运行[迁移工具](https://github.com/vuejs/vue-migration-helper)。我们非常谨慎地把高级 Vue 升级过程简化为使用一个简单的命令行工具。当工具识别出旧有的特性后，就会告知你并给出建议，同时附上关于详细信息的链接。

2. 然后，浏览本页面的侧边栏列出的内容。如果发现有的标题对你的项目有影响，但是迁移工具没有给出提示，请检查自己的项目。

3. 如果你的项目有测试代码，运行并查看仍然失败的地方。如果没有测试代码，在浏览器中打开你的程序，通过导航环顾并留意那些报错或警告信息。

4. 现在，你的应用程序应该已彻底完成迁移。如果你渴望了解更多，可以阅读本页面剩余部分 - 或者从[介绍](index.html)部分，从头开始深入新的文档和改进过的指南。由于你已经熟悉一些核心概念，所以许多部分已经被删除掉。

> 将 Vue 1.x 版本的应用程序迁移到 2.0 要花多长时间？

这取决于几个因素：

- 取决于你应用程序的规模 (中小型的基本上一天内就可以搞定)。

- 取决于你分心和开始 2.0 最酷的新功能的次数。😉 &nbsp;无法判断时间，我们构建 2.0 应用的时候也经常发生这种事！

- 取决于你使用了哪些旧有的特性。大部分可以通过查找和替换 (find-and-replace) 来实现升级，但有一些可能还是要花点时间。如果你没有遵循最佳实践，Vue 2.0 会尽力强迫你去遵循。这有利于项目的长期运行，但也可能意味着重大重构 (尽管有些需要重构的部分可能已经过时)。

> 如果我升级到到 Vue 2 ，我还必须同时升级 Vuex 和 Vue Router？

只有 Vue Router 2 与 Vue 2 保持兼容，所以 Vue Router 是需要升级的，你必须遵循 [Vue Router 迁移方式](migration-vue-router.html)来处理。幸运的是，大多数应用没有很多 router 相关代码，所以迁移可能不会超过一个小时。

对于 Vuex ，版本 0.8+ 与 Vue 2 保持兼容，所以部分不必强制升级。可以促使你立即升级的唯一理由，是你想要使用那些 Vuex 2 中新的高级特性，比如模块 (modules) 和减少的样板文件 (reduced boilerplate)。

## 模板

### 片段实例 <sup>移除</sup>

每个组件必须只有一个根元素。不再允许片段实例，如果你有这样的模板：

``` html
<p>foo</p>
<p>bar</p>
```

最好把整个内容都简单包裹到一个新的元素里，如下所示：

``` html
<div>
  <p>foo</p>
  <p>bar</p>
</div>
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>升级后运行端到端测试套件 (end-to-end test suite) 或运行应用程序，并查看<strong>控制台警告 (console warnings)</strong> 来找出那些模板中有多个根元素的地方。
</div>
{% endraw %}

## 生命周期钩子函数

### `beforeCompile` <sup>移除</sup>

使用 `created` 钩子函数替代。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>在代码库中运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>来找出所有使用此钩子函数的示例。</p>
</div>
{% endraw %}

### `compiled` <sup>替换</sup>

使用 `mounted` 钩子函数替代。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>在代码库中运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>来找出所有使用此钩子函数的示例。</p>
</div>
{% endraw %}

### `attached` <sup>移除</sup>

使用其他钩子函数内置的 DOM 检测 (DOM check) 方法。例如，替换如下：

``` js
attached: function () {
  doSomething()
}
```

可以这样使用：

``` js
mounted: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>在代码库中运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>来找出所有使用此钩子函数的示例。</p>
</div>
{% endraw %}

### `detached` <sup>移除</sup>

使用其他钩子函数内的 DOM 检测 (DOM check) 方法。例如，替换如下：

``` js
detached: function () {
  doSomething()
}
```

可以这样使用：

``` js
destroyed: function () {
  this.$nextTick(function () {
    doSomething()
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>在代码库中运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>来找出所有使用此钩子函数的示例。</p>
</div>
{% endraw %}

### `init` <sup>重新命名</sup>

使用新的 `beforeCreate` 钩子函数替代，本质上 beforeCreate 和 init 完全相同。init 被重新命名是为了和其他的生命周期方法的命名方式保持一致。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>在代码库中运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>来找出所有使用此钩子函数的示例。</p>
</div>
{% endraw %}

### `ready` <sup>替换</sup>

使用新的 `mounted` 钩子函数替代。应该注意的是，使用 `mounted` 并不能保证钩子函数中的 this.$el 在 document 中。为此还应该引入 `Vue.nextTick`/`vm.$nextTick`。例如：

``` js
mounted: function () {
  this.$nextTick(function () {
    // 代码保证 this.$el 在 document 中
  })
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>在代码库中运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>来找出所有使用此钩子函数的示例。</p>
</div>
{% endraw %}

## `v-for`

### `v-for` 遍历数组时的参数顺序 <sup>变更</sup>

当包含 `index` 时，之前遍历数组时的参数顺序是 `(index, value)`。现在是 `(value, index)` ，来和 JavaScript 的原生数组方法 (例如 `forEach` 和 `map`) 保持一致。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>在代码库中运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>来找出那些使用旧有参数顺序的示例。注意，如果你将你的 index 参数命名为一些不通用的名字 (例如 <code>position</code> 或 <code>num</code>)，迁移工具将不会把它们标记出来。</p>
</div>
{% endraw %}

### `v-for` 遍历对象时的参数顺序 <sup>变更</sup>

当包含 `key` 时，之前遍历对象的参数顺序是 `(key, value)`。现在是 `(value, key)`，来和常见的对象迭代器 (例如 lodash) 保持一致。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>在代码库中运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>来找出那些使用旧有参数顺序的示例。注意，如果你将你的 key 参数命名为一些不通用的名字 (例如 <code>name</code> 或 <code>property</code>)，迁移工具将不会把它们标记出来。</p>
</div>
{% endraw %}

### `$index` and `$key` <sup>移除</sup>

已经移除了 `$index` 和 `$key` 这两个隐式声明变量，以便在 `v-for` 中显式定义。这可以使没有太多 Vue 开发经验的开发者更好地阅读代码，并且在处理嵌套循环时也能产生更清晰的行为。
{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>在代码库中运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>来找出使用这些移除变量的示例。如果你没有找到，也可以在<strong>控制台错误</strong>中查找 (例如 <code>Uncaught ReferenceError: $index is not defined</code>)。</p>
</div>
{% endraw %}

### `track-by` <sup>替换</sup>

`track-by` 已经替换为 `key`，它的工作方式与其他属性一样，没有 `v-bind` 或者 `:` 前缀，它会被作为一个字符串处理。多数情况下，你需要使用具有完整表达式的动态绑定 (dynamic binding) 来替换静态的 key。例如，替换：

{% codeblock lang:html %}
<div v-for="item in items" track-by="id">
{% endcodeblock %}

你现在应该写为：

{% codeblock lang:html %}
<div v-for="item in items" v-bind:key="item.id">
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>在代码库中运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>来找出那些使用<code>track-by</code>的示例。</p>
</div>
{% endraw %}

### `v-for` 范围值 <sup>变更</sup>

之前，`v-for="number in 10"` 的 `number` 从 0 开始到 9 结束，现在从 1 开始，到 10 结束。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>在代码库中使用正则 <code>/\w+ in \d+/</code>搜索。当出现在 <code>v-for</code> 中，请检查是否受到影响。</p>
</div>
{% endraw %}

## Props

### `coerce` Prop 的参数 <sup>移除</sup>

如果需要检查 prop 的值，创建一个内部的 computed 值，而不再在 props 内部去定义，例如：

``` js
props: {
  username: {
    type: String,
    coerce: function (value) {
      return value
        .toLowerCase()
        .replace(/\s+/, '-')
    }
  }
}
```

现在应该写为：

``` js
props: {
  username: String,
},
computed: {
  normalizedUsername: function () {
    return this.username
      .toLowerCase()
      .replace(/\s+/, '-')
  }
}
```

这样有一些好处：

- 你可以对保持原始 prop 值的操作权限。
- 通过给予验证后的值一个不同的命名，强制开发者使用显式申明。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找出包含 <code>coerce</code> 选项的实例。</p>
</div>
{% endraw %}

### `twoWay` Prop 的参数 <sup>移除</sup>

Props 现在只能单向传递。为了对父组件产生反向影响，子组件需要显式地传递一个事件而不是依赖于隐式地双向绑定。详见：

- [自定义组件事件](components.html#监听子组件事件)
- [自定义输入组件](components-custom-events.html#将原生事件绑定到组件) (使用组件事件)
- [全局状态管理](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>，找出含有 <code>twoWay</code> 参数的实例。</p>
</div>
{% endraw %}

### `v-bind` 的 `.once`和`.sync` 修饰符 <sup>移除</sup>

Props 现在只能单向传递。为了对父组件产生反向影响，子组件需要显式地传递一个事件而不是依赖于隐式地双向绑定。详见：

- [自定义组件事件](components.html#监听子组件事件)
- [自定义输入组件](components-custom-events.html#将原生事件绑定到组件) (使用组件事件)
- [全局状态管理](state-management.html)

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到使用 <code>.once</code> 和 <code>.sync</code> 修饰符的实例。</p>
</div>
{% endraw %}

### 修改 Props <sup>弃用</sup>

组件内修改 prop 是反模式 (不推荐的) 的。比如，先声明一个 prop ，然后在组件中通过 `this.myProp = 'someOtherValue'` 改变 prop 的值。根据渲染机制，当父组件重新渲染时，子组件的内部 prop 值也将被覆盖。

大多数情况下，改变 prop 值可以用以下选项替代：

- 通过 data 属性，用 prop 去设置一个 data 属性的默认值。
- 通过 computed 属性。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行端对端测试，查看关于 prop 修改的<strong>控制台警告信息</strong>。</p>
</div>
{% endraw %}

### 根实例的 Props <sup>替换</sup>

对于一个根实例来说 (比如：用 `new Vue({ ... })` 创建的实例)，只能用 `propsData` 而不是 `props` 。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行端对端测试，将会弹出 <strong>failed tests</strong> 来通知你使用 <code>props</code> 的根实例已经失效。</p>
</div>
{% endraw %}

## 计算属性

### `cache: false` <sup>弃用</sup>

在 Vue 未来的大版本中，计算属性的缓存验证将会被移除。把不缓存的计算属性转换为方法可以得到和之前相同的结果。

示例：

``` js
template: '<p>message: {{ timeMessage }}</p>',
computed: {
  timeMessage: {
    cache: false,
    get: function () {
      return Date.now() + this.message
    }
  }
}
```

或者使用组件方法：

``` js
template: '<p>message: {{ getTimeMessage() }}</p>',
methods: {
  getTimeMessage: function () {
    return Date.now() + this.message
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到 <code>cache: false</code> 的选项。</p>
</div>
{% endraw %}

## Built-In 指令

### `v-bind` 真/假值 <sup>变更</sup>

在2.0中使用 `v-bind` 时，只有 `null`, `undefined`，和 `false` 被看作是假。这意味着，`0` 和空字符串将被作为真值渲染。比如 `v-bind:draggable="''"` 将被渲染为 `draggable="true"`。

对于枚举属性，除了以上假值之外，字符串 `"false"` 也会被渲染为 `attr="false"`。

<p class="tip">注意，对于其它钩子函数 (如 `v-if` 和 `v-show`)，他们依然遵循 js 对真假值判断的一般规则。</p>

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行端到端测试，如果你 app 的任何部分有可能被这个升级影响到，将会弹出<strong>failed tests</strong></p>
</div>
{% endraw %}

### 用 `v-on` 监听原生事件 <sup>变更</sup>

  现在在组件上使用 `v-on` 只会监听自定义事件 (组件用 `$emit` 触发的事件)。如果要监听根元素的原生事件，可以使用 `.native` 修饰符，比如：

{% codeblock lang:html %}
<my-component v-on:click.native="doSomething"></my-component>
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行端对端测试，如果你 app 的任何部分有可能被这个升级影响到，将会弹出<strong>failed tests</strong> </p>
</div>
{% endraw %}

### 带有 `debounce` 的 `v-model`<sup>移除</sup>

Debouncing 曾经被用来控制 Ajax 请求及其它高耗任务的频率。Vue 中`v-model`的 `debounce` 属性参数使得在一些简单情况下非常容易实现这种控制。但实际上，这是控制了**状态更新**的频率，而不是控制高耗时任务本身。这是个微小的差别，但是会随着应用增长而显现出局限性。

例如在设计一个搜索提示时的局限性：

{% raw %}
<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.js"></script>
<div id="debounce-search-demo" class="demo">
  <input v-model="searchQuery" placeholder="Type something">
  <strong>{{ searchIndicator }}</strong>
</div>
<script>
new Vue({
  el: '#debounce-search-demo',
  data: {
    searchQuery: '',
    searchQueryIsDirty: false,
    isCalculating: false
  },
  computed: {
    searchIndicator: function () {
      if (this.isCalculating) {
        return '⟳ Fetching new results'
      } else if (this.searchQueryIsDirty) {
        return '... Typing'
      } else {
        return '✓ Done'
      }
    }
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true
      this.expensiveOperation()
    }
  },
  methods: {
    expensiveOperation: _.debounce(function () {
      this.isCalculating = true
      setTimeout(function () {
        this.isCalculating = false
        this.searchQueryIsDirty = false
      }.bind(this), 1000)
    }, 500)
  }
})
</script>
{% endraw %}

使用 `debounce` 参数，便无法观察 "Typing" 的状态。因为无法对输入状态进行实时检测。然而，通过将 `debounce` 与 Vue 解耦，可以仅仅只延迟我们想要控制的操作，从而避开这些局限性：

``` html
<!--
通过使用 lodash 或者其它库的 debounce 函数，
我们相信 debounce 实现是一流的，
并且可以随处使用它，不仅仅是在模板中。
-->
<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.js"></script>
<div id="debounce-search-demo">
  <input v-model="searchQuery" placeholder="Type something">
  <strong>{{ searchIndicator }}</strong>
</div>
```

``` js
new Vue({
  el: '#debounce-search-demo',
  data: {
    searchQuery: '',
    searchQueryIsDirty: false,
    isCalculating: false
  },
  computed: {
    searchIndicator: function () {
      if (this.isCalculating) {
        return '⟳ Fetching new results'
      } else if (this.searchQueryIsDirty) {
        return '... Typing'
      } else {
        return '✓ Done'
      }
    }
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true
      this.expensiveOperation()
    }
  },
  methods: {
    // 这是 debounce 实现的地方。
    expensiveOperation: _.debounce(function () {
      this.isCalculating = true
      setTimeout(function () {
        this.isCalculating = false
        this.searchQueryIsDirty = false
      }.bind(this), 1000)
    }, 500)
  }
})
```

这种方式的另外一个优点是：当包裹函数执行时间与延时时间相当时，将会等待较长时间。比如，当给出搜索建议时，要等待用户输入停止一段时间后才给出建议，这个体验非常差。其实，这时候更适合用 **throttling** 函数。因为现在你可以自由的使用类似 lodash 之类的库，所以很快就可以用 throttling 重构项目。

{% raw %}
<div class="upgrade-path">
  <h4>Upgrade Path</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找出使用 <code>debounce</code> 参数的 实例。</p>
</div>
{% endraw %}

### 使用 `lazy` 或者 `number` 参数的 `v-model` 。<sup>替换</sup>

`lazy` 和 `number` 参数现在以修饰符的形式使用，这样看起来更加清晰，而不是这样：

``` html
<input v-model="name" lazy>
<input v-model="age" type="number" number>
```

现在写成这样：

``` html
<input v-model.lazy="name">
<input v-model.number="age" type="number">
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到这些弃用参数。</p>
</div>
{% endraw %}

### 使用内联 `value`的`v-model`  <sup>移除</sup>

`v-model` 不再以内联 `value` 方式初始化的初值了，显然他将以实例的 data 相应的属性作为真正的初值。

这意味着以下元素：

``` html
<input v-model="text" value="foo">
```

在 data 选项中有下面写法的：

``` js
data: {
  text: 'bar'
}
```

将渲染 model 为 'bar' 而不是 'foo' 。同样，对 `<textarea>` 已有的值来说：

``` html
<textarea v-model="text">
  hello world
</textarea>
```

必须保证 `text` 初值为 "hello world"

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>升级后运行端对端测试，注意关于<code>v-model</code>内联参数的 <strong>console warnings</strong></p>
</div>
{% endraw %}

### `v-model` with `v-for` Iterated Primitive Values <sup>移除</sup>

像这样的写法将失效：

``` html
<input v-for="str in strings" v-model="str">
```

因为 `<input>` 将被编译成类似下面的 js 代码：

``` js
strings.map(function (str) {
  return createElement('input', ...)
})
```

这样，`v-model` 的双向绑定在这里就失效了。把 `str` 赋值给迭代器里的另一个值也没有用，因为它仅仅是函数内部的一个变量。

替代方案是，你可以使用对象数组，这样`v-model` 就可以同步更新对象里面的字段了，例如：

{% codeblock lang:html %}
<input v-for="obj in objects" v-model="obj.str">
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行测试，如果你的 app 有地方被这个更新影响到的话将会弹出<strong>failed tests</strong>提示。</p>
</div>
{% endraw %}

### 带有 `!important` 的`v-bind:style`  <sup>移除</sup>

这样写将失效：

``` html
<p v-bind:style="{ color: myColor + ' !important' }">hello</p>
```

如果确实需要覆盖其它的 `!important`，最好用字符串形式去写：

``` html
<p v-bind:style="'color: ' + myColor + ' !important'">hello</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper"> 迁移帮助工具。</a>找到含有 <code>!important</code> 的 style 绑定对象。</p>
</div>
{% endraw %}

### `v-el` 和`v-ref` <sup>替换</sup>

简单起见，`v-el` 和 `v-ref` 合并为一个 `ref` 属性了，可以在组件实例中通过 `$refs` 来调用。这意味着 `v-el:my-element` 将写成这样：`ref="myElement"`，`v-ref:my-component` 变成了这样：`ref="myComponent"`。绑定在一般元素上时，`ref` 指 DOM 元素，绑定在组件上时，`ref` 为一组件实例。
因为 `v-ref` 不再是一个指令了而是一个特殊的属性，它也可以被动态定义了。这样在和`v-for` 结合的时候是很有用的：

``` html
<p v-for="item in items" v-bind:ref="'item' + item.id"></p>
```

以前 `v-el`/`v-ref` 和 `v-for` 一起使用将产生一个 DOM 数组或者组件数组，因为没法给每个元素一个特定名字。现在你还仍然可以这样做，给每个元素一个同样的`ref`：

``` html
<p v-for="item in items" ref="items"></p>
```

和 1.x 中不同，`$refs` 不是响应的，因为它们在渲染过程中注册/更新。只有监听变化并重复渲染才能使它们响应。

另一方面，设计`$refs`主要是提供给 js 程序访问的，并不建议在模板中过度依赖使用它。因为这意味着在实例之外去访问实例状态，违背了 Vue 数据驱动的思想。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找出实例中的 <code>v-el</code> 和 <code>v-ref</code> 。</p>
</div>
{% endraw %}

### `v-show`后面使用`v-else` <sup>移除</sup>

`v-else` 不能再跟在 `v-show`后面使用。请在`v-if`的否定分支中使用`v-show`来替代。例如：

``` html
<p v-if="foo">Foo</p>
<p v-else v-show="bar">Not foo, but bar</p>
```

现在应该写出这样：

``` html
<p v-if="foo">Foo</p>
<p v-if="!foo && bar">Not foo, but bar</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找出实例中存在的 <code>v-else</code> 以及 <code>v-show</code>。</p>
</div>
{% endraw %}

## 自定义指令 <sup>简化</sup>

在新版中，指令的使用范围已经大大减小了：现在指令仅仅被用于低级的 DOM 操作。大多数情况下，最好是使用组件作为代码复用的抽象层。

显要的改变有如下几点：

- 指令不再拥有实例。意思是，在指令的钩子函数中不再拥有实例的 `this` 。替代的是，你可以在参数中接受你需要的任何数据。如果确实需要，可以通过 `el` 来访问实例。
- 类似 `acceptStatement` ，`deep` ，`priority` 等都已被弃用。为了替换`双向`指令，见 [示例](#双向过滤器-替换)。
- 现在有些钩子的意义和以前不一样了，并且多了两个钩子函数。

幸运的是，新钩子更加简单，更加容易掌握。详见 [自定义指令指南](custom-directive.html)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到定义指令的地方。在 helper 工具会把这些地方标记出来，因为很有可能这些地方需要重构。</p>
</div>
{% endraw %}

### 指令 `.literal` 修饰符 <sup>移除</sup>

`.literal` 修饰符已经被移除，为了获取一样的功能，可以简单地提供字符串修饰符作为值。

示例，如下更改：

``` html
<p v-my-directive.literal="foo bar baz"></p>
```

只是：

``` html
<p v-my-directive="'foo bar baz'"></p>
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到实例中使用 `.literal` 修饰符的地方。</p>
</div>
{% endraw %}

## 过渡

### `transition` 参数 <sup>替换</sup>

Vue 的过渡系统有了彻底的改变，现在通过使用 `<transition>` 和 `<transition-group>` 来包裹元素实现过渡效果，而不再使用 `transition` 属性。详见 [Transitions guide](transitions.html)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到使用 <code>transition</code> 属性的地方。</p>
</div>
{% endraw %}

### 可复用的过渡 `Vue.transition` <sup>替换</sup>

在新的过渡系统中，可以[通过模板复用过渡效果](transitions.html#Reusable-Transitions)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到使用 <code>transition</code> 属性的地方。</p>
</div>
{% endraw %}

### 过渡的 `stagger` 参数 <sup>移除</sup>

如果希望在列表渲染中使用渐近过渡，可以通过设置元素的 `data-index`  (或类似属性) 来控制时间。请参考[这个例子](transitions.html#列表的渐进过渡)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到使用 <code>transition</code> 属性的地方。升级期间，你可以“过渡”到新的过渡策略。</p>
</div>
{% endraw %}

## 事件

### `events` 选项 <sup>移除</sup>

`events` 选项被弃用。事件处理器现在在 `created` 钩子中被注册。参考详细示例 [`$dispatch` and `$broadcast` 迁移指南](#dispatch-和-broadcast-替换)

### `Vue.directive('on').keyCodes` <sup>替换</sup>

新的简明配置 `keyCodes` 的方式是通过 `Vue.config.keyCodes`例如：

``` js
// v-on:keyup.f1 不可用
Vue.config.keyCodes.f1 = 112
```
{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到过时的 <code>keyCode</code> 配置</p>
</div>
{% endraw %}

### `$dispatch` 和 `$broadcast` <sup>替换</sup>

`$dispatch` 和 `$broadcast` 已经被弃用。请使用更多简明清晰的组件间通信和更好的状态管理方案，如：[Vuex](https://github.com/vuejs/vuex)。

因为基于组件树结构的事件流方式实在是让人难以理解，并且在组件结构扩展的过程中会变得越来越脆弱。这种事件方式确实不太好，我们也不希望在以后让开发者们太痛苦。并且`$dispatch` 和 `$broadcast` 也没有解决兄弟组件间的通信问题。

对于`$dispatch` 和 `$broadcast`最简单的升级方式就是：通过使用事件中心，允许组件自由交流，无论组件处于组件树的哪一层。由于 Vue 实例实现了一个事件分发接口，你可以通过实例化一个空的 Vue 实例来实现这个目的。

这些方法的最常见用途之一是父子组件的相互通信。在这些情况下，你可以使用 [`v-on`监听子组件上 $emit 的变化](components-custom-events.html#将原生事件绑定到组件)。这可以允许你很方便的添加事件显性。

然而，如果是跨多层父子组件通信的话，`$emit` 并没有什么用。相反，用集中式的事件中间件可以做到简单的升级。这会让组件之间的通信非常顺利，即使是兄弟组件。因为 Vue 通过事件发射器接口执行实例，实际上你可以使用一个空的 Vue 实例。

比如，假设我们有个 todo 的应用结构如下：

```
Todos
├─ NewTodoInput
└─ Todo
   └─ DeleteTodoButton
```

可以通过单独的事件中心管理组件间的通信：

``` js
// 将在各处使用该事件中心
// 组件通过它来通信
var eventHub = new Vue()
```

然后在组件中，可以使用 `$emit`, `$on`, `$off` 分别来分发、监听、取消监听事件：

``` js
// NewTodoInput
// ...
methods: {
  addTodo: function () {
    eventHub.$emit('add-todo', { text: this.newTodoText })
    this.newTodoText = ''
  }
}
```

``` js
// DeleteTodoButton
// ...
methods: {
  deleteTodo: function (id) {
    eventHub.$emit('delete-todo', id)
  }
}
```

``` js
// Todos
// ...
created: function () {
  eventHub.$on('add-todo', this.addTodo)
  eventHub.$on('delete-todo', this.deleteTodo)
},
// 最好在组件销毁前
// 清除事件监听
beforeDestroy: function () {
  eventHub.$off('add-todo', this.addTodo)
  eventHub.$off('delete-todo', this.deleteTodo)
},
methods: {
  addTodo: function (newTodo) {
    this.todos.push(newTodo)
  },
  deleteTodo: function (todoId) {
    this.todos = this.todos.filter(function (todo) {
      return todo.id !== todoId
    })
  }
}
```

在简单的情况下这样做可以替代 `$dispatch` 和 `$broadcast`，但是对于大多数复杂情况，更推荐使用一个专用的状态管理层如：[Vuex](https://github.com/vuejs/vuex)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找出使用 <code>$dispatch</code> 和 <code>$broadcast</code>的实例。</p>
</div>
{% endraw %}

## 过滤器

### 插入文本之外的过滤器 <sup>移除</sup>

现在过滤器只能用在插入文本中 (`{% raw %}{{ }}{% endraw %}` tags)。我们发现在指令 (如：`v-model`，`v-on`等) 中使用过滤器使事情变得更复杂。像`v-for` 这样的列表过滤器最好把处理逻辑作为一个计算属性放在 js 里面，这样就可以在整个模板中复用。

总之，能在原生 js 中实现的东西，我们尽量避免引入一个新的符号去重复处理同样的问题。下面是如何替换 Vue 内置过滤器：

#### 替换 `debounce` 过滤器

不再这样写

``` html
<input v-on:keyup="doStuff | debounce 500">
```

``` js
methods: {
  doStuff: function () {
    // ...
  }
}
```

请使用 [lodash's `debounce`](https://lodash.com/docs/4.15.0#debounce) (也有可能是 [`throttle`](https://lodash.com/docs/4.15.0#throttle)) 来直接控制高耗任务。可以这样来实现上面的功能：

``` html
<input v-on:keyup="doStuff">
```

``` js
methods: {
  doStuff: _.debounce(function () {
    // ...
  }, 500)
}
```

这种写法的更多优点详见：[`v-model` 示例](#带有-debounce-的-v-model 移除)。

#### 替换 `limitBy` 过滤器

不再这样写：

``` html
<p v-for="item in items | limitBy 10">{{ item }}</p>
```

在 computed 属性中使用 js 内置方法：[`.slice` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Examples)：

``` html
<p v-for="item in filteredItems">{{ item }}</p>
```

``` js
computed: {
  filteredItems: function () {
    return this.items.slice(0, 10)
  }
}
```

#### 替换 `filterBy` 过滤器

不再这样写：

``` html
<p v-for="user in users | filterBy searchQuery in 'name'">{{ user.name }}</p>
```

在 computed 属性中使用 js 内置方法 [`.filter` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Examples)：

``` html
<p v-for="user in filteredUsers">{{ user.name }}</p>
```

``` js
computed: {
  filteredUsers: function () {
    var self = this
    return self.users.filter(function (user) {
      return user.name.indexOf(self.searchQuery) !== -1
    })
  }
}
```

js 原生的 `.filter` 同样能实现很多复杂的过滤器操作，因为可以在计算 computed 属性中使用所有 js 方法。比如，想要通过匹配用户名字和电子邮箱地址 (不区分大小写) 找到用户：

``` js
var self = this
self.users.filter(function (user) {
  var searchRegex = new RegExp(self.searchQuery, 'i')
  return user.isActive && (
    searchRegex.test(user.name) ||
    searchRegex.test(user.email)
  )
})
```

#### 替换 `orderBy` 过滤器

不这样写：

``` html
<p v-for="user in users | orderBy 'name'">{{ user.name }}</p>
```

而是在 computed 属性中使用 [lodash's `orderBy`](https://lodash.com/docs/4.15.0#orderBy) (或者可能是 [`sortBy`](https://lodash.com/docs/4.15.0#sortBy))：

``` html
<p v-for="user in orderedUsers">{{ user.name }}</p>
```

``` js
computed: {
  orderedUsers: function () {
    return _.orderBy(this.users, 'name')
  }
}
```

甚至可以字段排序：

{% codeblock lang:js %}
_.orderBy(this.users, ['name', 'last_login'], ['asc', 'desc'])
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到指令中使用的过滤器。如果有些没找到，看看<strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

### 过滤器参数符号 <sup>变更</sup>

现在过滤器参数形式可以更好地与 js 函数调用方式一致，因此不用再用空格分隔参数：

``` html
<p>{{ date | formatDate 'YY-MM-DD' timeZone }}</p>
```

现在用圆括号括起来并用逗号分隔：

``` html
<p>{{ date | formatDate('YY-MM-DD', timeZone) }}</p>
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到老式的调用符号，如果有遗漏，请看<strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

### 内置文本过滤器 <sup>移除</sup>

尽管插入文本内部的过滤器依然有效，但是所有内置过滤器已经移除了。取代的是，推荐在每个区域使用更专业的库来解决。(比如用 [`date-fns`](https://date-fns.org/) 来格式化日期，用 [`accounting`](https://openexchangerates.github.io/accounting.js/) 来格式化货币)。

对于每个内置过滤器，我们大概总结了下该怎么替换。代码示例可能写在自定义 helper 函数，方法或计算属性中。

#### 替换 `json` 过滤器

不用一个个改，因为 Vue 已经帮你自动格式化好了，无论是字符串，数字还是数组，对象。如果想用 js 的 `JSON.stringify` 功能去实现，你也可以把它写在方法或者计算属性里面。

#### 替换 `capitalize` 过滤器

``` js
text[0].toUpperCase() + text.slice(1)
```

#### 替换 `uppercase` 过滤器

``` js
text.toUpperCase()
```

#### 替换 `lowercase` 过滤器

``` js
text.toLowerCase()
```

#### 替换 `pluralize` 过滤器

NPM 上的 [pluralize](https://www.npmjs.com/package/pluralize) 库可以很好的实现这个功能。如果仅仅想将特定的词格式化成复数形式或者想给特定的值 ('0') 指定特定的输出，也可以很容易地自定义复数格式化过滤器：

``` js
function pluralizeKnife (count) {
  if (count === 0) {
    return 'no knives'
  } else if (count === 1) {
    return '1 knife'
  } else {
    return count + 'knives'
  }
}
```

#### Replacing the `currency` Filter

对于简单的问题，可以这样做：

{% codeblock lang:js %}
'$' + price.toFixed(2)
{% endcodeblock %}

大多数情况下，仍然会有奇怪的现象 (比如 `0.035.toFixed(2)` 向上取舍得到 `0.04`，但是 `0.045` 向下取舍却也得到 `0.04`)。解决这些问题可以使用 [`accounting`](https://openexchangerates.github.io/accounting.js/) 库来实现更多可靠的货币格式化。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到舍弃的过滤器。如果有些遗漏，请参考<strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

### 双向过滤器 <sup>替换</sup>

有些用户已经乐于通过 `v-model` 使用双向过滤器，以很少的代码创建有趣的输入。尽管表面上很*简单*，双向过滤器也会暗藏一些巨大的复杂性——甚至促使状态更新变得迟钝影响用户体验。推荐用包裹一个输入的组件取而代之，这样以更显性且功能更丰富的方式创建自定义的输入。

我们现在做一次双向汇率过滤器的迁移作为示范：

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/6744xnjk/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

它基本工作良好，但是拖延的状态更新会导致奇怪的行为。比如，点击 `Result` 标签，试着在其中一个输入框中输入 `9.999`。当输入框失去焦点的时候，其值将会更新到 `$10.00`。然而当我们从整个计算器的角度看时，你会发现存储的数据是 `9.999`。用户看到的已经不是真实的同步了！

为了过渡到一个更加健壮的 Vue 2.0 的方案，让我们首先在一个新的 `<currency-input>` 组件中包裹这个过滤器：

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/943zfbsh/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

它允许我们添加独立过滤器无法封装的行为，比如选择输入框聚焦的内容。下一步我们从过滤器中提取业务逻辑。接下来是我们把所有的东西放到一个外部的 [`currencyValidator` 对象](https://gist.github.com/chrisvfritz/5f0a639590d6e648933416f90ba7ae4e)中：

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/9c32kev2/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

这会更加模块化，不只是更容易的迁移到 Vue 2，同时也允许汇率间隙和格式化：

- 从你的 Vue 代码中独立出来进行单元测试
- 在你的应用程序的别的部分中使用，比如验证验证一个 API 端的负荷

把这个验证器提取出来之后，我们也可以更舒适的把它构建到更健壮的解决方案中。那些古怪的状态也消除了，用户不再可能会输入错误，就像浏览器原生的数字输入框一样。

然而在 Vue 1.0 的过滤器中，我们仍然是受限的，所以还是完全升级到 Vue 2.0 吧：

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

你可能注意到了：

- 我们的输入框的各方面都更显性，使用生命周期钩子和 DOM 事件以替代双向过滤器的隐藏行为。
- 我们现在可以在自定义输入框中直接使用 `v-model`，其不只是固定配合正常的输入框来使用，这也意味着我们的组件是对 Vuex 友好的。
- 因为我们已经不再要求过滤器选项必须要有一个返回值，所以实际上我们的汇率工作可以异步完成。这意味着如果我们有很多应用需要和汇率打交道，我们可以轻松的提炼这个逻辑并成为一个共享的微服务。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到在例如 <code>v-model</code> 的指令中使用过滤器的例子。如果你错过了，则应该会收到<strong>命令行报错</strong>。</p>
</div>
{% endraw %}

## 插槽

### 重名的插槽 <sup>移除</sup>

同一模板中的重名 `<slot>` 已经弃用。当一个插槽已经被渲染过了，那么就不能在同一模板其它地方被再次渲染了。如果要在不同位置渲染同一内容，可以用 prop 来传递。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>更新后运行测试，查看<strong>控制台警告信息</strong> 关于重名 slots 的提示 <code>v-model</code>。</p>
</div>
{% endraw %}

### `slot` 样式参数 <sup>移除</sup>

通过具名 `<slot>` 插入的片段不再保持 `slot` 的参数。请用一个包裹元素来控制样式。或者用更高级方法：通过编程方式修改内容 ：[render functions](render-function.html)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到选择 slots 标签 CSS 选择器 (例如：<code>[slot="my-slot-name"]</code>)。</p>
</div>
{% endraw %}

## 特殊属性

### `keep-alive` 属性 <sup>替换</sup>

`keep-alive` 不再是一个特殊属性而是一个包裹组件，类似于 `<transition>`比如：

``` html
<keep-alive>
  <component v-bind:is="view"></component>
</keep-alive>
```

这样可以在含多种状态子组件中使用 `<keep-alive>` ：

``` html
<keep-alive>
  <todo-list v-if="todos.length > 0"></todo-list>
  <no-todos-gif v-else></no-todos-gif>
</keep-alive>
```

<p class="tip">当 `<keep-alive>` 含有不同子组件时，应该分别影响到每一个子组件。不仅是第一个而是所有的子组件都将被忽略。</p>

和 `<transition>`一起使用时，确保把内容包裹在内：

``` html
<transition>
  <keep-alive>
    <component v-bind:is="view"></component>
  </keep-alive>
</transition>
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到<code>keep-alive</code> 属性。</p>
</div>
{% endraw %}

## 计算插值

### 属性内部的计算插值 <sup>移除</sup>

属性内部的计算插值已经不能再使用了：

``` html
<button class="btn btn-{{ size }}"></button>
```

应该写成行内表达式：

``` html
<button v-bind:class="'btn btn-' + size"></button>
```

或者计算属性：

``` html
<button v-bind:class="buttonClasses"></button>
```

``` js
computed: {
  buttonClasses: function () {
    return 'btn btn-' + size
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到属性内部的计算插值</p>
</div>
{% endraw %}

### HTML 计算插值 <sup>移除</sup>

HTML 的计算插值 (`{% raw %}{{{ foo }}}{% endraw %}`) 已经移除，取代的是 [`v-html` 指令](../api/#v-html)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到 HTML 计算插值。</p>
</div>
{% endraw %}

### 单次绑定<sup>替换</sup>

单次绑定 (`{% raw %}{{* foo }}{% endraw %}`) 已经被新的 [`v-once` directive](../api/#v-once) 取代。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到单次绑定使用位置。</p>
</div>
{% endraw %}

## 响应

### `vm.$watch` <sup>changed</sup>

通过 `vm.$watch`创建的观察器现在将在组件渲染时被激活。这样可以让你在组件渲染前更新状态，不用做不必要的更新。比如可以通过观察组件的 prop 变化来更新组件本身的值。

如果以前通过 `vm.$watch` 在组件更新后与 DOM 交互，现在就可以通过`updated`生命周期钩子来做这些。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行测试，如果有依赖于老方法的观察器将弹出 <strong>failed tests</strong>。</p>
</div>
{% endraw %}

### `vm.$set` <sup>变更</sup>

 `vm.$set` 只是 [`Vue.set`](../api/#Vue-set) 的别名。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到过时的用法</p>
</div>
{% endraw %}

### `vm.$delete` <sup>变更</sup>

`vm.$delete` 现在只是：[`Vue.delete`](../api/#Vue-delete) 别名。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到过时的用法</p>
</div>
{% endraw %}

### `Array.prototype.$set`  <sup>弃用</sup>

用 `Vue.set` 替代

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到数组上的<code>.$set</code>。如有遗漏请参考<strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

### `Array.prototype.$remove` <sup>移除</sup>

用 `Array.prototype.splice` 替代，例如：

``` js
methods: {
  removeTodo: function (todo) {
    var index = this.todos.indexOf(todo)
    this.todos.splice(index, 1)
  }
}
```

或者更好的方法，直接给除去的方法一个 index 参数：

``` js
methods: {
  removeTodo: function (index) {
    this.todos.splice(index, 1)
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到数组上的<code>.$remove</code>。如有遗漏请参考<strong>控制台错误信息</strong></p>
</div>
{% endraw %}

### Vue 实例上的`Vue.set` 和 `Vue.delete`<sup>移除</sup>

`Vue.set` 和 `Vue.delete` 在实例上将不再起作用。现在都强制在实例的 data 选项中声明所有顶级响应值。如果删除实例属性或实例`$data`上的某个值，直接将它设置为 null 即可。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到实例中的 <code>Vue.set</code> 或 <code>Vue.delete</code> 。如有遗漏请参考<strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

### 替换 `vm.$data` <sup>移除</sup>

现在禁止替换实例的 $data。这样防止了响应系统的一些极端情况并且让组件状态更加可控可预测 (特别是对于存在类型检查的系统)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到覆盖 <code>vm.$data</code>的位置。如有遗漏请参考<strong>控制台警告信息</strong>。</p>
</div>
{% endraw %}

### `vm.$get` <sup>移除</sup>

可以直接取回响应数据。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到 <code>vm.$get</code> 的位置。如有遗漏请参考 <strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

## 围绕 DOM 的实例方法

### `vm.$appendTo` <sup>移除</sup>

使用 DOM 原生方法：

{% codeblock lang:js %}
myElement.appendChild(vm.$el)
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到 <code>vm.$appendTo</code> 的位置。如果有遗漏可以参考<strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

### `vm.$before` <sup>移除</sup>

使用 DOM 原生方法：

{% codeblock lang:js %}
myElement.parentNode.insertBefore(vm.$el, myElement)
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到 <code>vm.$before</code>。如有遗漏，请参考 <strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

### `vm.$after` <sup>移除</sup>

使用 DOM 原生方法：

{% codeblock lang:js %}
myElement.parentNode.insertBefore(vm.$el, myElement.nextSibling)
{% endcodeblock %}

如果 `myElement` 是最后一个节点也可以这样写：

{% codeblock lang:js %}
myElement.parentNode.appendChild(vm.$el)
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到 <code>vm.$after</code> 的位置。如有遗漏，请参考<strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

### `vm.$remove` <sup>移除</sup>

使用 DOM 原生方法：

{% codeblock lang:js %}
vm.$el.remove()
{% endcodeblock %}

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到<code>vm.$remove</code>。如有遗漏，请参考<strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

## 底层实例方法

### `vm.$eval` <sup>移除</sup>

尽量不要使用，如果必须使用该功能并且不肯定如何使用请参考 [the forum](https://forum.vuejs.org/)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到使用 <code>vm.$eval</code> 的位置。如有遗漏请参考<strong>控制台错误信息</strong>。</p>
</div>
{% endraw %}

### `vm.$interpolate` <sup>移除</sup>

尽量不要使用，如果必须使用该功能并且不肯定如何使用请参考 [the forum](https://forum.vuejs.org/)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到<code>vm.$interpolate</code>。如有遗漏请参考<strong>控制台错误信息</strong>.</p>
</div>
{% endraw %}

### `vm.$log` <sup>移除</sup>

请使用 [Vue Devtools](https://github.com/vuejs/vue-devtools) 感受最佳 debug 体验。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到 <code>vm.$log</code>。如有遗漏请参考<strong>控制台错误信息</strong>.</p>
</div>
{% endraw %}

## 实例 DOM 选项

### `replace: false` <sup>移除</sup>

现在组件总是会替换掉他们被绑定的元素。为了模仿`replace: false`的行为，可以用一个和将要替换元素类似的元素将根组件包裹起来：

``` js
new Vue({
  el: '#app',
  template: '<div id="app"> ... </div>'
})
```

或者使用渲染函数：

``` js
new Vue({
  el: '#app',
  render: function (h) {
    h('div', {
      attrs: {
        id: 'app',
      }
    }, /* ... */)
  }
})
```

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到 <code>replace: false</code>使用的位置。</p>
</div>
{% endraw %}

## 全局配置

### `Vue.config.debug` <sup>移除</sup>

不再需要，因为警告信息将默认在堆栈信息里输出。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到包含<code>Vue.config.debug</code>的地方。</p>
</div>
{% endraw %}

### `Vue.config.async` <sup>移除</sup>

异步操作现在需要渲染性能的支持。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行 <a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到使用<code>Vue.config.async</code>的实例。</p>
</div>
{% endraw %}

### `Vue.config.delimiters` <sup>替换</sup>

以[模板选项](../api/#delimiters)的方式使用。这样可以在使用自定义分隔符时避免影响第三方模板。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到使用<code>Vue.config.delimiters</code>的实例。</p>
</div>
{% endraw %}

### `Vue.config.unsafeDelimiters` <sup>移除</sup>

HTML 插值[替换为 `v-html`](#HTML-计算插值-移除)。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到 <code>Vue.config.unsafeDelimiters</code>。然后 helper 工具也会找到 HTML 插入的实例，可以用`v-html`来替换。</p>
</div>
{% endraw %}

## 全局 API

### 带 `el` 的 `Vue.extend` <sup>移除</sup>

el 选项不再在 `Vue.extend`中使用。仅在实例创建参数中可用。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>更新后运行测试在<strong>控制台警告信息</strong>中找到关于带有<code>Vue.extend</code>的<code>el</code>。</p>
</div>
{% endraw %}

### `Vue.elementDirective` <sup>移除</sup>

用组件来替代

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到包含<code>Vue.elementDirective</code>的实例。</p>
</div>
{% endraw %}

### `Vue.partial` <sup>移除</sup>

Partials 已被移除，取而代之的是更明确的组件之间的数据流--props。除非你正在使用一个部分性能关键型区域，否则建议只使用一个 [normal component](components.html) 来代替。如果你是动态绑定部分的 `name`，您可以使用 [dynamic component](components.html#动态组件)。

如果你碰巧在你的应用程序的性能关键部分使用 partials，那么你应该升级到[函数式组件](render-function.html#函数式组件)。它们必须在纯 JS / JSX 文件中 (而不是在 `.vue` 文件中)，并且是无状态的和无实例的，就像 partials。这使得渲染极快。

函数式组件相对于 partials 一个好处是它们可以更具动态性，因为它们允许您访问 JavaScript 的全部功能。然而，这是有成本的。如果你从来没有使用过渲染式的组件框架，你可能需要花费更长的时间来学习它们。

{% raw %}
<div class="upgrade-path">
  <h4>升级方式</h4>
  <p>运行<a href="https://github.com/vuejs/vue-migration-helper">迁移工具</a>找到包含 <code>Vue.partial</code>的实例</p>
</div>
{% endraw %}
