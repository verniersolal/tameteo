function logFormData() {
    console.log($('form').serializeArray())
}

function init() {
    $(document).ready(function () {
        $('.timepicker').timepicker();
    });
    var research_button = document.getElementById("research");
    research_button.addEventListener('click',logFormData);
}