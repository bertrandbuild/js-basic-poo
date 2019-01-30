/**
 * @class App
 * handle the globale application logic
 */
class App {
  constructor() {
    // environment variable
    this.PROD_ENV = false;
    // html elements
    this.contenuElt = document.getElementById("contenu");
    this.formulaireElt = document.querySelector("p");
    this.ajouterLinkElt = document.getElementById("ajoutLien");
    // utils
    this.ajax = new Ajax();
    this.fakeData = [
      {
        title: "So Foot",
        url: "http://sofoot.com",
        author: "yann.usaille"
      },
      {
        title: "Guide d'autodéfense numérique",
        url: "http://guide.boum.org",
        author: "paulochon"
      },
      {
        title: "L'encyclopédie en ligne Wikipedia",
        url: "http://Wikipedia.org",
        author: "annie.zette"
      }
    ];

    var self = this;

    // get and display remote/local links
    this.displayData();
    // Display the form on click
    self.ajouterLinkElt.addEventListener("click", function() {
      self.createFormulaire(function(data) { // callback function, called when the form is submitted
        
        // Parse url (add http if needed)
        var url = parseUrl(data.url);
        
        // Create the link object
        var link = {
          title: data.title,
          url: url,
          author: data.author
        }
        
        // Add the link to the dom
        var linkElt = self.createLinkElt(link);
        self.contenuElt.insertBefore(linkElt, self.contenuElt.firstChild);
    
        if (self.PROD_ENV) { // If we use remote data
          self.ajax.post( // update remote data
            "https://oc-jswebsrv.herokuapp.com/api/link",
            link,
            function(reponse) {
              console.log(reponse);
              displayInfoMessage( // display a confirmation message
                'Le link "' + data.title + '" a bien été ajouté.',
                self.formulaireElt
              );
            },
            true
          );
        } else {
          displayInfoMessage( // display a confirmation message
            'Le link "' + data.title + '" a bien été ajouté.',
            self.formulaireElt
          );
        }
      });
    });
  }

  /**
   * displayData - get the links and add it to the DOM
   * if we are on local we use the FakeData obj, else we connect to the API
   */
  displayData() {
    var self = this;
    // get local data
    if (!this.PROD_ENV) {
      this.fakeData.forEach(function(link) {
        // add to the DOM
        var linkElt = self.createLinkElt(link);
        self.contenuElt.appendChild(linkElt);
      });
    } else {
      // get remote data
      this.ajax.get("https://oc-jswebsrv.herokuapp.com/api/links", function(
        reponse
      ) {
        var linksWeb = JSON.parse(reponse);
        linksWeb.forEach(function(link) {
          // add to the DOM
          var linkElt = self.createLinkElt(link);
          self.contenuElt.appendChild(linkElt);
        });
      });
    }
  }

  /**
   * createFormulaire - replace the 'add a link' butt by a form
   * the form is composed by 3 inputs : Title, Autheur and Url
   * On form submit, the callback function is executed and the form replaced by the original button
   * @param {function} submitCallback the callback
   */
  createFormulaire(submitCallback) {
    var self = this;
    var authorElt = new TextInput("Entrez votre nom", 20);
    var titleElt = new TextInput("Entrez le title du lien", 40);
    var urlElt = new TextInput("Entrez l'URL du lien", 40);
    // urlElt.type = "url";

    var ajoutElt = document.createElement("input");
    ajoutElt.type = "submit";
    ajoutElt.value = "Ajouter";

    var formAjoutElt;
    formAjoutElt = document.createElement("form");
    formAjoutElt.appendChild(authorElt);
    formAjoutElt.appendChild(titleElt);
    formAjoutElt.appendChild(urlElt);
    formAjoutElt.appendChild(ajoutElt);

    // Replace the add button by the form
    self.formulaireElt.replaceChild(formAjoutElt, self.ajouterLinkElt);

    formAjoutElt.addEventListener("submit", function(e) {
      e.preventDefault();
      submitCallback({ // pass the user data 
        author: authorElt.value,
        title: titleElt.value,
        url: urlElt.value
      });
      // Remplace the form by the button
      self.formulaireElt.replaceChild(self.ajouterLinkElt, formAjoutElt);
    });
  }

  /**
   * createLinkElt - create and return a link HTML Element
   * @param {object} link the link object : {title, author, url}
   * @returns {HTMLElement} the html element
   */
  createLinkElt(link) {
    var title = link.title;
    var author = link.author;
    var url = link.url;

    // Contain the clickable title
    var titleElt = document.createElement("a");
    titleElt.href = url;
    titleElt.target = "_blank";
    titleElt.style.color = "#428bca";
    titleElt.style.textDecoration = "none";
    titleElt.style.marginRight = "5px";
    titleElt.appendChild(document.createTextNode(title));

    var urlElt = document.createElement("span");
    urlElt.appendChild(document.createTextNode(url));

    // h4 containing the title and the url
    var ligneTitleElt = document.createElement("h4");
    ligneTitleElt.style.margin = "0px";
    ligneTitleElt.appendChild(titleElt);
    ligneTitleElt.appendChild(urlElt);

    // Ligne containing the author
    var ligneDetailsElt = document.createElement("span");
    ligneDetailsElt.appendChild(
      document.createTextNode("Ajouté par " + author)
    );

    var divLinkElt = document.createElement("div");
    divLinkElt.classList.add("lien");
    divLinkElt.appendChild(ligneTitleElt);
    divLinkElt.appendChild(ligneDetailsElt);

    return divLinkElt;
  }
}

new App();
