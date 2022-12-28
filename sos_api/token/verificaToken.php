<?php

require_once(dirname(__FILE__) .  '/../pdo/Sql.php');
require_once(dirname(__FILE__) . './../cors/cors.php');

// if($token == null || strlen($token) < 32){
//     header('Location:login.html');
// }

// $query = "SELECT token FROM funcionarios WHERE email = '$email'";

// try
// {
//     $sql = new Sql();
//     $tokenResult = $sql->select($query);
//     if(count($tokenResult) === null || $tokenResult[0]['token'] !== $token){
//         header('Location: login.html');
//     }
// } catch(PDOException $e){
//     throw new Error($e->getMessage(), (int) $e->getCode());
// }

$headers = apache_request_headers();

if(isset($headers['Authorization']) && isset($headers['idUsuario'])){
    $token = $headers['Authorization'];
    $id_usuario = $headers['idUsuario'];
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

// if (isset($token) && isset($id_usuario)) {
//     echo 'token e id encontrados';
// } else {
//     echo 'nao encontrado';  
// }
