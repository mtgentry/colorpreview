# frozen_string_literal: true

# Load DSL and Setup Up Stages
require 'capistrano/setup'

# Includes default deployment tasks
require 'capistrano/deploy'

require 'capistrano/scm/git'
install_plugin Capistrano::SCM::Git

# If you are using rbenv add these lines:
require 'capistrano/rvm'

require 'capistrano/puma'
install_plugin Capistrano::Puma

require 'capistrano/bundler'
# require 'capistrano/rails'
require 'capistrano/rails/console'
# require "capistrano/rails/assets"
require 'capistrano/rails/migrations'

require 'capistrano/yarn'
require 'capistrano/nvm'

# Loads custom tasks from `lib/capistrano/tasks' if you have any defined.
Dir.glob('lib/capistrano/tasks/*.cap').each { |r| import r }
