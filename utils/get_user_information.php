<?php
    require_once("lib/guzzle/autoloader.php");
    require_once("utils.php");
    require_once("settings.php");

    function get_user_info() {
        global $server_url;
        $url = $server_url."/user";
        $cookie = $_COOKIE["pomoc_user"];
        $cookie_value = json_decode($cookie);
        $access_token = $cookie_value->access_token;
        $decoded_token = \Pomoc\Utils\Utils::decodeJWT($access_token);
        $decoded_payload = json_decode($decoded_token["payload"]);
        $data = array(
            'username' => $decoded_payload->sub  // We just grabbed the username. "sub" == username
        );

        $client = new GuzzleHttp\Client();

        // Implement try-catch error handling Runtime Exception that occurs here when the server can't be
        // reached or whatevs. Lols. Blame Ignacio on this "feature".
        $response = $client->request("GET", $url, ['json' => $data]);
        $json = json_decode($response->getBody(), true)["data"]["user"];

        return $json;
    }