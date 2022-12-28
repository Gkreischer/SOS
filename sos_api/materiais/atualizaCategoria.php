<?php
    require_once(dirname(__FILE__) . '/../cors/cors.php');
    require_once(dirname(__FILE__) . '/../pdo/Sql.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $id = $request->id;
    $value = $request->value;

    $query = "UPDATE categoria_materiais SET categoria = :categoria WHERE id = :id";

    $mariadb = new Sql();
    $result = $mariadb->Sqlquery($query, [
        ":id" => $id,
        ":categoria" => strtoupper($value)
    ]);

    echo json_encode($result);
    exit;
?>