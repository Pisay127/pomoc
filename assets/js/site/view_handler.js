$(document).ready(function() {
    if (sessionStorage.getItem('manage_users_down') === 'true') {
        $("div#users-dropdown").show();
        $('li#users-dropdownabble span').text('▲');
    } else {
        $("div#users-dropdown").hide();
        $('li#users-dropdownabble span').text('▼');
    }

    $('div#loading-page').fadeOut(500, function() {
        $('div#' + localStorage.getItem('current_view')).fadeIn(500, function () {
            if (sessionStorage.getItem('display_message') !== null) {
                var message_block = $('div.view-message');
                var manage_users_down_val = sessionStorage.getItem('manage_users_down');
                var display_view_all_admins = sessionStorage.getItem('display_view_all_admins');
                message_block.text(sessionStorage.getItem('message_text'));
                message_block.slideDown(450);

                sessionStorage.clear();
                sessionStorage.setItem('manage_users_down', manage_users_down_val);
                sessionStorage.setItem('display_view_all_admins', display_view_all_admins);

                // TODO: Have this part of the code and other derivatives such as this delete specific
                // TODO: items from session storage instead of clearing all of it then re-adding some
                // TODO: cleared items.
            }

            if (sessionStorage.getItem('display_view_all_admins') !== null) {
                display_all_admins();

                sessionStorage.removeItem('display_view_all_admins');
            }
        });
    });

    function display_all_admins() {
        var results_panel = $('div#manage-admins div#panel div#results');
        var view_all_button = $('div#manage-admins div#panel div#actions button#view-all-admins');

        if (results_panel.html() !== '') {
            return false;
        }

        $(view_all_button).attr('disabled', true);
        $(view_all_button).text('👁 Fetching data...');

        results_panel.html('');
        $.get('utils/get_all_admins.php', '', function (response) {
            var message_block = $('div.view-message');
            var json_response = JSON.parse(response);
            if (json_response.error === true) {
                message_block.text(json_response.message);
                message_block.slideDown(450);
                view_all_button.attr('disabled', false);
                view_all_button.text('👁 View all admins');
            } else {
                var results_html = '';
                var num_admins = Object.keys(json_response['data']['admin']).length;
                for (var i = 0; i < num_admins; i++) {
                    var obj = json_response['data']['admin'][i];
                    var div_class = 'dropdownabble-trigger';

                    if (i === 0) {
                        div_class += ' curved-top-border';
                    } else if (i === num_admins - 1) {
                        div_class += ' curved-bottom-border';
                    }

                    results_html += '<div class="' + div_class + '"><span style="margin-right: 2%">▶</span> (' + obj.id_number + ') ' + obj.last_name + ', ' + obj.first_name + '</div>';
                    results_html += '<div class="dropdownabble-element">';
                    results_html += '<form class="pure-form pure-form-aligned">' +
                        '<fieldset>';
                    results_html += '<div class="pure-control-group">' +
                        '<label for="">ID Number</label>' +
                        '<input name="id_number" type="text" placeholder="ID Number" value="' + obj.id_number + '">' +
                        '<span class="pure-form-message-inline">Should be of the form 12-34-569.</span>' +
                        '</div>';
                    results_html += '<div class="pure-control-group">' +
                        '<label for="">Username</label>' +
                        '<input name="username" type="text" placeholder="Username" value="' + obj.username + '">' +
                        '<span class="pure-form-message-inline">Alphanumeric characters only.</span>' +
                        '</div>';
                    results_html += '<div class="pure-control-group">' +
                        '<label for="">Password</label>' +
                        '<input name="password" type="password" placeholder="Password" value="">' +
                        '<span class="pure-form-message-inline"><span id="show-password" >👁</span> (Hover over eye to show password)</span>' +
                        '</div>';
                    results_html += '<div class="pure-control-group">' +
                        '<label for="">First Name</label>' +
                        '<input name="first_name" type="text" placeholder="First Name" value="' + obj.first_name + '">' +
                        '</div>';
                    results_html += '<div class="pure-control-group">' +
                        '<label for="">Middle Name</label>' +
                        '<input name="middle_name" type="text" placeholder="Middle Name" value="' + obj.middle_name + '">' +
                        '</div>';
                    results_html += '<div class="pure-control-group">' +
                        '<label for="">Last Name</label>' +
                        '<input name="last_name" type="text" placeholder="Last Name" value="' + obj.last_name + '">' +
                        '</div>';
                    results_html += '<div class="pure-control-group">' +
                        '<label for="">Birthday</label>' +
                        '<input name="create-admin-birth_date" type="text" placeholder="November 15, 1935" value="' + obj.birth_date + '">' +
                        '<span class="pure-form-message-inline">Click text field to select date.</span>' +
                        '</div>';
                    results_html += '<div class="pure-controls">' +
                        '<button name="save-changes-button" type="submit" class="pure-button pure-button-bluer-green admin-save-changes-button">Save changes</button>' +
                        '<button name="delete-button" type="submit" class="pure-button pure-button-red admin-delete-button margin-left-two-percent" ';

                    if (num_admins === 1) {
                        results_html += 'disabled';
                    }

                    results_html += '>Delete admin</button>' +
                        '</div>';
                    results_html += '<input name="user_id" type="hidden" value="' + obj.user_id + '">';
                    results_html += '</fieldset>' +
                        '</form>';
                    results_html += '<div class="dropdownabble-message"></div>';
                    results_html += '</div>';
                }

                view_all_button.text('👁 View all admins');
                results_panel.html(results_html);
                results_panel.slideDown(450);
            }
        });
    }
});