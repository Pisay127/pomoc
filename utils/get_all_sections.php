<?php
    require_once("../lib/guzzle/autoloader.php");
    require_once("utils.php");
    require_once("../settings.php");

    use GuzzleHttp\Exception\ClientException;

    $url = $server_url."/section";
    $data = array(
        'section_id'    => '__all__',
        'scope'         => 'section_id, section_name, year_level'
    );

    $client = new GuzzleHttp\Client();
    try {
        $response = $client->request("GET", $url, ['json' => $data]);

        $body = json_decode($response->getBody());
        $data = $body->data;

        $result = array(
            'error'   => false,
            'data'    => $data
        );

        echo json_encode($result);
    } catch (ClientException $client_exp) {
        $error_message = json_decode($client_exp->getResponse()->getBody(), true)["status"]["description"];
        $error_response = array(
            'error'   => true,
            'message' => "Something went wrong while updating. ".$error_message
        );
        echo json_encode($error_response);
    }