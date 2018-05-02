
const electron = require('electron')
const ipcR = electron.ipcRenderer

const UrlUtils = require('./urlUtils.js')

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

let lastPdf = 'lel'
function windowLoadedHandler () {
  document.body.addEventListener('click', () => {
    var profileOverlay = getProfileOverlay()

    if (profileOverlay !== null) {
      setTimeout(() => {
        var ovIframe = getProfileOverlayIFrame(profileOverlay)
        if (ovIframe !== null) {
          if (UrlUtils.isPdfLink(ovIframe.getAttribute('src')) &&
            lastPdf !== ovIframe.getAttribute('src')) {
            ipcR.send('dlDisabler')

            let newSrcUrl = UrlUtils.genPdfViewerUrlSrc(ovIframe.getAttribute('src'))
            ovIframe.setAttribute('src', newSrcUrl)
            lastPdf = ovIframe.getAttribute('src')
          }
        }
      }, 50)
    } else {
      lastPdf = 'lel'
    }
  })
}
