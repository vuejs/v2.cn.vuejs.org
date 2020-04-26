---
title: 表单校验
type: cookbook
order: 3
---

## 基本的示例

<div class="vueschool"><a href="https://vueschool.io/lessons/vuejs-form-validation-diy?friend=vuejs" target="_blank" rel="sponsored noopener" title="Free Vue.js Form Validation Lesson">Watch a free lesson on Vue School</a></div>

表单校验是浏览器原生支持的，但是有的时候用不同的浏览器处理起来需要一些小技巧。即使当表单校验已经被完美支持，你也还是有很多时候需要进行自定义的校验。这时一个更加手动的基于 Vue 的解决方案可能会更适合。我们来看一个简单的示例。

给定一个表单，包含三个字段，其中两个是必填项。我们先来看看 HTML：

``` html
<form
  id="app"
  @submit="checkForm"
  action="https://vuejs.org/"
  method="post"
>

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">Name</label>
    <input
      id="name"
      v-model="name"
      type="text"
      name="name"
    >
  </p>

  <p>
    <label for="age">Age</label>
    <input
      id="age"
      v-model="age"
      type="number"
      name="age"
      min="0"
    >
  </p>

  <p>
    <label for="movie">Favorite Movie</label>
    <select
      id="movie"
      v-model="movie"
      name="movie"
    >
      <option>Star Wars</option>
      <option>Vanilla Sky</option>
      <option>Atomic Blonde</option>
    </select>
  </p>

  <p>
    <input type="submit" value="Submit">
  </p>

</form>
```

我们从头到尾看一遍，这个 `<form>` 标记上有一个我们将会用在 Vue 组件上的 ID。这里有一个你稍后会看到的 `submit` 处理函数，而这里的 `action` 是一个可能指向了某个真实服务器的临时 URL (当然你在服务端也是要有校验的)。

下面有一段内容，会根据错误状态进行显示或隐藏。它将会在表单的最顶端渲染一个简单的错误列表。同时要注意我们会在提交的时候进行校验，而不是每个字段被修改的时候。

最后值得注意的是这三个字段都有一个对应的 `v-model` 来连接它们的值，我们将会在 JavaScript 中使用它。现在我们就来看一下。

``` js
const app = new Vue({
  el: '#app',
  data: {
    errors: [],
    name: null,
    age: null,
    movie: null
  },
  methods:{
    checkForm: function (e) {
      if (this.name && this.age) {
        return true;
      }

      this.errors = [];

      if (!this.name) {
        this.errors.push('Name required.');
      }
      if (!this.age) {
        this.errors.push('Age required.');
      }

      e.preventDefault();
    }
  }
})
```

非常短小精悍。我们定义了一个数组来放置错误，并将这三个表单字段的默认值设为 `null`。`checkForm` 的逻辑 (在表单提交时运行) 只会检查姓名和年龄，因为电影是选填的。如果它们是空的，那么我们会检查每一个字段并设置相应的错误，差不多就是这样。你可以在下面运行这个 demo。不要忘记提交成功时它会 POST 到一个临时的 URL。

<p data-height="265" data-theme-id="0" data-slug-hash="GObpZM" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 1" class="codepen">在 <a href="https://codepen.io">CodePen</a> 查看 Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) 的 <a href="https://codepen.io/cfjedimaster/pen/GObpZM/">表单校验 1</a>。</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## 使用自定义校验

对于第二个示例来说，第二个文本字段 (年龄) 变换成了电子邮件地址，它将会通过一些自定义的逻辑来校验。这部分代码来自 StackOverflow 的问题：[如何在 JavaScript 中校验电子邮件地址](https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript)。这是一个很好的问题，因为它会让 Facebook 上最激烈的政治、宗教争论看上去都只是“哪家的啤酒最好喝”这样的小分歧了。讲真的这很疯狂。我们来看 HTML，尽管它和第一个例子很接近。

``` html
<form
  id="app"
  @submit="checkForm"
  action="https://vuejs.org/"
  method="post"
  novalidate="true"
>

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">Name</label>
    <input
      id="name"
      v-model="name"
      type="text"
      name="name"
    >
  </p>

  <p>
    <label for="email">Email</label>
    <input
      id="email"
      v-model="email"
      type="email"
      name="email"
    >
  </p>

  <p>
    <label for="movie">Favorite Movie</label>
    <select
      id="movie"
      v-model="movie"
      name="movie"
    >
      <option>Star Wars</option>
      <option>Vanilla Sky</option>
      <option>Atomic Blonde</option>
    </select>
  </p>

  <p>
    <input
      type="submit"
      value="Submit"
    >
  </p>

</form>
```

尽管这里的不同点很小，注意顶端的 `novalidate="true"`。但是这很重要，因为浏览器会尝试在 `type="email"` 的字段校验邮件地址。坦白说在这个案例中浏览器的校验规则是值得信任的，不过我们想要创建一个自定义校验的例子，所以把它禁用了。以下是更新后的 JavaScript。

``` js
const app = new Vue({
  el: '#app',
  data: {
    errors: [],
    name: null,
    email: null,
    movie: null
  },
  methods: {
    checkForm: function (e) {
      this.errors = [];

      if (!this.name) {
        this.errors.push("Name required.");
      }
      if (!this.email) {
        this.errors.push('Email required.');
      } else if (!this.validEmail(this.email)) {
        this.errors.push('Valid email required.');
      }

      if (!this.errors.length) {
        return true;
      }

      e.preventDefault();
    },
    validEmail: function (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
})
```

如你所见，我们添加了一个新方法 `validEmail`，它将会在 `checkForm` 中被调用了。我们现在可以这样运行示例：

<p data-height="265" data-theme-id="0" data-slug-hash="vWqNXZ" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 2" class="codepen">在 <a href="https://codepen.io">CodePen</a> 查看 Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) 的 <a href="https://codepen.io/cfjedimaster/pen/vWqNXZ/">表单校验 2</a>。</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## 另一个自定义校验的例子

在第三个示例中，我们已经构建了一些你可能在一些调研类应用中见过的东西。用户需要花掉“预算”来为歼星舰模型装配一套部件。总价必须等于 100。先看 HTML。

``` html
<form
  id="app"
  @submit="checkForm"
  action="https://vuejs.org/"
  method="post"
  novalidate="true"
>

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    Given a budget of 100 dollars, indicate how much
    you would spend on the following features for the
    next generation Star Destroyer. Your total must sum up to 100.
  </p>

  <p>
    <input
      v-model.number="weapons"
      type="number"
      name="weapons"
    > Weapons <br/>
    <input
      v-model.number="shields"
      type="number"
      name="shields"
    > Shields <br/>
    <input
      v-model.number="coffee"
      type="number"
      name="coffee"
    > Coffee <br/>
    <input
      v-model.number="ac"
      type="number"
      name="ac"
    > Air Conditioning <br/>
    <input
      v-model.number="mousedroids"
      type="number"
      name="mousedroids"
    > Mouse Droids <br/>
  </p>

  <p>
    Current Total: {{total}}
  </p>

  <p>
    <input
      type="submit"
      value="Submit"
    >
  </p>

</form>
```

这组输入框覆盖了五个不同的部件。注意这里为 `v-model` attribute 添加了 `.number`。它会告诉 Vue 将其值作为数字来使用。不过这里有一个小小的 bug，那就是当其值为空的时候，它会回到字符串格式，稍后你将会看到变通的办法。为了让用户使用起来更方便，我们添加展示了一个当前的总和，这样我们就能够实时的看到它们一共花掉了多少钱。现在我们来看看 JavaScript。

``` js
const app = new Vue({
  el: '#app',
  data:{
    errors: [],
    weapons: 0,
    shields: 0,
    coffee: 0,
    ac: 0,
    mousedroids: 0
  },
  computed: {
     total: function () {
       // 必须解析，因为 Vue 会将空值转换为字符串
       return Number(this.weapons) +
         Number(this.shields) +
         Number(this.coffee) +
         Number(this.ac+this.mousedroids);
     }
  },
  methods:{
    checkForm: function (e) {
      this.errors = [];

      if (this.total != 100) {
        this.errors.push('Total must be 100!');
      }

      if (!this.errors.length) {
        return true;
      }

      e.preventDefault();
    }
  }
})
```

我们将总和设置为了一个计算属性，从那个我们解决掉的 bug 外面看上去，这已经足够了。我的 `checkForm` 方法现在只需要关注总和是不是 100 了。你可以在这里试用：

<p data-height="265" data-theme-id="0" data-slug-hash="vWqGoy" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 3" class="codepen">在 <a href="https://codepen.io">CodePen</a> 查看 Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) 的 <a href="https://codepen.io/cfjedimaster/pen/vWqGoy/">表单校验3</a>。</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## 服务端校验

在我们最终的示例中，我们构建了一些用到 Ajax 的服务端校验的东西。这个表单将会问你为一个新产品起名字，并且将会确保这个名字是唯一的。我们快速写了一个 [Netlify](https://netlify.com/) 的 serverless action 来进行这个校验。虽然这不是非常重要，但其逻辑如下：

``` js
exports.handler = async (event, context) => {
  
    const badNames = ['vista', 'empire', 'mbp'];
    const name = event.queryStringParameters.name;

    if (badNames.includes(name)) {
      return { 
        statusCode: 400,         
        body: JSON.stringify({error: 'Invalid name passed.'}) 
      }
    }

    return {
      statusCode: 204
    }
}

```

基本上除了“vista”、“empire”和“mbp”的名字都是可以接受的。好，让我们来看看表单。

``` html
<form
  id="app"
  @submit="checkForm"
  method="post"
>

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">New Product Name: </label>
    <input
      id="name"
      v-model="name"
      type="text"
      name="name"
    >
  </p>

  <p>
    <input
      type="submit"
      value="Submit"
    >
  </p>

</form>
```

这里没有任何特殊的东西。接下来我们再看看 JavaScript。

``` js
const apiUrl = 'https://vuecookbook.netlify.com/.netlify/functions/product-name?name=';

const app = new Vue({
  el: '#app',
  data: {
    errors: [],
    name: ''
  },
  methods:{
    checkForm: function (e) {
      e.preventDefault();

      this.errors = [];

      if (this.name === '') {
        this.errors.push('Product name is required.');
      } else {
        fetch(apiUrl + encodeURIComponent(this.name))
        .then(async res => {
          if (res.status === 204) {
            alert('OK');
          } else if (res.status === 400) {
            let errorResponse = await res.json();
            this.errors.push(errorResponse.error);
          }
        });
      }
    }
  }
})
```

我们从一个运行在 OpenWhisk 的 API 的 URL 变量开始。现在注意 `checkForm`。在这个版本中，我们始终阻止了表单的提交 (当然，它也可以通过 Vue 在 HTML 中完成)。你可以看到一个基本的校验，即 `this.name` 是否为空，然后我们请求这个 API。如果名字是无效的，我们就添加一个错误。如果是有效的，我们就不做任何事 (只是一个 alert)，但是你可以引导用户去一个新页面，在 URL 中带上产品的名字，或者其它行为。接下来你可以体验这个 demo：

<p data-height="265" data-theme-id="0" data-slug-hash="BmgzeM" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 4" class="codepen">在 <a href="https://codepen.io">CodePen</a> 查看 Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) 的 <a href="https://codepen.io/cfjedimaster/pen/BmgzeM/">表单校验4。</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## 其它替代模式

这份秘笈专注在“手动”校验表单，当然一些非常棒的 Vue 的库会为你搞定这些事情。使用一些预打包的库可能会影响你的应用最终的体积，但是好处是非常多的。这里有经过充分测试且保持日常更新的代码。其中包括以下 Vue 的表单校验库：

* [vuelidate](https://github.com/monterail/vuelidate)
* [VeeValidate](https://logaretm.github.io/vee-validate/)
