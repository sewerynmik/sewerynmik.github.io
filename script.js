/**
 * Pobranie elementów z formularza
 */

var imie = document.getElementById('imie');
var email = document.getElementById('email');
var temat = document.getElementById('temat');
var wiadomosc = document.getElementById('wiadomosc');
var zgoda = document.getElementById('zgoda');
var wyslij = document.getElementById('wyslij');

/**
 * Funkcja sprawdzająca czy wszystkie pola są wypełnione 
 */

imie.onkeyup = validate;
email.onkeyup = validate;
temat.onkeyup = validate;
zgoda.onchange = validate;

/**
 * Funkcja sprawdzająca czy email jest poprawny
 * @param {string} email musi zawierać znak @ oraz .
 */
function validateEmail(email) {
    var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Funkcja sprawdzająca czy wszystkie pola są wypełnione oraz czy email jest poprawny
 * za krótkie pola są podświetlane na czerwono, poprawne na zielono
 */
function validate() {
    /**
     * @param valid sprawdza czy pola są wypełnione
     */
    var valid = true;
    var litery = /^[A-Za-z]+$/;

    if (imie.value.length < 3 || !imie.value.match(litery)) {
        imie.style.boxShadow = "0 0 15px red";
        valid = false;
    } else {
        imie.style.boxShadow = "0 0 15px green";
    }

    if (email.value.length < 3 || !validateEmail(email.value)) {
        email.style.boxShadow = "0 0 15px red";
        valid = false;
    } else {
        email.style.boxShadow = "0 0 15px green";
    }

    if (temat.value.length < 3) {
        temat.style.boxShadow = "0 0 15px red";
        valid = false;
    } else {
        temat.style.boxShadow = "0 0 15px green";
    }

    /**
     * sprawdzenie czy zgoda jest zaznaczona i czy wszystkie pola są wypełnione
     */
    wyslij.disabled = !valid || !zgoda.checked;
}

/**
 * Pobranie elementów z nawigacji
 */
var nav1 = document.getElementById('n1');
var nav2 = document.getElementById('n2');
var nav3 = document.getElementById('n3');
var nav4 = document.getElementById('n4');

/**
 * Funkcje przewijające do odpowiednich sekcji
 */
nav1.onclick = function () {
    document.getElementsByClassName('backImage')[0].scrollIntoView({ behavior: 'smooth' });
}
nav2.onclick = function () {
    document.getElementsByClassName('api')[0].scrollIntoView({ behavior: 'smooth' });
}
nav3.onclick = function () {
    document.getElementsByClassName('text')[0].scrollIntoView({ behavior: 'smooth' });
}
nav4.onclick = function () {
    document.getElementsByClassName('formularz')[0].scrollIntoView({ behavior: 'smooth' });
}

/**
 * @param first sprawdza czy funkcja execute() została już wykonana
 */
var first = true;


/**
 * Funkcje pobierające dane z API YouTube
 */
function authenticate() {
    return gapi.auth2.getAuthInstance()
    /**
     * Funkcja logująca się do konta Google
     */
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        /**
         * Funkcja wyświetlająca komunikat o błędzie lub o poprawnym zalogowaniu
         */
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  /**
   * Funkcja ładująca dane z API YouTube
   */
  function loadClient() {
    /**
     * Funkcja ustawiająca klucz API
     */
    gapi.client.setApiKey("AIzaSyAze6gCUePWifTM2t57h-Hb_QUjBVUZnqY");
    /**
     * Funkcja ładująca dane z API YouTube
     */
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        /**
         * Funkcja wyświetlająca komunikat o błędzie lub o poprawnym załadowaniu danych
         */
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }

    /**
    * Funkcja pobierająca dane z API YouTube
    */
  function execute() {
    return gapi.client.youtube.channels.list({
      "part": [
        "snippet,contentDetails,statistics"
      ],
      "id": [
        "UC_x5XG1OV2P6uZZ5FSM9Ttw"
      ]
    })
        /**
         * Funkcja wyświetlająca komunikat o błędzie lub o poprawnym pobraniu danych
         */
        .then(function(response) {
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }

  /**
   * Funkcja inicjalizująca API YouTube
   */
  gapi.load("client:auth2", function() {
    /**
     * Funkcja inicjalizująca API YouTube i ustawiająca klucz klienta API
     */
    gapi.auth2.init({client_id: "776044183582-96jn07vm5nnmip3gdq7780b7gv444sgr.apps.googleusercontent.com"});
  });

/**
 * Funkcja pobierająca dane z formularza i wysyłająca je do API YouTube
 */
  document.querySelector('.api form').addEventListener('submit', function(event) {
    /**
     * Funkcja zapobiegająca domyślnej akcji przesyłania formularza
     */
    event.preventDefault();
    /**
     * Funkcja sprawdzająca czy funkcja execute() została już wykonana
     */
    if (first == true) {
        authenticate().then(loadClient).then(execute);
        first = false;
    }
    /**
     * @param searchQuery pobiera wartość z pola wyszukiwania
     */
    var searchQuery = document.getElementById('search').value;
    /**
     * Wywołanie funkcji wyszukującej w filmu na YouTube
     */
    searchYouTube(searchQuery);
});

/**
 * Funkcja wyszukująca w filmie na YouTube
 */
function searchYouTube(query) {
    /**
     * Funkcja wyszukująca w filmie na YouTube max 5 wyników
     */
    return gapi.client.youtube.search.list({
        'part': 'snippet',
        'maxResults': 5,
        'q': query
    })
    .then(function(response) {
        displayResults(response.result);
    },
    function(err) { console.error("Execute error", err); });
}

/**
 * Funkcja wyświetlająca wyniki wyszukiwania
 */
function displayResults(response) {
    /**
     * @param videosContainer pobiera element z HTML
     */
    var videosContainer = document.getElementById('videosContainer');

    /**
     * Usuwa poprzednie wyniki wyszukiwania
     */
    videosContainer.innerHTML = '';

    /**
     * Sprawdza czy są jakieś wyniki wyszukiwania
     */
    if (response.items.length == 0) {
        videosContainer.innerHTML = '<p>Brak wyników.</p>';
        return;
    }

    /**
     * @param firstVideo pobiera pierwszy wynik wyszukiwania będący filmem
     */
    var firstVideo = response.items.find(item => item.id.kind === 'youtube#video');

    /**
     * Jeeli nie ma wyników wyszukiwania będących filmami to wyświetla komunikat
     */
    if (!firstVideo) {
        videosContainer.innerHTML = '<p>Brak wyników wideo.</p>';
        return;
    }

    /**
     * Tworzy element iframe i dodaje go do strony
     */
    var iframe = document.createElement('iframe');
    /**
     * Ustawia ścieżkę do filmu na YouTube
     */
    iframe.setAttribute('src', 'https://www.youtube.com/embed/' + firstVideo.id.videoId);
    /**
     * Ustawia atrybuty wysookości i szerokości iframe
     */
    iframe.setAttribute('width', '560');
    iframe.setAttribute('height', '315');
    /**
     * Ustawia atrybuty frameborder, allow, allowfullscreen iframe
     */
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', true);

    /**
     * Dodaje iframe do strony
     */
    videosContainer.appendChild(iframe);
}
