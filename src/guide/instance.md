---
title: Vue 实例
type: guide
order: 3
---

## 构造器

每个 Vue.js 应用都是由 `Vue` 构造器创建的**根 Vue 实例**引导：

``` js
var vm = new Vue({
  // 选项
})
```

一个 Vue 实例不过是一个 [MVVM 模式](https://en.wikipedia.org/wiki/Model_View_ViewModel) 定义的 **ViewModel** ，因而你会看到变量名 `vm` 遍及整个文档。

在实例化 Vue 时，需要传入一个**选项对象**，它可以包含数据、模板、挂载元素、方法、生命周期钩子等选项。全部的选项可以在 API 文档中查看。

可以扩展 `Vue` 构造器，从而用预定义选项创建可复用的**组件构造器**：

``` js
var MyComponent = Vue.extend({
  // 扩展选项
})

// 所有的 `MyComponent` 实例都将以预定义的扩展选项创建
var myComponentInstance = new MyComponent()
```

尽管可以命令式地创建扩展实例，不过在多数情况下将组件构造器注册为一个自定义元素，然后声明式地用在模板中。我们将在后面详细说明组件系统。现在你只需知道所有的 Vue.js 组件都是扩展的 Vue 实例。

## 属性与方法

Vue 实例**代理**了 `data` 对象所有的属性：

``` js
var data = { a: 1 }
var vm = new Vue({
  data: data
})

vm.a === data.a // -> true

// 设置属性也会影响到原始数据
vm.a = 2
data.a // -> 2

// ... 反之亦然
data.a = 3
vm.a // -> 3
```

注意只有这些被代理的属性是**响应的**。如果在实例创建之后添加新的属性到实例上，它不会触发视图更新。我们将在后面详细讨论响应系统。

除了这些数据属性，Vue 实例暴露了一些有用的实例属性与方法。这些属性与方法有前缀  `$`，以便与代理的数据属性区分。例如：

``` js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // -> true
vm.$el === document.getElementById('example') // -> true

// $watch 是一个实例方法
vm.$watch('a', function (newVal, oldVal) {
  // 这个回调将在 `vm.a`  改变后调用
})
```

参考 API 文档查看全部的实例属性与方法。

## 实例生命周期

Vue 实例在创建时有一系列初始化步骤——例如，它需要建立数据观察，编译模板，创建必要的数据绑定。在此过程中，它也将调用一些**生命周期钩子**，给自定义逻辑提供运行机会。例如 `created`  钩子在实例创建后调用：

``` js
var vm = new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` 指向 vm 实例
    console.log('a is: ' + this.a)
  }
})
// -> "a is: 1"
```

也有一些其它的钩子，在实例生命周期的不同阶段调用，如 `compiled`、 `ready` 、`destroyed`。钩子的 `this` 指向调用它的 vm 实例。一些用户可能会问 Vue.js 是否有“控制器(Controller)”的概念？答案是，没有。组件的自定义逻辑可以分割在这些钩子中。

## 生命周期图示

下图说明了实例的生命周期。你不需要立马弄明白所有的东西，不过以后它会有帮助。

![Lifecycle](/images/lifecycle.png)
