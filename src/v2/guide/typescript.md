---
title: TypeScript 支持
type: guide
order: 404
---

在Vue 2.5.0中，我们大大改进了类型声明以使用默认的基于对象的API。同时，它的这些修改需要vue升级支持。阅读[博客文章]（https://medium.com/the-vue-point/upcoming-typescript-changes-in-vue-2-5-e9bd7e2ecf08）了解更多详情。

## 发布为 NPM 包的官方声明文件

静态类型系统能帮助你有效防止许多潜在的运行时错误，而且随着你的应用日渐丰满会更加显著。这就是为什么 Vue 不仅仅为 Vue core 提供了针对 [TypeScript](https://www.typescriptlang.org/) 的[官方类型声明](https://github.com/vuejs/vue/tree/dev/types)，还为 [Vue Router](https://github.com/vuejs/vue-router/tree/dev/types) 和 [Vuex](https://github.com/vuejs/vuex/tree/dev/types) 也提供了相应的声明文件。

而且，我们已经把它们[发布到了 NPM](https://cdn.jsdelivr.net/npm/vue/types/)，最新版本的 TypeScript 也知道该如何自己从 NPM 包里解析类型声明。这意味着只要你成功地通过 NPM 安装了，就不再需要任何额外的工具辅助，即可在 Vue 中使用 TypeScript 了。

我们还计划不久之后在`vue-cli`中提供一个Vue + TypeScript项目的初始配置选项。

## 推荐配置

``` js
// tsconfig.json
{
  "compilerOptions": {
    // 这符合Vue的浏览器支持
    "target": "es5",
    // 这可以对`this`上的数据属性进行更严格的推断
    "strict": true,
    // 如果使用webpack 2+或更高的版本，可以利用树状摇晃:
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

这句选项告诉 TypeScript 不要处理 ES 模块引入语句 (译注：import .. from ..)。这样 webpack 2 就可以充分利用其基于 ES 模块的 tree-shaking (译注一种在抽象语法树中减除未被使用的死代码的优化技术，简称`摇树优化`)。

参阅 [TypeScript 编译器选项文档 (英) ](https://www.typescriptlang.org/docs/handbook/compiler-options.html) 了解更多。

## 开发者工具

要使用TypeScript开发Vue应用程序，我们强烈建议您使用[Visual Studio Code]（https://code.visualstudio.com/），它为TypeScript提供了极好的立即使用支持。

## 基本用例

要让TypeScript正确推断Vue组件选项中的类型，您需要使用`Vue.component`或`Vue.extend`定义组件：
``` ts
import Vue from 'vue'
const Component = Vue.extend({
// 启用类型推断
})

const Component = {
// 这里不会有类型推断,
// 因为TypeScript不能确认这是Vue组件的选项.
}
```

请注意，当使用Vetur与SFC时，类型推断将自动应用于默认导出，因此不需要将其包装在`Vue.extend`中：

``` html
<template>
  ...
</template>
<script lang="ts">
  export default {
    //启用类型推断
  }
</script>
```
##Class 风格的 Vue 组件
如果您在声明组件时更喜欢基于类的API，则可以使用正式维护的[vue-class-component](https://github.com/vuejs/vue-class-componen)装饰器：
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


## 用于增强类型的插件

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
  // 可以使用 `VueConstructor`
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
