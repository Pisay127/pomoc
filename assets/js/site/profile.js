$(document).ready(function() {
    $(document).on('click', 'span.data-editable', function() {
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
                    second_diff = Math.floor(second_diff);

                    var $age_el = $('span#age');
                    $age_el.text(second_diff);
                    sessionStorage.setItem('age', second_diff);
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
        var modified_data = {};
        for (var i = 0; i < sessionStorage.length; i++) {
            var key = sessionStorage.key(i);
            modified_data[key] = sessionStorage.getItem(key);
        }

        $(this).text('Saving changes...').attr("disabled", "disabled");

        $.post('utils/profile-save.php', {'modified_data': JSON.stringify(modified_data)}, function(response) {
            var resp_json = JSON.parse(response);
            var message_text = resp_json.message;

            sessionStorage.clear();
            sessionStorage.setItem('display_profile_save', 'true');
            sessionStorage.setItem('profile_save_message', message_text);
            sessionStorage.setItem('no_loading', 'true');
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