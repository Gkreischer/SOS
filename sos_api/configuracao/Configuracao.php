<?php

require_once(dirname(__FILE__) . '/../pdo/Sql.php');

class Configuracao {

    function __construct(){
        header('Content-Type: application/json');
        date_default_timezone_set('America/Sao_Paulo');
    }

    public function cadastra($request){

        if(isset($request)){
            
            $query = "INSERT INTO configuracao (razao_social, nome_fantasia, cnpj, telefone, celular, email, whatsapp, caminho_logo, endereco, bairro, cidade, estado, cep, texto_comprovante_os) 
                    VALUES (:razao_social, :nome_fantasia, :cnpj, :telefone, :celular, :email, :whatsapp, :caminho_logo, :endereco, :bairro, :cidade, :estado, :cep, :texto_comprovante_os)";

            try {
                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":razao_social" => $request->razao_social,
                    ":nome_fantasia" => $request->nome_fantasia,
                    ":cnpj" => $request->cnpj,
                    ":telefone" => $request->telefone,
                    ":celular" => $request->celular,
                    ":email" => $request->email,
                    ":whatsapp" => $request->whatsapp,
                    ":caminho_logo" => $request->caminho_logo,
                    ":endereco" => $request->endereco,
                    ":bairro" => $request->bairro,
                    ":cidade" => $request->cidade,
                    ":estado" => strtoupper($request->estado),
                    ":cep" => $request->cep,
                    ":texto_comprovante_os" => $request->texto_comprovante_os
                ]);

                return $result;

            } catch(PDOException $e){
                throw new Error($e->getMessage(), (int) $e->getCode());
            }
        }
         
    }

    public function le($parametros = '*'){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM configuracao";
        try {
            $mariadb = new Sql();
            $result = $mariadb->select($query);

            return $result;
            
        } catch(PDOException $e){
            throw new Error($e->getMessage(), (int) $e->getCode());
        }
         
    }

    public function leComId($parametros = '*', $id){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM configuracao WHERE id = :id";
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
            $query = "UPDATE configuracao 
            SET razao_social = :razao_social, nome_fantasia = :nome_fantasia, cnpj = :cnpj, telefone = :telefone, 
            celular = :celular, email = :email, whatsapp = :whatsapp, caminho_logo = :caminho_logo, endereco = :endereco, bairro = :bairro,
            cidade = :cidade, estado = :estado, cep = :cep, atualizado_em = :atualizado_em, texto_comprovante_os = :texto_comprovante_os WHERE id = :id";

            try {

                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":id" => 1,
                    ":razao_social" => $request->razao_social,
                    ":nome_fantasia" => $request->nome_fantasia,
                    ":cnpj" => $request->cnpj,
                    ":telefone" => $request->telefone,
                    ":celular" => $request->celular,
                    ":email" => $request->email,
                    ":whatsapp" => $request->whatsapp,
                    ":caminho_logo" => $request->caminho_logo,
                    ":endereco" => $request->endereco,
                    ":bairro" => $request->bairro,
                    ":cidade" => $request->cidade,
                    ":estado" => strtoupper($request->estado),
                    ":cep" => $request->cep,
                    ":texto_comprovante_os" => $request->texto_comprovante_os,
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

    public function limpaConfiguracao($parametros = '*'){

        $query = "DELETE" . " " . strval($parametros) . " " . "FROM configuracao";
        try {
            $mariadb = new Sql();
            $result = $mariadb->Sqlquery($query);

            return $result;
            
        } catch(PDOException $e){
            throw new Error($e->getMessage(), (int) $e->getCode());
        }
         
    }


}
