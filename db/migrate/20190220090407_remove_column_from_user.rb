class RemoveColumnFromUser < ActiveRecord::Migration[5.2]
  def change
  	remove_column :users, :date_click_modal
  	remove_column :users, :click_modal
  end
end
