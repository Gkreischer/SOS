<?php
    require_once(dirname(__FILE__) . '/OrdemServico.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $os = new OrdemServico();
    $result = $os->le(
    'ordem_servico.id, ordem_servico.orcado, ordem_servico.finalizado, clientes.nome, ordem_servico.criado_em, ordem_servico.aceito, funcionarios.nome as tecnico_diagnostico', 
    'INNER JOIN clientes
    ON ordem_servico.id_cliente = clientes.id
    INNER JOIN funcionarios
    ON ordem_servico.id_tecnico_diagnostico = funcionarios.id
    WHERE ordem_servico.orcado = 1 and ordem_servico.finalizado is null'
    );

    echo json_encode($result);

    exit;
?>