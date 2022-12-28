<?php
    require_once(dirname(__FILE__) . '/../cors/cors.php');  
    require_once(dirname(__FILE__) . '/Equipamento.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $id = $request->id;

    $equipamento = new Equipamento();
    $result = $equipamento->leComId('*',$id);

    echo json_encode($result);

    exit;


?>