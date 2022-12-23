# frozen_string_literal: true

set :ssh_options, { forward_agent: true }
set :application, 'colormeiser'
set :repo_url, 'git@github.com:mtgentry/colormeister.git'

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }
set :branch, 'feature-update'
# Default deploy_to directory is /var/www/my_app
set :deploy_to, '/home/rails/colormeiser'

# set :linked_files, %w{config/database.yml config/secrets.yml config/application.yml}
set :linked_files, fetch(:linked_files, []).push(
  *%w[config/application.yml config/database.yml config/secrets.yml config/puma.rb]
)
set :linked_dirs, %w[
  log node_modules tmp/cache tmp/pids tmp/sockets vendor/bundle vendor/assets
  public/uploads public/system public/assets public/packs storage
  lib/custom_commads
]

set :nvm_type, :user # or :system, depends on your nvm setup
set :nvm_node, 'v14.16.0'
set :nvm_map_bins, %w[node npm yarn webpack rake]

set :yarn_target_path, -> { release_path } #
set :yarn_flags, '--production --silent --no-progress'    # default
set :yarn_roles, :all                                     # default
set :yarn_env_variables, {}

namespace :deploy do
  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  after :publishing, 'deploy:restart'
  after :finishing, 'deploy:cleanup'
end
