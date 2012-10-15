#!/usr/bin/env ruby
#
# This command-line script will make authenticated three-legged OAuth requests to the local API server for creating a
# new topic and creating a new reply.
#
# To run this script, you must do the following.
#
# (1) Start the app server, API server, and Sphinx server, i.e.:
#
#   script/server
#   API=1 script/server -p 3001
#   rake ts:start
#
# (2) Install the ruby-satisfaction gem. To do so, enter the following command from this current directory:
#
#   bundle install
#
# (3) Generate a developer API consumer key and secret for your Get Satisfaction user account. Go to
# <https://app.gsfn:3000/people/<username>/extensions>, and register a new application if you have not already. Also,
# take note of the user ID of your Get Satisfaction user account.
#
# (4) Execute this script at the command line.
#
#   ruby post_as_user.rb
#
# When prompted, provide the consumer key, consumer secret, and user ID.
#
# Enjoy!

require 'rubygems'
require 'satisfaction'

#################
# Configuration #
#################

DEFAULTS = {
  :api_host => 'api.getsatisfaction.com',
  :consumer => {
    :key  => '12345',
    :secret => '1234567890'
  },
  :provider => {
    :request_token_url => 'https://getsatisfaction.com/api/request_token',
    :access_token_url  => 'https://getsatisfaction.com/api/access_token',
    :authorize_url     => 'https://getsatisfaction.com/api/authorize'
  },
  :company_domain => 'mydomain'
}.freeze

STDOUT.sync = true
DEBUG = false

case arg = ARGV.pop
when '-v'
  DEBUG = true
end

###########
# Methods #
###########

def init

  api_host = prompt_user_for_value("API host", DEFAULTS[:api_host])
  consumer_token, consumer_secret = *get_oauth_consumer_credentials

  if "#{prompt_user_for_value('Already have an access token?', 'N')}"[0,1].downcase == 'y'
    access_token_key    = prompt_user_for_value("Access token key", '')
    access_token_secret = prompt_user_for_value("Access token secret", '')
    sfn = Satisfaction.new(:root => "https://#{api_host}")
    sfn.set_token(access_token_key, access_token_secret)
  else
    request_token_url, access_token_url, authorize_url = *get_oauth_configuration
    sfn = Satisfaction.new(
      :root              => "https://#{api_host}",
      :request_token_url => request_token_url,
      :access_token_url  => access_token_url,
      :authorize_url     => authorize_url
    )
  end

  sfn.set_consumer(consumer_token, consumer_secret)
  sfn
end

def prompt_user_for_value(message, default_value)
  print "#{message} [#{default_value}]: "
  new_value = readline.strip
  new_value.present? ? new_value : default_value
end

def get_oauth_configuration
  [
    prompt_user_for_value("Identity provider request token URL", DEFAULTS[:provider][:request_token_url]),
    prompt_user_for_value("Identity provider access token URL", DEFAULTS[:provider][:access_token_url]),
    prompt_user_for_value("Identity provider request token URL", DEFAULTS[:provider][:authorize_url])
  ]
end

def get_oauth_consumer_credentials

  token = prompt_user_for_value("Your API developer consumer token", DEFAULTS[:consumer][:key])
  secret = prompt_user_for_value("Your API developer consumer secret", DEFAULTS[:consumer][:secret]) if token.present?
  
  if token.blank? || secret.blank?
    puts "API developer token and secret are required!"
    exit 1
  end

  [token, secret]
end

def authorize(sfn)

  return if sfn.token.present?

  # Generate a request token

  print ">> Generating a request token... "

  begin
    unless request_token = sfn.request_token
      puts "Bad request token!"
      exit 1
    end
  rescue => exc
    puts "\n [!] #{exc.message}"
  end

  puts "Done (request token: #{request_token})"

  # Prompt user to authorize the request token manually

  print <<-EOD

###############
## ATTENTION ##
###############

To authorize the consumer to act on your behalf, update the database so that the newly generated API request token has a
user associated with it.

  Via web browser:

    #{sfn.authorize_url(request_token)}

  Via SQL console:

    UPDATE api_tokens SET user_id = '<user_id>' WHERE token = '#{request_token.token[0]}' AND type = 'request'

  Via Ruby console:

    Api::Token.find_by_token_and_type('#{request_token.token[0]}', 'request').update_attributes(:user_id => <user_id>)

Press [ENTER] when ready to continue.
  EOD

  readline

  # Generate an access token

  print ">> Requesting an access token... (request token is #{request_token.token[0]})"

  begin
    unless access_token = sfn.access_token(request_token)
      puts "Bad access token!"
      exit 1
    end
  rescue Sfn::AuthorizationError => exc
    puts "\n [!] Request token was not authorized"
    exit 1
  rescue => exc
    puts "\n [!] #{exc.message}"
    exit 1
  end


  sfn.set_token(access_token.token, access_token.secret)

  puts "Done"

  puts ">> Access token key:    #{access_token.token}"
  puts ">> Access token secret: #{access_token.secret}"
end

def send_api_call(description='')
  begin
    print ">> Sending API call - #{description}... "
    response = yield
    puts "Done"
  rescue => exc
    puts "\n [!] #{exc.message}"
  end

  response
end

def get_company_topics(sfn, company_domain)
  send_api_call "Getting company topics" do
    sfn.companies[company_domain].topics.page(1).items
  end
end

def post_new_topic(sfn, company_domain)
  send_api_call "Posting new topic" do
    sfn.topics.post(
      :company_domain => company_domain,
      :style => 'question',
      :subject => "Can I post on behalf of myself?",
      :additional_detail => "It seems as though I can.",
      :keywords => nil
    )
  end
end

def post_new_reply(sfn, topic)
  send_api_call "Posting new reply" do
    sfn.topics[topic.id].replies.post(
      :content => "Hey, this a reply posted via the API!"
    )
  end
end

def get_company_topic_replies(sfn, company_domain)
  topic_id = prompt_user_for_value("Topic ID or slug", '')
  send_api_call "Getting replies for company topic #{topic_id}" do
    sfn.companies[company_domain].topics[topic_id].replies.page(1).items
  end
end

########
# Main #
########

company_domain = prompt_user_for_value("Company domain", DEFAULTS[:company_domain])
sfn = init()
authorize(sfn)

# Make the authorized API requests

call_mode = prompt_user_for_value(
  "\nAvailable API calls:\n\n" +
  " [1] Get topics for #{company_domain}\n" +
  " [2] Post a topic/reply to #{company_domain}\n" +
  " [3] Get replies for a topic in #{company_domain}\n" +
  " [*] All of the above\n\n" +
  "Select one of the options above",
  "*"
)

if %w(1 *).include?(call_mode) && topics = get_company_topics(sfn, company_domain)
  puts " [*] Retrieved #{topics.size} topics for community:"
  topics.each{|t| puts "      . #{t.subject}" }
end

if %w(2 *).include?(call_mode) && topic = post_new_topic(sfn, company_domain)

  puts " [+] Created topic '#{topic.subject}':"
  puts topic.inspect

  if reply = post_new_reply(sfn, topic)
    puts " [+] Created reply #'#{reply.id}'"
    puts reply.inspect
  end
end

if %w(3 *).include?(call_mode) && replies = get_company_topic_replies(sfn, company_domain)
  puts " [*] Retrieved #{replies.size} replies for a topic in the community:"
  replies.each{|r| puts "      . #{(r.content || '')[0,15]} ..." }
end

