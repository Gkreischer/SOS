<?php

    require_once(dirname(__FILE__) . '/Material.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $id = $request;

    $material = new Material();
    $result = $material->deleta($id);

    echo json_encode($result);

    exit;

?>