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
}