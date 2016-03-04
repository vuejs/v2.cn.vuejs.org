---
title: 混合
type: guide
order: 16
---

## 基础

混合以一种灵活的方式为组件提供分布复用功能。混合对象可以包含任意的组件选项。当组件使用了混合对象时，混合对象的所有选项将被“混入”组件自己的选项中。

示例：

``` js
// 定义一个混合对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个组件，使用这个混合对象
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // -> "hello from mixin!"
```

## 选项合并

当混合对象与组件包含同名选项时，这些选项将以适当的策略合并。例如，同名钩子函数被并入一个数组，因而都会被调用。另外，混合的钩子将在组件自己的钩子**之前**调用。

``` js
var mixin = {
  created: function () {
    console.log('mixin hook called')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('component hook called')
  }
})

// -> "mixin hook called"
// -> "component hook called"
```

值为对象的选项，如 `methods`, `components` 和 `directives` 将合并到同一个对象内。如果键冲突则组件的选项优先。

``` js
var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('from mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('from self')
    }
  }
})

vm.foo() // -> "foo"
vm.bar() // -> "bar"
vm.conflicting() // -> "from self"
```

注意 `Vue.extend()` 使用同样的合并策略。

## 全局混合

也可以全局注册混合。小心使用！一旦全局注册混合，它会影响**所有**之后创建的 Vue 实例。如果使用恰当，可以为自定义选项注入处理逻辑：

``` js
// 为 `myOption` 自定义选项注入一个处理器
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!'
})
// -> "hello!"
```

<p class="tip">慎用全局混合，因为它影响到每个创建的 Vue 实例，包括第三方组件。在大多数情况下，它应当只用于自定义选项，就像上面示例一样。</p>

## 自定义选项合并策略

在合并自定义选项时，默认的合并策略是简单地覆盖已有值。如果想用自定义逻辑合并自定义选项，则向 `Vue.config.optionMergeStrategies` 添加一个函数：

``` js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // 返回 mergedVal
}
```

对于多数值为对象的选项，可以简单地使用 `methods` 所用的合并策略:

``` js
var strategies = Vue.config.optionMergeStrategies
strategies.myOption = strategies.methods
```
