<?php

require_once './../cors/cors.php';
require_once './../pdo/Sql.php';
require_once './../token/verificaToken.php';

$emailCliente = $_GET['email'];

$query = "SELECT * from clientes WHERE email = :EMAIL";

try{
    $mariadb = new Sql();
    $result = $mariadb->select($query, [
        ":EMAIL" => $emailCliente
    ]);

}catch(PDOException $e){
    echo json_encode('Nao foi possivel realizar a consulta');
}

echo json_encode($result[0]);


?>