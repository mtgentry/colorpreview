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

set :stage, :production
# server '13.56.207.222', user: 'ubuntu', roles: %w{web app db}
set :deploy_to, '/home/ubuntu/colormeiser'
set :branch, 'elvin-update'
