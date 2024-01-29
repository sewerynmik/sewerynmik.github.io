/*
* zmienna przetrzymująca pole imie z formularza
*/
var imie = document.getElementById('imie');

/*
* zmienna przetrzymująca pole email z formularza
*/
var email = document.getElementById('email');

/*
* zmienna przetrzymująca pole temat z formularza
*/
var temat = document.getElementById('temat');

/*
* zmienna przetrzymująca pole wiadomosc z formularza
*/
var wiadomosc = document.getElementById('wiadomosc');

/*
* zmienna przetrzymująca checkbox zgoda z formularza
*/
var zgoda = document.getElementById('zgoda');

/*
* zmienna przetrzymująca przycisk wyslij z formularza
*/
var wyslij = document.getElementById('wyslij');

/*
* przypisanie funkcji do zdarzenia onkeyup dla pola imie
*/
imie.onkeyup = validate;

/*
* przypisanie funkcji do zdarzenia onkeyup dla pola email
*/
email.onkeyup = validate;

/*
* przypisanie funkcji do zdarzenia onkeyup dla pola temat
*/
temat.onkeyup = validate;

/*
* przypisanie funkcji do zdarzenia onchange dla checkboxa
*/
zgoda.onchange = validate;

/*
* funkcja sprawdzająca poprawność adresu email 
* email wymaga znaku @ oraz kropki
* @param email - adres email
*/
function validateEmail(email) {
    var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
}

/*
* funkcja sprawdzająca poprawność formularza
* sprawdza czy pola imie, email, temat nie są puste
* sprawdza czy pole imie zawiera tylko litery
* sprawdza czy email jest poprawny
* sprawdza czy checkbox zgoda jest zaznaczony
*/
function validate() {
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

    wyslij.disabled = !valid || !zgoda.checked;
}

/*
* zmienna przetrzymująca pierwszy przycisk nawigacji
*/
var nav1 = document.getElementById('n1');

/*
* zmienna przetrzymująca drugi przycisk nawigacji
*/
var nav2 = document.getElementById('n2');

/*
* zmienna przetrzymująca trzeci przycisk nawigacji
*/
var nav3 = document.getElementById('n3');

/*
* zmienna przetrzymująca czwarty przycisk nawigacji
*/
var nav4 = document.getElementById('n4');

/*
* przypisanie funkcji do zdarzenia onclick dla pierwszego przycisku nawigacji
* po kliknięciu przewija stronę do sekcji z obrazkiem
*/
nav1.onclick = function () {
    document.getElementsByClassName('backImage')[0].scrollIntoView({ behavior: 'smooth' });
}

/*
* przypisanie funkcji do zdarzenia onclick dla drugiego przycisku nawigacji
* po kliknięciu przewija stronę do sekcji z API
*/
nav2.onclick = function () {
    document.getElementsByClassName('api')[0].scrollIntoView({ behavior: 'smooth' });
}

/*
* przypisanie funkcji do zdarzenia onclick dla trzeciego przycisku nawigacji
* po kliknięciu przewija stronę do sekcji z tekstem
*/
nav3.onclick = function () {
    document.getElementsByClassName('text')[0].scrollIntoView({ behavior: 'smooth' });
}

/*
* przypisanie funkcji do zdarzenia onclick dla czwartego przycisku nawigacji
* po kliknięciu przewija stronę do sekcji z formularzem
*/
nav4.onclick = function () {
    document.getElementsByClassName('formularz')[0].scrollIntoView({ behavior: 'smooth' });
}

/*
* zmienna przetrzymująca element sprawdzający czy zalogowano do API
*/
var first = true;

/**
 * Autentykuje użytkownika za pomocą Google API.
 */
function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
}

/**
 * Ładuje klienta Google API i ustawia klucz API.
 */
function loadClient() {
    gapi.client.setApiKey("AIzaSyAze6gCUePWifTM2t57h-Hb_QUjBVUZnqY");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
}

/**
 * Wykonuje zapytanie do API YouTube w celu pobrania informacji o kanale.
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
        .then(function(response) {
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
}

/**
 * Inicjalizacja klienta Google API.
 */
gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "776044183582-96jn07vm5nnmip3gdq7780b7gv444sgr.apps.googleusercontent.com"});
});

/**
 * Funkcja wywoływana po kliknięciu przycisku wyszukiwania.
 * Pobiera wartość z pola wyszukiwania i wysyła zapytanie do API YouTube.
 */
document.querySelector('.api form').addEventListener('submit', function(event) {
    event.preventDefault();
    if (first == true) {
        authenticate().then(loadClient).then(execute);
        first = false;
    }
    var searchQuery = document.getElementById('search').value;
    searchYouTube(searchQuery);
});

/**
 * Wysyła zapytanie do API YouTube w celu wyszukania filmów.
 * @param {string} query - Wyszukiwana fraza.
 */
function searchYouTube(query) {
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
 * Wyświetla wyniki wyszukiwania YouTube w kontenerze jeśli są dostępne.
 * @param {Object} response - Odpowiedź z API YouTube zawierająca wyniki wyszukiwania.
 */
function displayResults(response) {
    var videosContainer = document.getElementById('videosContainer');

    videosContainer.innerHTML = '';

    if (response.items.length == 0) {
        videosContainer.innerHTML = '<p>Brak wyników.</p>';
        return;
    }

    var firstVideo = response.items.find(item => item.id.kind === 'youtube#video');

    if (!firstVideo) {
        videosContainer.innerHTML = '<p>Brak wyników wideo.</p>';
        return;
    }

    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://www.youtube.com/embed/' + firstVideo.id.videoId);
    iframe.setAttribute('width', '560');
    iframe.setAttribute('height', '315');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', true);

    videosContainer.appendChild(iframe);
}

/**
 * Zmienna przechowująca pytania do quizu.
 */
const questions = [
    {
        question: "Ile minut filmu można maksymalnie przesłać na YouTube w jednym filmie?",
        options: ["15 minut", "30 minut", "60 minut"],
        correctAnswer: "60 minut"
    },
    {
        question: "Kto jest założycielem YouTube?",
        options: ["Steve Jobs", "Larry Page", "Chad Hurley, Steve Chen, Jawed Karim"],
        correctAnswer: "Chad Hurley, Steve Chen, Jawed Karim"
    },
    {
        question: "W jakim roku YouTube został założony?",
        options: ["2000", "2005", "2010"],
        correctAnswer: "2005"
    }
];

/**
 * Zmienna przechowująca indeks aktualnego pytania.
 */
let currentQuestionIndex = 0;

/**
 * Zmienna przechowująca wynik quizu.
 */
let score = 0;

/**
 * Zmienna przechowująca element z pytaniem.
 */
const questionElement = document.getElementById("question");

/**
 * Zmienna przechowująca element z opcją A.
 */
const optionAElement = document.getElementById("optionA");

/**
 * Zmienna przechowująca element z opcją B.
 */
const optionBElement = document.getElementById("optionB");

/**
 * Zmienna przechowująca element z opcją C.
 */
const optionCElement = document.getElementById("optionC");

/**
 * Zmienna przechowująca wynik quizu.
 */
const resultElement = document.getElementById("result");

/**
 * Zmienna przechowująca przycisk do przejścia do następnego pytania.
 */
const nextButton = document.getElementById("nextButton");

/**
 * Funkcja ładuje pytanie quizu do interfejsu użytkownika.
 * Pobiera aktualne pytanie na podstawie indeksu i wyświetla je wraz z opcjami odpowiedzi.
 */
function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionAElement.textContent = currentQuestion.options[0];
    optionBElement.textContent = currentQuestion.options[1];
    optionCElement.textContent = currentQuestion.options[2];
}

/**
 * Sprawdza, czy wybrana odpowiedź jest poprawna.
 * Zwiększa licznik wyniku w przypadku poprawnej odpowiedzi i przechodzi do następnego pytania.
 * @param {string} selectedOption - Wybrana opcja odpowiedzi.
 */
function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
        score++;
        nextQuestion();
    } else {
        nextQuestion();
    }
    nextButton.disabled = false;
}

/**
 * Przechodzi do następnego pytania quizu lub wyświetla wynik końcowy, jeśli to ostatnie pytanie.
 */
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
        resultElement.textContent = "";
        nextButton.disabled = false;
    } else {
        showFinalResult();
    }
}

/**
 * Wyświetla wynik końcowy quizu.
 * Ukrywa opcje odpowiedzi i wyświetla zdobyty wynik.
 */
function showFinalResult() {
    questionElement.textContent = "Koniec quizu!";
    optionAElement.style.display = "none";
    optionBElement.style.display = "none";
    optionCElement.style.display = "none";
    resultElement.textContent = `Twój wynik: ${score}/${questions.length}`;
    nextButton.style.display = "none";
}

/**
 * Inicjalizacja pierwszego pytania quizu i ustawienie listenerów na opcje odpowiedzi i przycisk następnego pytania.
 */
loadQuestion();

optionAElement.addEventListener("click", () => checkAnswer(optionAElement.textContent));
optionBElement.addEventListener("click", () => checkAnswer(optionBElement.textContent));
optionCElement.addEventListener("click", () => checkAnswer(optionCElement.textContent));
nextButton.addEventListener("click", nextQuestion);