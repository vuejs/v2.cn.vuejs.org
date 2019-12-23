---
title: 安全
type: guide
order: 504
---

## 报告安全漏洞

当一个安全漏洞被报告时，它会立即成为我们的最高顾虑，并由全职贡献者停下手中的工作处理此事。如发现任何安全漏洞，请邮件给 [vuejs.org@gmail.com](mailto:vuejs.org@gmail.com)。

虽然发现新安全漏洞是比较罕见的事，我们仍推荐始终使用最新版本的 Vue 及其官方的周边库，以确保应用始终尽可能安全。

## Vue 保护你的方式

### HTML 内容

不论使用模板还是渲染函数，内容都会被自动转义。也就是说对于这份模板：

```html
<h1>{{ userProvidedString }}</h1>
```

如果 `userProvidedString` 包含了：

```js
'<script>alert("hi")</script>'
```

则它会被转义成为如下 HTML：

```html
&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;
```

因此避免了脚本注入。该转义通过诸如 `textContent` 的浏览器原生的 API 完成，所以除非浏览器本身存在安全漏洞，否则不会存在安全漏洞。

### Attribute 绑定

同样地，动态 attribute 绑定也会自动被转义。也就是说对于这份模板：

```html
<h1 v-bind:title="userProvidedString">
  hello
</h1>
```

如果 `userProvidedString` 包含了：

```js
'" onclick="alert(\'hi\')'
```

则它会被转义成为如下 HTML：

```html
&quot; onclick=&quot;alert('hi')
```

因此避免了通过闭合 `title` attribute 而注入新的任意 HTML。该转义通过诸如 `setAttribute` 的浏览器原生的 API 完成，所以除非浏览器本身存在安全漏洞，否则不会存在安全漏洞。

## 潜在的危险

在任何 web 应用中，允许未清洁的用户提供的内容成为 HTML、CSS 或 JavaScript 都有潜在的危险。因此应该避免所有的可能。尽管如此，有些情况下的风险是可接受的。

例如，类似 CodePen 和 JSFiddle 这样的服务允许用户提供的内容直接被执行，但这是在一个可预期的沙盒的 iframe 上下文中。当内部需要某种程度可攻破的重要特性时，你的团队可以在特性的重要程度和被安全漏洞赋予的最坏场景之间进行权衡。

### 注入 HTML

如你之前学到的，Vue 会自动转义 HTML 内容，以避免向应用意外注入可执行的 HTML。然而，某些情况下你清楚这些 HTML 是安全的，这时你可以显性地渲染 HTML 内容：

- 使用模板：
  ```html
  <div v-html="userProvidedHtml"></div>
  ```

- 使用渲染函数：
  ```js
  h('div', {
    domProps: {
      innerHTML: this.userProvidedHtml
    }
  })
  ```

- 使用基于 JSX 的渲染函数：
  ```jsx
  <div domPropsInnerHTML={this.userProvidedHtml}></div>
  ```

<p class="tip">注意永远不要认为用户提供的 HTML 是 100% 安全的，除非在一个 iframe 沙盒或只有这些 HTML 的作者可以看到的应用的那部分。除此之外，允许用户撰写其自己的 Vue 模板会带来类似的危险。</p>

### 注入 URL

在类似这样的 URL 中：

```html
<a v-bind:href="userProvidedUrl">
  click me
</a>
```

如果该 URL 未进行对 `javascript:` 的“清洁”以避免执行 JavaScript，则会有潜在的安全问题。有一些库如 [sanitize-url](https://www.npmjs.com/package/@braintree/sanitize-url) 可以帮助你做这件事，但请注意：

<p class="tip">如果你曾经在前端做过 URL 清洁，你可能已经染上了安全问题。用户提供的 URL 永远需要通过后端在入库之前进行清洁。然后这个问题就会在*每个*客户端连接该 API 是被阻止，包括原生移动应用。还要注意，甚至对于被清洁过的 URL，Vue 仍无法帮助你保证它们会跳转到安全的目的地。</p>

### 注入样式

来看这个示例：

```html
<a
  v-bind:href="sanitizedUrl"
  v-bind:style="userProvidedStyles"
>
  click me
</a>
```

let's assume that `sanitizedUrl` has been sanitized, so that it's definitely a real URL and not JavaScript. With the `userProvidedStyles`, malicious users could still provide CSS to "click jack", e.g. styling the link into a transparent box over the "Log in" button. Then if `https://user-controlled-website.com/` is built to resemble the login page of your application, they might have just captured a user's real login information.

You may be able to imagine how allowing user-provided content for a `<style>` element would create an even greater vulnerability, giving that user full control over how to style the entire page. That's why prevents rendering of style tags inside templates, such as:

```html
<style>{{ userProvidedStyles }}</style>
```

To keep your users fully safe from click jacking, we recommend only allowing full control over CSS inside a sandboxed iframe. Alternatively, when providing user control through a style binding, we recommend using its [object syntax](class-and-style.html#Object-Syntax-1) and only allowing users to provide values for specific properties it's safe for them to control, like this:

```html
<a
  v-bind:href="sanitizedUrl"
  v-bind:style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  click me
</a>
```

### 注入 JavaScript

We strongly discourage ever rendering a `<script>` element with Vue, since templates and render functions should never have side effects. However, this isn't the only way to include strings that would be evaluated as JavaScript at runtime.

Every HTML element has attributes with values accepting strings of JavaScript, such as `onclick`, `onfocus`, and `onmouseenter`. Binding user-provided JavaScript to any of these event attributes is a potential security risk, so should be avoided.

<p class="tip">Note that user-provided JavaScript can never be considered 100% safe unless it's in a sandboxed iframe or in a part of the app where only the user who wrote that JavaScript can ever be exposed to it.</p>

Sometimes we receive vulnerability reports on how it's possible to do cross-site scripting (XSS) in Vue templates. In general, we do not consider such cases to be actual vulnerabilities, because there's no practical way to protect developers from the two scenarios that would allow XSS:

1. The developer is explicitly asking Vue to render user-provided, unsanitized content as Vue templates. This is inherently unsafe and there's no way for Vue to know the origin.

2. The developer is mounting Vue to an entire HTML page which happens to contain server-rendered and user-provided content. This is fundamentally the same problem as \#1, but sometimes devs may do it without realizing. This can lead to possible vulnerabilities where the attacker provides HTML which is safe as plain HTML but unsafe as a Vue template. The best practice is to never mount Vue on nodes that may contain server-rendered and user-provided content.

## 最佳实践

The general rule is that if you allow unsanitized, user-provided content to be executed (as either HTML, JavaScript, or even CSS), you might be opening yourself up to attacks. This advice actually holds true whether using Vue, another framework, or even no framework.

Beyond the recommendations made above for [Potential Dangers](#Potential-Dangers), we also recommend familiarizing yourself with these resources:

- [HTML5 Security Cheat Sheet](https://html5sec.org/)
- [OWASP's Cross Site Scripting (XSS) Prevention Cheat Sheet](https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet)

Then use what you learn to also review the source code of your dependencies for potentially dangerous patterns, if any of them include 3rd-party components or otherwise influence what's rendered to the DOM.

## 后端协作

HTTP security vulnerabilities, such as cross-site request forgery (CSRF/XSRF) and cross-site script inclusion (XSSI), are primarily addressed on the backend, so aren't a concern of Vue's. However, it's still a good idea to communicate with your backend team to learn how to best interact with their API, e.g. by submitting CSRF tokens with form submissions.

## 服务端渲染 (SSR)

There are some additional security concerns when using SSR, so make sure to follow the best practices outlined throughout [our SSR documentation](https://ssr.vuejs.org/) to avoid vulnerabilities.
