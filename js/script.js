function logFormData() {
    console.log($('form').serializeArray());
}

function init() {
    // Materialize Time picker
    var elems = document.querySelectorAll('.timepicker');
    var instances = M.Timepicker.init(elems, {twelveHour: false, i18n: {done: "Valider", cancel: "Annuler"}});

    var research_button = document.getElementById("research");
    research_button.addEventListener('click', logFormData);

    var getDataUrl = "http://data.montpellier3m.fr/sites/default/files/ressources/TAM_MMM_TpsReel.csv";

    fetch(getDataUrl, myInit) // Call the fetch function passing the url of the API as a parameter
        .then(function (response) {
            console.log(response);
            reponse.json().then(function (data) {
                console.log("toto", data);
            })
        })
        .catch(function (error) {
            console.log(error)
            // This is where you run code if the server returns any errors
        });

}