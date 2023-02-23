# frozen_string_literal: true

class FavoritesController < ApplicationController
  def index
    @favorites       = Favorite.with_ip_address(request.remote_ip).order(index: :asc)
    @shared          = SharedFavorite.get_shared_favorite(request.remote_ip)&.favorites&.ids || []
    @shared_favorite = SharedFavorite.find_by(ip_address: request.remote_ip) || []

    @all_check            = @favorites.size.eql?(@shared.size)
    @favorites_with_index = @favorites.map { |fav| { idx: fav.index, favorite: fav } }
  end

  def show
    @shared_favorite = SharedFavorite.find_by(link: params[:id])
    @favorites       = @shared_favorite&.favorites&.order(index: :asc) || []
    @shared          = @favorites&.pluck(:id) || []

    @all_check            = @favorites.size.eql?(@shared.size)
    @favorites_with_index = @favorites.map { |fav| { idx: fav.index, favorite: fav } }
  end

  def create
    colors = params.permit!.slice(:color_1, :color_2, :color_3, :color_4).values
    colors.delete('undefined')

    favorite = Favorite.new(last_pick_color_in_ip: request.remote_ip, color: colors)
    if favorite.save
      render json: { message: 'This color succesfully saved on your favorite list' }
    else
      render json: { message: favorite.errors.full_messages }
    end
  end

  def destroy
    fave = Favorite.find_by(id: params[:id])

    if fave&.destroy
      render json: { response: true, notice: 'Unfavorited succesfully' }
    else
      render json: { response: false, alert: fave&.errors&.full_messages&.to_sentence }
    end
  end

  def update_index_favorite
    favorite = params[:favorite]
    element1 = Favorite.find(favorite[:id1]) if favorite[:id1].present?
    message  = []
    notice   = []

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
