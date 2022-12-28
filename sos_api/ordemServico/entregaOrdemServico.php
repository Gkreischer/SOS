<?php

require_once(dirname(__FILE__) . '/OrdemServico.php');

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$id = $request->id;
$ordem_servico_recebida = $request->ordemServico;

$ordem_servico = new OrdemServico();
$result_entrega_ordem_servico = $ordem_servico->atualiza($ordem_servico_recebida, $id);

echo json_encode($result_entrega_ordem_servico);

exit;