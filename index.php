<?php
    $user_logged_in = false;
    if (isset($_COOKIE["pomoc_user"])) {
        $user_logged_in = true;
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="assets/css/pure-css/base-min.css">
    <link rel="stylesheet" type="text/css" href="assets/css/pure-css/pure-min.css">
    <link rel="stylesheet" type="text/css" href="assets/css/pure-css/forms-min.css">
    <link rel="stylesheet" type="text/css" href="assets/css/global.css">
    <link rel="stylesheet" type="text/css" href="assets/css/fonts.css">
    <?php
        if ($user_logged_in) {
            echo '
            <link rel="stylesheet" type="text/css" href="assets/css/logged_index.css">
            ';
        } else {
            echo '
            <link rel="stylesheet" type="text/css" href="assets/css/anon_index.css">
            ';
        }
    ?>
    <script type="text/javascript" src="assets/js/lib/jquery.js"></script>
    <script type="text/javascript" src="assets/js/site/login.js"></script>
</head>
<body>
    <?php
        if ($user_logged_in) {
            echo '
            <div id="content-layer" class="pure-g">
                <div id="sidebar" class="pure-u-7-24">
                    <div id="title">
                        <h1>Pomoc</h1>
                        <h2>The PSHS-EVC Grading and Attendance System</h2>
                    </div>
                    <div id="quote">
                        ~o~
                        <blockquote>
                            You know, rewarding us with $omething wouldn\'t hurt.
                            <br><br>-Shawarma Team
                        </blockquote>
                        ~o~
                    </div>
                    <div id="navigation">
                        <ul>
                            <li>Dashboard</li>
                            <li>Profile</li>
                        </ul>
                    </div>
                    <div id="information">
                        <footer>
                        Copyright &copy; Philippine Science High School - Eastern Visayas Campus.<br><br>Developed by Shawarma Team. You may contact us through <a href="https://twitter.com/seanballais" target="_blank">@seanballais</a>, <a href="https://twitter.com/dejesus_610" target="_blank">@dejesus_610</a>, <a href="https://twitter.com/pulmaats" target="_blank">@pulmaats</a>.
                        </footer>
                    </div>
                </div>
                <div id="main-dashboard" class="pure-u-17-24">
                    <div id="profile">
                        <h1>Profile</h1>
            ';
                        require_once("utils/get_user_information.php");
                        $user_info = get_user_info();
                        echo '
                            <p>
                            Username: '.$user_info["username"].'<br>
                            ID: '.$user_info["user_id"].'<br>
                            First Name: '.$user_info["first_name"].'<br>
                            Middle Name: '.$user_info["middle_name"].'<br>
                            Last Name: '.$user_info["last_name"].'<br>
                            Age: '.$user_info["age"].'<br>
                            Birth Date: '.$user_info["birth_date"].'
                            </p>
                        ';
            echo '
                    </div>
                </div>
            </div>
            ';
        } else {
            echo '
            <div id="content-layer" class="pure-g">
                <div id="title-block" class="pure-u-13-24">
                    <div id="title-content">
                        <h1>Pomoc</h1>
                        <h2>The PSHS - EVC Grading and Attendance System</h2>
                    </div>
                </div>
                <div id="login-block" class="pure-u-9-24">
                    <div id="login-block-content">
                        <img id="logo" class="pure-img" src="assets/img/icons/logo.jpg" width="175px" height="175px">
                        <h1>Log in to access Pomoc</h1>
                        <form id="login-form" class="pure-form pure-form-stacked">
                            <fieldset class="pure-group">
                                <input id="username" name="username" type="text" class="pure-input-1" placeholder="Username" required>
                                <input id="password" name="password" type="password" class="pure-input-1" placeholder="Password" required>
                                <input id="submit" type="submit" class="pure-input-1" value="Log in">
                                
                                <div id="login-message"></div>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div class="pure-u-2-24"></div>
            </div>
            ';
        }
        ?>
</body>
</html>