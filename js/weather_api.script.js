/**
 * Ce fichier script développe la partie de récupération des données de la météo sur Paris.
 * Nous utilisons l'api open weather map
 */

/**
 * Affiche le status météo de Paris en temps réel
 * @param json
 */
function displayWeather(json) {
    var currentTime = new Date().toLocaleTimeString('fr-FR', {
        hour12: false,
        hour: "numeric",
        minute: "numeric"
    });
    var city = json.name;
    var weatherIcon = "icons/" + json.weather[0].icon + ".png";
    var tempMax = parseInt(json.main.temp_max - 273.15);
    var tempMin = parseInt(json.main.temp_min - 273.15);
    var description = json.weather[0].description;
    document.getElementById('current-time').innerHTML = "Paris, " + currentTime;
    document.getElementById('weather-icon').src = weatherIcon;
    document.getElementById('temp-max').innerHTML = tempMax + "°C";
    document.getElementById('temp-min').innerHTML = tempMin + "°C";
    document.getElementById('weather-description').innerHTML = description.charAt(0).toUpperCase() + description.slice(1);
    $('#weather').show();
}

/**
 *  Récupère le status météo atuel de Paris grâce à un appel à l'api openweathermap
 */
function getCurrentWeather() {
    var url = "https://api.openweathermap.org/data/2.5/weather?q=Paris,fr?&lang=fr&APPID=0f8facfa615da89b6533605fa0ee2c4d";
    fetch(url) // Call the fetch function passing the url of the API as a parameter
        .then(function (response) {
            response.json().then(function (json) {
                displayWeather(json);
            })
        })
        .catch(function (error) {
            // This is where you run code if the server returns any errors
        });
}

getCurrentWeather();
