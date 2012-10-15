require 'rubygems'
require 'net/https'
require 'uri'
require 'oauth'

class OauthappController < ApplicationController
  
  KEY = "12345"
  SECRET = "1234567890"

  def oauth
    @consumer = OAuth::Consumer.new(KEY, SECRET,
                                   :site => "https://getsatisfaction.com",
                                   :request_token_path => "/api/request_token",
                                   :authorize_path => "/api/authorize",
                                   :access_token_path => "/api/access_token",
                                   :http_method        => :get)
    request_token = @consumer.get_request_token
    session[:request_token] = request_token

    redirect_to request_token.authorize_url + "&oauth_callback=" + CGI.escape("https://localhost:3000/oauthapp/oauth_success")
  end

  def oauth_success
    @access_token = session[:request_token].get_access_token
    response = @access_token.request(:get, "https://api.getsatisfaction.com/companies/devcommunity/topics.json")
    @topics = JSON.parse(response.body)['data'] if (response.code == '200');
  end
  
  def oauth_call
    @access_token_token = '12345' # read from DB
    @access_token_secret = '1234567890'

    @consumer=OAuth::Consumer.new(KEY, SECRET, { :site => "https://api.getsatisfaction.com" })

    @access_token = OAuth::AccessToken.new(@consumer, @access_token_token, @access_token_secret)

    response = @access_token.request(:get, "https://api.getsatisfaction.com/me.json")
    @me = JSON.parse(response.body)['canonical_name'] if (response.code == '200');
  end

end
