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

然后随着 [Vue Test Utils](https://vue-test-utils.vuejs.org/) 导入组件，你可以使用许多常见的断言 (这里我们使用的是 Jest 风格的 `expect` 断言作为示例)：

``` js
// 导入 Vue Test Utils 内的 `shallowMount` 和待测试的组件
import { shallowMount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

// 挂载这个组件
const wrapper = shallowMount(MyComponent)

// 这里是一些 Jest 的测试，你也可以使用你喜欢的任何断言库或测试
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
    expect(wrapper.vm.$data.message).toBe('bye!')
  })

  // 创建一个实例并检查渲染输出
  it('renders the correct message', () => {
    expect(wrapper.text()).toBe('bye!')
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

你可以使用 [Vue Test Utils](https://vue-test-utils.vuejs.org/) 来在输入不同 prop 时为渲染输出下断言：

``` js
import { shallowMount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

// 挂载元素并返回已渲染的组件的工具函数
function getMountedComponent(Component, propsData) {
  return shallowMount(Component, {
    propsData
  })
}

describe('MyComponent', () => {
  it('renders correctly with different props', () => {
    expect(
      getMountedComponent(MyComponent, {
        msg: 'Hello'
      }).text()
    ).toBe('Hello')

    expect(
      getMountedComponent(MyComponent, {
        msg: 'Bye'
      }).text()
    ).toBe('Bye')
  })
})
```

## 断言异步更新

由于 Vue 进行[异步更新 DOM](reactivity.html#异步更新队列) 的情况，一些依赖 DOM 更新结果的断言必须在 `vm.$nextTick()` resolve 之后进行：

``` js
// 在状态更新后检查生成的 HTML
it('updates the rendered message when wrapper.message updates', async () => {
  const wrapper = shallowMount(MyComponent)
  wrapper.setData({ message: 'foo' })

  // 在状态改变后和断言 DOM 更新前等待一刻
  await wrapper.vm.$nextTick()
  expect(wrapper.text()).toBe('foo')
})
```

关于更深入的 Vue 单元测试的内容，请移步 [Vue Test Utils](https://vue-test-utils.vuejs.org/zh/) 以及我们关于 [Vue 组件的单元测试](../cookbook/unit-testing-vue-components.html)的 cookbook 文章。
