class AddFavoriteLimitToUsers < ActiveRecord::Migration[5.2]
  def change
  	add_column :users, :fav_limit, :integer, default: 50
  end
end
