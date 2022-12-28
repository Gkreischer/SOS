<?php

require_once './../cors/cors.php';
require_once './../pdo/Sql.php';
require_once './../token/verificaToken.php';

$postdata = file_get_contents('php://input');
$request = json_decode($postdata);

$id = $request->data;

$query = "SELECT * from ordemservico as ordem inner join equipamentos as equipamento on ordem.cod_equipamento = equipamento.id_equipamento where ordem.id_ordem = '$id'";

try{

    $mariadb = new Sql();
    $result = $mariadb->select($query, [
        ":ID" => $id
    ]);

    echo json_encode($result[0]);

} catch(PDOException $e) {
    echo json_encode('Não foi possível realizar a consulta');
}


?>