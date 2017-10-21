---
title: TypeScript 支持
type: guide
order: 404
---

在 Vue 2.5.0 中，我们大大改进了类型声明以更好地使用默认的基于对象的 API。同时此版本也引入了一些其它变化，需要开发者作出相应的升级。阅读[博客文章](https://medium.com/the-vue-point/upcoming-typescript-changes-in-vue-2-5-e9bd7e2ecf08)了解更多详情。

## 发布为 NPM 包的官方声明文件

静态类型系统能帮助你有效防止许多潜在的运行时错误，而且随着你的应用日渐丰满会更加显著。这就是为什么 Vue 不仅仅为 Vue core 提供了针对 [TypeScript](https://www.typescriptlang.org/) 的[官方类型声明](https://github.com/vuejs/vue/tree/dev/types)，还为 [Vue Router](https://github.com/vuejs/vue-router/tree/dev/types) 和 [Vuex](https://github.com/vuejs/vuex/tree/dev/types) 也提供了相应的声明文件。

而且，我们已经把它们[发布到了 NPM](https://cdn.jsdelivr.net/npm/vue/types/)，最新版本的 TypeScript 也知道该如何自己从 NPM 包里解析类型声明。这意味着只要你成功地通过 NPM 安装了，就不再需要任何额外的工具辅助，即可在 Vue 中使用 TypeScript 了。

我们还计划在近期为 vue-cli 提供一个选项，来初始化一个立即可投入开发的 Vue + TypeScript 项目脚手架。

## 推荐配置

``` js
// tsconfig.json
{
  "compilerOptions": {
    // 与 Vue 的浏览器支持保持一致
    "target": "es5",
    // 这可以对 `this` 上的数据属性进行更严格的推断
    "strict": true,
    // 如果使用 webpack 2+ 或 rollup，可以利用 tree-shake:
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

这句选项告诉 TypeScript 不要处理 ES 模块引入语句 (译注：import .. from ..)。这样 webpack 2 就可以充分利用其基于 ES 模块的 tree-shaking (译注一种在抽象语法树中减除未被使用的死代码的优化技术，简称`摇树优化`)。

参阅 [TypeScript 编译器选项文档 (英)](https://www.typescriptlang.org/docs/handbook/compiler-options.html) 了解更多。

## 开发工具链

要使用 TypeScript 开发 Vue 应用程序，我们强烈建议您使用 [Visual Studio Code](https://code.visualstudio.com/)，它为 TypeScript 提供了极好的“开箱即用”支持。

如果你正在使用[单文件组件](./single-file-components.html) (SFC), 可以安装提供 SFC 支持以及其他更多实用功能的 [Vetur 插件](https://github.com/vuejs/vetur)。

## 基本用法

要让 TypeScript 正确推断 Vue 组件选项中的类型，您需要使用 `Vue.component` 或 `Vue.extend` 定义组件：
``` ts
import Vue from 'vue'
const Component = Vue.extend({
// 类型推断已启用
})

const Component = {
// 这里不会有类型推断,
// 因为TypeScript不能确认这是Vue组件的选项
}
```

请注意，当使用 Vetur 与 SFC 时，类型推断将自动应用于默认导出，因此不需要将其包装在 `Vue.extend` 中：

``` html
<template>
  ...
</template>
<script lang="ts">
  export default {
    //类型推断已启用
  }
</script>
```

## 基于类的 Vue 组件

如果您在声明组件时更喜欢基于类的 API，则可以使用官方维护的 [vue-class-component](https://github.com/vuejs/vue-class-component) 装饰器：
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


## 增强类型以配合插件使用

插件可以增加 Vue 的全局/实例属性和组件选项。在这些情况下，在 TypeScript 中制作插件需要类型声明。庆幸的是，TypeScript 有一个特性来补充现有的类型，叫做[模块补充 (module augmentation)](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)。

例如，声明一个 `string` 类型的实例属性 `$myProperty`：

``` ts
// 1. 确保在声明补充的类型之前导入 'vue'
import Vue from 'vue'

// 2. 定制一个文件，设置你想要补充的类型
//    在 types/vue.d.ts 里 Vue 有构造函数类型
declare module 'vue/types/vue' {
// 3. 声明为 Vue 补充的东西
  interface Vue {
    $myProperty: string
  }
}
```

在你的项目中包含了上述作为声明文件的代码之后 (像 `my-property.d.ts`)，你就可以在 Vue 实例上使用 `$myProperty` 了。

```ts
var vm = new Vue()
console.log(vm.$myProperty) // 将会顺利编译通过
```

你也可以声明额外的属性和组件选项：

```ts
import Vue from 'vue'

declare module 'vue/types/vue' {
  // 可以使用 `VueConstructor` 接口
  // 来声明全局属性
  interface VueConstructor {
    $myGlobal: string
  }
}

// ComponentOptions 声明于 types/options.d.ts 之中
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    myOption?: string
  }
}
```

上述的声明允许下面的代码顺利编译通过：

```ts
// 全局属性
console.log(Vue.$myGlobal)

// 额外的组件选项
var vm = new Vue({
  myOption: 'Hello'
})
```
