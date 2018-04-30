
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

function generateProfileOverlayIFrame (parent) {
  let iframe = document.createElement('iframe')

  iframe.setAttribute('frameborder', '0')
  // iframe.setAttribute('src', '')
}

/* <iframe frameborder="0" src="https://s3-eu-west-1.amazonaws.com/riminder-documents-eu/resume/4ddf07a67c01938c9a48bcbcc9c73db0599673cd.pdf" target="_parent" allowfullscreen="" height="140vh" name="" width="100%" style="position: relative; display: initial; height: 140vh; width: 100%;"></iframe> */

function windowLoadedHandler () {
  document.body.addEventListener('click', () => {
    let profileOverlay = getProfileOverlay()
    console.log('clicked yo ' + profileOverlay)
    if (profileOverlay !== null) {
      setTimeout(() => {
        let ovIframe = getProfileOverlayIFrame(profileOverlay)
        if (ovIframe !== null) {
          console.log('pimped!')
          let ovParent = ovIframe.parentElement
          ovIframe.remove()

        }
      }, 50)
    }
  })
}
