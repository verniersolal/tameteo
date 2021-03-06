//Sets default values
var transport = "";
var linesByTransport = {};
var stationsByLine = {};
var directionByLine = {};
var schedulesResults = [];
var traficByLine = "";
var placenameByLine = [];

// Line Autocomplete
var lineInput = document.querySelector('#line');
var stationsInput = document.querySelectorAll('#start_station');
var directionInput = document.querySelector('#direction');

/**
 * Ce fichier script développe la partie de récupération des données de la RATP.
 * Nous utilisons l'api API-RATP modifiée par Pierre Grimaud
 */


/**
 * Permet de récupérer la valeur des champs du formulaires
 * @returns {{transport: string, line: *, start_station: *, direction: *}}
 */
function getSelectedData() {
    return {
        transport: transport,
        line: linesByTransport[document.getElementById("line").value],
        start_station: stationsByLine[document.getElementById("start_station").value],
        direction: directionByLine[document.getElementById("direction").value]
    }
}

/**
 * Récupère le type de transport sélectionné.
 * Appelle la fonction qui récupère les lignes de ce type de transport.
 */
function getTransport() {
    transport = document.querySelector('input[name="transport"]:checked').id;
    getLines(transport);
}

/**
 * Récupère les lignes en fonction du type de transport
 * @param transport le type de transport
 */
function getLines(transport) {
    linesByTransport = {};
    var url = "https://api-ratp.pierre-grimaud.fr/v3/lines/" + transport;
    fetch(url) // Call the fetch function passing the url of the API as a parameter
        .then(function (response) {
            response.json().then(function (json) {
                var lines = json.result[transport];
                for (var i = 0; i < lines.length; i++) {
                    linesByTransport[lines[i].name] = lines[i].code;
                }
                var instances = M.Autocomplete.init(lineInput, {data: linesByTransport, minLength: 0});
            })
        })
        .catch(function (error) {
            // This is where you run code if the server returns any errors
        });
}

/**
 * Récupère les stations de la ligne de transport sélectionnée
 */
function getStations() {
    stationsByLine = {};
    var line = linesByTransport[document.getElementById("line").value];
    var url = "https://api-ratp.pierre-grimaud.fr/v3/stations/" + transport + "/" + line;
    fetch(url) // Call the fetch function passing the url of the API as a parameter
        .then(function (response) {
            response.json().then(function (json) {
                var stations = json.result.stations;
                for (var i = 0; i < stations.length; i++) {
                    stationsByLine[stations[i].name] = stations[i].slug;
                    var placename = stations[i].name;
                    placenameByLine.push(placename.split(' ').join('+'));
                }
                var instances = M.Autocomplete.init(stationsInput, {data: stationsByLine, minLength: 0});
            })
        })
        .catch(function (error) {
            // This is where you run code if the server returns any errors
        });
}

/**
 * Réinitialise les champs `Station` et `Direction` du formulaire
 */
function clearStationAndDirection() {
    document.getElementById("start_station").value = "";
    document.getElementById("direction").value = "";
}

/**
 * Réinitialise la totalité des champs du formulaire
 */
function clearAll() {
    clearStationAndDirection();
    document.getElementById("line").value = "";
}

/**
 * Retourne les choix de direction de la ligne de transport sélectionnée
 */
function getDirection() {
    directionByLine = {};
    var line = linesByTransport[document.getElementById("line").value];
    var url = "https://api-ratp.pierre-grimaud.fr/v3/lines/" + transport + "/" + line;
    fetch(url) // Call the fetch function passing the url of the API as a parameter
        .then(function (response) {
            response.json().then(function (json) {
                var result = json.result[0].directions;
                directionByLine[result.split("/")[0].trim()] = "A";
                directionByLine[result.split("/")[1].trim()] = "R";
                directionByLine["Toutes directions"] = "A+R";
                var instances = M.Autocomplete.init(directionInput, {data: directionByLine, minLength: 0});
            })
        })
        .catch(function (error) {
            // This is where you run code if the server returns any errors
        });
}

/**
 * Récupère les horaires de départ en fonction des champs du formulaire
 */
function getSchedules() {
    schedulesResults = {};
    var selectedData = getSelectedData();
    var url = "https://api-ratp.pierre-grimaud.fr/v3/schedules/" + selectedData.transport + "/" + selectedData.line + "/" + selectedData.start_station + "/" + selectedData.direction;
    fetch(url) // Call the fetch function passing the url of the API as a parameter
        .then(function (response) {
            response.json().then(function (json) {
                schedulesResults = json.result.schedules;
                displaySchedules();
            })
        })
        .catch(function (error) {
            // This is where you run code if the server returns any errors
        });
}

/**
 * Récupère l'état du trafic actuel sur la ligne sélectionnée
 */
function getTraficByLine() {
    traficByLine = "";
    var selectedData = getSelectedData();
    if (selectedData.transport !== "bus" && selectedData.transport !== "noctiliens") {
        var url = "https://api-ratp.pierre-grimaud.fr/v3/traffic/" + selectedData.transport + "/" + selectedData.line;
        fetch(url) // Call the fetch function passing the url of the API as a parameter
            .then(function (response) {
                response.json().then(function (json) {
                    traficByLine = json.result.message;
                    displayTrafic();
                })
            })
            .catch(function (error) {
                // This is where you run code if the server returns any errors
            });
    }
}

/**
 * Affiche l'état du trafic actuel sur la ligne sélectionnée dans le HTML
 */
function displayTrafic() {
    var traficDiv = document.getElementById("trafic");
    traficDiv.innerHTML = "<i class=\"small teal-text material-icons\">info</i>" + traficByLine;
    $("#trafic").show();
}

/**
 * Affiche les horaires de départ en fonction des champs du formulaire
 */
function displaySchedules() {
    var tableContent = document.getElementsByTagName("tbody");
    $("table").find('tbody').empty();
    for (var i = 0; i < schedulesResults.length; i++) {
        $("table").find('tbody').append("<tr><td>" + schedulesResults[i].message + "</td><td>" + schedulesResults[i].destination + "</td></tr>");
    }
    $("#schedules").show();
    document.getElementById('schedules').scrollIntoView({
        behavior: 'smooth'
    });
}

/**
 * Affiche le bouton de réinitialisation du formulaire
 */
function displayResetButton() {
    $('#resetButton').show();
    $("#research").attr('class', 'waves-effect waves-light btn teal input-field col s2 offset-s2');
}

/**
 * Réinitalise le formulaire avec les valeurs par défaut
 */
function resetFormData() {
    $('#resetButton').hide();
    $("#research").attr('class', 'waves-effect waves-light btn teal input-field col s2 offset-s5');
    document.getElementById("start_station").value = "";
    document.getElementById("line").value = "";
    document.getElementById("direction").value = "";
    $("#metros").prop("checked", true);
    transport = "metros";
    getTransport();
}

/**
 * Fonction d'initialisation appelée dans le body onload()
 */
function init() {
    getTransport();
    document.getElementById("research").addEventListener('click', getTraficByLine);
    document.getElementById("research").addEventListener('click', getSchedules);
    document.getElementById("research").addEventListener('click', getEventsByPlacename);
    var transport_buttons = document.getElementsByClassName("rad_btn");
    for (var i = 0; i < transport_buttons.length; i++) {
        transport_buttons[i].addEventListener('click', clearAll);
        transport_buttons[i].addEventListener('click', getTransport);
    }
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', displayResetButton)
    }
    document.getElementById("resetButton").addEventListener('click', resetFormData);
    document.getElementById("line").addEventListener('change', getStations);
    document.getElementById("line").addEventListener('change', getDirection);
    document.getElementById("line").addEventListener('change', clearStationAndDirection);
}