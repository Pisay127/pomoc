<?php
    require_once("../lib/guzzle/autoloader.php");
    require_once("../settings.php");

    $url = $server_url."/oauth";
    $data = array(
        'grant_type'    => "password",
        'client_id'     => $client_id,
        'client_secret' => $client_secret,
        'username'      => urlencode($_POST["username"]),
        'password'      => urlencode($_POST["password"])
    );

    $client = new GuzzleHttp\Client();
    $response = $client->request("POST", $url, ['json' => $data]);
    $json = json_decode($response->getBody());

    $cookie_data = array(
        'refresh_token' => $json->refresh_token,
        'access_token'  => $json->access_token
    );

    setcookie("pomoc_user", json_encode($cookie_data), time() + 259200, "/");

    // Add checks for errors.