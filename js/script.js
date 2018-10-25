function logFormData() {
    console.log($('form').serializeArray());
}

function init() {
    // Materialize Time picker
    var elems = document.querySelectorAll('.timepicker');
    var instances = M.Timepicker.init(elems, {twelveHour: false, i18n: {done: "Valider", cancel: "Annuler"}});

    var research_button = document.getElementById("research");
    research_button.addEventListener('click', logFormData);

    var getTAMData = "https://api-ratp.pierre-grimaud.fr/v3/lines/metros";

    var sncfCoverageUrl = "https://api.sncf.com/v1/coverage/";
    var stringAuth = "Basic YzhjNjk0NjMtOGM5Zi00YzllLTk5M2ItNmEyZDdmNzUzODU1Og==";

    fetch(getTAMData, {headers: headers}) // Call the fetch function passing the url of the API as a parameter
        .then(function (response) {
            response.text().then(function (value) {
                console.log(value);
            })
        })
        .catch(function (error) {
            console.log(error)
            // This is where you run code if the server returns any errors
        });
}