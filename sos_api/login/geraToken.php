<?php

    require_once './../cors/cors.php';
    require_once './../pdo/Sql.php';

     //  GERA TOKEN

     $mariadb = new Sql();

    // GERA UMA STRING ALEATORIA
    $token = openssl_random_pseudo_bytes(16);

    // CONVERTE PARA REPRESENTACAO HEXADECIMAL
    $token = bin2hex($token);

    $queryToken = "UPDATE LOGIN SET TOKEN = :TOKEN WHERE EMAIL = :EMAIL";

    $tokenResult = $mariadb->Sqlquery($queryToken, [
        ":TOKEN" => $token,
        ":EMAIL" => $email
    ]);

    header('Content-type: application/json');
    http_response_code(200);
    echo json_encode('/home');

    exit;

?>