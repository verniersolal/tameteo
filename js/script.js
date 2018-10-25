//Sets default values
var transport = "metros";

// Line Autocomplete
var lineInput = document.querySelector('#line');
var stationsInput = document.querySelectorAll('.stations');

function getFormData() {
    console.log($('form').serializeArray());
    return $('form').serializeArray();
}

function getTransport(event) {
    transport = event.target.id;
    getLines(transport);
}

function getLines(transport) {
    var linesByTransport = {};
    var url = "https://api-ratp.pierre-grimaud.fr/v3/lines/" + transport;
    fetch(url) // Call the fetch function passing the url of the API as a parameter
        .then(function (response) {
            response.json().then(function (json) {
                var lines = json.result[transport];
                for (var i = 0; i < lines.length; i++) {
                    linesByTransport[lines[i].code.toString()] = null;
                }
                var instances = M.Autocomplete.init(lineInput, {data: linesByTransport});
                console.log(linesByTransport);
            })
        })
        .catch(function (error) {
            console.log(error)
            // This is where you run code if the server returns any errors
        });
}

function getStations(transport) {
    console.log("get Stations");
    var stationsByLine = {};
    var line = document.getElementById("line").value;
    var url = "https://api-ratp.pierre-grimaud.fr/v3/stations/" + transport + "/" + line;
    fetch(url) // Call the fetch function passing the url of the API as a parameter
        .then(function (response) {
            response.json().then(function (json) {
                var stations = json.result.stations;
                for(var i=0;i<stations.length;i++){
                   stationsByLine[stations[i].name] =null;
                }
                var instances = M.Autocomplete.init(stationsInput, {data: stationsByLine});
                console.log(stationsByLine);
            })
        })
        .catch(function (error) {
            console.log(error)
            // This is where you run code if the server returns any errors
        });
}

function init() {
    // Materialize Time picker
    var time_picker = document.querySelectorAll('.timepicker');
    var instance = M.Timepicker.init(time_picker, {twelveHour: false, i18n: {done: "Valider", cancel: "Annuler"}});

    var research_button = document.getElementById("research");
    research_button.addEventListener('click', getTransport);

    var transport_buttons = document.getElementsByClassName("rad_btn");
    for (var i = 0; i < transport_buttons.length; i++) {
        transport_buttons[i].addEventListener('click', getTransport);
    }

    document.getElementById("line").addEventListener('change',function (ev) { getStations(transport) })

}