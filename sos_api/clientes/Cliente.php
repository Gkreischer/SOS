<?php

require_once(dirname(__FILE__) . '/../pdo/Sql.php');
require_once (dirname(__FILE__) . '/../token/verificaToken.php');

class Cliente {

    function __construct(){
        header('Content-Type: application/json');
        date_default_timezone_set('America/Sao_Paulo');
    }

    public function cadastra($request){

        if(isset($request)){
            
            $query = "INSERT INTO clientes (nome, cpf, razao_social, cnpj, telefone, celular, whatsapp, email, endereco, bairro, cidade, estado, cep, obs) 
                    VALUES (:nome, :cpf, :razao_social, :cnpj, :telefone, :celular, :whatsapp, :email, :endereco, :bairro, :cidade, :estado, :cep, :obs)";

            try {
                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":nome" => $request->nome,
                    ":cpf" => $request->cpf,
                    ":razao_social" => $request->razao_social,
                    ":cnpj" => $request->cnpj,
                    ":telefone" => $request->telefone,
                    ":celular" => $request->celular,
                    ":whatsapp" => $request->whatsapp,
                    ":email" => $request->email,
                    ":endereco" => $request->endereco,
                    ":bairro" => $request->bairro,
                    ":cidade" => $request->cidade,
                    ":estado" => $request->estado,
                    ":cep" => $request->cep,
                    ":obs" => $request->obs
                ]);

                return $result;

            } catch(PDOException $e){
                throw new Error($e->getMessage(), (int) $e->getCode());
            }
        }
         
    }

    public function le($parametros = '*'){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM clientes ORDER BY nome";
        try {
            $mariadb = new Sql();
            $result = $mariadb->select($query);

            return $result;
            
        } catch(PDOException $e){
            throw new Error($e->getMessage(), (int) $e->getCode());
        }
         
    }

    public function leComId($parametros = '*', $id, $args = ' '){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM clientes" . " " . $args . " " . "WHERE id = " . $id;
        try {
            $mariadb = new Sql();
            $result = $mariadb->select($query);

            return $result;
            
        } catch(PDOException $e){
            throw new Error($e->getMessage(), (int) $e->getCode());
        }
         
    }

    public function atualiza($request, $id){

        if(isset($id)){
            $query = "UPDATE clientes 
            SET nome = :nome, cpf = :cpf, razao_social = :razao_social, cnpj = :cnpj, telefone = :telefone, celular = :celular, whatsapp = :whatsapp, 
            email = :email, endereco = :endereco, bairro = :bairro, cidade = :cidade, estado = :estado, 
            cep = :cep, obs = :obs, atualizado_em = :atualizado_em WHERE id = :id";

            try {

                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":id" => $id,
                    ":nome" => $request->nome,
                    ":cpf" => $request->cpf,
                    ":razao_social" => $request->razao_social,
                    ":cnpj" => $request->cnpj,
                    ":telefone" => $request->telefone,
                    ":celular" => $request->celular,
                    ":whatsapp" => $request->whatsapp,
                    ":email" => $request->email,
                    ":endereco" => $request->endereco,
                    ":bairro" => $request->bairro,
                    ":cidade" => $request->cidade,
                    ":estado" => $request->estado,
                    ":cep" => $request->cep,
                    ":obs" => $request->obs,
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
            $query = "DELETE FROM clientes WHERE id = :id";

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