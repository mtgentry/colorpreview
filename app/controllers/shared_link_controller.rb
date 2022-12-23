# frozen_string_literal: true

class SharedLinkController < ApplicationController
  def show
    check_shared_title
    @shared_favorite = SharedFavorite.find_by(link: params[:id])
    @shared    = @shared_favorite&.favorites&.map(&:id) || []
    @favorites = @shared_favorite&.favorites
    @favorites = Favorite.where(last_pick_color_in_ip: @shared_favorite.ip_address) if @favorites.blank?
    @blank     = (50 - @favorites.count)
    @all_check = @favorites.size.eql?(@shared.size)
    @user = @shared_favorite.user if user_signed_in?

    @favorites_with_index = []
    fav_data = []
    fav_nil = []

    (1..50).each do |idx|
      favorite = @favorites.select { |f| f if f.index == idx }.sort

      fav_data << { idx: idx, favorite: favorite.first } if favorite.present?
      fav_nil << nil unless favorite.present?
      @favorites_with_index = fav_data + fav_nil
    end
  end

  def update_title
    shared = SharedFavorite.find_by(link: params[:shared_link][:link])

    respond_to do |format|
      if shared.update(shared_params)
        format.json { render json: shared }
      else
        format.json { render json: shared.errors.messages, status: 404}
      end
    end
  end

  def check_shared_title
    shared = SharedFavorite.find_by(link: params[:id])

    return unless shared.present?

    title = shared.try(:title)
    shared.update(title: 'Untitled') unless title.present?
  end

  private

  def shared_params
    params.require(:shared_link).permit(:title, :link)
  end
end
