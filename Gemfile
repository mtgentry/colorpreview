# frozen_string_literal: true

ruby '2.7.2'

source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '6.0.3.4'
# Use the Puma web server [https://github.com/puma/puma]
gem 'puma', '~> 5.1'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# # Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

gem 'jquery-rails', '~> 4.3', '>= 4.3.1'
gem 'pg', '~> 0.19.0'

gem 'webpacker', '6.0.0.pre.2'

gem 'devise'
gem 'select2-rails'
gem 'simple_form'

gem 'momentjs-rails'

gem 'draper'

# pagination
gem 'kaminari'

gem 'ransack'

# #step_by_step form
# gem 'wicked'
# #PDF GENERATION
# gem 'wicked_pdf'
# gem 'wkhtmltopdf-binary', '~> 0.12.3'
# active link
gem 'active_link_to'
# sort
gem 'acts_as_list'
# IMAGES
# sudo apt-get install imagemagick
gem 'carrierwave'
gem 'carrierwave-processing'
gem 'mini_magick'
# gem 'fog'

# STRIPE
gem 'stripe'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: %w[mri mingw x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 2.13'
  gem 'selenium-webdriver'
  # Deployment capistrano
  gem 'capistrano', '~> 3.7'
  gem 'capistrano3-puma', github: 'seuros/capistrano-puma'
  gem 'capistrano-bundler', '2.1.0'
  gem 'capistrano-rails', '1.6.2'
  gem 'capistrano-rails-console', '2.3.0'
  gem 'capistrano-rvm', '0.1.2'
  gem 'pry', '~> 0.10.3'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'letter_opener_web', '~> 1.3', '>= 1.3.1'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'web-console', '>= 3.3.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

gem 'ahoy_matey'
gem 'figaro'
gem 'geocoder'
gem 'groupdate'
gem 'maxminddb'
gem 'pundit'

# detect user language
gem 'http_accept_language'

# table pagination
gem 'pagy'

# exception notification
gem 'exception_notification'
