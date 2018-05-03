---
title: 添加实例属性
type: cookbook
order: 2
---

## 基本的示例

你可能会在很多组件里用到数据/实用工具，但是不想[污染全局作用域](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch3.md)。这种情况下，你可以通过在原型上定义它们使其在每个 Vue 的实例中可用。

``` js
Vue.prototype.$appName = 'My App'
```

这样 `$appName` 就在所有的 Vue 实例中可用了，甚至在实例被创建之前就可以。如果我们运行：

``` js
new Vue({
  beforeCreate: function () {
    console.log(this.$appName)
  }
})
```

则控制台会打印出 `My App`。就这么简单！

## 为实例属性设置作用域的重要性

你可能会好奇：

> “为什么 `appName` 要以 `$` 开头？这很重要吗？它会怎样？”

这里没有什么魔法。`$` 是在 Vue 所有实例中都可用的属性的一个简单约定。这样做会避免和已被定义的数据、方法、计算属性产生冲突。

> “你指的冲突是什么意思？”

另一个好问题！如果你写成：

``` js
Vue.prototype.appName = 'My App'
```

那么你希望下面的代码输出什么呢？

``` js
new Vue({
  data: {
    // 啊哦，`appName` *也*是一个我们定义的实例属性名！😯
    appName: 'The name of some other app'
  },
  beforeCreate: function () {
    console.log(this.appName)
  },
  created: function () {
    console.log(this.appName)
  }
})
```

日志中会先出现 `"My App"`，然后出现 `"The name of some other app"`，因为 `this.appName` 在实例被创建之后被 `data` [覆写了](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch5.md)。我们通过 `$` 为实例属性设置作用域来避免这种事情发生。你还可以根据你的喜好使用自己的约定，诸如 `$_appName` 或 `ΩappName`，来避免和插件或未来的插件相冲突。

## 真实的示例：通过 axios 替换 Vue Resource

比如你打算替换已经废弃的 [Vue Resource](https://medium.com/the-vue-point/retiring-vue-resource-871a82880af4) 库。你实在是很喜欢通过 `this.$http` 来访问请求方法，希望换成 axios 以后还能继续这样用。

你需要做的事情是把 axios 引入你的项目：

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.15.2/axios.js"></script>

<div id="app">
  <ul>
    <li v-for="user in users">{{ user.name }}</li>
  </ul>
</div>
```

设置 `Vue.prototype.$http` 为 `axios` 的别名：

``` js
Vue.prototype.$http = axios
```

然后你就可以在任何 Vue 实例中使用类似 `this.$http.get` 的方法：

``` js
new Vue({
  el: '#app',
  data: {
    users: []
  },
  created () {
    var vm = this
    this.$http
      .get('https://jsonplaceholder.typicode.com/users')
      .then(function (response) {
        vm.users = response.data
      })
  }
})
```

## 原型方法的上下文

你可能没有意识到，在 JavaScript 中一个原型的方法会获得该实例的上下文。也就是说它们可以使用 `this` 访问数据、计算属性、方法或其它任何定义在实例上的东西。

让我们将其用在一个名为 `$reverseText` 的方法上：

``` js
Vue.prototype.$reverseText = function (propertyName) {
  this[propertyName] = this[propertyName]
    .split('')
    .reverse()
    .join('')
}

new Vue({
  data: {
    message: 'Hello'
  },
  created: function () {
    console.log(this.message) // => "Hello"
    this.$reverseText('message')
    console.log(this.message) // => "olleH"
  }
})
```

注意如果你使用了 ES6/2015 的箭头函数，则其绑定的上下文**不会**正常工作，因为它们会隐式地绑定其父级作用域。也就是说使用箭头函数的版本：

``` js
Vue.prototype.$reverseText = propertyName => {
  this[propertyName] = this[propertyName]
    .split('')
    .reverse()
    .join('')
}
```

会抛出一个错误：

``` log
Uncaught TypeError: Cannot read property 'split' of undefined
```

## 何时避免使用这个模式

只要你对原型属性的作用域保持警惕，那么使用这个模式就是安全的——保证了这一点，就不太会出 bug。

然而，有的时候它会让其他开发者感到混乱。例如他们可能看到了 `this.$http`，然后会想“哦，我从来没见过这个 Vue 的功能”，然后他们来到另外一个项目又发现 `this.$http` 是未被定义的。或者你打算去搜索如何使用它，但是搜不到结果，因为他们并没有发现这是一个 axios 的别名。

**这种便利是以显性表达为代价的。**当我们查阅一个组件的时候，要注意交代清楚 `$http` 是从哪来的：Vue 自身、一个插件、还是一个辅助库？

那么有别的替代方案吗？

## 替代方案

### 当没有使用模块系统时

在**没有**模块系统 (比如 webpack 或 Browserify) 的应用中，存在一种*任何*重 JS 前端应用都常用的模式：一个全局的 `App` 对象。

如果你想要添加的东西跟 Vue 本身没有太多关系，那么这是一个不错的替代方案。举个例子：

``` js
var App = Object.freeze({
  name: 'My App',
  version: '2.1.4',
  helpers: {
    // 这我们之前见到过的 `$reverseText` 方法
    // 的一个纯函数版本
    reverseText: function (text) {
      return text
        .split('')
        .reverse()
        .join('')
    }
  }
})
```

<p class="tip">如果你在好奇 `Object.freeze`，它做的事情是阻止这个对象在未来被修改。这实质上是将它的属性都设为了常量，避免在未来出现状态的 bug。</p>

现在这些被共享的属性的来源就更加明显了：在应用中的某个地方有一个被定义好的 `App` 对象。你只需在项目中搜索就可以找到它。

这样做的另一个好处是 `App` 可以在你代码的*任何地方*使用，不管它是否是 Vue 相关的。包括向实例选项直接附加一些值而不必进入一个函数去访问 `this` 上的属性来得到这些值：

``` js
new Vue({
  data: {
    appVersion: App.version
  },
  methods: {
    reverseText: App.helpers.reverseText
  }
})
```

### 当使用模块系统时

当使用模块系统的时候，你可以轻松地把共享的代码组织成模块，然后把那些模块 `require`/`import` 到任何你所需要的地方。这是一个典型的显式做法，因为在每个文件里你都能得到一份依赖清单。你可以*准确地*知道每个依赖的来历。

虽然显然更啰嗦，但是这种方法确实是最可维护的，尤其是当和多人一起协作一个大型应用的时候。
