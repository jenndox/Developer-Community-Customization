<?php
require_once "HTTP/Request2.php";

$keyword = $_POST['keyword'];
$query = new HTTP_Request2('http://api.getsatisfaction.com/companies/devcommunity/topics.json?query=' . $keyword . '&limit=6&sort=recently_created',
                             HTTP_Request2::METHOD_GET, array());

$queryRes = $query->send();

$queryBody = $queryRes->getBody();

$queyData = json_decode($queryBody,true);

$newCount = $queyData["total"];

if ($newCount > 6)
{
    $newCount = 6;
}

echo '<h3>Search Results</h3><ul>';
for ($i = 1; $i <= $newCount - 1; $i++)
{
    echo '<li><p><div id="subject"><a href="';
    echo $queyData["data"][$i]["at_sfn"];
    echo '">';
    echo $queyData["data"][$i]["subject"];
    echo "</a></div></li>";
    echo '<div id="body">';
    $content = $queyData["data"][$i]["content"];
    if (strlen($body) > 80)
    {
        $content = substr($content, 0, 77) . '...';
    }
    echo $content;
    echo "</div></p>";
}
echo '</ul>';
?>