class SharedLinkController < ApplicationController
  
  def show
    check_shared_title
    @shared_favorite = SharedFavorite.find_by(link: params[:id])
    @shared     = @shared_favorite.favorites.map(&:id) rescue []
    @favorites  = @shared_favorite.favorites rescue []
    @blank      = (50 - @favorites.count)
    @all_check  = @favorites.size.eql?(@shared.size)
    @user = @shared_favorite.user if user_signed_in?

    @favorites_with_index = []
    fav_data, fav_nil     = [], []
    (1..50).each_with_index do |idx|
      favorite = @favorites.select{|f| f if f.index == idx}.sort

      if favorite.present?
        fav_data << {idx: idx, favorite: favorite.first}
      else
        fav_nil << nil
      end

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

    if shared.present?
      title = shared.try(:title)
      unless title.present?
        shared.update(title: "Untitled")
      end
    end
  end

  private
  def shared_params
    params.require(:shared_link).permit(:title, :link)
  end

end
