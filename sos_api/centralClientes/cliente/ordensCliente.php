<?php

require_once './../cors/cors.php';
require_once './../pdo/Sql.php';
require_once './../token/verificaToken.php';

$emailCliente = $_GET['email'];

$queryIdCliente = "SELECT id_cliente from clientes WHERE email = :EMAIL";

try{
    $mariadb = new Sql();
    $resultId = $mariadb->select($queryIdCliente, [
        ":EMAIL" => $emailCliente
    ]);
}catch(PDOException $e){
    echo json_encode('Não foi possível realizar a consulta');
}

$idCliente = $resultId[0]['id_cliente'];

$queryEquipamento = "SELECT * FROM `ordemservico` as ordem INNER JOIN equipamentos as equipamento WHERE ordem.cod_equipamento = equipamento.id_equipamento AND ordem.cod_cliente = :ID";

try{
    $mariadb = new Sql();
    $resultEquipamento = $mariadb->select($queryEquipamento, [
        ":ID" => $idCliente
    ]);
}catch(PDOException $e){
    echo json_encode('Não foi possível realizar a consulta');
}


echo json_encode($resultEquipamento);


?>