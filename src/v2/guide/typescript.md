---
title: TypeScript Support
type: guide
order: 25
---

##  2.2 版本中针对 TS + Webpack 2 用户的重要改动

在 Vue 2.2 里，我们引入了新机制，把 dist 文件都作为 ES 模块发布。这在 webpack 2 中属于默认行为。遗憾的是，这个改动会引入一个会破坏兼容性的意外改动。在 TypeScript + webpack 2 里， `import Vue = require('vue')` 现在会返回一个综合的 ES 模块对象，而不是 Vue 对象本身了。

我们计划在未来把所有的官方类型声明都改成 ES-风格的导出方式（译注：`export`）。请参阅下面的[推荐配置](#Recommended-Configuration)板块，配置一个不易过时的编码方案。

## 发布为 NPM 包的官方声明文件

静态类型系统能帮助你有效防止N多潜在的运行时错误，而且随着你的应用日渐丰满会更加显著。这就是为啥子 Vue 不仅仅为 Vue core 提供了针对 [TypeScript](https://www.typescriptlang.org/) 的[官方类型声明](https://github.com/vuejs/vue/tree/dev/types)，还为 [Vue Router](https://github.com/vuejs/vue-router/tree/dev/types) 和 [Vuex](https://github.com/vuejs/vuex/tree/dev/types) 也提供了相应的声明文件。

而且，我们已经把他们[发布于 NPM](https://unpkg.com/vue/types/)，最新版本的 TypeScript 也知道该如何自己从 NPM 包里解析类型声明。这意味着只要你成功地通过 NPM 安装了，就不再需要任何额外的工具辅助，即可在 Vue 中使用 TypeScript 了。

## 推荐配置

``` js
// tsconfig.json
{
  "compilerOptions": {
    // ... 已省略其它选项
    "allowSyntheticDefaultImports": true,
    "lib": [
      "dom",
      "es5",
      "es2015.promise"
    ]
  }
}
```

请注意 `allowSyntheticDefaultImports` 选项允许你使用下列语法：

``` js
import Vue from 'vue'
```

而不是这种：

``` js
import Vue = require('vue') // 注：老语法
```

我们更为推荐前者（ES 模块语法），因为他跟原生的 ES 用法更为一致，而且在未来，我们计划把官方声明全部搬迁到 ES 风格的导出方式。

另外呢，如果你是搭配 webpack 2 使用 TypeScript，那么以下配置也很推荐：

``` js
{
  "compilerOptions": {
    // ... 已省略其他配置
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

这句选项告诉 TypeScript 不要处理 ES 模块引入语句（译注：import .. from ..）。这样 webpack 2 就可以充分利用其基于 ES 模块的 tree-shaking（译注一种在抽象语法树中减除未被使用的死代码的优化技术，简称`摇树优化`）。

参阅 [TypeScript 编译器选项文档（英）](https://www.typescriptlang.org/docs/handbook/compiler-options.html) 了解更多。

## 使用 Vue 的类型声明

Vue 的类型声明道出了很多有效的[类型声明](https://github.com/vuejs/vue/blob/dev/types/index.d.ts)。比如，标记一个导出的组件选项对象(e.g. 在 `.vue` 文件中)：

``` ts
import Vue, { ComponentOptions } from 'vue'

export default {
  props: ['message'],
  template: '<span>{{ message }}</span>'
} as ComponentOptions<Vue>
```

## Class 风格的 Vue 组件

我们可以很容易地标记上 Vue 组件选项的类型：

``` ts
import Vue, { ComponentOptions }  from 'vue'

// 声明该组件的类型
interface MyComponent extends Vue {
  message: string
  onClick (): void
}

export default {
  template: '<button @click="onClick">Click!</button>',
  data: function () {
    return {
      message: 'Hello!'
    }
  },
  methods: {
    onClick: function () {
      // TypeScript 知道 `this` 是类型为 MyComponent 的对象
      // 因此 `this.message` 会是一个 string
      window.alert(this.message)
    }
  }
// 我们需要显式地标注导出选项对象为 MyComponent 类型
} as ComponentOptions<MyComponent>
```

不幸的是，这里也有一些局限性：

- __TypeScript 不能推断出 Vue API 里的所有类型__。比如，他们不知道我们 `data` 函数中返回的 `message` 属性会被添加到 `MyComponent` 实例中。这意味着如果我们给 `message` 赋值一个数字或者布尔值，linter 和 编译器并不能抛出一个“该值应该是字符串”的错误。

- 因为第一条的局限, __如上的类型注释可能会很罗嗦__。TypeScript 不能正确推导 `message` 的类型，是唯一迫使我们手动声明它是 string 的原因。

好消息是，[vue-class-component](https://github.com/vuejs/vue-class-component) 能解决以上的两个问题。这是一个官方的姐妹库，它能允许你把组件声明为一个原生的 JavaScript 类，外加一个 `@Component` 的修饰符。为了举例说明，我们把上面的栗子重写一下吧:

``` ts
import Vue from 'vue'
import Component from 'vue-class-component'

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  // 所有的组件选项都可以放在这里
  template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Vue {
  // 初始数据可以直接声明为实例的属性
  message: string = 'Hello!'

  // 组件方法也可以直接声明为实例的方法
  onClick (): void {
    window.alert(this.message)
  }
}
```

有了这种备选语法，我们的组件定义不仅仅更加短小了，而且 TypeScript 也能在无需显式的接口声明的情况下，正确推断 `message` 和 `onClick` 的类型了呢。这个策略甚至能让你处理计算属性（computed），生命周期钩子以及 render 函数的类型。你可以参阅 [vue-class-component 文档](https://github.com/vuejs/vue-class-component#vue-class-component)，来了解完整的细节。