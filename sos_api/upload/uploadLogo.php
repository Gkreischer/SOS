<?php

require_once(dirname(__FILE__) . "/../pdo/Sql.php");
require_once(dirname(__FILE__) . '/../token/verificaToken.php');

$rand = rand(0, 99999999999);

function gravaCaminhoLogo($cond = false, $file_name, $file_ext)
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

        $caminho_imagem = $protocol . $server_addr . "/sos_api/images/logo/" . $file_name . '.' . $file_ext;

        $query = "UPDATE configuracao SET caminho_logo = :caminho_logo WHERE id = :id";

        $mariadb = new Sql();
        $result_caminho_logo = $mariadb->Sqlquery($query, [
            ":caminho_logo" => $caminho_imagem,
            ":id" => 1
        ]);

        echo $result_caminho_logo;
    }
}

if (isset($_FILES['logo'])) {
    $errors = array();
    $file_name = $_FILES['logo']['name'];
    $file_size = $_FILES['logo']['size'];
    $file_tmp = $_FILES['logo']['tmp_name'];
    $file_type = $_FILES['logo']['type'];

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
        move_uploaded_file($file_tmp, "./../images/logo/" . $rand . '.' . $file_ext);
        gravaCaminhoLogo(true, $rand, $file_ext);
    } else {
        print_r($errors);
    }
}

exit(0);
