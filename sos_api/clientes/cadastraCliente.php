<?php
    
    require_once(dirname(__FILE__) . '/Cliente.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $cliente = new Cliente();
    $result = $cliente->cadastra($request);
    echo json_encode($result);

    exit;

?>