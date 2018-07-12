(function () {
  initHashLevelRedirects()
  initMobileMenu()
  initVideoModal()
  if (PAGE_TYPE) {
    initVersionSelect()
    initApiSpecLinks()
    initSubHeaders()
    initLocationHashFuzzyMatching()
  }

  // Most redirects should be specified in Hexo's
  // _config.yml. However, it can't handle hash-level
  // redirects, such as:
  //
  // /foo#hello -> /bar#hello
  //
  // For these cases where a section on one page has
  // moved to a perhaps differently-named section on
  // another page, we need this.
  function initHashLevelRedirects() {
    checkForHashRedirect(/components\.html$/, {
      '什么是组件？': '/v2/guide/components.html',
      '使用组件': '/v2/guide/components-registration.html',
      '全局注册': '/v2/guide/components-registration.html#全局注册',
      '局部注册': '/v2/guide/components-registration.html#局部注册',
      'DOM-模板解析注意事项': '/v2/guide/components.html#解析-DOM-模板时的注意事项',
      'data-必须是函数': '/v2/guide/components.html#data-必须是一个函数',
      '组件组合': '/v2/guide/components.html#组件的组织',
      'Prop': '/v2/guide/components.html#通过-Prop-向子组件传递数据',
      '使用-Prop-传递数据': '/v2/guide/components.html#通过-Prop-向子组件传递数据',
      'camelCase-vs-kebab-case': '/v2/guide/components-props.html#Prop-的大小写-camelCase-vs-kebab-case',
      '动态-Prop': '/v2/guide/components-props.html#静态的和动态的-Prop',
      '字面量语法-vs-动态语法': '/v2/guide/components-props.html#静态的和动态的-Prop',
      '单向数据流': '/v2/guide/components-props.html#单向数据流',
      'Prop-验证': '/v2/guide/components-props.html#Prop-验证',
      '非-Prop-特性': '/v2/guide/components-props.html#非-Prop-的特性',
      '替换-合并现有的特性': '/v2/guide/components-props.html#替换-合并已有的特性',
      '自定义事件': '/v2/guide/components.html#通过事件向父级组件发送消息',
      '使用-v-on-绑定自定义事件': '/v2/guide/components.html#通过事件向父级组件发送消息',
      '给组件绑定原生事件': '/v2/guide/components-custom-events.html#将原生事件绑定到组件',
      'sync-修饰符': '/v2/guide/components-custom-events.html#sync-修饰符',
      '使用自定义事件的表单输入组件': '/v2/guide/components-custom-events.html#将原生事件绑定到组件',
      '自定义组件的-v-model': '/v2/guide/components-custom-events.html#自定义组件的-v-model',
      '非父子组件的通信': '/v2/guide/state-management.html',
      '使用插槽分发内容': '/v2/guide/components.html#通过插槽分发内容',
      '编译作用域': '/v2/guide/components-slots.html#编译作用域',
      '单个插槽': '/v2/guide/components-slots.html#插槽内容',
      '具名插槽': '/v2/guide/components-slots.html#具名插槽',
      '作用域插槽': '/v2/guide/components-slots.html#作用域插槽',
      '动态组件': '/v2/guide/components.html#动态组件',
      'keep-alive': '/v2/guide/components-dynamic-async.html#在动态组件上使用-keep-alive',
      '杂项': '/v2/guide/components-edge-cases.html',
      '编写可复用组件': '/v2/guide/components.html#组件的组织',
      '子组件引用': '/v2/guide/components-edge-cases.html#访问子组件实例或子元素',
      '异步组件': '/v2/guide/components-dynamic-async.html#异步组件',
      '高级异步组件': '/v2/guide/components-dynamic-async.html#处理加载状态',
      '组件命名约定': '/v2/guide/components-registration.html#组件名',
      '递归组件': '/v2/guide/components-edge-cases.html#递归组件',
      '组件间的循环引用': '/v2/guide/components-edge-cases.html#组件之间的循环引用',
      '内联模板': '/v2/guide/components-edge-cases.html#内联模板',
      'X-Templates': '/v2/guide/components-edge-cases.html#X-Templates',
      '对低开销的静态组件使用-v-once': '/v2/guide/components-edge-cases.html#通过-v-once-创建低开销的静态组件'
    })
    function checkForHashRedirect(pageRegex, redirects) {
      // Abort if the current page doesn't match the page regex
      if (!pageRegex.test(window.location.pathname)) return

      var redirectPath = redirects[decodeURIComponent(window.location.hash.slice(1))]
      if (redirectPath) {
        window.location.href = window.location.origin + redirectPath
      }
    }
  }

  function initApiSpecLinks () {
    var apiContent = document.querySelector('.content.api')
    if (apiContent) {
      var apiTitles = [].slice.call(apiContent.querySelectorAll('h3'))
      apiTitles.forEach(function (titleNode) {
        var methodMatch = titleNode.textContent.match(/^([^(]+)\(/)
        if (methodMatch) {
          var idWithoutArguments = slugize(methodMatch[1])
          titleNode.setAttribute('id', idWithoutArguments)
          titleNode.querySelector('a').setAttribute('href', '#' + idWithoutArguments)
        }

        var ulNode = titleNode.parentNode.nextSibling
        if (ulNode.tagName !== 'UL') {
          ulNode = ulNode.nextSibling
          if (!ulNode) return
        }
        if (ulNode.tagName === 'UL') {
          var specNode = document.createElement('li')
          var specLink = createSourceSearchPath(titleNode.textContent)
          specNode.innerHTML = '<a href="' + specLink + '" target="_blank">源代码</a>'
          ulNode.appendChild(specNode)
        }
      })
    }

    function createSourceSearchPath (query) {
      query = query
        .replace(/\([^\)]*?\)/g, '')
        .replace(/(Vue\.)(\w+)/g, '$1$2" OR "$2')
        .replace(/vm\./g, 'Vue.prototype.')
      return 'https://github.com/search?utf8=%E2%9C%93&q=repo%3Avuejs%2Fvue+extension%3Ajs+' + encodeURIComponent('"' + query + '"') + '&type=Code'
    }
  }

  function parseRawHash (hash) {
    // Remove leading hash
    if (hash.charAt(0) === '#') {
      hash = hash.substr(1)
    }

    // Escape characters
    try {
      hash = decodeURIComponent(hash)
    } catch (e) {}
    return CSS.escape(hash)
  }

  function initLocationHashFuzzyMatching () {
    var rawHash = window.location.hash
    if (!rawHash) return
    var hash = parseRawHash(rawHash)
    var hashTarget = document.getElementById(hash)
    if (!hashTarget) {
      var normalizedHash = normalizeHash(hash)
      var possibleHashes = [].slice.call(document.querySelectorAll('[id]'))
        .map(function (el) { return el.id })
      possibleHashes.sort(function (hashA, hashB) {
        var distanceA = levenshteinDistance(normalizedHash, normalizeHash(hashA))
        var distanceB = levenshteinDistance(normalizedHash, normalizeHash(hashB))
        if (distanceA < distanceB) return -1
        if (distanceA > distanceB) return 1
        return 0
      })
      window.location.hash = '#' + possibleHashes[0]
    }

    function normalizeHash (rawHash) {
      return rawHash
        .toLowerCase()
        .replace(/\-(?:deprecated|removed|replaced|changed|obsolete)$/, '')
    }

    function levenshteinDistance (a, b) {
      var m = []
      if (!(a && b)) return (b || a).length
      for (var i = 0; i <= b.length; m[i] = [i++]) {}
      for (var j = 0; j <= a.length; m[0][j] = j++) {}
      for (var i = 1; i <= b.length; i++) {
        for (var j = 1; j <= a.length; j++) {
          m[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
            ? m[i - 1][j - 1]
            : m[i][j] = Math.min(
              m[i - 1][j - 1] + 1,
              Math.min(m[i][j - 1] + 1, m[i - 1][j] + 1))
        }
      }
      return m[b.length][a.length]
    }
  }

  /**
   * Mobile burger menu button and gesture for toggling sidebar
   */

  function initMobileMenu () {
    var mobileBar = document.getElementById('mobile-bar')
    var sidebar = document.querySelector('.sidebar')
    var menuButton = mobileBar.querySelector('.menu-button')

    menuButton.addEventListener('click', function () {
      sidebar.classList.toggle('open')
    })

    document.body.addEventListener('click', function (e) {
      if (e.target !== menuButton && !sidebar.contains(e.target)) {
        sidebar.classList.remove('open')
      }
    })

    // Toggle sidebar on swipe
    var start = {}, end = {}

    document.body.addEventListener('touchstart', function (e) {
      start.x = e.changedTouches[0].clientX
      start.y = e.changedTouches[0].clientY
    })

    document.body.addEventListener('touchend', function (e) {
      end.y = e.changedTouches[0].clientY
      end.x = e.changedTouches[0].clientX

      var xDiff = end.x - start.x
      var yDiff = end.y - start.y

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0 && start.x <= 80) sidebar.classList.add('open')
        else sidebar.classList.remove('open')
      }
    })
  }

  /**
  * Modal Video Player
  */
  function initVideoModal () {
    var modalButton = document.getElementById('modal-player')
    var videoModal = document.getElementById('video-modal')

    if (!modalButton || !videoModal) {
      return
    }

    var videoWrapper = videoModal.querySelector('.video-space')
    var overlay = document.createElement('div')
        overlay.className = 'overlay'
    var isOpen = false

    modalButton.addEventListener('click', function(event) {
      event.stopPropagation()
      videoModal.classList.toggle('open')
      document.body.classList.toggle('stop-scroll')
      document.body.appendChild(overlay)
      videoWrapper.innerHTML = '<iframe style="height: 100%; left: 0; position: absolute; top: 0; width: 100%;" src="//player.youku.com/embed/XMzMwMTYyODMyNA==?autoplay=true&client_id=37ae6144009e277d" frameborder="0" allowfullscreen></iframe>'
      isOpen = true
    })

    document.body.addEventListener('click', function(e) {
      if (isOpen && e.target !== modalButton && !videoModal.contains(e.target)) {
        videoModal.classList.remove('open')
        document.body.classList.remove('stop-scroll')
        document.body.removeChild(overlay)
        videoWrapper.innerHTML = ''
        isOpen = false
      }
    })
  }

  /**
   * Doc version select
   */

  function initVersionSelect () {
    // version select
    var versionSelect = document.querySelector('.version-select')
    versionSelect && versionSelect.addEventListener('change', function (e) {
      var version = e.target.value
      var section = window.location.pathname.match(/\/v\d\/(\w+?)\//)[1]
      if (version === 'SELF') return
      window.location.assign(
        'https://' +
        version +
        (version && '.') +
        'vuejs.org/' + section + '/'
      )
    })
  }

  /**
   * Sub headers in sidebar
   */

  function initSubHeaders () {
    var each = [].forEach
    var main = document.getElementById('main')
    var header = document.getElementById('header')
    var sidebar = document.querySelector('.sidebar')
    var content = document.querySelector('.content')

    // build sidebar
    var currentPageAnchor = sidebar.querySelector('.sidebar-link.current')
    var contentClasses = document.querySelector('.content').classList
    var isAPIOrStyleGuide = (
      contentClasses.contains('api') ||
      contentClasses.contains('style-guide')
    )
    if (currentPageAnchor || isAPIOrStyleGuide) {
      var allHeaders = []
      var sectionContainer
      if (isAPIOrStyleGuide) {
        sectionContainer = document.querySelector('.menu-root')
      } else {
        sectionContainer = document.createElement('ul')
        sectionContainer.className = 'menu-sub'
        currentPageAnchor.parentNode.appendChild(sectionContainer)
      }
      var headers = content.querySelectorAll('h2')
      if (headers.length) {
        each.call(headers, function (h) {
          sectionContainer.appendChild(makeLink(h))
          var h3s = collectH3s(h)
          allHeaders.push(h)
          allHeaders.push.apply(allHeaders, h3s)
          if (h3s.length) {
            sectionContainer.appendChild(makeSubLinks(h3s, isAPIOrStyleGuide))
          }
        })
      } else {
        headers = content.querySelectorAll('h3')
        each.call(headers, function (h) {
          sectionContainer.appendChild(makeLink(h))
          allHeaders.push(h)
        })
      }

      var animating = false
      sectionContainer.addEventListener('click', function (e) {

        // Not prevent hashchange for smooth-scroll
        // e.preventDefault()

        if (e.target.classList.contains('section-link')) {
          sidebar.classList.remove('open')
          setActive(e.target)
          animating = true
          setTimeout(function () {
            animating = false
          }, 400)
        }
      }, true)

      // make links clickable
      allHeaders
        .filter(function(el) {
          if (!el.querySelector('a')) {
            return false
          }
          var demos = [].slice.call(document.querySelectorAll('demo'))
          return !demos.some(function(demoEl) {
            return demoEl.contains(el)
          })
        })
        .forEach(makeHeaderClickable)

      smoothScroll.init({
        speed: 400,
        offset: 0
      })
    }

    var hoveredOverSidebar = false
    sidebar.addEventListener('mouseover', function () {
      hoveredOverSidebar = true
    })
    sidebar.addEventListener('mouseleave', function () {
      hoveredOverSidebar = false
    })

    // listen for scroll event to do positioning & highlights
    window.addEventListener('scroll', updateSidebar)
    window.addEventListener('resize', updateSidebar)

    function updateSidebar () {
      var doc = document.documentElement
      var top = doc && doc.scrollTop || document.body.scrollTop
      if (animating || !allHeaders) return
      var last
      for (var i = 0; i < allHeaders.length; i++) {
        var link = allHeaders[i]
        if (link.offsetTop > top) {
          if (!last) last = link
          break
        } else {
          last = link
        }
      }
      if (last)
        setActive(last.id, !hoveredOverSidebar)
    }

    function makeLink (h) {
      var link = document.createElement('li')
      window.arst = h
      var text = [].slice.call(h.childNodes).map(function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue
        } else if (['CODE', 'SPAN'].indexOf(node.tagName) !== -1) {
          return node.textContent
        } else {
          return ''
        }
      }).join('').replace(/\(.*\)$/, '')
      link.innerHTML =
        '<a class="section-link" data-scroll href="#' + h.id + '">' +
          htmlEscape(text) +
        '</a>'
      return link
    }

    function htmlEscape (text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }

    function collectH3s (h) {
      var h3s = []
      var next = h.nextSibling
      while (next && next.tagName !== 'H2') {
        if (next.tagName === 'H3') {
          h3s.push(next)
        }
        next = next.nextSibling
      }
      return h3s
    }

    function makeSubLinks (h3s, small) {
      var container = document.createElement('ul')
      if (small) {
        container.className = 'menu-sub'
      }
      h3s.forEach(function (h) {
        container.appendChild(makeLink(h))
      })
      return container
    }

    function setActive (id, shouldScrollIntoView) {
      var previousActive = sidebar.querySelector('.section-link.active')
      var currentActive = typeof id === 'string'
        ? sidebar.querySelector('.section-link[href="#' + id + '"]')
        : id
      if (currentActive !== previousActive) {
        if (previousActive) previousActive.classList.remove('active')
        currentActive.classList.add('active')
        if (shouldScrollIntoView) {
          var currentPageOffset = currentPageAnchor
            ? currentPageAnchor.offsetTop - 8
            : 0
          var currentActiveOffset = currentActive.offsetTop + currentActive.parentNode.clientHeight
          var sidebarHeight = sidebar.clientHeight
          var currentActiveIsInView = (
            currentActive.offsetTop >= sidebar.scrollTop &&
            currentActiveOffset <= sidebar.scrollTop + sidebarHeight
          )
          var linkNotFurtherThanSidebarHeight = currentActiveOffset - currentPageOffset < sidebarHeight
          var newScrollTop = currentActiveIsInView
            ? sidebar.scrollTop
            : linkNotFurtherThanSidebarHeight
              ? currentPageOffset
              : currentActiveOffset - sidebarHeight
          sidebar.scrollTop = newScrollTop
        }
      }
    }

    function makeHeaderClickable (header) {
      var link = header.querySelector('a')
      link.setAttribute('data-scroll', '')

      // transform DOM structure from
      // `<h2><a></a>Header</a>` to <h2><a>Header</a></h2>`
      // to make the header clickable
      var nodes = Array.prototype.slice.call(header.childNodes)
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i]
        if (node !== link) {
          link.appendChild(node)
        }
      }
    }
  }

  // Stolen from: https://github.com/hexojs/hexo-util/blob/master/lib/escape_regexp.js
  function escapeRegExp(str) {
    if (typeof str !== 'string') throw new TypeError('str must be a string!');

    // http://stackoverflow.com/a/6969486
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }

  // Stolen from: https://github.com/hexojs/hexo-util/blob/master/lib/slugize.js
  function slugize(str, options) {
    if (typeof str !== 'string') throw new TypeError('str must be a string!')
    options = options || {}

    var rControl = /[\u0000-\u001f]/g
    var rSpecial = /[\s~`!@#\$%\^&\*\(\)\-_\+=\[\]\{\}\|\\;:"'<>,\.\?\/]+/g
    var separator = options.separator || '-'
    var escapedSep = escapeRegExp(separator)

    var result = str
      // Remove control characters
      .replace(rControl, '')
      // Replace special characters
      .replace(rSpecial, separator)
      // Remove continuous separators
      .replace(new RegExp(escapedSep + '{2,}', 'g'), separator)
      // Remove prefixing and trailing separators
      .replace(new RegExp('^' + escapedSep + '+|' + escapedSep + '+$', 'g'), '')

    switch (options.transform) {
      case 1:
        return result.toLowerCase()
      case 2:
        return result.toUpperCase()
      default:
        return result
    }
  }
})()
