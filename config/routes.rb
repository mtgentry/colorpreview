# frozen_string_literal: true

Rails.application.routes.draw do
  # devise_for :users, controllers: { registrations: 'registrations' }

  root 'pages#main'

  get '/app' => 'main#index', :as => 'app'
  get '/app/hex-match' => 'main#hex_match', :as => 'hex_match'
  get '/random-color-generator' => 'main#random-color-generator'
  get '/red-aesthetic' => 'main#red-aesthetic'
  get '/blue-aesthetic' => 'main#blue-aesthetic'
  get '/green-aesthetic' => 'main#green-aesthetic'
  get '/yellow-aesthetic' => 'main#yellow-aesthetic'
  get 'main/click_modal' => 'main#click_modal'
  get 'main/close_alert_active' => 'main#close_alert_active'

  authenticate :user do
    resources :account, only: %i[index update] do
      member do
        post :license
      end
    end

    resources :colors, only: %i[index create], path: 'library'

    # resources :subscriptions, except: %i[index create], path: 'pricing' do
    #   collection do
    #     patch :update_card
    #     get :keys
    #     get :thank_you
    #     get :final_step
    #   end
    # end

    # get '/pricing/free/kFvmm3LoPq' => 'subscriptions#free'
    # post '/pricing/free/kFvmm3LoPq' => 'subscriptions#create'
    # get '/analytics' => 'analytics#index'
    get '/analytics/daily' => 'analytics#analytics_daily'
    get '/analytics/details' => 'analytics#analytics_details'

    match '/analytics' => 'analytics#index', via: %i[get post]
  end

  resources :favorites, only: %i[index create destroy show] do
    collection do
      put :update_index_favorite
    end
  end

  resources :shared_favorites, only: %i[create destroy] do
    collection do
      get 'add_fav'
      get 'remove_fav'
      get 'create_or_update_fav'
      get 'create_fav'
    end
  end

  resources :shared_link, path: 's', only: [:show] do
    collection do
      get 'update_title'
    end
  end

  # resources :licensed_account, path: 'add_licensed_account', only: %i[create new]

  # get '/next_step' => 'licensed_account#next_step'
  # get '/checkout_webhook' => 'payment_session#checkout_webhook'
  # post '/checkout' => 'payment_session#checkout'
  # get '/success' => 'payment_session#success'
  # get '/cancel' => 'payment_session#cancel'
  # post '/create-payment-intent' => 'payment_session#create_payment_intent'
  # get '/account_valid_stripe' => 'account#account_valid_stripe'
  # get '/check_coupon'  => 'account#check_coupon'
  # get '/payment_info'  => 'subscriptions#payment_info'
  # get '/pricing' => 'subscriptions#index'
  # post '/pricing' => 'subscriptions#create'

  # STATIC
  get '/' => 'pages#main'
  get '/legwork' => 'pages#legwork'
  get '/preserve' => 'pages#preserve'
  get '/si-le-soleil' => 'pages#silesoleil'
  # get '/premium' => 'pages#premium'
  get '/terms' => 'pages#terms'
  get '/contact' => 'pages#contact'
  get '/privacy' => 'pages#privacy'
  # get '/upgrade' => 'pages#upgrade'
  get '/sample_site' => 'pages#sample_site'
  get '/free_design_course' => 'pages#course'
  # get '/promotion' => 'pages#promotion'
  # get '/promotion2' => 'pages#promotion2'
  get '/adobe-color' => 'pages#adobe-color'
  get '/red-aesthetic-alternate' => 'main#red-aesthetic-alternate'
  get '/freemium' => 'pages#freemium'
  get '/freebies' => 'pages#freebies'

  # resources :payment_attempts, except: %i[edit update new]
end
