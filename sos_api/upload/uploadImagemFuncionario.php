<?php

require_once(dirname(__FILE__) . "/../pdo/Sql.php");
require_once(dirname(__FILE__) . '/../token/verificaToken.php');

$id_funcionario = $_POST['id_funcionario'];

function gravaCaminhoImagem($cond = false, $file_name, $file_ext, $id_funcionario)
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

        $caminho_imagem = $protocol . $server_addr . "/api/images/funcionarios/" . $file_name . '.' . $file_ext;

        $query = "UPDATE funcionarios SET caminho_imagem = :caminho_imagem WHERE id = :id";

        $mariadb = new Sql();
        $result_caminho_imagem = $mariadb->Sqlquery($query, [
            ":caminho_imagem" => $caminho_imagem,
            ":id" => $id_funcionario
        ]);

        echo $result_caminho_imagem;
    }
}

if (isset($_FILES['imagem'])) {
    $errors = array();
    $file_name = $_FILES['imagem']['name'];
    $file_size = $_FILES['imagem']['size'];
    $file_tmp = $_FILES['imagem']['tmp_name'];
    $file_type = $_FILES['imagem']['type'];

    $tmp = explode('.', $file_name);

    $file_ext = strtolower(end($tmp));

    $extensions = array("jpeg", "jpg", "png");

    if (in_array($file_ext, $extensions) === false) {
        $errors[] = "Extensão não aceita. Somente .jpeg, .jpg e .png";
    }

    if ($file_size > 2097152) {
        $errors[] = 'Arquivos até 2MB de tamanho';
    }

    $rand = rand(0, 99999999999);
    if (empty($errors) == true) {
        move_uploaded_file($file_tmp, "./../images/funcionarios/" . $rand . '.' . $file_ext);
        gravaCaminhoImagem(true, $rand, $file_ext, $id_funcionario);
    } else {
        print_r($errors);
    }
}

exit(0);
