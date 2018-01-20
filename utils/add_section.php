<?php
    require_once("../lib/guzzle/autoloader.php");
    require_once("utils.php");
    require_once("../settings.php");

    use GuzzleHttp\Exception\ClientException;

    $url = $server_url."/section";
    $section_data = json_decode($_POST["new_section_data"], true);

    $data = array(
        'user_id'       => \Pomoc\Utils\Utils::getUserID(),
        'access_token'  => \Pomoc\Utils\Utils::getAccessToken(),
        'scope'         => 'year_level, section_name',
    );

    $data = array_merge($data, $section_data);

    $client = new GuzzleHttp\Client();
    try {
        $response = $client->request("POST", $url, ['json' => $data]);

        $body = json_decode($response->getBody());
        $message = $body->status->description;

        $add_section_response = array(
            'error'   => false,
            'message' => $message
        );
        echo json_encode($add_section_response);
    } catch (ClientException $client_exp) {
        $error_message = json_decode($client_exp->getResponse()->getBody(), true)["status"]["description"];
        $add_section_response = array(
            'error'   => true,
            'message' => "Something went wrong while creating the new admin. ".$error_message
        );
        echo json_encode($add_section_response);
    }