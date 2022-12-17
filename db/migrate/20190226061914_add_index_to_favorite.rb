class AddIndexToFavorite < ActiveRecord::Migration[5.2]
  def change
    add_column :favorites, :index, :integer
  end
end
