# frozen_string_literal: true

class MainController < ApplicationController
  respond_to :html

  def index
    @sub_navigation_avail = true

    @colors = if current_user
                current_user.colors.all
              else
                []
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
    current_user&.update(close_alert_active: false)

    render json: :no_content, status: :ok
  end
end
