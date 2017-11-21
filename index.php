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
    <script type="text/javascript" src="assets/js/site/sidebar-admin.js"></script>
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
                    <div id="navigation">
                        <ul>
                            <li>Profile</li>
                            <li>Manage Subjects</li>
                            <li>Manage Classes</li>
                            <li>Manage Batches</li>
                            <li>Manage Sections</li>
                            <li id="users-dropdownabble">Manage Users<span class="push-rightmost">▼</span></li>
                            <div id="users-dropdown">
                                <li>Manage Admins</li>
                                <li>Manage Students</li>
                                <li>Manage Teachers</li>
                            </div>
                        </ul>
                    </div>
                    <div id="quote">
                        ~o~
                        <blockquote>
                            You know, rewarding us with $omething wouldn\'t hurt.
                            <br><br>-Shawarma Team
                        </blockquote>
                        ~o~
                    </div>
                    <div id="information">
                        <footer>
                        Copyright &copy; Philippine Science High School - Eastern Visayas Campus.<br><br>Developed by Shawarma Team. You may contact us through <a href="https://twitter.com/seanballais" target="_blank">@seanballais</a>, <a href="https://twitter.com/dejesus_610" target="_blank">@dejesus_610</a>, <a href="https://twitter.com/pulmaats" target="_blank">@pulmaats</a>.
                        </footer>
                    </div>
                </div>
                <div id="main-dashboard" class="pure-u-17-24">
                    <div id="profile" class="views">
            ';
                        require_once("utils/get_user_information.php");
                        $user_info = get_user_info();
                        $name = $user_info["first_name"]." ".$user_info["middle_name"]." ".$user_info["last_name"];
                        $birth_date = strftime("%B %d, %Y", strtotime($user_info["birth_date"]));
                        echo '
                            <div id="header">
                                <img id="profile-pic" class="pure-img" src="assets/img/icons/logo.jpg" width="175px" height="175px">
                                <h3>'.$name.'</h3>
                                <h2>@'.$user_info["username"].'</h2>
                                <p class="pure-u"><span id="age-span"><b>Age</b> '.$user_info["age"].'</span><span><b>Birthday</b> '.$birth_date.'</span></p>
                            </div>
                            <div id="information">
                                
                            </div>
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