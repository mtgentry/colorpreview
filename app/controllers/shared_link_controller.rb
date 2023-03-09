# frozen_string_literal: true

class SharedLinkController < ApplicationController
  def show
    check_shared_title
    @shared_favorite = SharedFavorite.find_by(link: params[:id])
    @favorites       = @shared_favorite&.favorites&.order(index: :asc) || []
    @shared          = @favorites&.pluck(:id) || []

    @all_check            = @favorites.size.eql?(@shared.size)
    @favorites_with_index = @favorites.map { |fav| { idx: fav.index, favorite: fav } }
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
