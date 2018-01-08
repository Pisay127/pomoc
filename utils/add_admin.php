<?php
    require_once("../lib/guzzle/autoloader.php");
    require_once("utils.php");
    require_once("../settings.php");

    use GuzzleHttp\Exception\ClientException;

    $url = $server_url."/user";
    $admin_data = json_decode($_POST["new_admin_data"], true);
    $admin_data_scope = '';
    $keys = array_keys($admin_data);
    for ($index = 0, $num_keys = count($keys); $index < $num_keys; $index++) {
        $admin_data_scope = $admin_data_scope.$keys[$index];

        if ($index < $num_keys - 1) {
            $admin_data_scope = $admin_data_scope.", ";
        }
    }

    $data = array(
        'user_id'       => \Pomoc\Utils\Utils::getUserID(),
        'access_token'  => \Pomoc\Utils\Utils::getAccessToken(),
        'scope'         => $admin_data_scope,
        'user_type'     => 'admin'
    );

    $data = array_merge($data, $admin_data);

    $client = new GuzzleHttp\Client();
    try {
        $response = $client->request("POST", $url, ['json' => $data]);

        $body = json_decode($response->getBody());
        $message = $body->status->description;

        $add_admin_response = array(
            'error'   => false,
            'message' => $message
        );
        echo json_encode($add_admin_response);
    } catch (ClientException $client_exp) {
        $error_message = json_decode($client_exp->getResponse()->getBody(), true)["status"]["description"];
        $add_admin_response = array(
            'error'   => true,
            'message' => "Something went wrong while creating the new admin. ".$error_message
        );
        echo json_encode($add_admin_response);
    }