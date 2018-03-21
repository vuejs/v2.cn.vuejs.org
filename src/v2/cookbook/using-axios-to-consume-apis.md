---
title: 使用 Axios 访问 API
type: cookbook
order: 9
---

## 简单的示例

你可能在构建应用程序的时候有很多次需要访问一个 API 并展示其数据。我们有很多种方法做这件事，而使用基于 promise 的 HTTP 客户端 [axios](https://github.com/axios/axios) 则是众多方法中比较流行的一个。

在本次实践中，我们会使用 [CoinDesk API](https://www.coindesk.com/api/) 来完成展示比特币价格且每分钟更新的工作。熟悉，我们要通过 npm/yarn 或一个 CDN 链接安装 axios。

我们有很多种方式可以从 API 请求信息，但是我们最好首先确认这些数据的样子，以便进一步确定如何展示它。为了做到这一点，我们会调用一次这个 API 病输出结果，以便我们能够看清楚它。我们查阅了 CoinDesk 的 API 文档，发现其请求是发送到 `https://api.coindesk.com/v1/bpi/currentprice.json` 的。所以，我们首先创建一个 data 里的属性以最终放置我们的信息，然后我们将会在 `mounted` 生命周期钩子中获取数据并赋值过去：

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

<p data-height="350" data-theme-id="32763" data-slug-hash="80043dfdb7b90f138f5585ade1a5286f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="First Step Axios and Vue" class="codepen">See the Pen <a href="https://codepen.io/team/Vue/pen/80043dfdb7b90f138f5585ade1a5286f/">First Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

很好！我们已经得到了一些数据。但是它看起来还比较乱，所以我们会更好的展示它并添加一些错误处理，以应对事情未如我们所愿或请求超时的情形。

## 真实示例：和数据协同工作

### 从一个 API 展示数据

从请求的响应中获取信息是一件再正常不过的事情，同时我们也需要准确的访问到它然后把它保存好。在这个例子中，我们可以看到我们需要的价格信息在 `response.data.bpi` 中。如果我们换用这个，则输出是下面这样的：

```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
```

<p data-height="200" data-theme-id="32763" data-slug-hash="6100b10f1b4ac2961208643560ba7d11" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Second Step Axios and Vue" class="codepen">See the Pen <a href="https://codepen.io/team/Vue/pen/6100b10f1b4ac2961208643560ba7d11/">Second Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

这让展示的工作变得容易了很多，所以我们可以更新 HTML 以从获取的数据中仅仅展示真正需要的信息。我们会创建一个[过滤器](../api/#Vue-filter)来确保小数部分的合理展示。

```html
<div id="app">
  <h1>Bitcoin Price Index</h1>
  <div v-for="currency in info" class="currency">
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

<p data-height="300" data-theme-id="32763" data-slug-hash="9d59319c09eaccfaf35d9e9f11990f0f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Third Step Axios and Vue" class="codepen">See the Pen <a href="https://codepen.io/team/Vue/pen/9d59319c09eaccfaf35d9e9f11990f0f/">Third Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 错误处理

很多时候我们可能并没有从 API 获取想要的数据。这可能是由于很多种因素引起的，比如 axios 调用可能会失败，包括：

* API 不工作了。
* 请求发错了。
* 这个 API 没有返回预想中的格式的信息。

当发送这个请求的时候，我们应该检查一下当前的环境，并自行列出所有可能出现的状态及其处理方式。在 axios 中，我们会通过使用 `catch` 来做这件事。

```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
  .catch(error => console.log(error))
```

这样我们就会知道在请求 API 的过程中是否有地方出错了，不过当数据长时间生成不出来或 API 不工作的时候会怎样呢？现在用户高将会什么都看不到。我们可能想为这种情况构建一个加载效果，然后告诉用户我们还无法获取数据。

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
      }).
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

    <div v-else v-for="currency in info" class="currency">
      {{ currency.description }}:
      <span class="lighten">
        <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
      </span>
    </div>

  </section>
</div>
```

你可以重复点击按钮并在我们从 API 获取数据时清晰的看到加载中的状态：

<p data-height="300" data-theme-id="32763" data-slug-hash="6c01922c9af3883890fd7393e8147ec4" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Fourth Step Axios and Vue" class="codepen">See the Pen <a href="https://codepen.io/team/Vue/pen/6c01922c9af3883890fd7393e8147ec4/">Fourth Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

我们还可以从不同的层次更加深入的改进这个组件的用法，并依赖你使用的 API 以及整个应用的复杂度提供更清晰的错误处理，

## 替代方案

### Fetch API

[Fetch API](https://developers.google.com/web/updates/2015/03/introduction-to-fetch) 是一个强大的原声 API，适用于这种类型的请求。你可能听说过 Fetch API 其中的一个好处，就是你不需要在使用它的时候额外加在一个外部资源，除非浏览器还不支持这个 API，因为这时你需要一个 polyfill。使用这个 API 还有很多别的注意事项，这也是为什么大家现阶段还是更喜欢 axios 多一些。当然这个事情在未来可能会发生改变。

如果你对使用 Fetch API 有兴趣，这里有一些[非常棒的文章](https://scotch.io/@bedakb/lets-build-type-ahead-component-with-vuejs-2-and-fetch-api)来解释如何使用它。

## 总结

其实 Vue 和 axios 可以在一起配合的事情不只是访问和展示一个 API。你也可以和 Serverless Function 交流，向一个有写权限的 API 发送 post/edit/delete 请求等等。将这两个库直接集成起来使用会成为开发者集成 HTTP 客户端到他们的工作流时的一种非常普遍的选择，
