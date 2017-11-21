<?php
    if (isset($_COOKIE["pomoc_user"])) {
        setcookie("pomoc_user", "", -1, "/");
    }