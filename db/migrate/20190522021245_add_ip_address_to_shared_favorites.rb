class AddIpAddressToSharedFavorites < ActiveRecord::Migration[5.2]
  def change
    add_column :shared_favorites, :ip_address, :string
  end
end
