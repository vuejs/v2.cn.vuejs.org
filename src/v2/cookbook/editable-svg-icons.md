---
title: 可编辑的 SVG 图标系统
type: cookbook
order: 4
---

## 基本的示例

创建一套 SVG 图标系统的方式有很多，但是有一种方法能够充分发挥 Vue 的能力，那就是把可编辑的内联图标创建为组件。这样做有好多好处：

* 图标易于实时修改
* 图标可以带动画
* 你可以使用标准的 prop 和默认值来将图标保持在一个典型的尺寸并随时按需改变它们
* 图标是内联的，所以不需要额外的 HTTP 请求
* 可以动态地使得图标可访问

首先，我们将为所有的图标创建一个文件夹，并将这些图标以一种标准化的方式命名以便获取它们：

> `components/icons/IconBox.vue`
> `components/icons/IconCalendar.vue`
> `components/icons/IconEnvelope.vue`

这里有一个示例的仓库，你可以看到全部的配置：[https://github.com/sdras/vue-sample-svg-icons/](https://github.com/sdras/vue-sample-svg-icons/)。

![网站文档](https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/screendocs.jpg '文档 demo')

我们将会创建一个基础图标 (`IconBase.vue`) 组件，并使用了一个插槽。

```html
<template>
  <svg xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 18 18"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <title
      :id="iconName"
      lang="en"
    >{{ iconName }} icon</title>
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>
```

你可以像这样使用这个基础图标，唯一可能要做的就是根据你图标的 `viewBox` 来更新其 `viewBox`。在基础图标里会有 `width`、`height`、`iconColor` 以及图标的名字等 prop，这样我们就可以通过 prop 对其动态更新。这个名字将会同时用在 `<title>` 的内容及其用于提供可访问性的 `id` 上。

我们的脚本是下面这样的，我们设了一些默认值，这样在没有特别设置的情况下图标渲染出来就是一致的：

```js
export default {
  props: {
    iconName: {
      type: String,
      default: 'box'
    },
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    },
    iconColor: {
      type: String,
      default: 'currentColor'
    }
  }
}
```

`currentColor` 会成为 `fill` 的默认值，于是图标就会继承周围文字的颜色了。我们也可以根据需求传递一个不一样的颜色的 prop。

我们可以这样使用它，通过 `IconWrite.vue` 将图标的路径包含于其中，作为其唯一的内容：

```html
<icon-base icon-name="write"><icon-write /></icon-base>
```

现在，如果我们想要创建更多种尺寸的图标，我们可以简单的这样做：

```html
<p>
  <!-- 你可以通过 prop 传递更小的 `width` 和 `height` -->
  <icon-base
    width="12"
    height="12"
    icon-name="write"
  ><icon-write /></icon-base>
  <!-- 或者你可以使用默认值，即 18 -->
  <icon-base icon-name="write"><icon-write /></icon-base>
  <!-- 或者让它更大一些 :) -->
  <icon-base
    width="30"
    height="30"
    icon-name="write"
  ><icon-write /></icon-base>
</p>
```

<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/Screen%20Shot%202018-01-01%20at%204.51.40%20PM.png" width="450" />

## 带动画的图标

当我们想要赋予它们动画，尤其是在一个交互动作的时候，在组件中控制图标是非常方便的。内联 SVG 对各种交互行为都有最高级的支持。这里有一个图标在点击之后产生动画的基本的示例：

```html
<template>
  <svg
    @click="startScissors"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="100"
    height="100"
    aria-labelledby="scissors"
    role="presentation"
  >
    <title
      id="scissors"
      lang="en"
    >Scissors Animated Icon</title>
    <path
      id="bk"
      fill="#fff"
      d="M0 0h100v100H0z"/>
    <g ref="leftscissor">
      <path d="M..."/>
      ...
    </g>
    <g ref="rightscissor">
      <path d="M..."/>
      ...
    </g>
  </svg>
</template>
```

```js
import { TweenMax, Sine } from 'gsap'

export default {
  methods: {
    startScissors() {
      this.scissorAnim(this.$refs.rightscissor, 30)
      this.scissorAnim(this.$refs.leftscissor, -30)
    },
    scissorAnim(el, rot) {
      TweenMax.to(el, 0.25, {
        rotation: rot,
        repeat: 3,
        yoyo: true,
        svgOrigin: '50 45',
        ease: Sine.easeInOut
      })
    }
  }
}
```

我们通过 `ref` 将我们需要移动的路径做了分组，因为这把剪刀的两侧需要同时移动，所以我们会创建一个传入 `ref` 的可复用的函数。并使用 GreenSock 帮助我们完成动画并解决 `transform-origin` 的浏览器兼容性问题。

<p data-height="300" data-theme-id="0" data-slug-hash="dJRpgY" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Editable SVG Icon System: Animated icon" class="codepen">在 <a href="https://codepen.io">CodePen</a> 查看 Vue (<a href="https://codepen.io/Vue">@Vue</a>) 的 <a href="https://codepen.io/team/Vue/pen/dJRpgY/">可编辑的 SVG 图标系统：带动画的图标</a>。</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

<p style="margin-top:-30px">很容易做到吧！并且很容易实时更新。</p>

你可以在[这个仓库](https://github.com/sdras/vue-sample-svg-icons/)看到更多动画的示例。

## 注意事项

设计师可能会改变他们的主意。产品需求也可能会变更。在一个基础组件中保持整个图标系统的逻辑，意味着你可以快速更新你所有的图标并快速丰富你的整个图标系统。甚至通过图标加载器，有些情况下需要你重新创建或编辑每个 SVG 来完成全局的改动。这个方法可以节约你的时间，减少你的痛苦。

## 何时避免使用这个模式

当你有许多图标用在你网站不同的地方时，这类 SVG 图标系统是非常有用的。如果你只在一个页面上重复使用相同的图标很多次 (比如一个大表格中每行的删除图标)，可能把它们编译到一个雪碧图表并通过 `<use>` 标签来加载会更好。

## 其它替代方案

其它帮助你管理 SVG 图标的工具有：

* [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader)
* [svgo-loader](https://github.com/rpominov/svgo-loader)

这些工具会在编译时打包 SVG，但是在运行时编辑它们会有一些麻烦，因为 `<use>` 标签在处理一些复杂的事情时存在浏览器兼容问题。同时它们会给你两个嵌套的 `viewBox` property，这是两套坐标系。所以实现上稍微复杂了一些。
