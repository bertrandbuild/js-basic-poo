class TextInput {
  /**
   * constructor - Create and return a text input 
   * @param {string} placeholder 
   * @param {string} size 
   */
  constructor(placeholder, size) {
    var inputElt = document.createElement("input");
    inputElt.type = "text";
    inputElt.setAttribute("placeholder", placeholder);
    inputElt.setAttribute("size", size);
    inputElt.setAttribute("required", "true");
    return inputElt;
  }
}
