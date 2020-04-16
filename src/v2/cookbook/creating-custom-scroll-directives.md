---
title: 创建自定义滚动指令
type: cookbook
order: 7
---

## 基本的示例

我们可能很多次想为网站的滚动事件添加一些行为，尤其是动画。已有的做法很多，但是代码和依赖最少的方式可能就是使用一个[自定义指令](../guide/custom-directive.html)创建一个钩子，在特定的滚动事件之后作处理。

```js
Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})

// main app
new Vue({
  el: '#app',
  methods: {
    handleScroll: function (evt, el) {
      if (window.scrollY > 50) {
        el.setAttribute(
          'style',
          'opacity: 1; transform: translate3d(0, -10px, 0)'
        )
      }
      return window.scrollY > 100
    }
  }
})
```

```html
<div id="app">
  <h1 class="centered">Scroll me</h1>
  <div
    v-scroll="handleScroll"
    class="box"
  >
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque amet harum aut ab veritatis earum porro praesentium ut corporis. Quasi provident dolorem officia iure fugiat, eius mollitia sequi quisquam.</p>
  </div>
</div>
```

<p class="tip">记住！指令必须在 Vue 实例之前注册好。</p>

我们可能还需要一个样式 property 来对中间值做过渡，在这个例子中：

```css
.box {
  transition: 1.5s all cubic-bezier(0.39, 0.575, 0.565, 1);
}
```

<p data-height="450" data-theme-id="5162" data-slug-hash="983220ed949ac670dff96bdcaf9d3338" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Custom Scroll Directive- CSS Transition" class="codepen">在 <a href="https://codepen.io">CodePen</a> 查看 Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) 的<a href="https://codepen.io/sdras/pen/983220ed949ac670dff96bdcaf9d3338/">自定义滚动指令- CSS 过渡</a>。</p>

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

或者使用 GreenSock (GSAP) 或任何其它 JavaScript 动画库，代码会变得更加简洁：

```js
Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})

// main app
new Vue({
  el: '#app',
  methods: {
    handleScroll: function (evt, el) {
      if (window.scrollY > 50) {
        TweenMax.to(el, 1.5, {
          y: -10,
          opacity: 1,
          ease: Sine.easeOut
        })
      }
      return window.scrollY > 100
    }
  }
})
```

而且我们会从实现中移除之前的 CSS 过渡，因为 JavaScript 已经搞定了这件事。

## 使用自定义指令的好处

Vue 为指令提供了丰富的选项，覆盖了绝大多数的常见用例，使得我们可以通过指令创建非常高效的开发体验。即便遇到了一个框架本身覆盖不到的极端情况，你也可以通过这种方式来解决，因为你可以很轻松地创建一个自定义指令来满足需求。

为元素附加或移除滚动事件是对于这项技术的一个很好的用例，因为就像其它我们使用的指令一样，它们有必要绑定在元素上，否则我们就需要寻找其 DOM 引用。这种模式避免了我们遍历 DOM 节点，保证事件的逻辑能够和需要引用的节点对应起来。

## 真实的示例：为级联动画使用一个自定义滚动指令

在创建一个风格统一的网站的过程中，你可能会发现你在很多区域复用了相同类型的动画逻辑。看起来我们创建一个非常特殊的自定义指令很简单对吧？好，通常情况下如果你想复用它，那么你*只需*在每次使用的时候对其进行一些小的改动即可。

为了保持代码的精炼和易读，我们会传递一些预设参数，诸如我们向下滚动页面时动画的起始点和终止点。

**这个示例最好在[全屏模式](https://s.codepen.io/sdras/debug/078c19f5b3ed7f7d28584da450296cd0)下浏览。**

<p data-height="500" data-theme-id="5162" data-slug-hash="c8c55e3e0bba997350551dd747119100" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Scrolling Example- Using Custom Directives in Vue" class="codepen">在 <a href="https://codepen.io">CodePen</a> 查看 Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) 的 <a href="https://codepen.io/sdras/pen/c8c55e3e0bba997350551dd747119100/">滚动示例 - 在 Vue 中使用自定义指令</a。></p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

在上述 demo 中，每个章节都有两个由滚动触发的不同类型的动画开关：一个渐变动画和一个动态改变 SVG 独立路径的动画。我们想要复用这两种动画，因此可以为每种动画各创建一个自定义指令。传入的参数将会帮助我们让一切都简单可复用。

为了展示实现方式，我们将会看一下这个渐变图形的示例，这里我们需要明确起始状态和完成状态，同时传入一个我们将要创建的渐变的路径的值。每个这样的参数都会以 `binding.value.foo` 的形式定义：

```js
Vue.directive('clipscroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      var hasRun = false
      if (!hasRun && window.scrollY > binding.value.start) {
        hasRun = true
        TweenMax.to(el, 2, {
          morphSVG: binding.value.toPath,
          ease: Sine.easeIn
        })
      }
      if (window.scrollY > binding.value.end) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})
```

然后我们可以在我们的模板中使用这个动画，在本例中我们会将该指令附加到一个 `clipPath` 元素上，然后将所有的参数放入一个对象传递到这个指令中。

```html
<clipPath id="clip-path">
  <path
    v-clipscroll="{ start: '50', end: '100', toPath: 'M0.39 0.34H15.99V22.44H0.39z' }"
    id="poly-shapemorph"
    d="M12.46 20.76L7.34 22.04 3.67 18.25 5.12 13.18 10.24 11.9 13.91 15.69 12.46 20.76z"
  />
</clipPath>
```

## 替代模式

自定义指令是非常有用的，但是有时候你需要的一些特定逻辑，它们已经存在于一个滚动库里了，而你并不希望从零开始重构它。

[Scrollmagic](http://scrollmagic.io/) 拥有一个非常丰富的生态系统，同时附带了很好的文档和演示以便大家浏览。这些特效包括且不仅限于诸如[视差滚动](http://scrollmagic.io/examples/advanced/parallax_scrolling.html)、[级联固定](http://scrollmagic.io/examples/expert/cascading_pins.html)、[章节切换](http://scrollmagic.io/examples/basic/section_wipes_natural.html)和[响应式持续时间](http://scrollmagic.io/examples/basic/responsive_duration.html)等。
