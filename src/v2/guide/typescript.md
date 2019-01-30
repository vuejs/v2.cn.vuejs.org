---
title: TypeScript 支持
type: guide
order: 403
---

> [Vue CLI](https://cli.vuejs.org/zh/) 内置了 TypeScript 工具支持。在 Vue 的下一个大版本 (3.x) 中也计划了相当多的 TypeScript 支持改进，包括内置的基于 class 的组件 API 和 TSX 的支持。

## 发布为 NPM 包的官方声明文件

静态类型系统能帮助你有效防止许多潜在的运行时错误，而且随着你的应用日渐丰满会更加显著。这就是为什么 Vue 不仅仅为 Vue core 提供了针对 [TypeScript](https://www.typescriptlang.org/) 的[官方类型声明](https://github.com/vuejs/vue/tree/dev/types)，还为 [Vue Router](https://github.com/vuejs/vue-router/tree/dev/types) 和 [Vuex](https://github.com/vuejs/vuex/tree/dev/types) 也提供了相应的声明文件。

而且，我们已经把它们[发布到了 NPM](https://cdn.jsdelivr.net/npm/vue/types/)，最新版本的 TypeScript 也知道该如何自己从 NPM 包里解析类型声明。这意味着只要你成功地通过 NPM 安装了，就不再需要任何额外的工具辅助，即可在 Vue 中使用 TypeScript 了。

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

注意你需要引入 `strict: true` (或者至少 `noImplicitThis: true`，这是 `strict` 模式的一部分) 以利用组件方法中 `this` 的类型检查，否则它会始终被看作 `any` 类型。

参阅 [TypeScript 编译器选项文档 (英)](https://www.typescriptlang.org/docs/handbook/compiler-options.html) 了解更多。

## 开发工具链

### 工程创建

[Vue CLI 3](https://github.com/vuejs/vue-cli) 可以使用 TypeScript 生成新工程。创建方式：

```bash
# 1. 如果没有安装 Vue CLI 就先安装
npm install --global @vue/cli

# 2. 创建一个新工程，并选择 "Manually select features (手动选择特性)" 选项
vue create my-project-name
```

### 编辑器支持

要使用 TypeScript 开发 Vue 应用程序，我们强烈建议您使用 [Visual Studio Code](https://code.visualstudio.com/)，它为 TypeScript 提供了极好的“开箱即用”支持。如果你正在使用[单文件组件](./single-file-components.html) (SFC), 可以安装提供 SFC 支持以及其他更多实用功能的 [Vetur 插件](https://github.com/vuejs/vetur)。

[WebStorm](https://www.jetbrains.com/webstorm/) 同样为 TypeScript 和 Vue 提供了“开箱即用”的支持。

## 基本用法

要让 TypeScript 正确推断 Vue 组件选项中的类型，您需要使用 `Vue.component` 或 `Vue.extend` 定义组件：

``` ts
import Vue from 'vue'
const Component = Vue.extend({
  // 类型推断已启用
})

const Component = {
  // 这里不会有类型推断，
  // 因为TypeScript不能确认这是Vue组件的选项
}
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

## 标注返回值

因为 Vue 的声明文件天生就具有循环性，TypeScript 可能在推断某个方法的类型的时候存在困难。因此，你可能需要在 `render` 或 `computed` 里的方法上标注返回值。

```ts
import Vue, { VNode } from 'vue'

const Component = Vue.extend({
  data () {
    return {
      msg: 'Hello'
    }
  },
  methods: {
    // 需要标注有 `this` 参与运算的返回值类型
    greet (): string {
      return this.msg + ' world'
    }
  },
  computed: {
    // 需要标注
    greeting(): string {
      return this.greet() + '!'
    }
  },
  // `createElement` 是可推导的，但是 `render` 需要返回值类型
  render (createElement): VNode {
    return createElement('div', this.greeting)
  }
})
```

如果你发现类型推导或成员补齐不工作了，标注某个方法也许可以帮助你解决这个问题。使用 `--noImplicitAny` 选项将会帮助你找到这些未标注的方法。
