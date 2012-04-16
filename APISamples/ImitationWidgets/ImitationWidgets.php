<html>
<head>

 <!DOCTYPE html>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> 

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
<script type="text/javascript" src="http://code.jquery.com/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="http://ajax.microsoft.com/ajax/jquery.validate/1.7/jquery.validate.min.js"></script>

<script type="text/javascript">
jQuery(document).ready(function(){
        jQuery("#search").validate({
                debug: false,
                rules: {
                        keyword: {
                                required: true,
                        }
                },
                messages: {
                        keyword: "Submit a query.",
                },
                submitHandler: function(form) {
                        // do other stuff for a valid form
                        jQuery.post('SearchFr.php', jQuery("#search").serialize(), function(data) {
                                jQuery('#results').html(data);
                        });
                }
        });
});
</script>
</head>
<body>
    
    <?php
echo '<div id="titleText">Recent Dev Community Topics</div><br />';

require_once "HTTP/Request2.php";

$request = new HTTP_Request2('http://api.getsatisfaction.com/companies/devcommunity/topics.json?limit=6&sort=recently_created',
                             HTTP_Request2::METHOD_GET, array());

$response = $request->send();

$body = $response->getBody();

$data = json_decode($body,true);

$count = $data["total"];

if ($count > 6)
{
    $count = 6;
}

echo '<ul>';
for ($i = 1; $i <= $count - 1; $i++)
{
    echo '<li><p><div id="subject"><a href="';
    echo $data["data"][$i]["at_sfn"];
    echo '">';
    echo $data["data"][$i]["subject"];
    echo "</a></div></li>";
    echo '<div id="body">';
    $body = $data["data"][$i]["content"];
    if (strlen($body) > 80)
    {
        $body = substr($body, 0, 77) . '...';
    }
    echo $body;
    echo "</div></p>";
}
echo '</ul>';
?>


<form  name="search" id="search" action="" method="POST">
Search: <input type="text" name="keyword" />
<input type="submit" name="submit" value="Submit" />
</form>

<div id="results">
</div>
</body>
</html>