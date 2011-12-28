 <!DOCTYPE html>
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

<?php
echo '<div id="titleText">Simple PHP Sample to Query the 30 Most Recent Topics</div><br /> <br />';

require_once "HTTP/Request2.php";

$request = new HTTP_Request2('http://api.getsatisfaction.com/companies/devcommunity/topics.json',
                             HTTP_Request2::METHOD_GET, array());
//$request->setAuth("USERNAME","PASSWORD", HTTP_Request2::AUTH_BASIC);

$response = $request->send();

$body = $response->getBody();

$data = json_decode($body,true);

$count = $data["total"];

if ($count > 30)
{
    $count = 30;
}

for ($i = 1; $i <= $count; $i++)
{
    echo '<div id="subject"><a href="';
    echo $data["data"][$i]["at_sfn"];
    echo '">';
    echo $data["data"][$i]["subject"];
    echo "</a></div><br />";
    echo '<div id="body">';
    echo $data["data"][$i]["content"];
    echo "</div><br /> <br />";
}
?>

<html>
<body>

</body>

 </html>
