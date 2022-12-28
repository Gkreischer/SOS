<?php

require_once(dirname(__FILE__) . '/../pdo/Sql.php');
require_once(dirname(__FILE__) . '/../token/verificaToken.php');

class Equipamento {

    function __construct(){
        header('Content-Type: application/json');
        date_default_timezone_set('America/Sao_Paulo');
    }

    public function cadastra($request){

        if(isset($request)){
            
            $query = "INSERT INTO equipamentos (id_cliente, nome, id_categoria, numero_serie, descricao) 
                    VALUES (:id_cliente, :nome, :id_categoria, :numero_serie, :descricao)";

            try {
                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":id_cliente" => $request->id_cliente,
                    ":nome" => strtoupper($request->nome),
                    ":id_categoria" => $request->id_categoria,
                    ":numero_serie" => $request->numero_serie,
                    ":descricao" => $request->descricao
                ]);

                return $result;

            } catch(PDOException $e){
                throw new Error($e->getMessage(), (int) $e->getCode());
            }
        }
         
    }

    public function le($parametros = '*'){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM equipamentos";
        try {
            $mariadb = new Sql();
            $result = $mariadb->select($query);

            return $result;
            
        } catch(PDOException $e){
            throw new Error($e->getMessage(), (int) $e->getCode());
        }
         
    }

    public function leComId($parametros = '*', $id, $args = ' '){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM equipamentos" . " " . $args . " " . "WHERE id_cliente = :id";
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

    public function leComCliente($parametros = '*', $id){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM equipamentos WHERE id_cliente = :id";
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
            $query = "UPDATE equipamentos 
            SET id_cliente = :id_cliente, nome = :nome, id_categoria = :id_categoria, numero_serie = :numero_serie, 
            descricao = :descricao, atualizado_em = :atualizado_em WHERE id = :id";

            try {

                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":id" => $id,
                    ":id_cliente" => $request->id_cliente,
                    ":nome" => strtoupper($request->nome),
                    ":id_categoria" => $request->id_categoria,
                    ":numero_serie" => $request->numero_serie,
                    ":descricao" => $request->descricao,
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

    public function deleta($id){

        if(isset($id)){
            $query = "DELETE FROM equipamentos WHERE id = :id";

            try {

                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":id" => $id
                ]);

                return $result;

            }catch(PDOException $e){
                throw new Error($e->getMessage(), (int) $e->getCode());
            }
        }
    }

}

?>