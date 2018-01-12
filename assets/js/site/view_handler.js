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

    if (localStorage.getItem('current_view') === 'manage-admins') {
        display_all_admins();
    }

    function display_all_admins() {
        var results_panel = $('div#manage-admins div#panel div#results');

        $.post('utils/get_all_admins.php', '', function (response) {
            var message_block = $('div.view-message');
            var json_response = JSON.parse(response);
            if (json_response.error === true) {
                message_block.text(json_response.message);
                message_block.slideDown(450);
            } else {
                var results_html = '';
                var num_admins = Object.keys(json_response['data']['admin']).length;
                for (var i = 0; i < num_admins; i++) {
                    var obj = json_response['data']['admin'][i];
                    var div_class = 'dropdownabble-trigger';

                    if (i === 0) {
                        div_class += ' curved-top-border';
                    }

                    if (i === num_admins - 1) {
                        div_class += ' curved-bottom-border bottom-dropdownabble-trigger';
                    }

                    results_html += '<div class="' + div_class + '"><span class="arrow" style="margin-right: 2%">▶</span>(<span class="dropdownabble-element-id-number">' + obj.id_number + '</span>) <span class="dropdownabble-element-last-name">' + obj.last_name + '</span>, <span class="dropdownabble-element-first-name">' + obj.first_name + '</span></div>';
                    results_html += '<div class="dropdownabble-element">';
                    results_html += '<form method="POST" class="pure-form pure-form-aligned">' +
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
                        '<span class="pure-form-message-inline"><span class="show-password" >👁</span> (Hover over eye to show password)</span>' +
                        '</div>';
                    results_html += '<div class="pure-control-group">' +
                        '<label>&nbsp;</label>' +
                        '<span class="pure-form-message-inline"><i>Note: Leave the password field blank if you do not want to change the password.</i></span>' +
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
                        '<input name="birth_date" type="text" class="date-selector-input" placeholder="November 15, 1935" value="' + obj.birth_date + '">' +
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

                results_panel.fadeOut(450, function() {
                    $(this).html('').html(results_html).slideDown(450);
                });
            }
        });
    }
});