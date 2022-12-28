<?php
// DEFININDO O TIMEZONE ABAIXO
date_default_timezone_set('America/Sao_Paulo');
// $timezone = date_default_timezone_get();
$timezone = date("Y-m-d H:i:s");
echo "The current server timezone is: " . $timezone;

?>