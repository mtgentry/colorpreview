class MainController < ApplicationController
  respond_to :html

  def index
    @sub_navigation_avail = true

    if current_user
      @colors = current_user.colors.all
    else
      @colors = []
    end    
  end

  def hex_match
    @sub_navigation_avail = true
  end

  def click_modal
    if session[:click_modal] == true
      click_modal = true
      session[:click_modal] = false
    else
      click_modal = false
    end
    respond_to do |format|
      format.json { render json: click_modal }
    end
  end

  def close_alert_active
    current_user.update(close_alert_active: false) if current_user

    render json: :no_content, status: :ok
  end
end