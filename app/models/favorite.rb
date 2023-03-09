# frozen_string_literal: true

class Favorite < ApplicationRecord
  belongs_to :user, optional: true
  has_and_belongs_to_many :shared_favorites

  scope :with_ip_address, ->(ip_address = nil){ where(last_pick_color_in_ip: ip_address).order(index: :asc) }

  serialize :color, Array

  validates_with Validators::FavoriteValidator

  before_save :fill_index
  before_update :set_ip_nil

  def set_ip_nil
    self.last_pick_color_in_ip = nil if user_id_was.blank? && user_id.present? && last_pick_color_in_ip_was.present?
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

  private

  def fill_index
    return index if !new_record? && index.present?

    # limit         = 50
    favorites       = self.class.with_ip_address(last_pick_color_in_ip)
    limit           = favorites.count
    available_index = (1..limit).to_a - favorites.pluck(:index)
    self.index      = available_index.take(1)[0] || limit + 1
  end
end
