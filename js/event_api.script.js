/**
 * Ce fichier script développe la partie de récupération des évenements sur Paris.
 * Nous utilisons l'api des evenements fournie par opendata.paris
 */


/**
 *  Affiche les événements  qui ont lieu proche de la ligne, dans un élement web carousel
 *
 * @param events le tableau des évènements qui ont lieu proche de la ligne sélectionnée
 */
function displayEventsByPlacename(events) {
    var colors = ["red", "amber", "green", "blue", "pink", "cyan", "purple", "orange", "brown", "grey"];
    if(events.length > 0) {
        for (var i = 0; i < events.length; i++) {
            document.getElementById('carouselEvents').innerHTML += "<div class=\"carousel-item " + colors[i] + " white-text\" href=\"#one!\">   " +
                "<h2>" + events[i].title + "</h2>\n" +
                "      <p class=\"white-text\">" + events[i].description + "</p>" +
                "      <a class=\"btn waves-effect white grey-text darken-text-2\" target='_blank' href='" + events[i].link + "' >Voir plus</a>" +
                "</div>";
        }
        $('#carouselEvents').show();
        var carouselElement = document.getElementById('carouselEvents');
        var carouselInstance = M.Carousel.init(carouselElement, {
            fullWidth: true,
            indicators: true
        });
    }else{
        M.toast({html: "Pas d'évenements proches de cette ligne"})
    }
}

/**
 * Fait un appel fetch pour récupérer les événements en fonction de ligne de transport sélectionné
 * Stocke le resultat dans un tableau et appelle ensuite la fonction d'affichage
 */
function getEventsByPlacename() {
    var url = "https://opendata.paris.fr/api/records/1.0/search/?dataset=evenements-a-paris&q=";
    var today = new Date();
    today = today.getFullYear() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getDate();
    var dateInterval = "(date_start%3C%3D%22" + today + "%22+AND+date_end%3E%3D%22" + today + "%22)+";
    var placename = "(";
    for (var i = 0; i < placenameByLine.length; i++) {
        placename += "placename%3D%22" + placenameByLine[i] + "%22+OR+"
    }
    placename = placename.slice(0, -4);
    placename += ")";
    url = url + dateInterval + "AND" + placename;
    var test = "https://opendata.paris.fr/api/records/1.0/search/?dataset=evenements-a-paris&q=(date_start%3C%3D%222018-10-26%22+AND+date_end%3E%3D%222018-10-26%22)+AND+(placename%3D%22villette%22)"
    fetch(url) // Call the fetch function passing the url of the API as a parameter
        .then(function (response) {
            response.json().then(function (json) {
                    var events = json.records;
                    var eventsByLine = [];
                    for (var i = 0; i < events.length; i++) {
                        var eventData = {
                            title: events[i].fields.title,
                            description: events[i].fields.description,
                            price: events[i].fields.pricing_info,
                            link: events[i].fields.link
                        };
                        eventsByLine[i] = eventData;
                    }
                    eventsByLine.slice(0, 10); // On va afficher au maximum 10 evenements
                    displayEventsByPlacename(eventsByLine);
                    document.getElementById('carouselEvents').scrollIntoView({behavior:'smooth'});
                }
            )
        })
        .catch(function (error) {
            // This is where you run code if the server returns any errors
        });
}
