# frozen_string_literal: true

class SharedFavoritesController < ApplicationController
  def create
    shared = current_user.try(:get_shared_favorite)
    shared = SharedFavorite.get_shared_favorite(request.remote_ip) unless user_signed_in?
    if shared.blank?
      shared = SharedFavorite.new
      shared.link = SecureRandom.alphanumeric(10)
      shared.user_id = current_user.id if user_signed_in?
      shared.ip_address = request.remote_ip unless user_signed_in?
    elsif shared.present? && shared.link.blank?
      shared.link = SecureRandom.alphanumeric(10)
    end
    # shared.save

    # params_colors = JSON.parse(cookies[:favorites])

    # params_colors.each do |col|
    #   if !col.blank?
    #     if !user_signed_in?
    #       ch = Favorite.find_by_color_and_last_pick_color_in_ip(col['colors'], request.remote_ip)
    #     else
    #       ch = Favorite.find_by_color_and_user_id(col['colors'], shared.user_id)
    #     end
    #     next if ch.present?
    #     @fav = Favorite.new
    #     @fav.color = col['colors']
    #     @fav.index = col['id']
    #     @fav.last_pick_color_in_ip = request.remote_ip unless user_signed_in?
    #     @fav.user_id = current_user.id if user_signed_in?
    #     @fav.save!
    #     shared.favorites << @fav if !@fav.blank?
    #   end
    # end

    respond_to do |format|
      if shared.save
        format.json { render json: shared }
      else
        format.json { render json: shared.errors.messages, status: 404}
      end
    end
  end

  def destroy; end

  def create_or_update_fav
    get_colors
    if SharedFavorite.is_already_generate_link_today?(request.remote_ip, current_user.try(:id))
      @shared = SharedFavorite.get_existing_favorite(@colors, request.remote_ip, current_user.try(:id))
      if @shared.blank?
        set_new_shared
      else
        @shared.link = SecureRandom.alphanumeric(10)
        @shared.save
      end
    else
      set_new_shared
    end
    respond_to do |format|
      format.json { render json: {link: @shared.link} }
    end
  end

  def create_fav
    get_colors
    if user_signed_in?
      @shared = current_user.shared_favorites.new
      @shared.user_id = current_user.id
    else
      @shared = SharedFavorite.new
      @shared.ip_address = request.remote_ip
    end
    @shared.link = SecureRandom.alphanumeric(10)
    @shared.favorites = @favorites
    # @shared.title = SharedFavorite.set_title(@colors, current_user.try(:id), request.remote_ip)
    @shared.save
    respond_to do |format|
      format.json { render json: {link: @shared.link} }
    end
  end

  def add_fav
    if user_signed_in?
      shared = current_user.shared_favorites.new
      shared.user_id = current_user.id
      shared.favorites = current_user.try(:get_shared_favorite).favorites
    else
      shared = SharedFavorite.new
      shared.ip_address = request.remote_ip
      shared.favorites = SharedFavorite.get_shared_favorite(request.remote_ip).favorites
    end

    shared.link = SecureRandom.alphanumeric(10)
    shared.save
    shared_favorites = shared.favorites

    if eval params[:all_record]
      favorite = current_user.favorites - shared_favorites if user_signed_in?
      favorite = Favorite.where(last_pick_color_in_ip: request.remote_ip) - shared_favorites unless user_signed_in?
      shared_favorites << favorite
    else
      favorite = Favorite.find(params[:favorite_id])
      shared_favorites << favorite unless shared_favorites.include?(favorite)
    end

    respond_to do |format|
      format.json { render json: {favorite: favorite, link: shared.link} }
    end
  end

  def remove_fav
    if user_signed_in?
      shared = current_user.shared_favorite.new
      shared.user_id = current_user.id
      shared.favorites = current_user.try(:get_shared_favorite).favorites
    else
      shared = SharedFavorite.new
      shared.ip_address = request.remote_ip
      shared.favorites = SharedFavorite.get_shared_favorite(request.remote_ip).favorites
    end

    shared.link = SecureRandom.alphanumeric(10)
    shared.save
    shared_favorites = shared.favorites

    if eval params[:all_record]
      current_user.get_shared_favorite.favorites = [] if user_signed_in?
      shared.favorites  = [] unless user_signed_in?
    else
      favorite = Favorite.find(params[:favorite_id])
      shared_favorites.delete(favorite) if shared_favorites.include?(favorite)
    end
    respond_to do |format|
      format.json { render json: {favorite: favorite, link: shared.link} }
    end
  end

  private

  def set_new_shared
    if user_signed_in?
      @shared = current_user.shared_favorites.new
      @shared.user_id = current_user.id
    else
      @shared = SharedFavorite.new
      @shared.ip_address = request.remote_ip
    end
    @shared.link = SecureRandom.alphanumeric(10)
    @shared.favorites = @favorites
    @shared.save
  end

  def get_colors
    @favorites = Favorite.where(id: params[:favorite_ids])
    @colors    = @favorites.map(&:color)
  end
end
