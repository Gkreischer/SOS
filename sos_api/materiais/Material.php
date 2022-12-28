<?php

require_once(dirname(__FILE__) . './../pdo/Sql.php') ;
require_once(dirname(__FILE__) . './../token/verificaToken.php');

class Material {

    function __construct(){
        header('Content-Type: application/json');
        date_default_timezone_set('America/Sao_Paulo');
    }

    public function cadastra($request){

        if(isset($request)){
            
            $query = "INSERT INTO materiais (nome, id_categoria, descricao, valor) 
                    VALUES (:nome, :id_categoria, :descricao, :valor)";

            try {
                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":nome" => strtoupper($request->nome),
                    ":id_categoria" => $request->id_categoria,
                    ":descricao" => $request->descricao,
                    ":valor" => $request->valor
                ]);

                return $result;

            } catch(PDOException $e){
                throw new Error($e->getMessage(), (int) $e->getCode());
            }
        }
         
    }

    public function le($parametros = '*', $filter = ''){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM materiais" . " " . $filter . " " . "ORDER BY nome";
        try {
            $mariadb = new Sql();
            $result = $mariadb->select($query);

            return $result;
            
        } catch(PDOException $e){
            throw new Error($e->getMessage(), (int) $e->getCode());
        }
         
    }

    public function leComId($parametros = '*', $id){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM materiais WHERE id = :id";
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
            $query = "UPDATE materiais 
            SET nome = :nome, id_categoria = :id_categoria, descricao = :descricao, valor = :valor, 
            atualizado_em = :atualizado_em WHERE id = :id";

            try {

                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":id" => $id,
                    ":nome" => strtoupper($request->nome),
                    ":id_categoria" => $request->id_categoria,
                    ":descricao" => $request->descricao,
                    ":valor" => $request->valor,
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
            $query = "DELETE FROM materiais WHERE id = :id";

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