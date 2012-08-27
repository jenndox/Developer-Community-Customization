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
echo '<div id="titleText">Simple PHP Sample to Get All Topics</div><br /> <br />'; 

require_once "HTTP/Request2.php";

$myFile = @"file:///FOLDER/FILENAME.txt";
$fh = fopen($myFile, 'w') or die("can't open file");


$request = new HTTP_Request2('https://api.getsatisfaction.com/companies/YOURCOMMUNITY/topics.json?limit=30', HTTP_Request2::METHOD_GET); 
$request->setAuth("YOUR EMAIL ADDRESS","YOUR PASSWORD", HTTP_Request2::AUTH_BASIC); 

$newHeader = 'Content-type: application/json'; 

$request->setHeader($newHeader); 


$response = $request->send(); 

$body = $response->getBody(); 

$queyData = json_decode($body,true);

$newCount = sizeof($queyData["data"]);

echo $newCount;



echo '<h3>Search Results</h3><ul>';

if ($queyData["total"] > $newCount)
{

    echo $queyData["total"];
    for ($idx=0; $idx< ($queyData["total"] / 30); $idx++)
    {
        $newrequest = new HTTP_Request2('https://api.getsatisfaction.com/companies/YOURCOMMUNITY/topics.json?limit=30&page=' . $idx, HTTP_Request2::METHOD_GET);
        $newrequest->setAuth("YOUR EMAIL ADDRESS","YOUR PASSWORD", HTTP_Request2::AUTH_BASIC); 
        $newrequest->setHeader($newHeader); 
        $newresponse = $newrequest->send(); 
        
        $newbody = $newresponse->getBody(); 
        $queyData = json_decode($newbody,true);
        $count = sizeof($queyData["data"]);
        for ($i = 1; $i <= $count - 1; $i++)
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
            
            $replyrequest = new HTTP_Request2('https://api.getsatisfaction.com/topics/' . $queyData["data"][$i]["id"] . '/replies.json', HTTP_Request2::METHOD_GET);
            $replyrequest->setAuth("YOUR EMAIL ADDRESS","YOUR PASSWORD", HTTP_Request2::AUTH_BASIC); 
            $replyrequest->setHeader($newHeader); 
            $replyresponse = $replyrequest->send(); 
            $replybody = $replyresponse->getBody(); 
            $replyData = json_decode($replybody,true);
            
            fwrite($fh, $queyData["data"][$i]["subject"] . '^' . $queyData["data"][$i]["at_sfn"] . '^' . urlencode($queyData["data"][$i]["content"]) . '^');
            
            $replyct = $replyData["total"];
            if ($replyData["total"] > 30)
                $replyct = 30;
            for ($j = 0; $j <= $replyct; $j++)
            {
                fwrite($fh, urlencode($replyData["data"][$j]["content"]) . '^');
            }
            
            fwrite($fh, '
                   ');
        }
    }
    echo '</ul>';
    fclose($fh);
}

?> 
</body> 
</html>