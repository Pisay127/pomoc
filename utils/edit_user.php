<?php
    require_once("../lib/guzzle/autoloader.php");
    require_once("utils.php");
    require_once("../settings.php");

    use GuzzleHttp\Exception\ClientException;

    $url = $server_url."/user";
    $modified_data = json_decode($_POST["modified_data"], true);
    $modified_data_scope = '';
    $new_data = array();
    $keys = array_keys($modified_data);
    for ($index = 0, $num_keys = count($keys); $index < $num_keys; $index++) {
        if ($modified_data[$keys[$index]] != '') {
            $modified_data_scope = $modified_data_scope.$keys[$index];
            $new_data[$keys[$index]] = $modified_data[$keys[$index]];

            if ($index < $num_keys - 1) {
                $modified_data_scope = $modified_data_scope.", ";
            }
        }
    }

    $data = array(
        'scope'         => $modified_data_scope
    );

    $data = array_merge($data, $new_data);

    $client = new GuzzleHttp\Client();
    try {
        $response = $client->request("PUT", $url, ['json' => $data]);

        $body = json_decode($response->getBody());
        $message = $body->status->description;

        $profile_save_response = array(
            'error'   => false,
            'message' => $message
        );
        echo json_encode($profile_save_response);
    } catch (ClientException $client_exp) {

        $profile_save_response = array(
            'error'   => true,
            'message' => "Something went wrong while updating. Try reloading the page or try again later."
        );
        echo json_encode($profile_save_response);
    }