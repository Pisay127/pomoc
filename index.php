<?php
    require_once("utils/templating.php");
    require_once("utils/utils.php");

    use \Pomoc\Utils\Templating;
    use \Pomoc\Utils\Utils;

    $user_logged_in = false;
    if (isset($_COOKIE["pomoc_user"])) {
        $user_logged_in = true;
    }

    $current_view = null;
    $vars = array();
    if (isset($_COOKIE["pomoc_user"])) {
        $current_view = $_COOKIE["current_view"];
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
            $view_css = $_COOKIE["current_view"].".css";
            // No need to check if current_view has a value because if a user is logged in, current_view
            // has a value.

            echo '<link rel="stylesheet" type="text/css" href="assets/css/content-layer.css">';
            echo '<link rel="stylesheet" type="text/css" href="assets/css/sidebar.css">';
            echo '<link rel="stylesheet" type="text/css" href="assets/css/loading-page.css">';
            echo '<link rel="stylesheet" type="text/css" href="assets/css/'.$view_css.'">';
        } else {
            echo '<link rel="stylesheet" type="text/css" href="assets/css/anon_index.css">';
        }
    ?>
    <script type="text/javascript" src="assets/js/lib/jquery.js"></script>
    <script type="text/javascript" src="assets/js/lib/jquery-ui.min.js"></script>
    <script type="text/javascript" src="assets/js/lib/jquery-highlight.js"></script>
    <script type="text/javascript" src="assets/js/lib/js.cookie.js"></script>
    <script type="text/javascript" src="assets/js/site/sidebar.js"></script>
    <script type="text/javascript" src="assets/js/site/view-handler.js"></script>

    <?php
        $view_js = "login.js";
        if (isset($_COOKIE["current_view"])) {
            $view_js = $_COOKIE["current_view"].".js";
        }

        echo "<script type=\"text/javascript\" src=\"assets/js/site/".$view_js."\"></script>";
    ?>
</head>
<body>
    <?php
        if ($user_logged_in) {
            if ($current_view == "profile") {
                require_once("utils/get_user_information.php");
                $user_info = get_user_info();
                $name = $user_info["first_name"]." ".$user_info["middle_name"]." ".$user_info["last_name"];
                $birth_date = strftime("%B %d, %Y", strtotime($user_info["birth_date"]));

                $vars = array(
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
                );
            }

            echo Utils::render_view("fragments/".$current_view.".html", $vars);
        } else {
            echo Templating::render_fragment('fragments/anon_index.html');
        }
    ?>
</body>
</html>