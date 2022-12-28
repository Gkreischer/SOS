<?php
    require_once(dirname(__FILE__) . '/Equipamento.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $equipamento = new Equipamento();
    $result = $equipamento->cadastra($request);

    echo json_encode($result);
    exit;
?>