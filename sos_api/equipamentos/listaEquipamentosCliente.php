<?php
    require_once(dirname(__FILE__) . '/Equipamento.php');
    require_once(dirname(__FILE__) . '/../cors/cors.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $id_cliente = $request;

    $equipamento = new Equipamento();
    $result = $equipamento->leComId(
        'equipamentos.id, equipamentos.nome, equipamentos.numero_serie, equipamentos.descricao, equipamentos.descricao, equipamentos.atualizado_em, equipamentos.criado_em, categoria_equipamentos.categoria, categoria_equipamentos.id as id_categoria', 
        $id_cliente,
        'INNER JOIN categoria_equipamentos ON equipamentos.id_categoria = categoria_equipamentos.id' 
    );

    echo json_encode($result);
    exit;
