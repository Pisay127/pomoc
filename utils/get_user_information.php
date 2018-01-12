<?php
    require_once("lib/guzzle/autoloader.php");
    require_once("utils.php");
    require_once("settings.php");

    function get_user_info() {
        global $server_url;
        $url = $server_url."/user";
        $data = array(
            'user_id' => \Pomoc\Utils\Utils::getUserID(),  // We just grabbed the username. "sub" == username
            'scope' => "user_id, id_number, first_name, middle_name, last_name, birth_date, username, age, user_type"
        );

        $client = new GuzzleHttp\Client();

        // Implement try-catch error handling Runtime Exception that occurs here when the server can't be
        // reached or whatevs. Lols. Blame Ignacio on this "feature".
        $response = $client->request("GET", $url, ['json' => $data]);
        $json = json_decode($response->getBody(), true)["data"]["user"];

        return $json;
    }