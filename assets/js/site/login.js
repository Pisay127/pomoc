$(document).ready(function(){
   $('form#login-form').submit(function(e) {
       e.preventDefault();

       $("input#submit").val('Logging in...').attr("disabled", "disabled");

       var form_data = $(this).serialize();
       $.post('utils/login.php', form_data, function(response) {
           var resp_json = JSON.parse(response);
           if (resp_json.error) {
               var message_block = $('div#login-message');
               message_block.text(resp_json.message);

               if (message_block.is(':visible')) {
                   // Perhaps in the future, try making the form shake horizontally,
                   // and flash the login message block.

                   message_block.fadeOut(200).fadeIn(200)
                                .fadeOut(200).fadeIn(200);
               } else {
                   message_block.slideDown(450);
               }

               $("input#submit").val('Login').removeAttr("disabled");
           } else {
               localStorage.setItem('current_view', 'profile');
               sessionStorage.setItem('manage_users_down', false);
               window.location.reload(true);
           }
       });
   });
});