$(document).ready(function() {
    if (sessionStorage.getItem('manage_users_down') === 'true') {
        $("div#users-dropdown").show();
        $('li#users-dropdownabble span').text('▲');
    } else {
        $("div#users-dropdown").hide();
        $('li#users-dropdownabble span').text('▼');
    }

    $('div#loading-page').fadeOut(500, function() {
        $('div#' + Cookies.get('current_view')).fadeIn(500, function () {
            var manage_users_down_val = sessionStorage.getItem('manage_users_down');

            if (sessionStorage.getItem('display_message') !== null) {
                var message_block = $('div.view-message');
                message_block.text(sessionStorage.getItem('message_text'));
                message_block.slideDown(450);

                // TODO: Have this part of the code and other derivatives such as this delete specific
                // TODO: items from session storage instead of clearing all of it then re-adding some
                // TODO: cleared items.
            }

            sessionStorage.clear();
            sessionStorage.setItem('manage_users_down', manage_users_down_val);
        });
    });
});