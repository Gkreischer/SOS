<?php

require_once(dirname(__FILE__) . '/../cors/cors.php');
require_once(dirname(__FILE__)  . '/../cors/cors.php');
require_once(dirname(__FILE__) . '/../token/verificaToken.php');

class MaterialOs {

    function __construct(){
        header('Content-Type: application/json');
        date_default_timezone_set('America/Sao_Paulo');
    }

    public function cadastra($request){

        if(isset($request)){
            
            $query = "INSERT INTO material_os (id_os, id_material, quantidade, valor) 
                    VALUES (:id_os, :id_material, :quantidade, :valor)";

            try {
                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":id_os" => $request->id_cliente,
                    ":id_material" => $request->id_material,
                    ":quantidade" => $request->quantidade,
                    ":valor" => $request->valor
                ]);

                return $result;

            } catch(PDOException $e){
                throw new Error($e->getMessage(), (int) $e->getCode());
            }
        }
         
    }

    public function le($parametros = '*', $args = ''){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM material_os" . " " . $args;
        try {
            $mariadb = new Sql();
            $result = $mariadb->select($query);

            return $result;
            
        } catch(PDOException $e){
            throw new Error($e->getMessage(), (int) $e->getCode());
        }
         
    }

    public function leComId($parametros = '*', $id, $args = ''){

        $query = "SELECT" . " " . strval($parametros) . " " . "FROM material_os" . " " . $args . " " . "WHERE material_os.id = :id";
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
            
            $query = "UPDATE material_os 
            SET id_os = :id_os, id_material = :id_material, quantidade = :quantidade, valor = :valor
            WHERE id = :id";

            try {

                $mariadb = new Sql();
                $result = $mariadb->Sqlquery($query, [
                    ":id_os" => $request->id_os,
                    ":id_material" => $request->id_material,
                    ":quantidade" => $request->quantidade,
                    ":valor" => $request->valor,
                    ":id" => $id
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