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
            'signature' => $signature
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

class SimpleSet
{
    private $container = array();

    public function add($value)
    {
        $this->container[$value] = true;
    }

    public function contains($value)
    {
        return isset($this->container[$value]);
    }
}
