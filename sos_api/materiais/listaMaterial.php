<?php

    require_once(dirname(__FILE__) . '/Material.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $material = new Material();
    $result = $material->le('materiais.id, nome, id_categoria, materiais.caminho_imagem, descricao, valor, criado_em, atualizado_em, categoria_materiais.id as id_categoria, categoria_materiais.categoria',
     'INNER JOIN categoria_materiais WHERE materiais.id_categoria = categoria_materiais.id');

    echo json_encode($result);

    exit;

?>