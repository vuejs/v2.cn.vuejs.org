---
title: Vue 组件的单元测试
type: cookbook
order: 6
---

## 基本的示例

单元测试是软件开发非常基础的一部分。单元测试会封闭执行最小化单元的代码，使得添加新功能和追踪问题更容易。Vue 的[单文件组件](../guide/single-file-components.html)使得为组件撰写隔离的单元测试这件事更加直接。它会让你更有信心地开发新特性而不破坏现有的实现，并帮助其他开发者理解你的组件的作用。

这是一个判断一些文本是否被渲染的简单的示例：

```html
<template>
  <div>
    <input v-model="username">
    <div
      v-if="error"
      class="error"
    >
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hello',
  data () {
    return {
      username: ''
    }
  },

  computed: {
    error () {
      return this.username.trim().length < 7
        ? 'Please enter a longer username'
        : ''
    }
  }
}
</script>
```

```js
import { shallowMount } from '@vue/test-utils'
import Hello from './Hello.vue'

test('Hello', () => {
  // 渲染这个组件
  const wrapper = shallowMount(Hello)

  // `username` 在除去头尾空格之后不应该少于 7 个字符
  wrapper.setData({ username: ' '.repeat(7) })

  // 确认错误信息被渲染了
  expect(wrapper.find('.error').exists()).toBe(true)

  // 将名字更新至足够长
  wrapper.setData({ username: 'Lachlan' })

  // 断言错误信息不再显示了
  expect(wrapper.find('.error').exists()).toBe(false)
})
```

上述代码片段展示了如何基于 `username` 的长度测试一个错误信息是否被渲染。它展示了 Vue 组件单元测试的一般思路：渲染这个组件，然后断言这些标签是否匹配组件的状态。

## 为什么要测试？

组件的单元测试有很多好处：

- 提供描述组件行为的文档
- 节省手动测试的时间
- 减少研发新特性时产生的 bug
- 改进设计
- 促进重构

自动化测试使得大团队中的开发者可以维护复杂的基础代码。

#### 起步

[Vue Test Utils](https://github.com/vuejs/vue-test-utils) 是 Vue 组件单元测试的官方库。[Vue CLI](https://github.com/vuejs/vue-cli) 的 `webpack` 模板对 Karma 和 Jest 这两个测试运行器都支持，并且在 Vue Test Utils 的文档中有一些[引导](https://vue-test-utils.vuejs.org/zh/guides/)。

## 实际的例子

单元测试应该：

- 可以快速运行
- 易于理解
- 只测试*一个独立单元的工作*

我们在上一个示例的基础上继续构建，同时引入一个<a href="https://zh.wikipedia.org/wiki/工厂方法#工厂">工厂函数 (factory function)</a>使得我们的测试更简洁更易读。这个组件应该：

- 展示一个“Welcome to the Vue.js cookbook”的问候语
- 提示用户输入用户名
- 如果输入的用户名少于七个字符则展示错误信息

让我们先看一下组件代码：

```html
<template>
  <div>
    <div class="message">
      {{ message }}
    </div>
    Enter your username: <input v-model="username">
    <div
      v-if="error"
      class="error"
    >
      Please enter a username with at least seven letters.
    </div>
  </div>
</template>

<script>
export default {
  name: 'Foo',

  data () {
    return {
      message: 'Welcome to the Vue.js cookbook',
      username: ''
    }
  },

  computed: {
    error () {
      return this.username.trim().length < 7
    }
  }
}
</script>
```

我们应该测试的内容有：

- `message` 是否被渲染
- 如果 `error` 是 `true`，则 `<div class="error">` 应该展示
- 如果 `error` 是 `false`，则 `<div class="error">` 不应该展示

我们的第一次测试尝试：

```js
import { shallowMount } from '@vue/test-utils'
import Foo from './Foo.vue'

describe('Foo', () => {
  it('renders a message and responds correctly to user input', () => {
    const wrapper = shallowMount(Foo, {
      data: {
        message: 'Hello World',
        username: ''
      }
    })

    // 确认是否渲染了 `message`
    expect(wrapper.find('.message').text()).toEqual('Hello World')

    // 断言渲染了错误信息
    expect(wrapper.find('.error').exists()).toBeTruthy()

    // 更新 `username` 并断言错误信息不再被渲染
    wrapper.setData({ username: 'Lachlan' })
    expect(wrapper.find('.error').exists()).toBeFalsy()
  })
})
```

上述代码有一些问题：

- 单个测试断言了不同的事情
- 很难阐述组件可以处于哪些不同的状态，以及它该被渲染成什么样子

接下来的示例从这几个方面改善了测试：

- 每个 `it` 块只做一个断言
- 让测试描述更简短清晰
- 只提供测试需要的最小化数据
- 把重复的逻辑重构到了一个工厂函数中 (创建 `wrapper` 和设置 `username` 变量)

*更新后的测试*：

```js
import { shallowMount } from '@vue/test-utils'
import Foo from './Foo'

const factory = (values = {}) => {
  return shallowMount(Foo, {
    data: { ...values  }
  })
}

describe('Foo', () => {
  it('renders a welcome message', () => {
    const wrapper = factory()

    expect(wrapper.find('.message').text()).toEqual("Welcome to the Vue.js cookbook")
  })

  it('renders an error when username is less than 7 characters', () => {
    const wrapper = factory({ username: ''  })

    expect(wrapper.find('.error').exists()).toBeTruthy()
  })

  it('renders an error when username is whitespace', () => {
    const wrapper = factory({ username: ' '.repeat(7)  })

    expect(wrapper.find('.error').exists()).toBeTruthy()
  })

  it('does not render an error when username is 7 characters or more', () => {
    const wrapper = factory({ username: 'Lachlan'  })

    expect(wrapper.find('.error').exists()).toBeFalsy()
  })
})
```

注意事项：

在一开始，工厂函数将 `values` 对象合并到了 `data` 并返回了一个新的 `wrapper` 实例。这样，我们就不需要在每个测试中重复 `const wrapper = shallowMount(Foo)`。另一个好处是当你想为更复杂的组件在每个测试中伪造或存根一个方法或计算属性时，你只需要声明一次即可。

## 额外的上下文

上述的测试是非常简单的，但是在实际情况下 Vue 组件常常具有其它你想要测试的行为，诸如：

- 调用 API
- 为 `Vuex` 的 store，commit 或 dispatch 一些 mutation 或 action
- 测试用户交互

我们在 Vue Test Utils 的[教程](https://vue-test-utils.vuejs.org/zh/guides/)中提供了更完整的示例展示这些测试。

Vue Test Utils 及庞大的 JavaScript 生态系统提供了大量的工具促进 100% 的测试覆盖率。单元测试只是整个测试金字塔中的一部分。其它类型的测试还包括 e2e (端到端) 测试、快照比对测试等。单元测试是最小巧也是最简单的测试——它们通过隔离单个组件的每一个部分，来在最小工作单元上进行断言。

快照比对测试会保存你的 Vue 组件的标记，然后比较每次新生成的测试运行结果。如果有些东西改变了，开发者就会得到通知，并决定这个改变是刻意为之 (组件更新时) 还是意外发生的 (组件行为不正确)。

端到端测试致力于确保组件的一系列交互是正确的。它们是更高级别的测试，例如可能会测试用户是否注册、登录以及更新他们的用户名。这种测试运行起来会比单元测试和快照比对测试慢一些。

单元测试中开发的时候是最有用的，即能帮助开发者思考如何设计一个组件或重构一个现有组件。通常每次代码发生变化的时候它们都会被运行。

高级别的测试，诸如端到端测试，运行起来会更慢很多。这些测试通常只在部署前运行，来确保系统的每个部分都能够正常的协同工作。

更多测试 Vue 组件的知识可翻阅核心团员 [Edd Yerburgh](https://eddyerburgh.me/) 的书[《测试 Vue.js 应用》](https://www.manning.com/books/testing-vuejs-applications)。

## 何时避免这个模式

单元测试是任何正经的应用的重要部分。一开始，当你对一个应用的愿景还不够清晰的时候，单元测试可能会拖慢开发进度，但是一旦你的愿景建立起来并且有真实的用户对这个应用产生兴趣，那么单元测试 (以及其它类型的自动化测试) 就是绝对有必要的了，它们会确保基础代码的可维护性和可扩展性。
