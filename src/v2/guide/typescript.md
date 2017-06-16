---
title: TypeScript 支持
type: guide
order: 25
---

## 对于 TS + webpack 2 用户的重要变更通知

在 Vue 2.2 中，我们介绍了如何将分发（dist）文件作为 ES 模块公开（expose），默认情况下，它将被 webpack 2 使用。不幸的是，如果你使用 TypeScript + webpack 2 的组合，那么将得到一个意外的结果: `import Vue = require('vue')` 将返回整个 Vue 的 ES 模块，而非一个Vue的对象自身。

我们计划未来所有官方声明将使用 ES 导出（exports）风格。未来的项目配置请参阅下面的[推荐配置](#推荐配置)

## Npm 包中的官方声明

一个静态类型系统可以帮助你预防许多潜在的运行错误，特别是在你所开发的应用程序越来越大的时候。这就是 Vue 要与 TypeScript 的官方类型声明搭配的原因，（不仅 Vue，[Vue-router](https://github.com/vuejs/vue-router/tree/dev/types) 与 [Vuex](https://github.com/vuejs/vuex/tree/dev/types) 也将如此）

当发布到 Npm 上时，最新的 TypeScript 知道如何解决 NPM 包中的类型声明。这意味着当通过 NPM 安装时，你不需要任何额外的工具来让 Vue 和 TypeScript 协同工作。

## 推荐配置

``` js
// tsconfig.json
{
  "compilerOptions": {
    // ... other options omitted
    "allowSyntheticDefaultImports": true,
    "lib": [
      "dom",
      "es5",
      "es2015.promise"
    ]
  }
}
```
Note: `allowSyntheticDefaultImports` 选项允许我们使用以下形式:

``` js
import Vue from 'vue
```

替代:

``` js
import Vue = require('vue')
```

推荐使用前一种做法（ES 模块语法），因为它与推荐的纯 ES 用法一致。而且我们计划未来所有官方声明将使用ES导出（exports）风格

此外，假如你搭配 webpack 2 来使用 TypeScript， 以下做法也是推荐的:

``` js
{
  "compilerOptions": {
    // ... other options omitted
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

上面的配置告知 TypeScript 应使 ES 模块导入语句保持原样，这将反过来允许 webpack 2 利用基于 ES 模块的树状缓冲（ES-module-based tree-shaking）。

更多细节，请参阅 [TypeScript 编译选项文档](https://www.typescriptlang.org/docs/handbook/compiler-options.html)。

## 使用 Vue 类型声明

Vue 的类型定义导出许多有用的[类型声明](https://github.com/vuejs/vue/blob/dev/types/index.d.ts)。比如，以注解的形式导出组件选项对象（e.g. in a `.vue` file）:

``` ts
import Vue, { ComponentOptions } from 'vue'

export default {
  props: ['message'],
  template: '<span>{{ message }}</span>'
} as ComponentOptions<Vue>
```

## 类风格的 Vue 组件

将类型注解用于 Vue 组件选项很简单:

``` ts
import Vue, { ComponentOptions }  from 'vue'
// Declare the component's type
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
      // TypeScript knows that `this` is of type MyComponent
      // and that `this.message` will be a string
      window.alert(this.message)
    }
  }
// We need to explicitly annotate the exported options object
// with the MyComponent type
} as ComponentOptions<MyComponent>
```

稍显不幸的是，类型推断是有限制的:

- __TypeScript 不能从 Vue 的 API 中推断出所有类型__ 比如，它不知道在我们 `data` 函数中返回的 `message` 属性将被添加到 `MyComponent` 实例。这意味着如果我们将一个数字或者布尔值赋给了 `message` 时，检测器(linter)与编译器(compiler)将不能发现这个错误，并向我们提示这应该是一个字符串。

- 由于之前的限制，__注解类型可能是鸡肋的__。我们不得不手动地将 `message` 声明为为字符串的唯一原因就是在这种情况下，TypeScript 不能推断出类型。

但让人高兴的是，[vue-class-component](https://github.com/vuejs/vue-class-component) 能够解决上面两个问题。这个官方合作库允许你通过 `@Component` 装饰器以 JavaScript 原生类的方式声明组件，
举个例子，让我们重写上面的组件:

``` ts
import Vue from 'vue'
import Component from 'vue-class-component'

// The @Component decorator indicates the class is a Vue component
@Component({
  // All component options are allowed in here
  template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Vue {
  // Initial data can be declared as instance properties
  message: string = 'Hello!'

  // Component methods can be declared as instance methods
  onClick (): void {
    window.alert(this.message)
  }
}
```

使用上面的这种语法替代原先的方法，我们的组件定义更加简洁，而且 TypeScript 也可以推断出 `message` 和 `onClick` 的类型，并且也不需要明确地进行接口声明。它甚至允许你处理计算属性，生命周期钩子和渲染函数的类型。有关完整使用细节，请参阅 [the vue-class-component docs](https://github.com/vuejs/vue-class-component#vue-class-component).