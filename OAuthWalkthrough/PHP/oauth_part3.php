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
echo '<div id="titleText">How to Make Oauth API calls Part 3</div><br /> <br />'; 

require_once "OAuth.php";


      $origKey = '12345'; $origSecret = '1234567890';
      $accessKey = '24680'; $accessSecret = '1357997531';
      $consumer = new OAuthConsumer($origKey, $origSecret);
      $token = new OAuthToken($accessKey, $accessSecret);
      $url = 'https://api.getsatisfaction.com/companies/devcommunity/topics.json';
      $params = $additionalFields;
      $request = OAuthRequest::from_consumer_and_token($consumer, $token, "GET", $url, $params);
      $sigmethod = new OAuthSignatureMethod_HMAC_SHA1();
      $request->sign_request($sigmethod, $consumer, $token);
      echo $request->to_url();

?> 
</body> 
</html>