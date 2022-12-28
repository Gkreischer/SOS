<?php

require_once(dirname(__FILE__) . '/../cors/cors.php');
require_once(dirname(__FILE__) . '/../pdo/Sql.php');

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

// PEGA AS INFORMACOES DE LOGIN

$email = $request->email;
$senha = $request->senha;

$query = "SELECT * FROM funcionarios WHERE email = :email";

try {
    $sql = new Sql();
    $resultUsername = $sql->select($query, [
        ":email" => $email
    ]);
} catch (PDOException $e) {
    throw new Error($e->getMessage(), (int) $e->getCode());
}

$result = $resultUsername;

if (count($result) === 0) {
    echo json_encode('Usuario ou senha incorretos');
} else {
    $idUsuario = $result[0]['id'];
    $email = $result[0]['email'];
    $hashSenha = $result[0]['senha'];

    $nivelUsuario = $result[0]['nivel'];

    if (password_verify($senha, $hashSenha)) {

        // GERA UMA STRING ALEATORIA
        $token = openssl_random_pseudo_bytes(16);

        // CONVERTE PARA REPRESENTACAO HEXADECIMAL
        $token = bin2hex($token);

        $queryToken = "UPDATE funcionarios SET token = :token WHERE id = :idUsuario";

        $tokenResult = $sql->Sqlquery($queryToken, [
            ":token" => $token,
            ":idUsuario" => $idUsuario
        ]);

        header('Content-type: application/json');
        http_response_code(200);
        echo json_encode((object)array($idUsuario, $token, $nivelUsuario));
    } else {
        echo 'Dados incorretos';
    }
}

exit;
