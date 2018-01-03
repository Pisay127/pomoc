$(document).ready(function() {
    $(document).on('click', 'span.data-editable', function() {
        var $el = $(this);
        var el_id = $el.attr('id');
        var orig_text = $el.text();
        var $input = $('<input/>').val($el.text());
        $input.attr('id', 'birth_date');
        $input.attr('class', 'float-right right');
        $el.replaceWith($input);

        var save = function(){
            var entered_text = $input.val();
            if (entered_text && !isAllWhitespace(entered_text)) {
                $el.text($input.val());
            } else {
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
                    save();
                }
            });
            $input.datepicker('show');
        } else {
            $input.one('blur', save).focus();
        }
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