<?php

    require_once './../cors/cors.php';  
    require_once './../pdo/Sql.php';
    require_once './../token/verificaToken.php';

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $request = $request->data;

    $idCliente = $request->id_cliente;
    $tipoPessoa = $request->tipoPessoa;
    $nome_cliente = $request->nome_cliente;
    $email = $request->email;    
    $contato = $request->contato;
    $razaoSocial = $request->razaoSocial;
    $inscricaoEstadual = $request->inscricaoEstadual;
    $cpf = $request->cpf;
    $cnpj = $request->cnpj;
    $cep = $request->cep;
    $endereco = $request->endereco;
    $bairro = $request->bairro;
    $cidade = $request->cidade;
    $estado = $request->estado;


    $query = "UPDATE clientes SET nome_cliente = :nome_cliente, tipoPessoa = :tipoPessoa, cpf = :cpf, cnpj = :cnpj, razaoSocial = :razaoSocial, inscricaoEstadual = :inscricaoEstadual, cep = :cep, endereco = :endereco,
                                    bairro = :bairro, cidade = :cidade, estado = :estado, email = :email, contato = :contato WHERE id_cliente = :idCliente";

    try {
        $mariadb = new Sql();
        $result = $mariadb->Sqlquery($query, [
            ":nome_cliente" => $nome_cliente,
            ":tipoPessoa" => $tipoPessoa,
            ":cpf" => $cpf,
            ":cnpj" => $cnpj,
            ":razaoSocial" => $razaoSocial,
            ":email" => $email,
            ":contato" => $contato,
            ":inscricaoEstadual" => $inscricaoEstadual,
            ":cep" => $cep,
            ":endereco" => $endereco,
            ":bairro" => $bairro,
            ":cidade" => $cidade,
            ":estado" => $estado,
            ":idCliente" => $idCliente
        ]);
        echo json_encode(true);

    } catch(PDOException $e){
        echo json_encode(false);
    }


    exit;


?>