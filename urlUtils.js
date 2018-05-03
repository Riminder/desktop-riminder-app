const url = require('url')

const URL_TO_SIGNIN_PAGE = url.format({protocol: 'https:', hostname: 'www.riminder.net', pathname: 'signin/team/'})
// const REGEXP_INTERNAL_LINK = new RegExp(url.format({protocol: 'https:', hostname: 'www.riminder.net'}))
const REGEXP_INTERNAL_LINK = new RegExp(/http[s]{0,1}:\/\/.+\.riminder\.net\/.+/)

// RiminderUrlUtils gathers url related function
class RiminderUrlUtils {
  static isExternalUrl (url) {
    return (!REGEXP_INTERNAL_LINK.test(url))
  }

  // getDirectLoginUrl create an url to user's dashboard for autologin
  // it's need the user's team (the url is {user's team}.riminder.net/dashboard)
  static genDirectLoginUrl (team) {
    let _hostname = team + '.riminder.net'
    let res = url.format({
      protocol: 'https:',
      hostname: _hostname,
      pathname: 'dashboard'
    })
    return res
  }

  // return url to sigin page if team is undefined
  // because a team is needed to generate an url to dashboard
  static selectSigninUrl (team = undefined) {
    let url = URL_TO_SIGNIN_PAGE
    if (team !== undefined) {
      url = this.genDirectLoginUrl(team)
    }
    return url
  }

  static genPdfViewerUrlSrc (url) {
    let baseUrl = 'https://mozilla.github.io/pdf.js/web/viewer.html?file='
    return baseUrl + encodeURIComponent(url)
  }

  static isPdfLink (link) {
    let pdfregex = new RegExp(/.+pdf$/)

    return pdfregex.test(link)
  }
}

module.exports = RiminderUrlUtils
