<?php
    require_once(dirname(__FILE__) . '/Equipamento.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $id = $request->id;
    $equipamentoCliente = $request->equipamento;

    $equipamento = new Equipamento();
    $result = $equipamento->atualiza($equipamentoCliente, $id);

    echo json_encode($result);

    exit;
