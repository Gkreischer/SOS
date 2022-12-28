<?php

    require_once(dirname(__FILE__) . '/Cliente.php');
    
    $cliente = new Cliente();
    $clientes = $cliente->le();

    echo json_encode($clientes);

    exit;
?>