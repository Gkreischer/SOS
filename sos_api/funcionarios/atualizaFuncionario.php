<?php
    
    require_once(dirname(__FILE__) . '/Funcionario.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $id = $request->id;

    $funcionario = new Funcionario();

    $result = $funcionario->atualiza($request, $id);

    echo json_encode($result);
    exit;
    
?>