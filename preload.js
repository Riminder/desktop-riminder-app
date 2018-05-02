
const electron = require('electron')
const ipcR = electron.ipcRenderer

window.onload = setTimeout(windowLoadedHandler, 50)

function getProfileOverlay () {
  let elements = document.getElementsByClassName('pane___1BONj')
  if (elements.length === 0) {
    return null
  }
  return elements[0]
}

function getProfileOverlayIFrame (profileOverlay) {
  let elements = profileOverlay.getElementsByTagName('iframe')

  if (elements.length === 0) {
    return null
  }
  return elements[0]
}

function isPdfLink (link) {
  let pdfregex = new RegExp(/.+pdf$/)

  return pdfregex.test(link)
}

let lastPdf = 'lel'
function windowLoadedHandler () {
  document.body.addEventListener('click', () => {
    var profileOverlay = getProfileOverlay()
    console.log('clicked yo ' + profileOverlay)
    if (profileOverlay !== null) {
      setTimeout(() => {
        var ovIframe = getProfileOverlayIFrame(profileOverlay)
        if (ovIframe !== null) {
          if (isPdfLink(ovIframe.getAttribute('src')) && lastPdf !== ovIframe.getAttribute('src')) {
            ipcR.send('dlDisabler')
            var newUrlSrc = 'https://mozilla.github.io/pdf.js/web/viewer.html?file='
            newUrlSrc += encodeURIComponent(ovIframe.getAttribute('src'))
            console.log('newUrlSrc!' + newUrlSrc)
            ovIframe.setAttribute('src', newUrlSrc)
            lastPdf = ovIframe.getAttribute('src')
          }
        }
      }, 50)
    } else {
      lastPdf = 'lel'
    }
  })
}
