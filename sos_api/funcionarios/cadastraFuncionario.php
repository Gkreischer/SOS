<?php
    
    require_once(dirname(__FILE__) . '/Funcionario.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $funcionario = new Funcionario();

    $result = $funcionario->cadastra($request);

    echo json_encode($result);
    exit;
    
?>