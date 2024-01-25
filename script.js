var imie = document.getElementById('imie');
var email = document.getElementById('email');
var temat = document.getElementById('temat');
var wiadomosc = document.getElementById('wiadomosc');
var zgoda = document.getElementById('zgoda');
var wyslij = document.getElementById('wyslij');

imie.onkeyup = validate;
email.onkeyup = validate;
temat.onkeyup = validate;
zgoda.onchange = validate;

function validateEmail(email) {
    var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
}

function validate() {
    var valid = true;
    if (imie.value.length < 3) {
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

var nav1 = document.getElementById('n1');
var nav2 = document.getElementById('n2');
var nav3 = document.getElementById('n3');
var nav4 = document.getElementById('n4');

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


function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    gapi.client.setApiKey("AIzaSyAze6gCUePWifTM2t57h-Hb_QUjBVUZnqY");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
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
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "776044183582-96jn07vm5nnmip3gdq7780b7gv444sgr.apps.googleusercontent.com"});
  });