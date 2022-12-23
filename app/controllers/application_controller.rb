# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pagy::Backend
  include HttpAcceptLanguage::AutoLocale
  # include Pundit

  # protect_from_forgery with: :exception

  before_action :track_action
  before_action :track_location
  before_action :set_session_click_modal, :set_page_for_devise_controller, :set_locale
  before_action :get_ga_tacking_id

  helper_method :current_user
  helper_method :user_signed_in?

  def current_user
    nil
  end

  def user_signed_in?
    false
  end

  private

  def set_session_click_modal
    if session[:date].try(:to_date) != Date.today || cookies[:popuptips] == 'true'
      session[:date] = Date.today
      session[:click_modal] = true
    end
  end

  def set_page_for_devise_controller
    devise_controller? && @page = 'devise'
  end

  def track_action
    return if params[:controller].eql?('analytics')

    properties = request.path_parameters
    datas = {}
    datas['promotion'] = cookies[:promotion]
    datas['modalusage'] = cookies[:modalusage]
    datas['popupalert'] = cookies[:popupalert]
    # datas['counter'] = cookies[:counter]
    datas['buy_plan'] = user_signed_in? && (current_user.subscription.present? || current_user.payment_sessions.present?)
    datas['activate_license'] = user_signed_in? && current_user.license.present?
    datas['user_login'] = user_signed_in? ? true : false
    datas['user_id'] = user_signed_in? ? current_user.id : false

    properties[:cookies] = datas

    @tracking_data = begin
      current_visit
    rescue => _e
      nil
    end

    if @tracking_data
      ahoy.track('Ran action', properties)
      # events = @tracking_data.events
      # compares = []
      # events.each do |event|
      #   ep = event.properties.class.eql?(Array) ? event.properties.first : event.properties
      #   cookies_data = ep["cookies"]
      #   compares << (cookies_data == datas) ? true : false
      # end

      # if !compares.include?(true)
      #   ahoy.track("Ran action", properties)
      # end
      ahoy.track('Ran action', properties)
    end
  end

  def track_location
    return true if Rails.env.development?

    @tracking_data = set_geocoder_data(@tracking_data) if @tracking_data.country.blank?
    request_country = @tracking_data&.country.to_s&.downcase

    redirect_to Rails.application.secrets.colorsupplyyy_url and return unless %w[ja jp japan].include?(request_country)
  end

  def set_geocoder_data(tracking_data)
    geocoder_data = Geocoder.search(@tracking_data.ip).first
    return if geocoder_data.blank?

    tracking_data.update(
      {
        country: geocoder_data.country,
        region: geocoder_data.region,
        city: geocoder_data.city,
        latitude: geocoder_data.latitude,
        longitude: geocoder_data.longitude
      }
    )
    tracking_data
  end

  def set_locale
    locale_browser     = http_accept_language.compatible_language_from(I18n.available_locales)
    I18n.locale        = locale_browser.to_s.eql?('ja') ? 'jp' : locale_browser
    params[:locale]    = I18n.locale

    # used to compare the last language with current language
    @updated_to_jp     = !session[:language].to_s.eql?(I18n.locale.to_s) && I18n.locale.to_s.eql?('jp')
    session[:language] = I18n.locale
  end

  def get_ga_tacking_id
    @tracking_id = Rails.application.secrets.ga_tracking_id
  end
end
