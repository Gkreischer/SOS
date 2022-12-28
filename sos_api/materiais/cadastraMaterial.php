<?php

    require_once(dirname(__FILE__) . '/Material.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $material = new Material();
    $result = $material->cadastra($request);

    echo json_encode($result);

    exit;

?>