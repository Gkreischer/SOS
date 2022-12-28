<?php

require_once(dirname(__FILE__) . '/../pdo/Sql.php');
require_once(dirname(__FILE__) . '/../token/verificaToken.php');

class Funcionario {

    function __construct(){
        header('Content-Type: application/json');
    }

    public function cadastra($request){

        if(isset($request)){
            
            $query = "INSERT INTO funcionarios (nome, cpf, email, telefone, celular, cargo, nivel, senha) VALUES (:nome, :cpf, :email, :telefone, :celular, :cargo, :nivel, :senha)";

            try {
                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":nome" => $request->nome,
                    ":cpf" => $request->cpf,
                    ":email" => $request->email,
                    ":telefone" => $request->telefone,
                    ":celular" => $request->celular,
                    ":cargo" => $request->cargo,
                    ":nivel" => $request->nivel,
                    ":senha" => password_hash($request->senha, PASSWORD_DEFAULT)
                ]);

                return $result;

            } catch(PDOException $e){
                throw new Error($e->getMessage(), (int) $e->getCode());
            }
        }
         
    }

    public function le($parametros = '*'){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM funcionarios ORDER BY nome";
        try {
            $mariadb = new Sql();
            $result = $mariadb->select($query);

            return $result;
            
        } catch(PDOException $e){
            throw new Error($e->getMessage(), (int) $e->getCode());
        }
         
    }

    public function leComId($parametros = '*', $id){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM funcionario WHERE id = :id";
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

        if(isset($id)){
            $query = "UPDATE funcionarios SET nome = :nome, cpf = :cpf, email = :email, telefone = :telefone, celular = :celular, cargo = :cargo, nivel = :nivel, senha = :senha, atualizado_em = :atualizado_em WHERE id = :id";

            try {

                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":id" => $id,
                    ":nome" => $request->nome,
                    ":cpf" => $request->cpf,
                    ":email" => $request->email,
                    ":telefone" => $request->telefone,
                    ":celular" => $request->celular,
                    ":cargo" => $request->cargo,
                    ":nivel" => $request->nivel,
                    ":senha" => password_hash($request->senha, PASSWORD_DEFAULT),
                    ":atualizado_em" => date("Y-m-d H:i:s")
                ]);

                return $result;

            }catch(PDOException $e){
                throw new Error($e->getMessage(), (int) $e->getCode());
            }

        }
    }

    public function deleta($id){

        if(isset($id)){
            $query = "DELETE FROM funcionarios WHERE id = :id";

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