<?php
    require_once(dirname(__FILE__) . '/../cors/cors.php');
    require_once(dirname(__FILE__) . '/../pdo/Sql.php');

    $query = "SELECT * FROM categoria_materiais";

    try {
    
        $mariadb = new Sql();
        $result = $mariadb->select($query);
        echo json_encode($result);

    } catch(PDOException $e){
        throw new \Exception($e->getMessage(), (int) $e->getCode());
    }

    exit;

?>