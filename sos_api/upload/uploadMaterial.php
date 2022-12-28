<?php

require_once(dirname(__FILE__) . "/../pdo/Sql.php");
require_once(dirname(__FILE__) . '/../token/verificaToken.php');

$id_material = $_POST['id_material'];

if(!isset($id_material)){
    return;
    exit(0);
}

function gravaCaminhoImagem($cond = false, $file_name, $file_ext, $id_material)
{

    if ($cond) {
        if (
            isset($_SERVER['HTTPS']) &&
            ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1) || isset($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
            $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https'
        ) {
            $protocol = 'https://';
        } else {
            $protocol = 'http://';
        }

        $server_addr = EXTERNAL_IP;

        $query = "UPDATE materiais SET caminho_imagem = :caminho_imagem, atualizado_em = :atualizado_em WHERE id = :id_material";

        $caminho_imagem = $protocol . $server_addr . "/sos_api/images/material/" . $file_name . '.' . $file_ext;

        $mariadb = new Sql();
        $result_caminho_imagem = $mariadb->Sqlquery($query, [
            ":caminho_imagem" => $caminho_imagem,
            ":atualizado_em" => date("Y-m-d H:i:s"),
            ":id_material" => $id_material
        ]);

        $res = array('status' => 1, 'caminho_imagem' => $caminho_imagem);

        if($result_caminho_imagem) {
            echo json_encode($res);
        }
    }
}

if (is_numeric($id_material)) {

    $rand = rand(0, 99999999999);

    if (isset($_FILES['material'])) {
        $errors = array();
        $file_name = $_FILES['material']['name'];
        $file_size = $_FILES['material']['size'];
        $file_tmp = $_FILES['material']['tmp_name'];
        $file_type = $_FILES['material']['type'];

        $tmp = explode('.', $file_name);

        $file_ext = strtolower(end($tmp));

        $extensions = array("jpeg", "jpg", "png");

        if (in_array($file_ext, $extensions) === false) {
            $errors[] = "Extensão não aceita. Somente .jpeg, .jpg e .png";
        }

        if ($file_size > 2097152) {
            $errors[] = 'Arquivos até 2MB de tamanho';
        }

        if (empty($errors) == true) {
            move_uploaded_file($file_tmp, "./../images/material/" . $rand . '.' . $file_ext);
            gravaCaminhoImagem(true, $rand, $file_ext, $id_material);
        } else {
            print_r($errors);
        }
    }
}





exit(0);
