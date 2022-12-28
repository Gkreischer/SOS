<?php

    require_once(dirname(__FILE__) . '/Configuracao.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $configuracao = new Configuracao();
    $result = $configuracao->cadastra($request);

    echo json_encode($result);
    exit;
