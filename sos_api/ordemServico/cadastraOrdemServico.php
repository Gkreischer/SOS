<?php
    require_once(dirname(__FILE__) . '/OrdemServico.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $os = new OrdemServico();
    $result = $os->cadastra($request);

    echo json_encode($result);

    exit;
?>