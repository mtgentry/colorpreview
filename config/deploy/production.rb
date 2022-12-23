# frozen_string_literal: true

# Simple Role Syntax
# ==================
# Supports bulk-adding hosts to roles, the primary
# server in each group is considered to be the first
# unless any hosts have the primary property set.
# Don't declare `role :all`, it's a meta role
# role :app, %w{deploy@example.com}
# role :web, %w{deploy@example.com}
# role :db,  %w{deploy@example.com}

set :user, 'rails'
set :rvm_type, :user
set :rvm_ruby_version, '2.7.2'
set :rvm_custom_path, '/usr/share/rvm/'

set :stage, :production
server '139.59.112.179', user: 'rails', roles: %w[web app db]
