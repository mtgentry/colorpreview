class CreateSharedFavorite < ActiveRecord::Migration[5.2]
  def change
    create_table :shared_favorites do |t|
      t.string :link
      t.belongs_to :user  
      t.timestamps
    end
 
    create_table :favorites_shared_favorites, id: false do |t|
      t.belongs_to :shared_favorite, index: true
      t.belongs_to :favorite, index: true
    end
  end
end
