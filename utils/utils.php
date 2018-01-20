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

    public static function getRandomLoadingQuote()
    {
        $loading_quotes = array(
            "Musta grades?",
            "Can't touch this.",
            "Watching Hillary's Breakthrough 2017 video",
            "BLACKPINK is <3",
            "Ayoko na. Huhuhu.",
            "Di pala siya si Mr. Right? How sad. Iyak ka nalang.",
            "Ikaw ka na ba si Mr. Right?",
            "Mag-study ka na.",
            "\"Bawi nalang next quarter.\" (One quarter later) \"Bawi nalang next quarter.\"",
            "Ma'am, pa-extend deadline. Hihi.",
            "Sir, pa-extend deadline. Hihi.",
            "Ma'am, pwede plus points?",
            "Sir, pwede plus points?",
            "\"Nakuha?\" (whole class nods without even getting the topic)",
            "\"Geeets?\"",
            "\"Iha, mabigat na ba yan?\"",
            "\"Errrrrrrr\"",
            "\"Go to the board and multiply.\"",
            "\"To dream the impossible dreeaaaaammm...\"",
            "\"To fight the unbeatable fooooeeee\"",
            "Remember your priorities! I know you wanna watch that another random Youtube video but watching Kpop is better.",
            "Sean Ballais was here.",
            "Nikka de Jesus was here.",
            "Kenn Pulma was here.",
            "Tama muna sa Facebook and DoTa 2.",
            "Gtg",
            "Bai bai"
        );

        return $loading_quotes[rand(0, count($loading_quotes) - 1)];
    }

    public static function render_view($current_view, $vars = array())
    {
        return '<div id="content-layer" class="pure-g">'
               .Templating::render_fragment('fragments/sidebar.html')
               .'<div id="main-dashboard" class="pure-u-17-24">'
               .Templating::render_fragment('fragments/loading.html',
                                            array("quote" => Utils::getRandomLoadingQuote()))
               .Templating::render_fragment($current_view, $vars)
               .'</div></div>';
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
