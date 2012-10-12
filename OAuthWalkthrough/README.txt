README First

From this community topic:
https://getsatisfaction.com/devcommunity/topics/how_do_i_use_three_legged_oauth_to_sign_api_calls_answered_using_php

We've had conversations in the past about how to use Three-Legged OAuth to sign API requests. I'd love to give the implementation details I used here and please chime in if there are refinements you would like to add. 

Relevant URLs: 

Get a request token at https:// getsatisfaction.com/api/request_token
Redirect users to https:// getsatisfaction.com/api/authorize?oauth_token=XXX to authorize a request token
Exchange an authorized request token to get an access token at https:// getsatisfaction.com/api/access_token


Step One: Use key/secret to get a request token: 

Code: 
      $origKey = '12345'; $origSecret = '1234567890';
      $consumer = new OAuthConsumer($origKey, $origSecret);
      $url = 'https:// getsatisfaction.com/api/request_token';
      $params = $additionalFields;
      $request = OAuthRequest::from_consumer_and_token($consumer, null, "GET", $url, $params);
      $sigmethod = new OAuthSignatureMethod_HMAC_SHA1();
      $request->sign_request($sigmethod, $consumer, null);
      echo $request->to_url();


Gets me this URL: 
https:// getsatisfaction.com/api/request_token?oauth_version=1.0&oauth_nonce=cc9854e8ad5b9095dfbdb766d7741be6&oauth_timestamp=1349997588&oauth_consumer_key=12345&oauth_signature_method=HMAC-SHA1&oauth_signature=09876543211234567890 

Gets me this request token: 
oauth_token=543210&oauth_token_secret=0987654321 

I save this token in a table for User Jim. 

User             Jim
Request token      543210
Request secret     0987654321


Step Two: Have Jim authorize the request token for future use: 

Get the user Jim to go to this page in the browser: 
https:// getsatisfaction.com/api/authorize?oauth_token=543210 

This will prompt him to sign in to Get Satisfaction. When he signs in to Get Satisfaction, it will authorize the app to post for him. 

NOTE: This has an ugly final page due to a product issue on our server. My apologies, It is working. 

Step Three: Exchange the request token for an access token: 

Code: 
      $origKey = '12345'; $origSecret = '1234567890';
      $tokenKey = '543210'; $tokenSecret = '0987654321';
      $consumer = new OAuthConsumer($origKey, $origSecret);
      $token = new OAuthToken($tokenKey, $tokenSecret);
      $url = 'https:// getsatisfaction.com/api/access_token';
      $request = OAuthRequest::from_consumer_and_token($consumer, $token, "GET", $url, null);
      $sigmethod = new OAuthSignatureMethod_HMAC_SHA1();
      $request->sign_request($sigmethod, $consumer, $token);
      echo $request->to_url();


Gets me this URL: 
https:// getsatisfaction.com/api/access_token?oauth_version=1.0&oauth_nonce=c44d7c86fddeb0876f388af693313d0a&oauth_timestamp=1350000418&oauth_consumer_key=12345&oauth_token=543210&oauth_signature_method=HMAC-SHA1&oauth_signature=1234567890987654321 

Which gets me this Access Token and Access Secret: 
oauth_token=24680&oauth_token_secret=1357997531 

So now my chart looks like: 
User            Jim
Request token      543210
Request secret     0987654321
Access token        24680
Access Secret      1357997531


You need this for all of the users. You can store the tokens in a table in your integration code. The Access token and Access secret are needed for making the API calls for a given user. 
