# frozen_string_literal: true

class SharedFavorite < ApplicationRecord
  belongs_to :user, optional: true
  has_and_belongs_to_many :favorites

  scope :get_non_user_shared_favorites, ->(ip_address) { where(ip_address: ip_address) }
  scope :get_user_shared_favorites,     ->(user_id) { where(user_id: user_id) }

  before_save :check_unique_link, if: :link_changed?

  def check_unique_link
    loop do
      self.link = SecureRandom.alphanumeric(10)
      break unless SharedFavorite.all.map(&:link).include?(link)
    end
  end

  class << self
    def get_shared_favorite(ip_address)
      get_non_user_shared_favorites(ip_address).last
    end

    def get_all_shared_favorite_today(ip_address = nil, user_id = nil)
      if user_id.present?
        get_user_shared_favorites(user_id).select { |sf| sf if sf.created_at.try(:to_date) == Date.today }
      elsif ip_address.present?
        get_non_user_shared_favorites(ip_address).select { |sf| sf if sf.created_at.try(:to_date) == Date.today }
      else
        []
      end
    end

    def is_already_generate_link_today?(ip_address = nil, user_id = nil)
      get_all_shared_favorite_today(ip_address, user_id).present?
    end

    def get_existing_favorite(colors, ip_address = nil, user_id = nil)
      # to check existing favorite
      shared_favorites = get_all_shared_favorite_today(ip_address, user_id)

      shared_favorites.each do |sf|
        values = []
        next unless sf.favorites.count == colors.count

        sf.favorites.each do |f|
          values << colors.include?(f.color)
        end

        return sf if values.all?(true)
      end

      nil
    end
  end
end
