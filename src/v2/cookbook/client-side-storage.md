---
title: 客户端存储
type: cookbook
order: 11
---

## 基本的示例

客户端存储是快速为一个应用进行性能优化的绝佳方法。通过把数据存储在浏览器中，用户不必每次都向服务器请求获取同一个信息。在你离线时，使用本地存储的数据而不是向远端服务器上请求数据就显得非常有用，甚至在线用户也可以从中获益。客户端存储可以通过这些技术来实现：[cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)、[Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) (更准确地说是“Web Storage”)、[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 和 [WebSQL](https://www.w3.org/TR/webdatabase/) (这项技术已经被废弃了，你不应该在新项目中使用它)。

在这个 cookbook 的条目中，我们将专注于最简单的存储机制：Local Storage。Local Storage 使用键/值对来存储数据。它仅支持存储简单的值，但也可以通过 JSON 编解码来存储复杂的数据。总的来说，Local Storage 适合存储你希望进行持久化的较小数据集，比如用户偏好设置或表单数据。更大规模和更复杂的数据则适合存储在 IndexedDB 中。

让我们从一个表单的简单示例开始：

``` html
<div id="app">
  My name is <input v-model="name">
</div>
```

这个示例中的表单字段绑定了一个叫 `name` 的值。下面是 JavaScript 代码：

``` js
const app = new Vue({
  el: '#app',
  data: {
    name: ''
  },
  mounted() {
    if (localStorage.name) {
      this.name = localStorage.name;
    }
  },
  watch: {
    name(newName) {
      localStorage.name = newName;
    }
  }
});
```

请注意 `mounted` 和 `watch` 两个方法。我们使用 `mounted` 方法来从 `localStorage` 中加载数据。为了将数据写入，我们侦听 `name` 值的变化，并将数据实时写入。

你可以在下面运行这个程序：

<p data-height="265" data-theme-id="0" data-slug-hash="KodaKb" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="testing localstorage" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/KodaKb/">testing localstorage</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

在表单中输入一些东西，然后刷新页面。你会发现之前输入的值自动出现了。别忘了你的浏览器提供了好用的开发者工具来检查客户端存储的情况。这是一个使用 Firefox 的示例：

![Firefox 中的 Storage 开发工具](/images/devtools-storage.png)

这是一个使用 Chrome 的示例：

![Chrome 中的 Storage 开发工具](/images/devtools-storage-chrome.png)

最后，这是一个使用 Microsoft Edge 的示例。请注意，你可以在 Debugger tab 下找到应用存储的值。

![Edge 中的 Storage 开发工具](/images/devtools-storage-edge.png)

<p class="tip">除此之外，这些开发工具也可以用来移除存储的数据，在测试时会很有用。</p>

将变化的值立即写入或许是不被推荐的。让我们来考虑一个略微进阶的示例，首先是升级后的表单。

``` html
<div id="app">
  <p>
    My name is <input v-model="name">
    and I am <input v-model="age"> years old.
  </p>
  <p>
    <button @click="persist">Save</button>
  </p>
</div>
```

现在我们有了两个字段 (依然是绑定到一个 Vue 实例上)，但是多了一个可以运行 `persist` 方法的按钮。让我们来看 JavaScript 代码。

``` js
const app = new Vue({
  el: '#app',
  data: {
    name: '',
    age: 0
  },
  mounted() {
    if (localStorage.name) {
      this.name = localStorage.name;
    }
    if (localStorage.age) {
      this.age = localStorage.age;
    }
  },
  methods: {
    persist() {
      localStorage.name = this.name;
      localStorage.age = this.age;
      console.log('now pretend I did more stuff...');
    }
  }
})
```

像之前一样，`mounted` 方法是用来加载持久化了的数据 (如果存在的话)。这一次，数据只会在点击按钮后才被持久化。我们也可以在数据被存储之前，对数据进行验证或转换。你也可以将日期一并存储进去来记录这些数据是何时被存储的。有了这些元数据，`mounted` 方法就可以通过逻辑判断来决定是否再次对数据进行存储。你可以在下面对这个版本进行尝试。

<p data-height="265" data-theme-id="0" data-slug-hash="rdOjLN" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="testing localstorage 2" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/rdOjLN/">testing localstorage 2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 处理复杂的数据

就像在前文中提到的那样，Local Storage 只适合用于存储简单的值。为了存储对象和数组这样更复杂的数据，你必须使用 JSON 来对数据进行序列化和反序列化。下面这个示例演示了对一个猫的数组进行持久化的操作 (这个数组类型不能更好了)。

``` html
<div id="app">
  <h2>Cats</h2>
  <div v-for="(cat, n) in cats">
    <p>
      <span class="cat">{{ cat }}</span>
      <button @click="removeCat(n)">Remove</button>
    </p>
  </div>

  <p>
    <input v-model="newCat">
    <button @click="addCat">Add Cat</button>
  </p>
</div>
```

这个“app”的顶部有一个简单的列表 (还有一个可以移除一只猫的按钮)，底部有一个添加一只新猫的表单。现在我们来看 JavaScript 代码。

``` js
const app = new Vue({
  el: '#app',
  data: {
    cats: [],
    newCat: null
  },
  mounted() {
    if (localStorage.getItem('cats')) {
      try {
        this.cats = JSON.parse(localStorage.getItem('cats'));
      } catch(e) {
        localStorage.removeItem('cats');
      }
    }
  },
  methods: {
    addCat() {
      // 确保他们输入了一些东西
      if (!this.newCat) {
        return;
      }

      this.cats.push(this.newCat);
      this.newCat = '';
      this.saveCats();
    },
    removeCat(x) {
      this.cats.splice(x, 1);
      this.saveCats();
    },
    saveCats() {
      const parsed = JSON.stringify(this.cats);
      localStorage.setItem('cats', parsed);
    }
  }
})
```

在这个应用中，我们转而调用 Local Storage API 而不再“直接”访问 Local Storage。这两种方法都是有效的，但是调用 API 往往是更值得推荐的方法。`mounted` 方法现在需要先获取数据，然后对 JSON 格式的数据进行解析。如果这里出现了任何错误，我们就认为数据已经损坏了并将它删除。(请记住，如果你的网页应用使用了客户端存储技术，用户可以随意访问并修改这些存储的数据。)

我们现在有三种方法可以对猫进行操作。`addCat` 和 `removeCat` 方法负责更新储存在 `this.cats` 中的“实时”Vue 数据。在此之后，它们通过 `saveCats` 方法来序列化和持久化这些数据。你可以在下面体验一下这个版本：

<p data-height="265" data-theme-id="0" data-slug-hash="qoYbyW" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="localstorage, complex" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/qoYbyW/">localstorage, complex</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 替代方案

尽管 Local Storage API 较为简单，但它缺少了一些在很多应用中都很有用的基本特性。下面几个插件包装了对 Local Storage 的访问并让它变得简单易用，同时加入了诸如默认值等功能。

* [vue-local-storage](https://github.com/pinguinjkeke/vue-local-storage)
* [vue-reactive-storage](https://github.com/ropbla9/vue-reactive-storage)
* [vue2-storage](https://github.com/yarkovaleksei/vue2-storage)

## 总结

虽然浏览器永远不会取代服务器的持久化系统，但是通过多种方法在本地缓存数据可以让你的应用的性能得到大幅度的提升，而与 Vue.js 相结合则会让它更为强大。
