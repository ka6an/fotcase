<?php
$to = 'fotcasecompany@gmail.com, leshka3333@mail.ru';
$subject = 'Заявка с FOTCASE';
$message = '
        <html>
            <head>
                <title>'.$subject.'</title>
            </head>
            <body>
                <p>Имя: '.$_POST['name'].'</p>
                <p>Email: '.$_POST['email'].'</p>
                <p>Телефон: '.$_POST['phone'].'</p>
            </body>
        </html>';
$headers  = "Content-type: text/html; charset=utf-8 \r\n";
$headers .= "From: Отправитель <from@fotcase.ru>\r\n";
mail($to, $subject, $message, $headers);
?>