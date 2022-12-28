<?php

    // CRIA UM ADMINISTRADOR NO PROGRAMA, CASO NAO EXISTA

    require_once(dirname(__FILE__) . '/../pdo/Sql.php');
    require_once(dirname(__FILE__) . '/../cors/cors.php');

    $query = "INSERT INTO funcionarios (nome, cpf, email, telefone, celular, caminho_imagem, cargo, nivel, senha, token) 
    VALUES (:nome, :cpf, :email, :telefone, :celular, :caminho_imagem, :cargo, :nivel, :senha, :token)";

    try {
        $mariadb = new Sql();

        $result = $mariadb->Sqlquery($query, [
            ":nome" => "admin",
            ":cpf" => '11122233344',
            ":email" => 'admin@email.com',
            ":telefone" => "2233334444",
            ":celular" => "22988887777",
            ":caminho_imagem" => null,
            ":cargo" => "Administrador",
            ":nivel" => 3,
            ":senha" => password_hash('admin12345', PASSWORD_DEFAULT),
            ":token" => bin2hex(openssl_random_pseudo_bytes(16))
        ]);

        echo json_encode($result);

    } catch(PDOException $e){
        throw new Error($e->getMessage(), (int) $e->getCode());
    }
    exit;

?>