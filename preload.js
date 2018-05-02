
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

function monitorOverlay () {
  let profileOverlay = getProfileOverlay()
  if (profileOverlay !== null) {
    let ovIframe = getProfileOverlayIFrame(profileOverlay)

    if (ovIframe !== null) {
      let evt = new window.CustomEvent('overlayReady', {'detail': {iframe: ovIframe,
        overlay: profileOverlay}})

      document.body.dispatchEvent(evt)
    }
  }
}

let lastPdf = 'lel'
function windowLoadedHandler () {
  // for the overlayReady event
  // avoid the instant download and permit pdf support
  setInterval(monitorOverlay, 10)
  document.body.addEventListener('overlayReady', (event) => {
    var ovIframe = event.detail.iframe
    if (ovIframe !== null) {
      if (UrlUtils.isPdfLink(ovIframe.getAttribute('src')) &&
        lastPdf !== ovIframe.getAttribute('src')) {
        ipcR.send('dlDisabler')

        let newSrcUrl = UrlUtils.genPdfViewerUrlSrc(ovIframe.getAttribute('src'))
        ovIframe.setAttribute('src', newSrcUrl)
        lastPdf = ovIframe.getAttribute('src')
      }
    }
  })
}
