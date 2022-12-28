<?php
    require_once(dirname(__FILE__) . '/../cors/cors.php');
    require_once(dirname(__FILE__) . '/../pdo/Sql.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $query = "INSERT INTO categoria_materiais (categoria) VALUES (:categoria)";

    try{
        $mariadb = new Sql();
        $result = $mariadb->Sqlquery($query, [
            ":categoria"=>strtoupper($request->categoria)
        ]);

        echo json_encode($result);

    } catch(PDOException $e){
        throw new \Exception($e->getMessage(), (int) $e->getCode());
    }
    
    exit;
?>