<?php

    require_once(dirname(__FILE__) . '/Funcionario.php');

    $funcionario = new Funcionario();

    $funcionarios = $funcionario->le('*');

    echo json_encode($funcionarios);

    exit;

?>
