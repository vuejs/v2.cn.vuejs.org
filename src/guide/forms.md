---
title: 表单控件绑定
type: guide
order: 10
---

## 基础用法

可以用 `v-model` 指令在表单控件元素上创建双向数据绑定。根据控件类型它自动选取正确的方法更新元素。尽管有点神奇，`v-model` 不过是语法糖，在用户输入事件中更新数据，以及特别处理一些极端例子。


### Text

``` html
<span>Message is: {{ message }}</span>
<br>
<input type="text" v-model="message" placeholder="edit me">
```

{% raw %}
<div id="example-1" class="demo">
  <span>Message is: {{ message }}</span><br>
  <input type="text" v-model="message" placeholder="edit me">
</div>
<script>
new Vue({
  el: '#example-1',
  data: {
    message: ''
  }
})
</script>
{% endraw %}

### Checkbox

单个勾选框，逻辑值：

``` html
<input type="checkbox" id="checkbox" v-model="checked">
<label for="checkbox">{{ checked }}</label>
```
{% raw %}
<div id="example-2" class="demo">
  <input type="checkbox" id="checkbox" v-model="checked">
  <label for="checkbox">{{ checked }}</label>
</div>
<script>
new Vue({
  el: '#example-2',
  data: {
    checked: false
  }
})
</script>
{% endraw %}

多个勾选框，绑定到同一个数组：

``` html
<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
<label for="jack">Jack</label>
<input type="checkbox" id="john" value="John" v-model="checkedNames">
<label for="john">John</label>
<input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
<label for="mike">Mike</label>
<br>
<span>Checked names: {{ checkedNames | json }}</span>
```

``` js
new Vue({
  el: '...',
  data: {
    checkedNames: []
  }
})
```

{% raw %}
<div id="example-3" class="demo">
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
  <br>
  <span>Checked names: {{ checkedNames | json }}</span>
</div>
<script>
new Vue({
  el: '#example-3',
  data: {
    checkedNames: []
  }
})
</script>
{% endraw %}

### Radio


``` html
<input type="radio" id="one" value="One" v-model="picked">
<label for="one">One</label>
<br>
<input type="radio" id="two" value="Two" v-model="picked">
<label for="two">Two</label>
<br>
<span>Picked: {{ picked }}</span>
```
{% raw %}
<div id="example-4" class="demo">
  <input type="radio" id="one" value="One" v-model="picked">
  <label for="one">One</label>
  <br>
  <input type="radio" id="two" value="Two" v-model="picked">
  <label for="two">Two</label>
  <br>
  <span>Picked: {{ picked }}</span>
</div>
<script>
new Vue({
  el: '#example-4',
  data: {
    picked: ''
  }
})
</script>
{% endraw %}

### Select

单选：

``` html
<select v-model="selected">
  <option selected>A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>Selected: {{ selected }}</span>
```
{% raw %}
<div id="example-5" class="demo">
  <select v-model="selected">
    <option selected>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>Selected: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-5',
  data: {
    selected: null
  }
})
</script>
{% endraw %}

多选（绑定到一个数组）：

``` html
<select v-model="selected" multiple>
  <option selected>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>Selected: {{ selected | json }}</span>
```
{% raw %}
<div id="example-6" class="demo">
  <select v-model="selected" multiple style="width: 50px">
    <option selected>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <br>
  <span>Selected: {{ selected | json }}</span>
</div>
<script>
new Vue({
  el: '#example-6',
  data: {
    selected: []
  }
})
</script>
{% endraw %}

动态选项，用 `v-for` 渲染：

``` html
<select v-model="selected">
  <option v-for="option in options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<span>Selected: {{ selected }}</span>
```
``` js
new Vue({
  el: '...',
  data: {
    selected: 'A',
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
    ]
  }
})
```
{% raw %}
<div id="example-7" class="demo">
  <select v-model="selected">
    <option v-for="option in options" v-bind:value="option.value">
      {{ option.text }}
    </option>
  </select>
  <span>Selected: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-7',
  data: {
    selected: 'A',
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
    ]
  }
})
</script>
{% endraw %}

## 绑定 value

对于单选按钮，勾选框及选择框选项，`v-model` 绑定的 value 通常是静态字符串（对于勾选框是逻辑值）：

``` html
<!-- 当选中时，`picked` 为字符串 "a" -->
<input type="radio" v-model="picked" value="a">

<!-- `toggle` 为 true 或 false -->
<input type="checkbox" v-model="toggle">

<!-- 当选中时，`selected` 为字符串 "abc" -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

但是有时我们想绑定 value 到 Vue 实例的一个动态属性上，这时可以用 `v-bind` 实现，并且这个属性的值可以不是字符串。

### Checkbox

``` html
<input
  type="checkbox"
  v-model="toggle"
  v-bind:true-value="a"
  v-bind:false-value="b">
```

``` js
// 当选中时
vm.toggle === vm.a
// 当没有选中时
vm.toggle === vm.b
```

### Radio

``` html
<input type="radio" v-model="pick" v-bind:value="a">
```

``` js
// 当选中时
vm.pick === vm.a
```

### Select Options

``` html
<select v-model="selected">
  <!-- 对象字面量 -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```

``` js
// 当选中时
typeof vm.selected // -> 'object'
vm.selected.number // -> 123
```

## 参数特性

### lazy

在默认情况下，`v-model` 在`input` 事件中同步输入框值与数据，可以添加一个特性 `lazy`，从而改到在 `change` 事件中同步：

``` html
<!-- 在 "change" 而不是 "input" 事件中更新 -->
<input v-model="msg" lazy>
```

### number

如果想自动将用户的输入转为 Number 类型（如果原值的转换结果为 NaN 则返回原值），可以添加一个特性 `number`：

``` html
<input v-model="age" number>
```

### debounce

`debounce` 设置一个最小的延时，在每次敲击之后延时同步输入框的值与数据。如果每次更新都要进行高耗操作（例如在输入提示中 Ajax 请求），它较为有用。

``` html
<input v-model="msg" debounce="500">
```
 {% raw %}
<div id="debounce-demo" class="demo">
  {{ msg }}<br>
  <input v-model="msg" debounce="500">
</div>
<script>
new Vue({
  el:'#debounce-demo',
  data: { msg: 'edit me' }
})
</script>
{% endraw %}

注意 `debounce` 参数不会延迟 input 事件：它延迟“写入”底层数据。因此在使用 `debounce` 时应当用 `vm.$watch()` 响应数据的变化。若想延迟 DOM 事件，应当使用 [debounce 过滤器](/api/#debounce)。

