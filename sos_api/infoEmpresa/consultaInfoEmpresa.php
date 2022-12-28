<?php

    require_once(dirname(__FILE__) . '/InfoEmpresa.php');

    $infoempresa = new InfoEmpresa();
    $result = $infoempresa->le();

    echo json_encode($result);

    exit;
?>