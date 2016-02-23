---
title: 自定义过滤器
type: guide
order: 15
---

## 基础

类似于自定义指令，可以用全局方法 `Vue.filter()` 注册一个自定义过滤器，它接收两个参数：**过滤器 ID** 和**过滤器函数**。过滤器函数以值为参数，返回转换后的值：

``` js
Vue.filter('reverse', function (value) {
  return value.split('').reverse().join('')
})
```

``` html
<!-- 'abc' => 'cba' -->
<span v-text="message | reverse"></span>
```

过滤器函数可以接收任意数量的参数：

``` js
Vue.filter('wrap', function (value, begin, end) {
  return begin + value + end
})
```

``` html
<!-- 'hello' => 'before hello after' -->
<span v-text="message | wrap 'before' 'after'"></span>
```

## 双向过滤器

目前我们使用过滤器都是在把来自模型的值显示在视图之前转换它。不过也可以定义一个过滤器，在把来自视图（`<input>` 元素）的值写回模型之前转化它：

``` js
Vue.filter('currencyDisplay', {
  // model -> view
  // 在更新 `<input>` 元素之前格式化值
  read: function(val) {
    return '$'+val.toFixed(2)
  },
  // view -> model
  // 在写回数据之前格式化值
  write: function(val, oldVal) {
    var number = +val.replace(/[^\d.]/g, '')
    return isNaN(number) ? 0 : parseFloat(number.toFixed(2))
  }
})
```

示例：

{% raw %}
<div id="two-way-filter-demo" class="demo">
  <input type="text" v-model="money | currencyDisplay">
  <p>Model value: {{money}}</p>
</div>
<script>
new Vue({
  el: '#two-way-filter-demo',
  data: {
    money: 123.45
  },
  filters: {
    currencyDisplay: {
      read: function(val) {
        return '$'+val.toFixed(2)
      },
      write: function(val, oldVal) {
        var number = +val.replace(/[^\d.]/g, '')
        return isNaN(number) ? 0 : parseFloat(number.toFixed(2))
      }
    }
  }
})
</script>
{% endraw %}

## 动态参数

如果过滤器参数没有用引号包起来，则它会在当前 vm 作用域内动态计算。另外，过滤器函数的 `this` 始终指向调用它的 vm。例如：

``` html
<input v-model="userInput">
<span>{{msg | concat userInput}}</span>
```

``` js
Vue.filter('concat', function (value, input) {
  // `input` === `this.userInput`
  return value + input
})
```

上例比较简单，也可以用表达式达到相同的结果，但是对于更复杂的逻辑——需要多于一个语句，这时需要将它放到计算属性或自定义过滤器中。

内置过滤器 `filterBy` 和 `orderBy`，根据所属 Vue 实例的当前状态，过滤/排序传入的数组。
