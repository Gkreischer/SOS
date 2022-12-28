<?php
require_once(dirname(__FILE__) . '/../cors/cors.php');
require_once(dirname(__FILE__) . '/OrdemServico.php');

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

// CAMPOS RECEBIDOS DA REQUEST

$id_ordem_servico = $request->id;

$ordem_servico = $request->ordemServico;

$id_cliente = $ordem_servico->id_cliente;
$id_equipamento = $ordem_servico->id_equipamento;
$id_atendente = $ordem_servico->id_atendente;
$id_tecnico_diagnostico = $ordem_servico->id_tecnico_diagnostico;
$id_tecnico_execucao = $ordem_servico->id_tecnico_execucao;

$problema_relatado = $ordem_servico->problema_relatado;
$problema_diagnosticado = $ordem_servico->problema_diagnosticado;
$servico_executado = $ordem_servico->servico_executado;
$obs = $ordem_servico->obs;
$obs_tecnico = $ordem_servico->obs_tecnico;

$total_servico = $ordem_servico->total_servico;
$total_material = $ordem_servico->total_material;
$desconto = $ordem_servico->desconto;
$total_os = $ordem_servico->total_os;

$aceito = $ordem_servico->aceito;
$orcado = $ordem_servico->orcado;
$finalizado = $ordem_servico->finalizado;
$entregue = $ordem_servico->entregue;

// CAMPO MATERIAIS DA OS

$materiais = $ordem_servico->materiais;

if (count($materiais) != 0) {

    // VERIFICA SE OS ITENS JA ESTAO NA TABELA DE material_os
    $query = "SELECT * FROM material_os WHERE id_os = :id_ordem_servico";

    try {
        $mariadb = new Sql();
        $result_materiais = $mariadb->select($query, [
            ":id_ordem_servico" => $id_ordem_servico
        ]);
    } catch (PDOException $e) {
        throw new \Exception($e->getMessage(), (int) $e->getCode());
    }

    if (count($result_materiais) != 0) {

        // SE POSSUIR ITENS DA OS JA CADASTRADOS, DELETA
        $query = "DELETE FROM material_os WHERE id_os = :id_ordem_servico";

        try {
            $mariadb = new Sql();
            $result_exclusao = $mariadb->Sqlquery($query, [
                ":id_ordem_servico" => $id_ordem_servico
            ]);
        } catch (PDOException $e) {
            throw new \Exception($e->getMessage(), (int) $e->getCode());
        }
    }

    // CADASTRA MATERIAIS CASO EXISTAM
    foreach ($materiais as $material) {
        $query = "INSERT INTO material_os (id_os, id_material, quantidade, valor) VALUES (:id_os, :id_material, :quantidade, :valor)";

        try {
            $mariadb = new Sql();
            $result_cadastro_materiais = $mariadb->Sqlquery($query, [
                ":id_os" => $id_ordem_servico,
                ":id_material" => $material->id_material,
                ":quantidade" => $material->quantidade,
                ":valor" => $material->valor
            ]);
        } catch (PDOException $e) {
            throw new \Exception($e->getMessage(), (int) $e->getCode());
        }
    }
}

$query_atualiza_ordem_servico = "UPDATE ordem_servico 
                                SET id_cliente = :id_cliente, id_equipamento = :id_equipamento, id_atendente = :id_atendente,
                                id_tecnico_diagnostico = :id_tecnico_diagnostico, id_tecnico_execucao = :id_tecnico_execucao,
                                aceito = :aceito, orcado = :orcado, finalizado = :finalizado, entregue = :entregue,
                                problema_relatado = :problema_relatado, problema_diagnosticado = :problema_diagnosticado,
                                servico_executado = :servico_executado, obs = :obs, obs_tecnico = :obs_tecnico,
                                total_servico = :total_servico, total_material = :total_material, total_os = :total_os,
                                desconto = :desconto, atualizado_em = :atualizado_em, concluida_em = :concluida_em, entregue_em = :entregue_em
                                WHERE id = :id_ordem_servico";

try {
    $mariadb = new Sql();

    if($entregue == 1) {
        $result_atualizacao_ordem_servico = $mariadb->Sqlquery($query_atualiza_ordem_servico, [
            ":id_cliente" => $id_cliente,
            ":id_equipamento" => $id_equipamento,
            ":id_atendente" => $id_atendente,
            ":id_tecnico_diagnostico" => $id_tecnico_diagnostico,
            ":id_tecnico_execucao" => $id_tecnico_execucao,
            ":aceito" => $aceito,
            ":orcado" => $orcado,
            ":finalizado" => $finalizado,
            ":entregue" => $entregue,
            ":problema_relatado" => $problema_relatado,
            ":problema_diagnosticado" => $problema_diagnosticado,
            ":servico_executado" => $servico_executado,
            ":obs" => $obs,
            ":obs_tecnico" => $obs_tecnico,
            ":total_servico" => $total_servico,
            ":total_material" => $total_material,
            ":total_os" => $total_os,
            ":desconto" => $desconto,
            ":atualizado_em" => null,
            ":concluida_em" => null,
            ":entregue_em" => date("Y-m-d H:i:s"),
            ":id_ordem_servico" => $id_ordem_servico,
        ]);
    } else {
        if ($finalizado == 1) {
            $result_atualizacao_ordem_servico = $mariadb->Sqlquery($query_atualiza_ordem_servico, [
                ":id_cliente" => $id_cliente,
                ":id_equipamento" => $id_equipamento,
                ":id_atendente" => $id_atendente,
                ":id_tecnico_diagnostico" => $id_tecnico_diagnostico,
                ":id_tecnico_execucao" => $id_tecnico_execucao,
                ":aceito" => $aceito,
                ":orcado" => $orcado,
                ":finalizado" => $finalizado,
                ":entregue" => $entregue,
                ":problema_relatado" => $problema_relatado,
                ":problema_diagnosticado" => $problema_diagnosticado,
                ":servico_executado" => $servico_executado,
                ":obs" => $obs,
                ":obs_tecnico" => $obs_tecnico,
                ":total_servico" => $total_servico,
                ":total_material" => $total_material,
                ":total_os" => $total_os,
                ":desconto" => $desconto,
                ":atualizado_em" => date("Y-m-d H:i:s"),
                ":concluida_em" => date("Y-m-d H:i:s"),
                ":entregue_em" => null,
                ":id_ordem_servico" => $id_ordem_servico,
            ]);
        } else {
            $result_atualizacao_ordem_servico = $mariadb->Sqlquery($query_atualiza_ordem_servico, [
                ":id_cliente" => $id_cliente,
                ":id_equipamento" => $id_equipamento,
                ":id_atendente" => $id_atendente,
                ":id_tecnico_diagnostico" => $id_tecnico_diagnostico,
                ":id_tecnico_execucao" => $id_tecnico_execucao,
                ":aceito" => $aceito,
                ":orcado" => $orcado,
                ":finalizado" => $finalizado,
                ":entregue" => $entregue,
                ":problema_relatado" => $problema_relatado,
                ":problema_diagnosticado" => $problema_diagnosticado,
                ":servico_executado" => $servico_executado,
                ":obs" => $obs,
                ":obs_tecnico" => $obs_tecnico,
                ":total_servico" => $total_servico,
                ":total_material" => $total_material,
                ":total_os" => $total_os,
                ":desconto" => $desconto,
                ":atualizado_em" => date("Y-m-d H:i:s"),
                ":concluida_em" => null,
                ":entregue_em" => null,
                ":id_ordem_servico" => $id_ordem_servico
            ]);
        }
    }

    
} catch (PDOException $e) {
    throw new \Exception($e->getMessage(), (int) $e->getCode());
}

echo json_encode($result_atualizacao_ordem_servico);
exit(0);
