<?php

namespace Pomoc\Utils;


class Utils
{
    public static function decodeJWT($jwt)
    {
        list($header, $payload, $signature) = explode(".", $jwt);
        return array(
            'header'    => base64_decode($header),
            'payload'   => base64_decode($payload),
            'signature' => base64_decode($signature)
        );
    }

    public static function getUserID()
    {
        $access_token = Utils::getAccessToken();
        $decoded_token = Utils::decodeJWT($access_token);
        $decoded_payload = json_decode($decoded_token["payload"]);

        return $decoded_payload->sub;
    }

    public static function getAccessToken()
    {
        $cookie = $_COOKIE["pomoc_user"];
        $cookie_value = json_decode($cookie);
        $access_token = $cookie_value->access_token;

        return $access_token;
    }
}
