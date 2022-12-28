<?php

    require_once(dirname(__FILE__) . '/Cliente.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $id = $request->id;

    $cliente = new Cliente();
    $result = $cliente->atualiza($request, $id);

    echo json_encode($result);

    exit;
?>