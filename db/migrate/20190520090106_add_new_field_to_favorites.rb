class AddNewFieldToFavorites < ActiveRecord::Migration[5.2]
  def change
  	add_column :favorites, :last_pick_color_in_ip, :string
  end
end
