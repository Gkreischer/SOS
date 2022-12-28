<?php

require_once(dirname(__FILE__)  . '/../pdo/Sql.php');
require_once(dirname(__FILE__)  . '/../token/verificaToken.php');

class OrdemServico {

    function __construct(){
        header('Content-Type: application/json');
        date_default_timezone_set('America/Sao_Paulo');
    }

    public function cadastra($request){

        if(isset($request)){
            
            $query = "INSERT INTO ordem_servico (id_cliente, id_equipamento, id_atendente, id_tecnico_diagnostico, id_tecnico_execucao, aceito, orcado, finalizado, entregue, problema_relatado, problema_diagnosticado, servico_executado, obs, obs_tecnico, total_servico, total_material, total_os, desconto) 
                    VALUES (:id_cliente, :id_equipamento, :id_atendente, :id_tecnico_diagnostico, :id_tecnico_execucao, :aceito, :orcado, :finalizado, :entregue, :problema_relatado, :problema_diagnosticado, :servico_executado, :obs, :obs_tecnico, :total_servico, :total_material, :total_os, :desconto)";

            try {
                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":id_cliente" => $request->id_cliente,
                    ":id_equipamento" => $request->id_equipamento,
                    ":id_atendente" => $request->id_atendente,
                    ":id_tecnico_diagnostico" => $request->id_tecnico_diagnostico,
                    ":id_tecnico_execucao" => $request->id_tecnico_execucao,
                    ":aceito" => $request->aceito,
                    ":orcado" => $request->orcado,
                    ":finalizado" => $request->finalizado,
                    ":entregue" => $request->entregue,
                    ":problema_relatado" => $request->problema_relatado,
                    ":problema_diagnosticado" => $request->problema_diagnosticado,
                    ":servico_executado" => $request->servico_executado,
                    ":obs" => $request->obs,
                    ":obs_tecnico" => $request->obs_tecnico,
                    ":total_servico" => $request->total_servico,
                    ":total_material" => $request->total_material,
                    ":total_os" => $request->total_os,
                    ":desconto" => $request->desconto,
                ]);

                return $result;

            } catch(PDOException $e){
                throw new Error($e->getMessage(), (int) $e->getCode());
            }
        }
         
    }

    public function le($parametros = '*', $args = ''){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM ordem_servico" . " " . $args;
        try {
            $mariadb = new Sql();
            $result = $mariadb->select($query);

            return $result;
            
        } catch(PDOException $e){
            throw new Error($e->getMessage(), (int) $e->getCode());
        }
         
    }

    public function leComId($parametros = '*', $id, $args = ''){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM ordem_servico" . " " . $args . " " . "WHERE ordem_servico.id = :id";
        try {
            $mariadb = new Sql();
            $result = $mariadb->select($query, [
                ":id" => $id
            ]);

            return $result;
            
        } catch(PDOException $e){
            throw new Error($e->getMessage(), (int) $e->getCode());
        }
         
    }

    public function atualiza($request, $id){

        if(isset($id) && isset($request)){
            
            $query = "UPDATE ordem_servico 
            SET id_equipamento = :id_equipamento, id_atendente = :id_atendente, id_tecnico_diagnostico = :id_tecnico_diagnostico, 
            id_tecnico_execucao = :id_tecnico_execucao, aceito = :aceito, orcado = :orcado, finalizado = :finalizado,
            entregue = :entregue, problema_relatado = :problema_relatado, problema_diagnosticado = :problema_diagnosticado,
            servico_executado = :servico_executado, obs = :obs, obs_tecnico = :obs_tecnico, total_servico = :total_servico,
            total_material = :total_material, total_os = :total_os, desconto = :desconto, atualizado_em = :atualizado_em
            WHERE id = :id";

            try {

                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":id" => $id,
                    ":id_equipamento" => $request->id_equipamento,
                    ":id_atendente" => $request->id_atendente,
                    ":id_tecnico_diagnostico" => $request->id_tecnico_diagnostico,
                    ":id_tecnico_execucao" => $request->id_tecnico_execucao,
                    ":aceito" => $request->aceito,
                    ":orcado" => $request->orcado,
                    ":finalizado" => $request->finalizado,
                    ":entregue" => $request->entregue,
                    ":problema_relatado" => $request->problema_relatado,
                    ":problema_diagnosticado" => $request->problema_diagnosticado,
                    ":servico_executado" => $request->servico_executado,
                    ":obs" => $request->obs,
                    ":obs_tecnico" => $request->obs_tecnico,
                    ":total_servico" => $request->total_servico,
                    ":total_material" => $request->total_material,
                    ":total_os" => $request->total_os,
                    ":desconto" => $request->desconto,
                    ":atualizado_em" => date("Y-m-d H:i:s")
                ]);

                return $result;

            }catch(PDOException $e){
                throw new Error($e->getMessage(), (int) $e->getCode());
            }
        } else {
            return 'Erro, não é possível cadastrar sem id';
        }
    }

}

?>