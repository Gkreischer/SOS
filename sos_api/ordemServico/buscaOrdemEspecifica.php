<?php

    require_once(dirname(__FILE__) . '/OrdemServico.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $id_ordemServico = $request;

    $os = new OrdemServico();
    $result = $os->leComId(
        "ordem_servico.id, ordem_servico.id_cliente, ordem_servico.obs, ordem_servico.problema_relatado, ordem_servico.problema_diagnosticado,
        ordem_servico.id_tecnico_diagnostico, ordem_servico.id_tecnico_execucao, ordem_servico.aceito, ordem_servico.orcado, ordem_servico.finalizado,
        ordem_servico.entregue, ordem_servico.servico_executado, ordem_servico.obs_tecnico, ordem_servico.total_servico, ordem_servico.total_material,
        ordem_servico.total_os, ordem_servico.desconto, ordem_servico.criado_em, ordem_servico.atualizado_em, ordem_servico.concluida_em, ordem_servico.entregue_em,
        clientes.nome, clientes.telefone, clientes.celular, clientes.whatsapp, equipamentos.id as id_equipamento, equipamentos.nome as equipamento, equipamentos.numero_serie as numero_serie, 
        equipamentos.descricao, categoria_equipamentos.categoria, funcionarios.id as id_atendente, funcionarios.nome as atendente,
        CASE WHEN clientes.cnpj != null THEN 'Pessoa Juridica' ELSE 'Pessoa Física' END as tipo_cliente",
        $id_ordemServico,
        'inner join clientes
        on clientes.id = ordem_servico.id_cliente
        inner join equipamentos
        on equipamentos.id = ordem_servico.id_equipamento
        inner join categoria_equipamentos 
        on categoria_equipamentos.id = equipamentos.id_categoria
        inner join funcionarios
        on funcionarios.id = ordem_servico.id_atendente'
    );

    echo json_encode($result);
    exit(0);


?>