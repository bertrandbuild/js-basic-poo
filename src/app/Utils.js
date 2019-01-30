/**
 * parseUrl - add 'http://' if needed
 * @param {string} url 
 */
function parseUrl(url) {
  // If the url doesn't start by "http://" neither by "https://"
  if ((url.indexOf("http://") !== 0) && (url.indexOf("https://") !== 0)) {
    // add "http://"
    url = "http://" + url;
  }
  return url;
}

/**
 * displayInfoMessage - display an information message
 * @param {string} message
 * @param {HTMLElement} node - the html node where the message will be displayed
 */
function displayInfoMessage(message, node) {
  var self = this;
  // create element
  var infoElt = document.createElement("div");
  infoElt.classList.add("info");
  infoElt.textContent = message;
  node.insertBefore(infoElt, node.children[0]);
  // remove element after 2sec
  setTimeout(function () {
      node.removeChild(infoElt);
  }, 2000);
}
