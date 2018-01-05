$(document).ready(function() {
    if (sessionStorage.getItem('manage_users_down') === 'true') {
        $("div#users-dropdown").show();
        $('li#users-dropdownabble span').text('▲');
    }

    if (sessionStorage.getItem('no_loading') === null) {
        $('div#loading-page').fadeOut(500, function() {
            $('div#' + localStorage.getItem('current_view')).fadeIn(500);
        });
    } else {
        $('div#loading-page').fadeOut(500, function() {
            $('div#' + localStorage.getItem('current_view')).fadeIn(500, function () {
                if (sessionStorage.getItem('display_profile_save') !== null
                    && localStorage.getItem('current_view') === 'profile') {
                    var message_block = $('div#profile-save-message');
                    message_block.text(sessionStorage.getItem('profile_save_message'));
                    message_block.slideDown(450);
                    sessionStorage.clear();
                }
            });
        });
    }
});