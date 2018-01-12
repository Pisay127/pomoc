$(document).ready(function() {
    var admin_panel_form_selector = 'div#manage-admins div#panel div#add-admin-panel div#add-admin-form form';
    var admin_panel_form = $(admin_panel_form_selector);
    var admin_inputs = {};
    var timeout_id = 0;
    $(admin_panel_form_selector + ' input').each(function() {
        var input = $(this);
        var input_id = input.attr('id');
        admin_inputs[input_id] = input;
    });

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

    $(document).on('click', 'button.admin-save-changes-button', function(e) {
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

    $('div#manage-admins div#panel div#actions button#add-new-admin').click(function() {
        var add_admin_panel = $('div#manage-admins div#panel div#add-admin-panel');
        if (add_admin_panel.is(':visible')) {
            add_admin_panel.slideUp(400);
            admin_panel_form[0].reset();
        } else {
            add_admin_panel.slideDown(400);
        }
    });

    $(document).on('click', 'input.date-selector-input', function() {
        $(this).datepicker({
            dateFormat: 'MM dd, yy',
            changeYear: true,
            changeMonth: true,
            minDate: new Date(1935, 11, 15), // Start of Commonwealth of the Philippines, yo!
            maxDate: 0,
            yearRange: '1935:+0'
        });
        $(this).datepicker('show');
    });

    $(document).on('keydown', 'input.date-selector-input', function(e) {
        e.preventDefault();
        return false;
    });

    $(document).on('click', 'button.admin-delete-button', function(e) {
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

    $('div#manage-admins div#panel div#add-admin-panel span#add-admin-panel-close-button').click(function() {
        $('div#manage-admins div#panel div#add-admin-panel').slideUp(400);
        admin_panel_form[0].reset();
    });

    $('#content-layer #main-dashboard #manage-admins div#panel div#add-admin-panel div#add-admin-form form fieldset div span span#show-password').hover(
        function() { // On hover.
            admin_inputs['password'].attr('type', 'text');
        },
        function() { // After hover
            admin_inputs['password'].attr('type', 'password');
        }
    );

    $(document).on('mouseenter', 'span.show-password', function() {
        var parent_form = $(this).closest('form');
        var password_field = parent_form[0].elements['password'];
        $(password_field).attr('type', 'text');
    });

    $(document).on('mouseleave', 'span.show-password', function() {
        var parent_form = $(this).closest('form');
        var password_field = parent_form[0].elements['password'];
        $(password_field).attr('type', 'password');
    });

    $(admin_inputs['create-admin-birth_date']).click(function() {
        $(this).datepicker({
            dateFormat: 'MM dd, yy',
            changeYear: true,
            changeMonth: true,
            minDate: new Date(1935, 11, 15), // Start of Commonwealth of the Philippines, yo!
            maxDate: 0,
            yearRange: '1935:+0'
        });
        $(this).datepicker('show');
    });

    $(admin_inputs['create-admin-birth_date']).keydown(function(e) {
        e.preventDefault();
        return false;
    });

    $('#content-layer #main-dashboard #manage-admins div#panel div#add-admin-panel div#add-admin-form form fieldset div button').click(function(e) {
        e.preventDefault();
        $(this).text('Creating new admin...').attr("disabled", "disabled");

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

            message_block.text(message);
            message_block.slideDown(450);

            $(this).text('Create new admin').attr("disabled", false);

            return false;
        }

        if (Math.floor(Math.random() * 1000) === 0) {
            // If you are this unlucky, just wow, oh wow.
            message = 'IT\'S SPECIFIED IN THE DAMN FORM ALREADY! Gah, humans!';
        }


        for (var key in admin_inputs) {
            if (key === 'id_number' && !isIDNumberValid(admin_inputs[key].val())) {
                message = 'Invalid ID number. It must be of the form 12-34-569. ' + message;
                message_block.text(message);
                message_block.slideDown(450);

                $(this).text('Create new admin').attr("disabled", false);

                return false;
            } else if (key === 'username' && !isUsernameValid(admin_inputs[key].val())) {
                message = 'Invalid username. Use alphanumeric characters only. ' + message;
                message_block.text(message);
                message_block.slideDown(450);

                $(this).text('Create new admin').attr("disabled", false);

                return false;
            }

            if (key === 'create-admin-birth_date') {
                validatedData['age'] = getAgeInYears(key);
                key = 'birth_date';
            }

            validatedData[key] = admin_inputs[(key === 'birth_date') ? 'create-admin-birth_date' : key].val();
        }

        $.post('utils/add_admin.php', { 'new_admin_data': JSON.stringify(validatedData)}, function(response) {
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

    function getAgeInYears(date) {
        var second_diff = (Date.now() / 1000) - (new Date(date).getTime() / 1000 | 0);
        second_diff = second_diff / 31557600; // Divided by the number of seconds in a year.
        return Math.floor(second_diff);
    }

    function isIDNumberValid(id_number) {
        var pattern = new RegExp('^\\d{2}[-]\\d{2}[-]\\d{3}$');
        return pattern.test(id_number);
    }

    function isUsernameValid(username) {
        var pattern = new RegExp('^(([a-zA-Z])|(\\d))+$');
        return pattern.test(username);
    }

    function isFormValid() {
        var isValid = true;
        $(admin_panel_form_selector + ' input').each(function() {
            if ($(this).val() === '') {
                isValid = false;
            }
        });

        return isValid;
    }

    function checkIfUserIDIsCurrentUser(user_id) {
        var cookie_user_id = getUserIDFromCookie();

        return cookie_user_id == user_id;
    }

    function getUserIDFromCookie() {
        var access_token = getAccessTokenFromCookie();
        var decoded_jwt = decodeJWT(access_token);
        var decoded_payload = JSON.parse(decoded_jwt.payload);

        return decoded_payload.sub;
    }

    function decodeJWT(jwt) {
        var jwt_parts = jwt.split('.');
        return {
            'header': atob(jwt_parts[0]),
            'payload': atob(jwt_parts[1]),
            'signature': jwt_parts[2]
        }
    }

    function getAccessTokenFromCookie() {
        var cookie = Cookies.get('pomoc_user');
        var cookie_value = JSON.parse(cookie);

        return cookie_value.access_token;
    }
});