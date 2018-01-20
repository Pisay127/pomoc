<?php
    if (isset($_COOKIE["pomoc_user"])) {
        setcookie("pomoc_user", "", -1, "/");
        setcookie("current_view", "", -1, "/");
    }