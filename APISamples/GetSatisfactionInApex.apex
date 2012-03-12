public class GetSatisfactionQuery
{
    public String newHtml = '';
    
    public String getNewHtml()
    {
        return newHtml;
    }

    class Response {
        public Integer total;
        public Topic[] data;              
    }
    
    class Topic {
        public String at_sfn;
        public String subject;
        public String content;
        public Integer active_replies;
        public String user_defined_code;
        public String most_recent_activity;
        public String status;
        public Author author;
        public String slug;
        public String style;
        public Integer me_too_count;
        public Integer reply_count;
        public String is_closed;
        public String company_id;
        public String has_promoted_replies;
        public String employee;
        public String created_at;
        public Integer follower_count;
        public String last_active_at;
        public String id;
        public String url;
        public Emotitag emotitag;
    }
    
    class Author {
        public String avatar_url_medium;
        public String champion;
        public String avatar_url_large;
        public String title;
        public String employee;
        public String avatar_url_small;
        public String avatar;
        public String name;
        public String avatar_url_mini;
        public String canonical_name;
        public String id;
        public String at_sfn;
        public String url;
    }
    
    class Emotitag {
        public String feeling;
        public String face;
        public Integer intensity;
    }

    public void customGetSatWidget()
    {
        HttpRequest req = new HttpRequest();
        
        // Set HTTPRequest Method
        req.setMethod('GET');
        
        // Set HTTPRequest header properties
        req.setHeader('content-type', 'application/json');
        
        // To get the Basic auth header value, I did:
        // Go to http://www.opinionatedgeek.com/dotnet/tools/base64encode/.
        // Put in a value for Username:Password that looked like "jenn@domain.com:myPassw0rd"
        // (But don't try that, it is not my password or email address.)
        // Then I insert the encoded value in the setHeader call below.
        req.setHeader('Authorization','<<Add a Base 64 encoded Auth token here.>>');
        
        // Set the URL of the API endpoint I want to query
        req.setEndpoint('https://api.getsatisfaction.com/companies/devcommunity/topics.json?limit=5&sort=recently_created');
        
        Http http = new Http();
        
         try {
              // Execute web service call here      
              HTTPResponse res = http.send(req);
              
              // Helpful debug messages
              System.debug('STATUS:'+res.getStatus());
              System.debug('STATUS_CODE:'+res.getStatusCode());
              
              // Deserialize the JSON response and create a response object.
              Response topicRes = (Response)JSON.deserialize(res.getBody(), GetSatisfactionQuery.Response.class);
              
              // For each topic, get the data and do some formatting to make it look nice.
              for (integer idx=0; idx < 5; idx++)
              {
                  // Get the Topic object.
                  Topic topic = topicRes.data[idx];
                  
                  // Use HTTPS because secure data is happy data.
                  String uri = topic.at_sfn.replace('http:', 'https:');
                  
                  // Truncate the body to just 80 characters.
                  String body = topic.content;
                  if (body.length() > 80)
                  {
                      body = body.substring(0, 77) + '...';
                  }
                  
                  // Create an HTML string that formats the three elements referenced above.
                  newHtml = newHtml + '<li><a href="' + uri + '">' + topic.subject + '</a> </li>' + body + '<br />';
              }
        
         } catch(System.CalloutException e) {
            // Exception handling goes here....
            System.debug('Error from GET request.');
            System.debug(e);
        }
    }
}
