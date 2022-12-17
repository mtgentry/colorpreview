# frozen_string_literal: true

class Favorite < ApplicationRecord
  belongs_to :user, optional: true
  has_and_belongs_to_many :shared_favorites

  serialize :color, Array

  before_update :set_ip_nil

  def set_ip_nil
    if user_id_was.blank? && user_id.present? && last_pick_color_in_ip_was.present?
      self.last_pick_color_in_ip = nil
    end
  end

  class << self
    def set_up_default_favorite(favorites, ip_address)
      return unless favorites.present?

      default_favorite = Favorite.new
      default_favorite.last_pick_color_in_ip = ip_address
      default_favorite.color = %w[#f74703 #e9eb2e #50b490 #2e5ec0]
      default_favorite.index = 1
      default_favorite.save
    end
  end
end
