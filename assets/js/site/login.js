$(document).ready(function(){
   $('form#login-form').submit(function(e) {
       e.preventDefault();

       var form_data = $('form#login-form').serialize();
       $.post('utils/login.php', form_data, function(response) {
           window.location.reload(true);
       });
   });
});