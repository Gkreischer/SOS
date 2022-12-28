<?php

    require_once(dirname(__FILE__) . '/Configuracao.php');

    $configuracao = new Configuracao();
    $result = $configuracao->le('*');

    echo json_encode($result);

    exit;
