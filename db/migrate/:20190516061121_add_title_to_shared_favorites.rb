class AddTitleToSharedFavorites < ActiveRecord::Migration[5.2]
  def change
    add_column :shared_favorites, :title, :string
  end
end