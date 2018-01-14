<?php
    require_once("utils/templating.php");

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
    <link rel="stylesheet" type="text/css" href="assets/css/jquery/jquery-ui.min.css">
    <link rel="stylesheet" type="text/css" href="assets/css/jquery/jquery-ui.theme.min.css">
    <link rel="stylesheet" type="text/css" href="assets/css/jquery/jquery-ui.structure.min.css">
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
    <script type="text/javascript" src="assets/js/lib/jquery-ui.min.js"></script>
    <script type="text/javascript" src="assets/js/lib/jquery-highlight.js"></script>
    <script type="text/javascript" src="assets/js/lib/js.cookie.js"></script>
    <script type="text/javascript" src="assets/js/site/login.js"></script>
    <script type="text/javascript" src="assets/js/site/sidebar.js"></script>
    <script type="text/javascript" src="assets/js/site/profile.js"></script>
    <script type="text/javascript" src="assets/js/site/manage-admin.js"></script>
    <script type="text/javascript" src="assets/js/site/view_handler.js"></script>
</head>
<body>
    <?php
        if ($user_logged_in) {
            require_once("utils/get_user_information.php");
            $user_info = get_user_info();
            $name = $user_info["first_name"]." ".$user_info["middle_name"]." ".$user_info["last_name"];
            $birth_date = strftime("%B %d, %Y", strtotime($user_info["birth_date"]));
            echo '
            <div id="content-layer" class="pure-g">
                <div id="sidebar" class="pure-u-7-24">
                    <div id="title">
                        <h1>Pomoc</h1>
                        <h2>The PSHS-EVC Grading and Attendance System</h2>
                    </div>
                    <div id="navigation">
                        <ul>
                            <li id="profile">Profile</li>
                            <li id="manage-subjects">Manage Subjects</li>
                            <li id="manage-classes">Manage Classes</li>
                            <li id="manage-batches">Manage Batches</li>
                            <li id="manage-sections">Manage Sections</li>
                            <li id="users-dropdownabble">Manage Users<span class="push-rightmost">▼</span></li>
                            <div id="users-dropdown">
                                <li id="manage-admins">Manage Admins</li>
                                <li id="manage-teachers">Manage Teachers</li>
                                <li id="manage-students">Manage Students</li>
                            </div>
                            <li id="logout-button">Logout</li>
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
                    ';
                    echo '
                    <div id="loading-page">
                        <!-- To be invoked only when switching views. -->
                        <img src="assets/img/icons/loading.svg">
                        <p>';
                        $loading_quotes = array(
                            "Musta grades?",
                            "Can't touch this.",
                            "Watching Hillary's Breakthrough 2017 video",
                            "BLACKPINK is <3",
                            "Ayoko na. Huhuhu.",
                            "Di pala siya si Mr. Right? How sad. Iyak ka nalang.",
                            "Ikaw ka na ba si Mr. Right?",
                            "Mag-study ka na.",
                            "\"Bawi nalang next quarter.\" (One quarter later) \"Bawi nalang next quarter.\"",
                            "Ma'am, pa-extend deadline. Hihi.",
                            "Sir, pa-extend deadline. Hihi.",
                            "Ma'am, pwede plus points?",
                            "Sir, pwede plus points?",
                            "\"Nakuha?\" (whole class nods without even getting the topic)",
                            "\"Geeets?\"",
                            "\"Iha, mabigat na ba yan?\"",
                            "\"Errrrrrrr\"",
                            "\"Go to the board and multiply.\"",
                            "\"To dream the impossible dreeaaaaammm...\"",
                            "\"To fight the unbeatable fooooeeee\"",
                            "Remember your priorities! I know you wanna watch that another random Youtube video but watching Kpop is better. (totally not a Kpop fan)",
                            "Sean Ballais was here.",
                            "Nikka de Jesus was here.",
                            "Kenn Pulma was here.",
                            "Tama muna sa Facebook and DoTa 2.",
                            "Gtg",
                            "Bai bai"
                        );
                        echo $loading_quotes[rand(0, count($loading_quotes) - 1)];
                    echo '</p>
                    </div>';
                    echo \Pomoc\Utils\Templating::render_fragment("fragments/profile.html",
                                                                  array(
                                                                      "name" => $name,
                                                                      "user_id" => $user_info["user_id"],
                                                                      "id_number" => $user_info["id_number"],
                                                                      "username" => $user_info["username"],
                                                                      "first_name" => $user_info["first_name"],
                                                                      "middle_name" => $user_info["middle_name"],
                                                                      "last_name" => $user_info["last_name"],
                                                                      "age" => $user_info["age"],
                                                                      "user_type" => $user_info["user_type"],
                                                                      "birth_date" => $birth_date
                                                                  )
                                                                 );
                    echo'<div id="manage-subjects" class="view">Test</div>';
                    echo \Pomoc\Utils\Templating::render_fragment("fragments/manage-admins.html");
                    echo '<div id="manage-students" class="view">student</div>
                    <div id="manage-teachers" class="view">teacher</div>
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