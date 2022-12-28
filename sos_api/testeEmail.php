<?php
  
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
  
require './vendor/autoload.php';
  
$mail = new PHPMailer(true);
  
try {
    $mail->SMTPDebug = 3;                                       
    $mail->isSMTP();                                            
    $mail->Host       = 'smtp.gmail.com;';                    
    $mail->SMTPAuth   = true;                             
    $mail->Username   = 'gustavokreischer@gmail.com';                 
    $mail->Password   = 'Programacao90!@';                        
    $mail->SMTPSecure = 'tls';                              
    $mail->Port       = 587;  
  
    $mail->setFrom('mskinformatica@gmail.com', 'MSK Informática');           
    $mail->addAddress('gustavokreischer@gmail.com');
       
    $mail->isHTML(true);                                  
    $mail->Subject = 'Sua ordem de serviço na MSK Informática foi criada';
    $mail->Body    = 'HTML message body in <b>bold</b> ';
    $mail->AltBody = 'Body in plain text for non-HTML mail clients';
    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );
    $mail->send();
    echo "Email enviado com sucessso";
} catch (Exception $e) {
    echo "O email não pode ser enviado. Motivo: {$mail->ErrorInfo}";
}
  
?>