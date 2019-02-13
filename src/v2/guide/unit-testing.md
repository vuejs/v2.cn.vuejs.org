---
title: 单元测试
type: guide
order: 402
---

> [Vue CLI](https://cli.vuejs.org/zh/) 拥有开箱即用的通过 [Jest](https://github.com/facebook/jest) 或 [Mocha](https://mochajs.org/) 进行单元测试的内置选项。我们还有官方的 [Vue Test Utils](https://vue-test-utils.vuejs.org/zh/) 提供更多详细的指引和自定义设置。

## 简单的断言

你不必为了可测性在组件中做任何特殊的操作，导出原始设置就可以了：

``` html
<template>
  <span>{{ message }}</span>
</template>

<script>
  export default {
    data () {
      return {
        message: 'hello!'
      }
    },
    created () {
      this.message = 'bye!'
    }
  }
</script>
```

然后随着 Vue 导入组件的选项，你可以使用许多常见的断言 (这里我们使用的是 Jasmine/Jest 风格的 `expect` 断言作为示例)：

``` js
// 导入 Vue.js 和组件，进行测试
import Vue from 'vue'
import MyComponent from 'path/to/MyComponent.vue'

// 这里是一些 Jasmine 2.0 的测试，你也可以使用你喜欢的任何断言库或测试工具。

describe('MyComponent', () => {
  // 检查原始组件选项
  it('has a created hook', () => {
    expect(typeof MyComponent.created).toBe('function')
  })

  // 评估原始组件选项中的函数的结果
  it('sets the correct default data', () => {
    expect(typeof MyComponent.data).toBe('function')
    const defaultData = MyComponent.data()
    expect(defaultData.message).toBe('hello!')
  })

  // 检查 mount 中的组件实例
  it('correctly sets the message when created', () => {
    const vm = new Vue(MyComponent).$mount()
    expect(vm.message).toBe('bye!')
  })

  // 创建一个实例并检查渲染输出
  it('renders the correct message', () => {
    const Constructor = Vue.extend(MyComponent)
    const vm = new Constructor().$mount()
    expect(vm.$el.textContent).toBe('bye!')
  })
})
```

## 编写可被测试的组件

很多组件的渲染输出由它的 props 决定。事实上，如果一个组件的渲染输出完全取决于它的 props，那么它会让测试变得简单，就好像断言不同参数的纯函数的返回值。看下面这个例子：

``` html
<template>
  <p>{{ msg }}</p>
</template>

<script>
  export default {
    props: ['msg']
  }
</script>
```

你可以在不同的 props 中，通过 `propsData` 选项断言它的渲染输出：

``` js
import Vue from 'vue'
import MyComponent from './MyComponent.vue'

// 挂载元素并返回已渲染的文本的工具函数
function getRenderedText (Component, propsData) {
  const Constructor = Vue.extend(Component)
  const vm = new Constructor({ propsData: propsData }).$mount()
  return vm.$el.textContent
}

describe('MyComponent', () => {
  it('renders correctly with different props', () => {
    expect(getRenderedText(MyComponent, {
      msg: 'Hello'
    })).toBe('Hello')

    expect(getRenderedText(MyComponent, {
      msg: 'Bye'
    })).toBe('Bye')
  })
})
```

## 断言异步更新

由于 Vue 进行 [异步更新 DOM](reactivity.html#异步更新队列) 的情况，一些依赖 DOM 更新结果的断言必须在 `Vue.nextTick` 回调中进行：

``` js
// 在状态更新后检查生成的 HTML
it('updates the rendered message when vm.message updates', done => {
  const vm = new Vue(MyComponent).$mount()
  vm.message = 'foo'

  // 在状态改变后和断言 DOM 更新前等待一刻
  Vue.nextTick(() => {
    expect(vm.$el.textContent).toBe('foo')
    done()
  })
})
```

关于更深入的 Vue 单元测试的内容，请移步 [Vue Test Utils](https://vue-test-utils.vuejs.org/zh/) 以及我们关于 [Vue 组件的单元测试](../cookbook/unit-testing-vue-components.html)的 cookbook 文章。
