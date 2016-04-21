# cn.vuejs.org

欢迎加入 [vuejs.org][vuejs.org] 中文翻译项目。

访问中文网站：

- http://cn.vuejs.org 放在 Github 上。
- http://vuejs.org.cn 放在 Coding 上，在国内访问较快。

参与：

- 如果你看到错别字、漏译、错译，请直接提交 pr
    （[帮助](https://help.github.com/articles/using-pull-requests/)）。
- 如果你看到网站问题，或者创建一个 issue，或者直接提交 pr。
- 如果你对已有翻译有异议，建议创建一个 issue 讨论。
- 如果你想修改英文内容，请去 [vuejs.org 项目][vuejs.org]。
- 如果你想求教 Vue.js 使用问题，请去[论坛][forum]。
- 如果你遇到 Vue.js 的问题，请去 [vue 项目][vue]，
    创建 issue 并提供演示。可以在 JSBin, JSFiddle, Codepen 等网站创建演示。

项目的分支：

- `lang-zh` 翻译是在这个分支进行的，这是默认分支。
- `master` 旧英文文档，不要改动。
- `gh-pages` 网站发布在这个分支。

相关网站与项目：

- [vue.js 英文网站](http://vuejs.org)
- [论坛][forum]
- [vuejs.org 项目][vuejs.org]
- [vue 项目][vue]

## 翻译

fork 这个项目，修改 `lang-zh` 分支下的文件，然后提交 pr。

### 翻译要求

- 汉字，字母，数字等之间以空格隔开。
- 中文使用中文符号，英文使用英文符号。
- 专有词注意大小写，如 HTML，CSS，JavaScript。
- 术语与已有译文保持一致，如果有异议请先在 issue 中讨论。
- 代码只翻译注释。
- 标题会转化为链接，文档其它地方可能会用到，所以标题应尽量简短，
    在修改标题时搜索一下它是否还用在其它地方。
    同样的，在修改文档内链接时也应搜索一下。

### 术语翻译对照

- attribute 特性
- transition 过渡

### 不翻译的术语

- getter, setter
- prop

## 同步英文网站

下面的命令示例是直接操作这个项目，需要项目管理员权限。
非项目管理员需要 fork 项目, 完成相关修改之后提交 pr。

### 同步翻译

初始化：

```bash
git pull git@github.com:vuejs/cn.vuejs.org.git
cd cn.vuejs.org
npm install
npm install -g hexo-cli
# 添加源 vuejs.org
git remote add en git@github.com:vuejs/vuejs.org.git
```

每次更新：

```bash
# 拉取 cn.vuejs.org
git pull
# 拉取 vuejs.org
git pull en master
# 处理合并冲突
git mergetool
# 预览网站
hexo serve
# 推送更新
git commit
git push
```

使用 [Github 对比视图](https://github.com/vuejs/vuejs.org/compare)
查看 [vuejs.org 项目][vuejs.org] 的变化，会看得清楚些。

### 发布网站

网站发布到 `gh-pages`分支，由项目下 `Makefile` 脚本自动完成。
`Makefile` 先测试 vue 项目，故需要 clone [vue 项目][vue]。
Windows 下运行这个脚本会有困难，建议在 Linux 或 Mac 下运行。

目前 Vue.js 中文网站在国内用这个网址 http://vuejs.org.cn/ 访问会比较快，
网站项目放在 [Coding](https://coding.net/u/limichange/p/cn.vuejs.org/) 上，
由项目下的 `sync.sh` 脚本同步 Github。

三个项目放到同一目录下，文件结构将是这样的：

```
├── cn.vuejs.org
├── vue
├── vuejs.org.cn
```

发布网站：

```bash
# 先更新 vue
cd ../vue
git pull origin master

# 发布到 github
cd ../cn.vuejs.org
make

# 同步到 coding
cd ../vuejs.org.cn
./sync.sh
```

[vuejs.org]: https://github.com/vuejs/vuejs.org
[vue]: https://github.com/vuejs/vue
[forum]: http://forum.vuejs.org
