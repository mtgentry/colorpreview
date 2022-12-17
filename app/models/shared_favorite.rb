class SharedFavorite < ApplicationRecord
  belongs_to :user, optional: true
  has_and_belongs_to_many :favorites

  scope :get_non_user_shared_favorites,   -> (ip_address){ where(ip_address: ip_address) }
  scope :get_user_shared_favorites,       -> (user_id){ where(user_id: user_id) }

  before_save :check_unique_link, if: :link_changed?

  def check_unique_link
		loop do
			self.link = SecureRandom.alphanumeric(10)
			break unless SharedFavorite.all.map(&:link).include?(self.link)
		end
  end

  class << self
    def get_shared_favorite(ip_address)
      self.get_non_user_shared_favorites(ip_address).last      
    end

    def get_all_shared_favorite_today(ip_address = nil, user_id = nil)
    	shared_favorites = []
	  	shared_favorites = if user_id.present?
		  	self.get_user_shared_favorites(user_id).select{|sf| sf if sf.created_at.try(:to_date) == Date.today }
		  elsif ip_address.present?
		  	self.get_non_user_shared_favorites(ip_address).select{|sf| sf if sf.created_at.try(:to_date) == Date.today }
		  end
		  return shared_favorites
    end

	  def is_already_generate_link_today?(ip_address = nil, user_id = nil)
	  	return self.get_all_shared_favorite_today(ip_address, user_id).present?
	  end

	  def get_existing_favorite(ip_address = nil, user_id = nil, colors)
	  	# to check existing favorite
	  	shared_favorites = self.get_all_shared_favorite_today(ip_address, user_id)

		  shared_favorites.each do |sf|
			  values = []
		  	if sf.favorites.count == colors.count
			  	sf.favorites.each do |f|
			  		values << colors.include?(f.color)
			  	end
			  	return sf if values.all?(true)
			  end
		  end
		  return nil
	  end
  end
end
