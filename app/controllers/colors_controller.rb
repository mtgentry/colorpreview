class ColorsController < ApplicationController
  def index    
    @selected_colors = current_user.colors.all
    @colors = Color.all - @selected_colors
  end

  def create
    if current_user.is_payed?
      new_colors = params[:colors] || []
      current_user.colors.delete_all
      new_colors.each do |color|
        UserColor.create({ user_id: current_user.id, color_id: color[:id], position: color[:index] })
      end
    end
    respond_to do |format|
      format.html
      format.js
    end
  end

  private
end