$(document).ready(function() {
    $('div#loading-page').fadeOut(500, function() {
        $('div#' + localStorage.getItem('current_view')).fadeIn(500);
    });
});