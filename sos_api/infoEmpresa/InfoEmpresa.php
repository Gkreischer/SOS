<?php

require_once(dirname(__FILE__) . '/../pdo/Sql.php');

class InfoEmpresa {

    function __construct(){
        header('Content-Type: application/json');
        date_default_timezone_set('America/Sao_Paulo');
    }

    public function cadastra($request){

        if(isset($request)){
            
            $query = "INSERT INTO configuracao (razao_social, nome_fantasia, cnpj, telefone, celular, whatsapp, logo_url, endereco, bairro, cidade, estado, cep) 
                    VALUES (:razao_social, :nome_fantasia, :cnpj, :telefone, :celular, :whatsapp, :logo_url, :endereco, :bairro, :cidade, :estado, :cep)";

            try {
                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":razao_social" => $request->razao_social,
                    ":nome_fantasia" => $request->nome_fantasia,
                    ":cnpj" => $request->cnpj,
                    ":telefone" => $request->telefone,
                    ":celular" => $request->celular,
                    ":whatsapp" => $request->whatsapp,
                    ":logo_url" => $request->logo_url,
                    ":endereco" => $request->endereco,
                    ":bairro" => $request->bairro,
                    ":cidade" => $request->cidade,
                    ":estado" => $request->estado,
                    ":cep" => $request->cep
                ]);

                return $result;

            } catch(PDOException $e){
                throw new Error($e->getMessage(), (int) $e->getCode());
            }
        }
         
    }

    public function le($parametros = '*'){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM configuracao WHERE id = 1";
        try {
            $mariadb = new Sql();
            $result = $mariadb->select($query);

            return $result;
            
        } catch(PDOException $e){
            throw new Error($e->getMessage(), (int) $e->getCode());
        }
         
    }


    public function atualiza($request){

        if(isset($request)){
            $query = "UPDATE configuracao 
            SET razao_social = :razao_social, nome_fantasia = :nome_fantasia, cnpj = :cnpj, telefone = :telefone, celular = :celular, 
            whatsapp = :whatsapp, logo_url = :logo_url, endereco = :endereco, bairro = :bairro, cidade = :cidade, 
            estado = :estado, cep = :cep, atualizado_em = :atualizado_em WHERE id = :id";

            try {

                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":id" => 1,
                    ":razao_social" => $request->razao_social,
                    ":nome_fantasia" => $request->nome_fantasia,
                    ":cnpj" => $request->cnpj,
                    ":telefone" => $request->telefone,
                    ":celular" => $request->celular,
                    ":whatsapp" => $request->whatsapp,
                    ":logo_url" => $request->logo_url,
                    ":endereco" => $request->endereco,
                    ":bairro" => $request->bairro,
                    ":cidade" => $request->cidade,
                    ":estado" => $request->estado,
                    ":cep" => $request->cep,
                    ":atualizado_em" => date("Y-m-d H:i:s")
                ]);

                return $result;

            }catch(PDOException $e){
                throw new Error($e->getMessage(), (int) $e->getCode());
            }
        } 
    }

}

?>