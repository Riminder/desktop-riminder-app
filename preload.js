
const electron = require('electron')
const ipcR = electron.ipcRenderer

const RiminderUrlUtils = require('./urlUtils.js')

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

function getProfileOverlayAttachementContainer (profileOverlay) {
  let elements = profileOverlay.getElementsByClassName('attachments')

  let res = []
  for (let i = 0, max = elements.length; i < max; i++) {
    res.push(elements[i])
  }
  return res
}

let canFireEvent = true
function putListenerOnAttachements (profileOverlay) {
  let attachments = getProfileOverlayAttachementContainer(profileOverlay)

  attachments.forEach((element) => {
    element.addEventListener('click', () => {
      canFireEvent = true
    })
  })
}

function monitorOverlay () {
  let profileOverlay = getProfileOverlay()
  if (profileOverlay !== null) {
    let ovIframe = getProfileOverlayIFrame(profileOverlay)

    if (ovIframe !== null) {
      let evt = new window.CustomEvent('onAttachementOverlay', {'detail': {iframe: ovIframe,
        overlay: profileOverlay}})
      if (canFireEvent) {
        document.body.dispatchEvent(evt)
        putListenerOnAttachements(profileOverlay)
        canFireEvent = false
      }
    } else { canFireEvent = true }
  } else { canFireEvent = true }
}

let lastPdf = 'lel'
function handleOnAttachementOverlayEvent (event) {
  var ovIframe = event.detail.iframe
  if (ovIframe !== null) {
    if (RiminderUrlUtils.isPdfLink(ovIframe.getAttribute('src')) &&
      lastPdf !== ovIframe.getAttribute('src')) {
      ipcR.send('dlDisabler')

      let newSrcUrl = RiminderUrlUtils.genPdfViewerUrlSrc(ovIframe.getAttribute('src'))
      ovIframe.setAttribute('src', newSrcUrl)
      lastPdf = ovIframe.getAttribute('src')
    }
  }
}

function windowLoadedHandler () {
  // for the overlayReady event
  // avoid the instant download and permit pdf support
  setInterval(monitorOverlay, 10)
  document.body.addEventListener('onAttachementOverlay', (event) => {
    handleOnAttachementOverlayEvent(event)
  })
}
