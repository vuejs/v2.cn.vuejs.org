// give me the moneyz
(function () {
  var code = document.getElementById('qrcode')
  var isOpen = false

  document.getElementById('donate').addEventListener('click', function (e) {
    e.stopPropagation()
    if (isOpen) return
    isOpen = true
    code.style.display = 'block'
    var f = code.offsetHeight
    code.classList.remove('hidden')
  })

  document.body.addEventListener('click', function () {
    if (isOpen) {
      isOpen = false
      code.classList.add('hidden')
      setTimeout(function () {
        code.style.display = ''
      }, 250)
    }
  })
})()
