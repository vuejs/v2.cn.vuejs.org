---
title: 路由
type: guide
order: 501
---

## 官方路由

对于大多数单页面应用，都推荐使用官方支持的 [vue-router 库](https://github.com/vuejs/vue-router)。更多细节可以移步 [vue-router 文档](https://router.vuejs.org/)。

## 从零开始简单的路由

如果你只需要非常简单的路由而不想引入一个功能完整的路由库，可以像这样动态渲染一个页面级的组件：

``` js
const NotFound = { template: '<p>Page not found</p>' }
const Home = { template: '<p>home page</p>' }
const About = { template: '<p>about page</p>' }

const routes = {
  '/': Home,
  '/about': About
}

new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || NotFound
    }
  },
  render (h) { return h(this.ViewComponent) }
})
```
结合 HTML5 History API，你可以建立一个麻雀虽小但是五脏俱全的客户端路由器。可以直接看[实例应用](https://github.com/chrisvfritz/vue-2.0-simple-routing-example)。

## 整合第三方路由

如果你有更偏爱的第三方路由，如 [Page.js](https://github.com/visionmedia/page.js) 或者 [Director](https://github.com/flatiron/director)，整合起来也[一样简单](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/compare/master...pagejs)。这里有一个使用了 Page.js 的[完整示例](https://github.com/chrisvfritz/vue-2.0-simple-routing-example/tree/pagejs)。
