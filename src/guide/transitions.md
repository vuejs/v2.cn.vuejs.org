---
title: 过渡
type: guide
order: 11
---

通过 Vue.js 的过渡系统，可以在元素从 DOM 中插入或移除时自动应用过渡效果。Vue.js 会在适当的时机为你触发 CSS 过渡或动画，你也可以提供相应的 JavaScript 钩子函数在过渡过程中执行自定义的 DOM 操作。

为了应用过渡效果，需要在目标元素上使用 `transition` 特性：

``` html
<div v-if="show" transition="my-transition"></div>
```

`transition` 特性可以与下面资源一起用：

- `v-if`
- `v-show`
- `v-for` （只在插入和删除时触发，[使用 vue-animated-list 插件](https://github.com/vuejs/vue-animated-list)）
- 动态组件 （介绍见[组件](components.html#动态组件)）
- 在组件的根节点上，并且被 Vue 实例 DOM 方法（如 `vm.$appendTo(el)`）触发。

当插入或删除带有过渡的元素时，Vue 将：

1. 尝试以 ID `"my-transition"` 查找 JavaScript 过渡钩子对象——通过 `Vue.transition(id, hooks)` 或 `transitions` 选项注册。如果找到了，将在过渡的不同阶段调用相应的钩子。

2. 自动嗅探目标元素是否有 CSS 过渡或动画，并在合适时添加/删除 CSS 类名。

3. 如果没有找到 JavaScript 钩子并且也没有检测到 CSS 过渡/动画，DOM 操作（插入/删除）在下一帧中立即执行。

## CSS 过渡

### 示例

典型的 CSS 过渡像这样：

``` html
<div v-if="show" transition="expand">hello</div>
```

然后为 `.expand-transition`, `.expand-enter` 和 `.expand-leave` 添加 CSS 规则:

``` css
/* 必需 */
.expand-transition {
  transition: all .3s ease;
  height: 30px;
  padding: 10px;
  background-color: #eee;
  overflow: hidden;
}

/* .expand-enter 定义进入的开始状态 */
/* .expand-leave 定义离开的结束状态 */
.expand-enter, .expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}
```

你可以在同一元素上通过动态绑定实现不同的过渡：

```html
<div v-if="show" :transition="transitionName">hello</div>
```

```js
new Vue({
  el: '...',
  data: {
    show: false,
    transitionName: 'fade'
  }
})
```

另外，可以提供 JavaScript 钩子:

``` js
Vue.transition('expand', {

  beforeEnter: function (el) {
    el.textContent = 'beforeEnter'
  },
  enter: function (el) {
    el.textContent = 'enter'
  },
  afterEnter: function (el) {
    el.textContent = 'afterEnter'
  },
  enterCancelled: function (el) {
    // handle cancellation
  },

  beforeLeave: function (el) {
    el.textContent = 'beforeLeave'
  },
  leave: function (el) {
    el.textContent = 'leave'
  },
  afterLeave: function (el) {
    el.textContent = 'afterLeave'
  },
  leaveCancelled: function (el) {
    // handle cancellation
  }
})
```

{% raw %}
<div id="demo">
  <div v-if="show" transition="expand">hello</div>
  <button @click="show = !show">Toggle</button>
</div>

<style>
.expand-transition {
  transition: all .3s ease;
  height: 30px;
  padding: 10px;
  background-color: #eee;
  overflow: hidden;
}
.expand-enter, .expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}
</style>

<script>
new Vue({
  el: '#demo',
  data: {
    show: true,
    transitionState: 'Idle'
  },
  transitions: {
    expand: {
      beforeEnter: function (el) {
        el.textContent = 'beforeEnter'
      },
      enter: function (el) {
        el.textContent = 'enter'
      },
      afterEnter: function (el) {
        el.textContent = 'afterEnter'
      },
      beforeLeave: function (el) {
        el.textContent = 'beforeLeave'
      },
      leave: function (el) {
        el.textContent = 'leave'
      },
      afterLeave: function (el) {
        el.textContent = 'afterLeave'
      }
    }
  }
})
</script>
{% endraw %}

### 过渡的 CSS 类名

类名的添加和切换取决于 `transition` 特性的值。比如 `transition="fade"`，会有三个 CSS 类名：

1. `.fade-transition` 始终保留在元素上。

2. `.fade-enter` 定义进入过渡的开始状态。只应用一帧然后立即删除。

3. `.fade-leave` 定义离开过渡的结束状态。在离开过渡开始时生效，在它结束后删除。

如果 `transition` 特性没有值，类名默认是 `.v-transition`, `.v-enter` 和 `.v-leave`。

### 自定义过渡类名

> 1.0.14 新增

我们可以在过渡的 JavaScript 定义中声明自定义的 CSS 过渡类名。这些自定义类名会覆盖默认的类名。当需要和第三方的 CSS 动画库，比如 [Animate.css](https://daneden.github.io/animate.css/) 配合时会非常有用：

``` html
<div v-show="ok" class="animated" transition="bounce">Watch me bounce</div>
```

``` js
Vue.transition('bounce', {
  enterClass: 'bounceInLeft',
  leaveClass: 'bounceOutRight'
})
```

### 显式声明 CSS 过渡类型

> 1.0.14 新增

Vue.js 需要给过渡元素添加事件侦听器来侦听过渡何时结束。基于所使用的 CSS，该事件要么是 `transitionend`，要么是 `animationend`。如果你只使用了两者中的一种，那么 Vue.js 将能够根据生效的 CSS 规则自动推测出对应的事件类型。但是，有些情况下一个元素可能需要同时带有两种类型的动画。比如你可能希望让 Vue 来触发一个 CSS animation，同时该元素在鼠标悬浮时又有 CSS transition 效果。这样的情况下，你需要显式地声明你希望 Vue 处理的动画类型 (`animation` 或是 `transition`)：

``` js
Vue.transition('bounce', {
  // 该过渡效果将只侦听 `animationend` 事件
  type: 'animation'
})
```

### 过渡流程详解

当 `show` 属性改变时，Vue.js 将相应地插入或删除 `<div>` 元素，按照如下规则改变过渡的 CSS 类名：

- 如果 `show` 变为 false，Vue.js 将：
  1. 调用 `beforeLeave` 钩子；
  2. 添加 `v-leave` 类名到元素上以触发过渡；
  3. 调用 `leave` 钩子；
  4. 等待过渡结束（监听 `transitionend` 事件）；
  5. 从 DOM 中删除元素并删除 `v-leave` 类名；
  6. 调用 `afterLeave` 钩子。

- 如果 `show` 变为 true，Vue.js 将：
  1. 调用 `beforeEnter` 钩子；
  2. 添加 `v-enter` 类名到元素上；
  3. 把它插入 DOM；
  4. 调用 `enter` 钩子；
  5. 强制一次 CSS 布局，让 `v-enter` 确实生效。然后删除 `v-enter` 类名，以触发过渡，回到元素的原始状态；
  6. 等待过渡结束；
  7. 调用 `afterEnter` 钩子。

另外，如果在它的进入过渡还在进行中时删除元素，将调用 `enterCancelled` 钩子，以清理变动或 `enter` 创建的计时器。反过来对于离开过渡亦如是。

上面所有的钩子函数在调用时，它们的 `this` 均指向其所属的 Vue 实例。编译规则：过渡在哪个上下文中编译，它的 `this` 就指向哪个上下文。

最后，`enter` 和 `leave` 可以有第二个可选的回调参数，用于显式控制过渡如何结束。因此不必等待 CSS `transitionend` 事件， Vue.js 将等待你手工调用这个回调，以结束过渡。例如：

``` js
enter: function (el) {
  // 没有第二个参数
  // 由 CSS transitionend 事件决定过渡何时结束
}
```

vs.

``` js
enter: function (el, done) {
  // 有第二个参数
  // 过渡只有在调用 `done` 时结束
}
```

<p class="tip">当多个元素一起过渡时，Vue.js 会批量处理，只强制一次布局。</p>

### CSS 动画

CSS 动画用法同 CSS 过渡，区别是在动画中 `v-enter` 类名在节点插入 DOM 后不会立即删除，而是在 `animationend` 事件触发时删除。

示例： (省略了兼容性前缀)

``` html
<span v-show="show" transition="bounce">Look at me!</span>
```

``` css
.bounce-transition {
  display: inline-block; /* 否则 scale 动画不起作用 */
}
.bounce-enter {
  animation: bounce-in .5s;
}
.bounce-leave {
  animation: bounce-out .5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(0);
  }
}
```

{% raw %}
<div id="anim" class="demo">
  <span v-show="show" transition="bounce">Look at me!</span>
  <br>
  <button @click="show = !show">Toggle</button>
</div>

<style>
  .bounce-transition {
    display: inline-block;
  }
  .bounce-enter {
    -webkit-animation: bounce-in .5s;
    animation: bounce-in .5s;
  }
  .bounce-leave {
    -webkit-animation: bounce-out .5s;
    animation: bounce-out .5s;
  }
  @keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  @keyframes bounce-out {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
  }
  @-webkit-keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  @-webkit-keyframes bounce-out {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
  }
</style>

<script>
new Vue({
  el: '#anim',
  data: { show: true }
})
</script>
{% endraw %}

## JavaScript 过渡

也可以只使用 JavaScript 钩子，不用定义任何 CSS 规则。当只使用 JavaScript 过渡时，**`enter` 和 `leave` 钩子需要调用 `done` 回调**，否则它们将被同步调用，过渡将立即结束。

为 JavaScript 过渡显式声明 `css: false` 是个好主意，Vue.js 将跳过 CSS 检测。这样也会阻止无意间让 CSS 规则干扰过渡。

在下例中我们使用 jQuery 注册一个自定义的 JavaScript 过渡：

``` js
Vue.transition('fade', {
  css: false,
  enter: function (el, done) {
    // 元素已被插入 DOM
    // 在动画结束后调用 done
    $(el)
      .css('opacity', 0)
      .animate({ opacity: 1 }, 1000, done)
  },
  enterCancelled: function (el) {
    $(el).stop()
  },
  leave: function (el, done) {
    // 与 enter 相同
    $(el).animate({ opacity: 0 }, 1000, done)
  },
  leaveCancelled: function (el) {
    $(el).stop()
  }
})
```

然后用 `transition` 特性中：

``` html
<p transition="fade"></p>
```

## 渐近过渡

`transition` 与 `v-for` 一起用时可以创建渐近过渡。给过渡元素添加一个特性 `stagger`, `enter-stagger` 或 `leave-stagger`：

``` html
<div v-for="item in list" transition="stagger" stagger="100"></div>
```

或者，提供一个钩子 `stagger`, `enter-stagger` 或 `leave-stagger`，以更好的控制：

``` js
Vue.transition('stagger', {
  stagger: function (index) {
    // 每个过渡项目增加 50ms 延时
    // 但是最大延时限制为 300ms
    return Math.min(300, index * 50)
  }
})
```

示例：

<iframe width="100%" height="200" style="margin-left:10px" src="http://jsfiddle.net/yyx990803/mvo99bse/embedded/result,html,js,css" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
