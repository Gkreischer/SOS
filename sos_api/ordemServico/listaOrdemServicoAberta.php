<?php
    require_once(dirname(__FILE__) . '/OrdemServico.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $os = new OrdemServico();
    $result = $os->le(
    'ordem_servico.id, ordem_servico.orcado, clientes.nome, ordem_servico.criado_em', 
    'INNER JOIN clientes
    ON ordem_servico.id_cliente = clientes.id WHERE ordem_servico.orcado = 0'
    );

    echo json_encode($result);

    exit;
?>