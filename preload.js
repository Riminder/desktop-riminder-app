
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

function windowLoadedHandler () {
  document.body.addEventListener('click', () => {
    let profileOverlay = getProfileOverlay()
    console.log('clicked yo ' + profileOverlay)
    if (profileOverlay !== null) {
      let ovIframe = getProfileOverlayIFrame(profileOverlay)
      if (ovIframe !== null) {
        ovIframe.remove()
      }
    }
  })
}
