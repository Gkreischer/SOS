<?php

    require_once(dirname(__FILE__) . '/Cliente.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $clientes = new Cliente();
    $result = $clientes->leComId('*', $request);

    echo json_encode($result);

    exit;
?>