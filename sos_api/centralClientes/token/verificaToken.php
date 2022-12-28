<?php

require_once './../cors/cors.php';
require_once './../pdo/Sql.php';

$token = $_GET['token'];
$email = $_GET['email'];

$query = "SELECT email FROM login WHERE token = :TOKEN";

try {

    $mariadb = new Sql();
    $result = $mariadb->select($query, [
        ":TOKEN" => $token
    ]);

}catch(PDOException $e){
    echo json_encode('Nao foi possivel realizar a consulta');
}

if(count($result) === 0){
    exit;
}


?>