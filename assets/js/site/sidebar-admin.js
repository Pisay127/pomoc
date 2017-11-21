$(document).ready(function() {
    var is_manage_users_dropped = false;

    $('li#users-dropdownabble').click(function() {
        if (!is_manage_users_dropped) {
            $("div#users-dropdown").slideDown(400);
            $('li#users-dropdownabble span').text('▲');
            is_manage_users_dropped = true;
        } else {
            $("div#users-dropdown").slideUp(400);
            $('li#users-dropdownabble span').text('▼');
            is_manage_users_dropped = false;
        }
    })
});