<?php

    require_once './../cors/cors.php';
    require_once './../pdo/Sql.php';

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $data = $request->data;

    $emailCliente = $data->email;
    $senhaCliente = $data->senha;

    $queryLogin = "SELECT * FROM login WHERE email = :email AND tipo = :tipo";

    try {

        $mariadb = new Sql();
        $resultLogin = $mariadb->select($queryLogin, [
            ":email" => $emailCliente,
            ":tipo" => 'cliente'
        ]);

    }catch(PDOException $e){
        echo json_encode('Não foi possivel realizar a consulta');
    }


    if(count($resultLogin) > 0){
        
        $hashSenha = $resultLogin[0]['senha'];

        if(password_verify($senhaCliente, $hashSenha) && $resultLogin[0]['tipo'] === 'cliente'){

            // ATUALIZA TOKEN AO LOGAR
            $email = $resultLogin[0]['email'];
            $tokenUpdate = bin2hex(openssl_random_pseudo_bytes(16));

            $queryToken = "UPDATE login SET token = '$tokenUpdate' WHERE email = '$email'";

            try {
                $mariadb = new Sql();
                $resultUpdateToken =  $mariadb->Sqlquery($queryToken);
            }catch(PDOException $e){
                echo json_encode('Não foi possivel atualizar o token');
            }

            echo json_encode((object) array("token" => $tokenUpdate, "tipoUsuario" => $resultLogin[0]['tipo'], "email" => $resultLogin[0]['email']));

        } else {

            echo json_encode('Usuario ou senha incorretos');
        }

    } else {
        echo json_encode('Usuario ou senha incorretos');
    }



?>