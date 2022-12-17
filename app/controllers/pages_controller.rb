class PagesController < ApplicationController
  respond_to :html

  def index
  end

  def legwork
  end

  def silesoleil
  end

  def premium
    # @plans = get_plans
    redirect_to pricing_path
  end

  def contact
  end

  def about
  end

  def terms
  end

  def upgrade
  end

  def main
    check_default_favorite
  end

  def freebies
    if !helpers.freebies_for_selected_country
      flash[:alert] = "You are not allowed to visit this page."
      redirect_to root_url
    end
  end

  private 

  def get_plans
    # @stripe_list = Stripe::Plan.all
    @stripe_list = Stripe::Price.list({type: :one_time})
    @stripe_list[:data].reject { |i| i.transform_quantity == nil }.sort_by { |x| x['unit_amount'] }
    # @stripe_list[:data].reject { |i| i.transform_usage == nil }.sort_by { |x| x['amount'] }
  end

  def check_default_favorite
    if !user_signed_in?
      ip_address = request.remote_ip
      favorites = Favorite.where(last_pick_color_in_ip: ip_address) rescue []
      Favorite.set_up_default_favorite(favorites, ip_address)
    end
  end
end