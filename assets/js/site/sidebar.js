$(document).ready(function() {
    var is_manage_users_dropped = false;

    $('div#navigation ul li#users-dropdownabble').click(function() {
        if (!is_manage_users_dropped) {
            $("div#users-dropdown").slideDown(400);
            $('li#users-dropdownabble span').text('▲');
            is_manage_users_dropped = true;
        } else {
            $("div#users-dropdown").slideUp(400);
            $('li#users-dropdownabble span').text('▼');
            is_manage_users_dropped = false;
        }
    });

    $('div#navigation ul li#profile').click(function() {
        if (localStorage.getItem('current_view') !== 'profile') {
            $('div#' + localStorage.getItem('current_view')).fadeOut(500);
            $('div#loading-page').fadeIn(500);
            localStorage.setItem('current_view', 'profile');
            window.location.reload(true);
        }
    });

    $('div#navigation ul li#manage-subjects').click(function() {
        if (localStorage.getItem('current_view') !== 'manage-subjects') {
            $('div#' + localStorage.getItem('current_view')).fadeOut(500);
            $('div#loading-page').fadeIn(500);
            localStorage.setItem('current_view', 'manage-subjects');
            window.location.reload(true);
        }
    });

    $('div#navigation ul li#logout-button').click(function() {
        $.post('utils/logout.php', function() {
            localStorage.clear();
            window.location.reload(true);
        });
    });
});