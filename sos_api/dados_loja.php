<?php

require __DIR__ . "./configuracao/Configuracao.php";

$configuracao = new Configuracao();
$dados_loja = $configuracao->le('*');

echo json_encode($dados_loja);

exit(0);
