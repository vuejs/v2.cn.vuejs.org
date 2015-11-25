# cn.vuejs.org

[vuejs 简体中文](http://cn.vuejs.org/) 网站。

这个网站使用 [hexo](http://hexo.io/) 创建。站点内容为 Markdown 格式，位于 `src` 目录下。

## 开发

启用开发服务器 `localhost:4000`:

```
$ npm install -g hexo-cli
$ npm install
$ hexo server
```

## 翻译

欢迎提交 [pr](https://help.github.com/articles/using-pull-requests/)。

### 翻译要求

- 汉字，字母，数字等之间以空格隔开。
- 中文使用中文符号，英文使用英文符号。
- 专有词注意大小写，如 HTML，CSS，JavaScript。
- 术语与已有译文保持一致，如果有不同意见请先在 issue 中讨论。
- 代码只翻译注释。
- 标题会转化为链接，文档其它地方可能会用到，所以标题应尽量简短，在修改标题时搜索一下它是否还用在其它地方。在修改文档内链接时也应搜索一下。

### 术语翻译对照

- attribute 特性
- transition 过渡

### 不翻译的术语

- getter, setter
- prop
