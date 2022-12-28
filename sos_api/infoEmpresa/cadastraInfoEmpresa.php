<?php
    
    require_once(dirname(__FILE__) . '/InfoEmpresa.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $infoempresa = new InfoEmpresa();
    $result = $infoempresa->cadastra($request);
    
    echo json_encode($result);
    exit;
