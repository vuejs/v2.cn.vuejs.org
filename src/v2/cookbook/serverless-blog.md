---
title: 创建一个基于 CMS 的博客
type: cookbook
order: 5
---

恭喜你已经发布了你的 Vue.js 网站！现在你想要在网站上快速添加一个博客系统，但不想新起一台服务器去部署一个 WordPress 实例 (或任何基于数据库的 CMS)。你希望只添加一些 Vue.js 的博客组件和一些路由就能搞定对吧？你想要的就是直接消费你的 Vue.js 应用中的 API 来完全支撑起一个博客站。这份教程将会告诉你如何做到这一点，所以让我们来看看吧！

我们将会使用 Vue.js 快速构建一个基于 CMS 的博客站。它使用了 [ButterCMS](https://buttercms.com/)，一个 API 优先的 CMS，让你使用 ButterCMS 仪表盘管理内容并将我们的内容 API 集成到你的 Vue.js 应用中。你可以为一个新的项目或在一个已有的 Vue.js 项目使用 ButterCMS。

![Butter 仪表盘](https://user-images.githubusercontent.com/160873/36677285-648798e4-1ad3-11e8-9454-d22fca8280b7.png "Butter Dashboard")

## 安装

在你的命令行中运行：

```bash
npm install buttercms --save
```

Butter 也可以通过 CDN 加载：

```html
<script src="https://cdnjs.buttercms.com/buttercms-1.1.0.min.js"></script>
```

## 快速开始

设置你的 API token：

```javascript
var butter = require('buttercms')('your_api_token');
```

使用 ES6：

```javascript
import Butter from 'buttercms';
const butter = Butter('your_api_token');
```

使用 CDN：

```html
<script src="https://cdnjs.buttercms.com/buttercms-1.1.0.min.js"></script>
<script>
  var butter = Butter('your_api_token');
</script>
```

将这个文件导入到任何你想使用 ButterCMS 的组件中。然后在浏览器的命令行中运行：

```javascript
butter.post.list({page: 1, page_size: 10}).then(function(response) {
  console.log(response)
})
```

这个 API 请求会获取你的博客文章列表。你将会在请求的响应中看到你的账户的一篇示例博文。

## 展示博文

为了展示博文，我们在应用中创建了一个 `/blog` 路由 (使用 Vue Router) 并从 Butter API 获取博文列表，同样的还创建了一个 `/blog/:slug` 路由来处理单篇博文。

你可以翻阅 ButterCMS [API 参考文档](https://buttercms.com/docs/api/?javascript#blog-posts) 来了解更多选项，比如按分类或作者过滤。请求的响应也会包含一些用在翻页导航上的元数据。

`router/index.js:`

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import BlogHome from '@/components/BlogHome'
import BlogPost from '@/components/BlogPost'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/blog/',
      name: 'blog-home',
      component: BlogHome
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: BlogPost
    }
  ]
})
```

然后创建 `components/BlogHome.vue` 作为你的博客首页，列出你最近的博文。

```html
<script>
  import { butter } from '@/buttercms'
  export default {
    name: 'blog-home',
    data() {
      return {
        page_title: 'Blog',
        posts: []
      }
    },
    methods: {
      getPosts() {
        butter.post.list({
          page: 1,
          page_size: 10
        }).then(res => {
          this.posts = res.data.data
        })
      }
    },
    created() {
      this.getPosts()
    }
  }
</script>

<template>
  <div id="blog-home">
      <h1>{{ page_title }}</h1>
      <!-- 创建 `v-for` 并为 Vue 应用一个 `key`，该示例使用了 `slug` 和 `index` 的组合。 -->
      <div
        v-for="(post,index) in posts"
        :key="post.slug + '_' + index"
      >
        <router-link :to="'/blog/' + post.slug">
          <article class="media">
            <figure>
              <!-- 使用 `:` 绑定结果 -->
              <!-- 使用一组 `v-if`/`else` 判断它们是否是 `featured_image` -->
              <img
                v-if="post.featured_image"
                :src="post.featured_image"
                alt=""
              >
              <img
                v-else
                src="http://via.placeholder.com/250x250"
                alt=""
              >
            </figure>
            <h2>{{ post.title }}</h2>
            <p>{{ post.summary }}</p>
          </article>
        </router-link>
      </div>
  </div>
</template>
```

这是它的样子 (注意为了快速设置样式，我们从 https://bulma.io/ 添加了 CSS)：

![buttercms-bloglist](https://user-images.githubusercontent.com/160873/36868500-1b22e374-1d5e-11e8-82a0-20c8dc312716.png)

现在创建 `components/BlogPost.vue` 用来展示你的单篇博文页面。

```html
<script>
  import { butter } from '@/buttercms'
  export default {
    name: 'blog-post',
    data() {
      return {
        post: {}
      }
    },
    methods: {
      getPost() {
        butter.post.retrieve(this.$route.params.slug)
          .then(res => {
            this.post = res.data
          }).catch(res => {
            console.log(res)
          })
      }
    },
    created() {
      this.getPost()
    }
  }
</script>

<template>
  <div id="blog-post">
    <h1>{{ post.data.title }}</h1>
    <h4>{{ post.data.author.first_name }} {{ post.data.author.last_name }}</h4>
    <div v-html="post.data.body"></div>

    <router-link
      v-if="post.meta.previous_post"
      :to="/blog/ + post.meta.previous_post.slug"
      class="button"
    >
      {{ post.meta.previous_post.title }}
    </router-link>
    <router-link
      v-if="post.meta.next_post"
      :to="/blog/ + post.meta.next_post.slug"
      class="button"
    >
      {{ post.meta.next_post.title }}
    </router-link>
  </div>
</template>
```

预览效果如下：

![buttercms-blogdetail](https://user-images.githubusercontent.com/160873/36868506-218c86b6-1d5e-11e8-8691-0409d91366d6.png)

现在我们的应用已经拉取了所有博文并且可以导航到每个独立的博文。但上一篇博文/下一篇博文的链接还不工作。

需要注意的一点是在通过参数控制路由时，比如当用户从 `/blog/foo` 导航至 `/blog/bar` 时，我们复用了相同的组件实例。因为这两个路由渲染了相同的组件，所以比销毁老实例再创建新实例的效率更高。

<p class="tip">注意，用这种方式使用组件意味着这个组件的生命周期钩子将不会被调用。请移步 Vue Router 的文档了解[动态路由匹配](https://router.vuejs.org/en/essentials/dynamic-matching.html)。</p>

为了解决这个问题，我们需要匹配 `$route` 对象并在路由发生变化的时候调用 `getPost()`。

更新 `components/BlogPost.vue` 中的 `<script>` 部分：

```html
<script>
  import { butter } from '@/buttercms'
  export default {
    name: 'blog-post',
    data() {
      return {
        post: null
      }
    },
    methods: {
      getPost() {
        butter.post.retrieve(this.$route.params.slug)
          .then(res => {
            this.post = res.data
          }).catch(res => {
            console.log(res)
          })
      }
    },
    watch: {
      $route: {
        immediate: true,
        handler(to, from) {
          this.getPost()
        }
      }
    }
  }
</script>
```

现在你的应用就有了可工作的博客，你可以在 ButterCMS 仪表盘便捷地更新它。

## 分类、标签和作者

使用 Butter 关于分类、标签和作者的 API 来设置和过滤你的博客。

你可以移步到 ButterCMS API 参考文档来进一步了解这些对象：

* [Categories](https://buttercms.com/docs/api/?ruby#categories)
* [Tags](https://buttercms.com/docs/api/?ruby#tags)
* [Authors](https://buttercms.com/docs/api/?ruby#authors)

这里有一个示例，列出所有分类并根据分类获取博文列表。在生命周期钩子 `created()` 中调用这些方法：

```javascript
methods: {
  // ...
  getCategories() {
    butter.category.list()
      .then(res => {
        console.log('List of Categories:')
        console.log(res.data.data)
      })
  },
  getPostsByCategory() {
    butter.category.retrieve('example-category', {
        include: 'recent_posts'
      })
      .then(res => {
        console.log('Posts with specific category:')
        console.log(res)
      })
  }
},
created() {
  // ...
  this.getCategories()
  this.getPostsByCategory()
}
```

## 替代方案

有一个替代方案，尤其在你只喜欢写 Markdown 时适用，就是使用诸如 [Nuxtent](https://nuxtent-module.netlify.com/guide/writing/#async-components) 的工具。Nuxtent 允许你在 Markdown 文件内部使用 `Vue Component`。它类似一个静态站点工具 (例如 Jekyll)，让你在 Markdown 文件中撰写你的博文。Nuxtent 将 Vue.js 和 Markdown 很好地整合起来，让你完全生活在 Vue.js 的世界里。

## 总结

差不多就是这些了！现在你已经在自己的应用中拥有了一个可以正常工作的 CMS 博客。我们希望这份教程可以帮助你，使你的 Vue.js 开发体验更有乐趣 🙂
