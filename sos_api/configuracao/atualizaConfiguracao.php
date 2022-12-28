<?php

    require_once(dirname(__FILE__) . '/Configuracao.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $id = 1;

    $configuracao = new Configuracao();
    
    // VERIFICA SE JA POSSUI CADASTRO
    $result_verifica = $configuracao->le('*');

    if(count($result_verifica) == 0){
        $result_cadastro = $configuracao->cadastra($request);
        echo json_encode($result_cadastro);
    }

    if(count($result_verifica) == 1) {
        $result_atualiza = $configuracao->atualiza($request, $id);
        echo json_encode($result_atualiza);
    }

    if(count($result_verifica) > 1) {
        $result_limpa_configuracao = $configuracao->limpaConfiguracao('*');
        $result_cadastra_configuracao = $configuracao->cadastra($request);
        echo json_encode($result_cadastra_configuracao);
    }

    exit;
