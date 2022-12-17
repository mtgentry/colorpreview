# frozen_string_literal: true

class FavoritesController < ApplicationController
  def index
    if user_signed_in?
      @favorites = current_user&.favorites || []
      @shared = current_user&.get_shared_favorite&.favorites&.map(&:id) || []
      @shared_favorite = current_user&.get_shared_favorite || []
    else
      @favorites = Favorite.where(last_pick_color_in_ip: request.remote_ip) || []
      @shared = SharedFavorite.get_shared_favorite(request.remote_ip)&.favorites&.map(&:id) || []
      @shared_favorite = SharedFavorite.find_by(ip_address: request.remote_ip) || []
    end
    blank_total = (1..50)
    @blank = (50 - @favorites.count)

    @all_check = @favorites.size.eql?(@shared.size)

    @favorites_with_index = []
    blank_total.each do |idx|
      favorite = @favorites.select{|f| f if f.index == idx}.sort

      if favorite.count > 1
        favorite.each_with_index do |fav, idx|
          fav.delete unless (idx + 1) == 1
        end
      end

      fave = { idx: idx, favorite: favorite.first } if favorite.present?

      @favorites_with_index << fave
    end
  end

  def show
    shared_fav = SharedFavorite.find_by(link: params[:id])
    @favorites = shared_fav&.favorites || []
    @shared = @favorites&.map(&:id) || []
    @blank = (50 - @favorites.count)
    @all_check = @favorites.size.eql?(@shared.size)

    @favorites_with_index = []
    fav_data = []
    fav_nil = []
    (1..50).each do |idx|
      favorite = @favorites.select { |f| f if f.index == idx }.sort

      if favorite.present?
        fav_data << { idx: idx, favorite: favorite.first }
      else
        fav_nil << nil
      end

      @favorites_with_index = fav_data + fav_nil
    end
  end

  def create
    if user_signed_in?
      fav_limit = current_user.favorites_limit
      counter = current_user.fav_limit
    else
      fav = Favorite.where(last_pick_color_in_ip: request.remote_ip)
      counter = 50
      fav_limit = fav.count >= counter
    end

    if !fav_limit
      color_1 = params[:color_1]
      color_2 = params[:color_2]
      color_3 = params[:color_3]
      color_4 = params[:color_4]

      colors = []
      colors << color_1 unless color_1.eql?('undefined')
      colors << color_2 unless color_2.eql?('undefined')
      colors << color_3 unless color_3.eql?('undefined')
      colors << color_4 unless color_4.eql?('undefined')

      if user_signed_in?
        favorite  = Favorite.where(user: current_user, color: colors)
        favorites = current_user.favorites
      else
        favorite  = Favorite.where(last_pick_color_in_ip: request.remote_ip, color: colors)
        favorites = Favorite.where(last_pick_color_in_ip: request.remote_ip) || []
      end

      if !favorite.present?
        if favorites.map(&:index).include?(counter)
          (1..counter).each do |idx|
            index_exist = if user_signed_in?
                            Favorite.where(user: current_user).map(&:index).include?(idx)
                          else
                            Favorite.where(last_pick_color_in_ip: request.remote_ip).map(&:index).include?(idx)
                          end

            @index = idx

            break unless index_exist
          end
          _favorite = if user_signed_in?
                        Favorite.create(user: current_user, color: colors, index: @index)
                      else
                        Favorite.create(last_pick_color_in_ip: request.remote_ip, color: colors, index: @index)
                      end
        else
          favorites.each do |favo|
            favo.update(index: favo.index + 1)
          end
          _favorite = if user_signed_in?
                        Favorite.create(user: current_user, color: colors, index: 1)
                      else
                        Favorite.create(last_pick_color_in_ip: request.remote_ip, color: colors, index: 1)
                      end
        end

        # flash[:notice] = "This color succesfully saved on your favorite list"
        # render :js => "window.location = '/favorites'"
        render json: { message: 'This color succesfully saved on your favorite list' }
      else
        # flash[:notice] = "This color is already on your favorite list"
        # render :js => "window.location = '/favorites'"
        render json: { message: 'This color is already on your favorite list' }
      end
    else
      # flash[:notice] = "Your favorite list has reached the limit"
      # render :js => "window.location = '/favorites'"
      render json: { message: 'Your favorite list has reached the limit' }
    end
  end

  def destroy
    fave = Favorite.find_by(id: params[:id])

    if fave&.destroy
      flash = 'Unfavorite succesfully'
      render json: {response: true, notice: flash }
    else
      flash = @fave.errors.full_messages.to_sentence
      render json: {response: false, notice: flash }
    end
  end

  def update_index_favorite
    favorite = params[:favorite]
    element1 = Favorite.find(favorite[:id1]) if favorite[:id1].present?
    message = []
    notice = []

    if element1.present?
      if element1.update(index: favorite[:position1])
        notice << 'element1-updated'
        if favorite[:id2].present?
          element2 = Favorite.find(favorite[:id2])
          if element2.present?
            if element2.update(index: favorite[:position2])
              notice << 'element2-updated'
            else
              notice << 'element2-not-saved'
              message << element2.errors.full_messages.to_sentence
            end
          else
            notice << 'element2-ID-NotFound'
          end
        end
      else
        notice << 'element1-not-saved'
        message << element1.errors.full_messages.to_sentence
      end
    else
      notice << 'element1-ID-NotFound'
    end
    render json: { notice: notice.to_sentence, message: message.to_sentence }
  end
end
