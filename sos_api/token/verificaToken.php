<?php

require_once(dirname(__FILE__) .  '/../pdo/Sql.php');
require_once(dirname(__FILE__) . './../cors/cors.php');

$headers = apache_request_headers();


if(isset($headers['Authorization']) && isset($headers['Idusuario'])){
    $token = $headers['Authorization'];
    $id_usuario = $headers['Idusuario'];
  	
} else {
    // TO PRINT RECEIPTS
    $token = $_GET['token'];
    $id_usuario = $_GET['id_cliente'];
}


function verificaToken($token, $id_usuario) {

    $query = "SELECT id, token FROM funcionarios WHERE id = :id";

    $mariadb = new Sql();
    $result_consulta_token = $mariadb->select($query, [
        ":id" => $id_usuario
    ]);

    if($result_consulta_token[0]['token'] !== $token) {
        echo 'Token invalido';
    } 
}

verificaToken($token, $id_usuario);

