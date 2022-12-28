<?php
    require_once(dirname(__FILE__) . '/../cors/cors.php');
    require_once(dirname(__FILE__) . '/../pdo/Sql.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    $id = $request;

    $query = "DELETE FROM categoria_materiais WHERE id = :id";

    try{
        $mariadb = new Sql();
        $result = $mariadb->Sqlquery($query, [
            ":id"=>$id
        ]);

        echo json_encode($result);

    } catch(PDOException $e){
        throw new \Exception($e->getMessage(), (int) $e->getCode());
    }
    
    exit;
?>