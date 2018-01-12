$(document).ready(function() {
    $('div#navigation ul li#users-dropdownabble').click(function() {
        if (sessionStorage.getItem('manage_users_down') === 'false'
            || !$(this).next().is(':visible')) {
            $("div#users-dropdown").slideDown(400);
            $('li#users-dropdownabble span').text('▲');
            sessionStorage.setItem('manage_users_down', true);
        } else {
            $("div#users-dropdown").slideUp(400);
            $('li#users-dropdownabble span').text('▼');
            sessionStorage.setItem('manage_users_down', false);
        }
    });

    $('div#navigation ul li').click(function() {
        var menu_id = $(this).attr('id');
        if (localStorage.getItem('current_view') !== menu_id
            && (menu_id !== 'users-dropdownabble'
                && menu_id !== 'logout-button')
        ) {
            $('div#' + localStorage.getItem('current_view')).fadeOut(500, function() {
                $('div#loading-page').fadeIn(500);
            });
            localStorage.setItem('current_view', menu_id);
            window.location.reload(true);
        }
    });

    $('div#navigation ul li#logout-button').click(function() {
        $.post('utils/logout.php', function() {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload(true);
        });
    });
});