<?php
    require_once("../lib/guzzle/autoloader.php");
    require_once("utils.php");
    require_once("../settings.php");

    use GuzzleHttp\Exception\ClientException;

    $url = $server_url."/user";
    $user_id = $_POST["user_id"];
    $data = array(
        'user_id'      => $user_id,
        'scope'        => ''
    );

    $client = new GuzzleHttp\Client();
    try {
        $response = $client->request("DELETE", $url, ['json' => $data]);

        $body = json_decode($response->getBody());
        $message = $body->status->description;

        $result = array(
            'error'   => false,
            'data'    => $data
        );

        echo json_encode($result);
    } catch (ClientException $client_exp) {
        $error_message = json_decode($client_exp->getResponse()->getBody(), true)["status"]["description"];
        $error_response = array(
            'error'   => true,
            'message' => "Something went wrong while deleting admin. ".$error_message
        );
        echo json_encode($error_response);
    }