class ApplicationController < ActionController::Base
  include Pagy::Backend
  include HttpAcceptLanguage::AutoLocale
  # include Pundit
  
  # protect_from_forgery with: :exception

  before_action :track_action
  before_action :set_session_click_modal, :set_page_for_devise_controller, :set_locale
  before_action :get_ga_tacking_id

  private

  def set_session_click_modal
		if session[:date].try(:to_date) != Date.today || cookies[:popuptips] == "true"
			session[:date] = Date.today
			session[:click_modal] = true
		end
  end

  def set_page_for_devise_controller
    devise_controller? && @page = 'devise'
  end

  def track_action
    if !params[:controller].eql?("analytics")
      properties = request.path_parameters
      datas = {}
      datas['promotion'] = cookies[:promotion]
      datas['modalusage'] = cookies[:modalusage]
      datas['popupalert'] = cookies[:popupalert]
      datas['counter'] = cookies[:counter]
      datas['buy_plan'] = (user_signed_in? && (current_user.subscription.present? || current_user.payment_sessions.present?)) ? true : false
      datas['activate_license'] = (user_signed_in? && current_user.license.present?) ? true : false
      datas['user_login'] = user_signed_in? ? true : false
      datas['user_id'] = user_signed_in? ? current_user.id : false

      properties[:cookies] = datas
      
      @tracking_data = current_visit rescue nil

      if @tracking_data
        # events = @tracking_data.events
        # compares = []
        # events.each do |event|
        #   ep = event.properties.class.eql?(Array) ? event.properties.first : event.properties
        #   cookies_data = ep["cookies"]
        #   compares << (cookies_data == datas) ? true : false
        # end

        # if !compares.include?(true)
          ahoy.track("Ran action", properties)
        # end
      end
    end
  end

  def set_locale
    locale_browser     = http_accept_language.compatible_language_from(I18n.available_locales)
    I18n.locale        = locale_browser.to_s.eql?("ja") ? "jp" : locale_browser
    params[:locale]    = I18n.locale

    # used to compare the last language with current language
    @updated_to_jp     = !session[:language].to_s.eql?(I18n.locale.to_s) && I18n.locale.to_s.eql?("jp")
    session[:language] = I18n.locale
  end

  def get_ga_tacking_id
    @tracking_id = Rails.application.secrets.ga_tracking_id
  end
end