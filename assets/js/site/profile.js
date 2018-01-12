$(document).ready(function() {
    $(document).on('click', 'div#profile div#information div#info-list span.data-editable', function() {
        var $el = $(this);
        var el_id = $el.attr('id');
        var orig_text = $el.text();
        var $input;
        if (el_id === 'password') {
            $input = $('<input type="password"/>');
        } else {
            $input = $('<input/>').val($el.text());
        }
        $input.attr('id', 'birth_date');
        $input.attr('class', 'float-right right');

        $el.replaceWith($input);

        var save = function(){
            var entered_text;
            if (el_id === 'password') {
                entered_text = '(secret)';
            } else {
                entered_text = $input.val();
            }

            if (entered_text && !isAllWhitespace(entered_text) && el_id !== 'password') {
                if (entered_text !== orig_text && el_id !== 'password') {
                    // Hey, someone modified this field.
                    sessionStorage.setItem(el_id, entered_text);
                    $('button#profile-save-button').attr('disabled', false);
                }

                $el.text($input.val());
            } else {
                if (el_id === 'password' && $input.val() !== '') {
                    sessionStorage.setItem('password', $input.val());
                    $('button#profile-save-button').attr('disabled', false);
                }

                $el.text(orig_text);
            }
            $input.replaceWith($el);
        };

        if (el_id === 'birth_date') {
            $input.attr('readonly', 'readonly');
            $input.datepicker({
                dateFormat: 'MM dd, yy',
                changeYear: true,
                changeMonth: true,
                minDate: new Date(1935, 11, 15), // Start of Commonwealth of the Philippines, yo!
                maxDate: 0,
                yearRange: '1935:+0',
                onClose: function() {
                    var second_diff = (Date.now() / 1000) - (new Date($input.val()).getTime() / 1000 | 0);
                    second_diff = second_diff / 31557600; // Divided by the number of seconds in a year.
                    var age_year = Math.floor(second_diff);

                    var $age_el = $('span#age');
                    $age_el.text(age_year);
                    sessionStorage.setItem('age', age_year);
                    save();
                }
            });
            $input.datepicker('show');
        } else {
            $input.keypress(function(e) {
                if (e.which === 13) {
                    $(this).blur();
                }
            });
            $input.one('blur', save).focus();
        }
    });

    $('button#profile-save-button').click(function() {
        var user_id = $('div#profile div#information div#info-list div#user_id').attr('data-user-id');
        var modified_data = {};
        for (var i = 0; i < sessionStorage.length; i++) {
            var key = sessionStorage.key(i);

            if (key === 'manage_users_down') {
                continue;
            }

            modified_data[key] = sessionStorage.getItem(key);
        }

        modified_data['user_id'] = user_id;

        $(this).text('Saving changes...').attr("disabled", "disabled");

        $.post('utils/edit_user.php', {'modified_data': JSON.stringify(modified_data)}, function(response) {
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

    function isAllWhitespace(text) {
        for (var i = 0, len = text.length; i < len; i++) {
            if (text.charAt(i) !== " ") {
                return false;
            }
        }

        return true;
    }
});