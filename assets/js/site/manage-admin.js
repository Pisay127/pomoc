$(document).ready(function() {
    var admin_panel_form_selector = 'div#manage-admins div#panel div#add-admin-panel div#add-admin-form form';
    var admin_panel_form = $(admin_panel_form_selector);
    var admin_inputs = {};
    $(admin_panel_form_selector + ' input').each(function() {
        var input = $(this);
        var input_id = input.attr('id');
        admin_inputs[input_id] = input;
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
});