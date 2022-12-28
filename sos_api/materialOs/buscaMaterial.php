<?php

    require_once(dirname(__FILE__) . '/MaterialOs.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $id = $request;

    $material_os = new MaterialOs();

    $result = $material_os->le(
        'material_os.id_material, material_os.quantidade, material_os.valor, materiais.nome, materiais.criado_em, materiais.atualizado_em',
        "INNER JOIN materiais
        ON materiais.id = material_os.id_material
        WHERE material_os.id_os = '$id'"
    );

    echo json_encode($result);
    exit(0);
?>