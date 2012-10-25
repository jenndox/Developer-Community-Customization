require 'rubygems'
require 'oauth'
require 'json'

# These are the Fastpass credentials for a community

CONSUMER_KEY    = "12345"
CONSUMER_SECRET = "1234567890"

# Set the http method and the API endpoint
http_method     = :get
api_host        = "https://api.getsatisfaction.com"

consumer = OAuth::Consumer.new(CONSUMER_KEY, CONSUMER_SECRET, :site => api_host, :http_method => http_method)
access_token = OAuth::AccessToken.new(consumer)


request_headers = {'Content-Type' => 'application/json'}

api_url_path    = "/people/jenndox.json"

# --- for get ---
users_response = access_token.get(api_url_path, request_headers)
users_hash = JSON.parse(users_response.body)

users_hash['data'].each { |k|
  user_id = k['id']
  name = k['name']
  email = k['shared_email']
  

  puts "user #{user_id} (#{name}) \t n. has email: #{email}"
}