$(document).ready(function() {
    var section_panel_form_selector = 'div#manage-sections div#panel div#add-section-panel div#add-section-form form';
    var section_panel_form = $(section_panel_form_selector);
    var timeout_id = 0;

    $(document).on('click', 'div.dropdownabble-trigger', function() {
        if ($(this).next().is(':visible')) {
            $(this).children('span.arrow').text('▶');

            var trigger_div = $(this);
            $(this).next().slideUp(450, function() {
                if (trigger_div.hasClass('bottom-dropdownabble-trigger')) {
                    trigger_div.addClass('curved-bottom-border');
                }
            });
        } else {
            $(this).children('span.arrow').text('▼');

            if ($(this).hasClass('bottom-dropdownabble-trigger')) {
                $(this).removeClass('curved-bottom-border', function() {
                    $(this).next().slideDown(450);
                });
            } else {
                $(this).next().slideDown(450);
            }
        }
    });

    $(document).on('click', 'button.section-save-changes-button', function(e) {
        e.preventDefault();

        var save_button = $(this);

        $(this).text('Saving changes...').attr("disabled", true);

        var parent_form = $(this).closest('form');
        var message_block = parent_form.next('div.dropdownabble-message');
        var admin_data = {};

        message_block.slideUp(450);

        var invalid_input = false;
        var invalid_input_message = '';
        $(parent_form).find(':input').not(':button').each(function() {
            var input_name = $(this).attr('name');
            var input_val = $(this).val();

            if (input_name === 'birth_date') {
                admin_data['age'] = getAgeInYears(input_val);
            } else if (input_name === 'id_number' && !isIDNumberValid(input_val)) {
                invalid_input = true;
                invalid_input_message = 'Invalid ID number. It must be of the form 12-34-569.';

                return false;
            } else if (input_name === 'username' && !isUsernameValid(input_val)) {
                invalid_input = true;
                invalid_input_message = 'Invalid username. Use alphanumeric characters only.';

                return false;
            }

            admin_data[input_name] = input_val;
        });

        if (invalid_input) {
            clearTimeout(timeout_id);

            message_block.slideUp(450, function() {
                message_block.text(invalid_input_message);
            }).slideDown(450);

            save_button.text('Save changes').attr("disabled", false);

            return false;
        }

        var dropdownabble_trigger = $(this).closest('div.dropdownabble-element').prev('div');

        $.post('utils/edit_user.php', {'modified_data': JSON.stringify(admin_data)}, function(response) {
            var resp_json = JSON.parse(response);
            var message_text = resp_json.message;
            message_block.text(message_text).slideDown(450);

            save_button.text('Save changes').attr("disabled", false);

            // TODO: Add a "Gathering admin information..." message at the start of this manage admin page.

            if (admin_data['id_number']) {
                $(dropdownabble_trigger).children('span.dropdownabble-element-id-number').text(admin_data['id_number']);
            }

            if (admin_data['last_name']) {
                $(dropdownabble_trigger).children('span.dropdownabble-element-last-name').text(admin_data['last_name']);
            }

            if (admin_data['first_name']) {
                $(dropdownabble_trigger).children('span.dropdownabble-element-first-name').text(admin_data['first_name']);
            }

            $(dropdownabble_trigger).highlight('#D4AE88');

            timeout_id = setTimeout(function() {
                message_block.slideUp(450);
            }, 3000);
        });
    });

    $('div#manage-sections div#panel div#actions button#add-new-section').click(function() {
        var add_admin_panel = $('div#manage-sections div#panel div#add-section-panel');
        if (add_admin_panel.is(':visible')) {
            add_admin_panel.slideUp(400);
            section_panel_form[0].reset();
        } else {
            add_admin_panel.slideDown(400);
        }
    });

    $(document).on('click', 'button.section-delete-button', function(e) {
        e.preventDefault();
        $(this).attr('disabled', true);
        var admin_delete_button = $(this);

        var parent_form = $(this).closest('form');
        var user_id = parent_form[0].elements['user_id'].value;
        var message_block = parent_form.next();

        if (checkIfUserIDIsCurrentUser(user_id)) {
            // TODO: Replace this with a custom dialog made using HTML/CSS.
            var delete_self = confirm("You are about to delete yourself. Are you really sure?\n\n" +
                "Note: You won't delete yourself from existence though, unfortunately.");

            if (delete_self === false) {
                sessionStorage.setItem('display_view_all_admins', 'true');
                window.location.reload(true);

                return false;
            }

            Cookies.remove('pomoc_user');
        }

        $.post('utils/delete_user.php', { 'user_id': user_id }, function(response) {
            var resp_json = JSON.parse(response);
            var message_text = resp_json.message;

            if (resp_json.error === true) {
                message_block.text(message_text);
                message_block.slideDown(450);
                admin_delete_button.attr('disabled', false);

                return false;
            }

            var manage_users_down_val = sessionStorage.getItem('manage_users_down');
            sessionStorage.clear();
            sessionStorage.setItem('display_message', 'true');
            sessionStorage.setItem('message_text', message_text);
            sessionStorage.setItem('display_view_all_admins', 'true');
            sessionStorage.setItem('manage_users_down', manage_users_down_val);
            window.location.reload(true);
        });
    });

    $('div#manage-sections div#panel div#add-section-panel span#add-section-panel-close-button').click(function() {
        $('div#manage-sections div#panel div#add-section-panel').slideUp(400);
        section_panel_form[0].reset();
    });

    $('#content-layer #main-dashboard #manage-sections div#panel div#add-section-panel div#add-section-form form fieldset div button').click(function(e) {
        e.preventDefault();
        $(this).text('Creating new section...').attr("disabled", "disabled");

        var validatedData = {};
        var message_block = $('div.view-message');
        var message = '';

        message_block.slideUp(450);

        if (!isFormValid()) {
            message = 'Please fill out all of the fields in the form.';

            if (Math.floor(Math.random() * 100) === 0) {
                // If you are this unlucky, just wow, oh wow.
                message += ' We know it\'s exhausting but you have to.';
            }

            message_block.text(message).slideDown(450);

            $(this).text('Create new section').attr("disabled", false);

            return false;
        }

        if (Math.floor(Math.random() * 1000) === 0) {
            // If you are this unlucky, just wow, oh wow.
            message = 'IT\'S SPECIFIED IN THE DAMN FORM ALREADY! Gah, humans!';
        }

        validatedData['section_name'] = $(section_panel_form_selector + ' input#section_name').val();
        validatedData['year_level'] = $(section_panel_form_selector + ' select#year_level').val();

        console.log(validatedData);

        $.post('utils/add_section.php', { 'new_section_data': JSON.stringify(validatedData)}, function(response) {
            var resp_json = JSON.parse(response);
            var message_text = resp_json.message;
            var manage_users_down_val = sessionStorage.getItem('manage_users_down');

            sessionStorage.clear();
            sessionStorage.setItem('display_message', 'true');
            sessionStorage.setItem('message_text', message_text);
            sessionStorage.setItem('manage_users_down', manage_users_down_val);
            window.location.reload(true);
        });
    });

    display_all_sections();

    function isFormValid() {
        var isValid = true;
        $(section_panel_form_selector + ' input').each(function() {
            // No need to check if the dropdown widget has a value because it already has a default value.

            if ($(this).val() === '') {
                isValid = false;
            }
        });

        return isValid;
    }

    function display_all_sections() {
        var results_panel = $('div#manage-sections div#panel div#results');

        $.post('utils/get_all_sections.php', '', function (response) {
            var message_block = $('div.view-message');
            var json_response = JSON.parse(response);
            if (json_response.error === true) {
                message_block.text(json_response.message);
                message_block.slideDown(450);
            } else {
                var results_html = '';
                var num_sections = Object.keys(json_response['data']['section']).length;
                for (var i = 0; i < num_sections; i++) {
                    var obj = json_response['data']['section'][i];
                    var div_class = 'dropdownabble-trigger';

                    if (i === 0) {
                        div_class += ' curved-top-border';
                    }

                    if (i === num_sections - 1) {
                        div_class += ' curved-bottom-border bottom-dropdownabble-trigger';
                    }

                    results_html += '<div class="' + div_class + '"><span class="arrow" style="margin-right: 2%">▶</span>(<span class="dropdownabble-element-id-number">' + obj.id_number + '</span>) <span class="dropdownabble-element-last-name">' + obj.last_name + '</span>, <span class="dropdownabble-element-first-name">' + obj.first_name + '</span></div>';
                    results_html += '<div class="dropdownabble-element">';
                    results_html += '<form method="POST" class="pure-form pure-form-aligned">' +
                        '<fieldset>';
                    results_html += '<div class="pure-control-group">' +
                        '<label for="">Section Name</label>' +
                        '<input name="section_name" type="text" placeholder="Section Name" value="' + obj.section_name + '">' +
                        '</div>';
                    results_html += '<div class="pure-control-group">' +
                        '<label for="">Year Level</label>' +
                        '<select id="year_level" name="year-level" value="' + obj.year_level + '">' +
                        '<option value="1">Grade 7</option>' +
                        '<option value="2">Grade 8</option>' +
                        '<option value="3">Grade 9</option>' +
                        '<option value="4">Grade 10</option>' +
                        '<option value="5">Grade 11</option>' +
                        '<option value="6">Grade 12</option>' +
                        '</select>' +
                        '</div>';
                    results_html += '<div class="pure-controls">' +
                        '<button name="save-changes-button" type="submit" class="pure-button pure-button-bluer-green admin-save-changes-button">Save changes</button>' +
                        '<button name="delete-button" type="submit" class="pure-button pure-button-red admin-delete-button margin-left-two-percent" ';

                    results_html += '>Delete section</button>' +
                        '</div>';
                    results_html += '<input name="user_id" type="hidden" value="' + obj.user_id + '">';
                    results_html += '</fieldset>' +
                        '</form>';
                    results_html += '<div class="dropdownabble-message"></div>';
                    results_html += '</div>';
                }

                results_panel.fadeOut(450, function() {
                    if (num_sections > 0) {
                        $(this).html('').html(results_html).slideDown(450);
                    } else {
                        // TODO: Create sad document icon.

                        results_html = '<div id="results-loading"><p>No sections added yet.</p></div>';
                        $(this).html('').html(results_html).slideDown(450);
                    }
                });
            }
        });
    }
});