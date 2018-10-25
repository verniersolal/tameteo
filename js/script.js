function logFormData() {
    console.log($('form').serializeArray())
}

function init() {
    // Materialize Time picker
    var elems = document.querySelectorAll('.timepicker');
    var instances = M.Timepicker.init(elems,{twelveHour : false,i18n : {done:"Valider",cancel:"Annuler"}});

    var research_button = document.getElementById("research");
    research_button.addEventListener('click', logFormData);
}