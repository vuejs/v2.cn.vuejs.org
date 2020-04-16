---
title: 使用 axios 访问 API
type: cookbook
order: 9
---

## 基本的示例

有很多时候你在构建应用时需要访问一个 API 并展示其数据。做这件事的方法有好几种，而使用基于 promise 的 HTTP 客户端 [axios](https://github.com/axios/axios) 则是其中非常流行的一种。

在本次实践中，我们会使用 [CoinDesk API](https://www.coindesk.com/api/) 来完成展示比特币价格且每分钟更新的工作。首先，我们要通过 npm/Yarn 或一个 CDN 链接安装 axios。

我们有很多种方式可以从 API 请求信息，但是最好首先确认这些数据看起来长什么样，以便进一步确定如何展示它。为此，我们会调用一次这个 API 并输出结果，以便我们能够看清楚它。如 CoinDesk 的 API 文档所述，请求会发送到 `https://api.coindesk.com/v1/bpi/currentprice.json`。所以，我们首先创建一个 data 里的 property 以最终放置信息，然后将会在 `mounted` 生命周期钩子中获取数据并赋值过去：

```js
new Vue({
  el: '#app',
  data () {
    return {
      info: null
    }
  },
  mounted () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => (this.info = response))
  }
})
```

```html
<div id="app">
  {{ info }}
</div>
```

我们得到的东西是这样的：

<p data-height="350" data-theme-id="32763" data-slug-hash="80043dfdb7b90f138f5585ade1a5286f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="First Step Axios and Vue" class="codepen">在 <a href="https://codepen.io">CodePen</a> 查看 Vue (<a href="https://codepen.io/Vue">@Vue</a>)的 <a href="https://codepen.io/team/Vue/pen/80043dfdb7b90f138f5585ade1a5286f/">axios 和 Vue：第一步</a>。</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

很好！我们已经得到了一些数据。但是它看起来还比较乱，所以我们会更好的展示它并添加一些错误处理，以防出现异常情况或请求超时。

## 真实示例：和数据协同工作

### 从一个 API 展示数据

通常情况下，我们需要的信息已经包含在了响应中，只需要遍历我们保存下来的内容就能正确地获取。在这个例子中，我们可以看到我们需要的价格信息在 `response.data.bpi` 中。如果我们换用这个，则输出是下面这样的：

```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
```

<p data-height="200" data-theme-id="32763" data-slug-hash="6100b10f1b4ac2961208643560ba7d11" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Second Step Axios and Vue" class="codepen">在 <a href="https://codepen.io">CodePen</a> 查看 Vue (<a href="https://codepen.io/Vue">@Vue</a>)的 <a href="https://codepen.io/team/Vue/pen/6100b10f1b4ac2961208643560ba7d11/">axios 和 Vue：第二步</a>。 </p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

这让展示的工作变得容易了很多，所以我们可以更新 HTML 以从获取的数据中仅仅展示真正需要的信息。我们会创建一个[过滤器](../api/#Vue-filter)来确保小数部分的合理展示。

```html
<div id="app">
  <h1>Bitcoin Price Index</h1>
  <div
    v-for="currency in info"
    class="currency"
  >
    {{ currency.description }}:
    <span class="lighten">
      <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
    </span>
  </div>
</div>
```

```js
filters: {
  currencydecimal (value) {
    return value.toFixed(2)
  }
},
```

<p data-height="300" data-theme-id="32763" data-slug-hash="9d59319c09eaccfaf35d9e9f11990f0f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Third Step Axios and Vue" class="codepen">在 <a href="https://codepen.io">CodePen</a> 查看 Vue (<a href="https://codepen.io/Vue">@Vue</a>)的 <a href="https://codepen.io/team/Vue/pen/9d59319c09eaccfaf35d9e9f11990f0f/">axios 和 Vue：第三步</a>。</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 错误处理

很多时候我们可能并没有从 API 获取想要的数据。这可能是由于很多种因素引起的，比如 axios 调用可能由于多种原因而失败，包括但不限于：

* API 不工作了；
* 请求发错了；
* API 没有按我们预期的格式返回信息。

当发送这个请求的时候，我们应该检查一下这些情况，并在所有情况下都返回相应的信息以便处理这些问题。在 axios 中，我们会通过使用 `catch` 来做这件事。

```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
  .catch(error => console.log(error))
```

这样我们就会知道在请求 API 的过程中是否有地方出错了，不过当数据长时间生成不出来或 API 不工作的时候会怎样呢？现在用户将会什么都看不到。我们可能想为这种情况构建一个加载效果，然后在根本无法获取数据时通知用户。

```js
new Vue({
  el: '#app',
  data () {
    return {
      info: null,
      loading: true,
      errored: false
    }
  },
  filters: {
    currencydecimal (value) {
      return value.toFixed(2)
    }
  },
  mounted () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => {
        this.info = response.data.bpi
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.loading = false)
  }
})
```

```html
<div id="app">
  <h1>Bitcoin Price Index</h1>

  <section v-if="errored">
    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
  </section>

  <section v-else>
    <div v-if="loading">Loading...</div>

    <div
      v-else
      v-for="currency in info"
      class="currency"
    >
      {{ currency.description }}:
      <span class="lighten">
        <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
      </span>
    </div>

  </section>
</div>
```

你可以在下面的例子中点击 Rerun 按钮以便看到我们从 API 获取数据时的加载状态：

<p data-height="300" data-theme-id="32763" data-slug-hash="6c01922c9af3883890fd7393e8147ec4" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Fourth Step Axios and Vue" class="codepen">在 <a href="https://codepen.io">CodePen</a> 查看 Vue (<a href="https://codepen.io/Vue">@Vue</a>)的 <a href="https://codepen.io/team/Vue/pen/6c01922c9af3883890fd7393e8147ec4/">axios 和 Vue：第四步</a>。</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

我们还可以做进一步优化，如用组件来实现不同部分、给出更明确的错误报告。这都取决于你使用的 API 以及应用的复杂度。

## 替代方案

### Fetch API

[Fetch API](https://developers.google.com/web/updates/2015/03/introduction-to-fetch) 是一个用于此类请求的强大的原生 API。你可能听说过 Fetch API 其中的一个好处，就是你不需要在使用它的时候额外加载一个外部资源。确实如此！但是……目前它还没有被浏览器完全支持，所以你仍然需要一个 polyfill。使用这个 API 还有很多别的注意事项，这也是为什么大家现阶段还是更喜欢 axios 多一些。当然这个事情在未来可能会发生改变。

如果你对使用 Fetch API 有兴趣，这里有一些[非常棒的文章](https://scotch.io/@bedakb/lets-build-type-ahead-component-with-vuejs-2-and-fetch-api)来解释如何使用它。

## 总结

其实 Vue 和 axios 可以在一起配合的事情不只是访问和展示一个 API。你也可以和 Serverless Function 通信，向一个有写权限的 API 发送发布/编辑/删除请求等等。由于这两个库的集成很简单直接，它便成为了需要在工作流中集成 HTTP 客户端的开发者的常见选择。
