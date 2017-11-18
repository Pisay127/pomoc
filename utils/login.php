<?php
    require_once("../settings.php");

    echo($_POST["username"]);

    /**
    // Accept form information.
    // Send data to API.
    $url = $server_url."/oauth";
    $data = array(
        'grant_type'    => "password",
        'client_id'     => $client_id,
        'client_secret' => $client_secret,
        'username'      => urlencode($_POST["username"]),
        'password'      => urlencode($_POST["password"])
    );

    $options = array(
        'http' => array(
            'header'  => "Content-Type: application/json\r\n".
                         "Accept: application/json\r\n",
            'method'  => "POST",
            'content' => json_encode($data)
        )
    );

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    $response = json_decode($result);
    error_log($response);
    **/