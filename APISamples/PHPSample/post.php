 <!DOCTYPE html>
 <html>
 <head>
<style type="text/css">
#titleText
{
    font-family: "Helvetica";
    font-size: 24px;
    font-weight:bold;
    text-align:center;
}

#subject
{
    font-family: "Helvetica";
    font-size: 16px;
    line-height: 1.25em;
}

#body
{
    font-family: "Helvetica";
    font-size: 12px;
}
</style>
 </head>
 <body>
<?php
echo '<div id="titleText">Simple PHP Sample to Add Topics</div><br /> <br />';

require_once "HTTP/Request2.php";

$username = "you@yourdomain.com";
$password = "12345";
$request = new HTTP_Request2('http://api.getsatisfaction.com/companies/jenns_cool_stuff/topics.json',
                             HTTP_Request2::METHOD_POST);
$request->setAuth($username, $password, HTTP_Request2::AUTH_BASIC);

$newSubject = $_POST['subject'];
$newDetail = $_POST['detail'];

$newBody = '{"topic": {"subject": "'.$newSubject.'", "additional_detail": "'.$newDetail.'"}} ';
echo $newBody;

$newHeader = 'Content-type: application/json';

$request->setHeader($newHeader);
$request->setBody($newBody);


$response = $request->send();

$body = $response->getBody();

echo $body;

?>
 </body>
 </html>