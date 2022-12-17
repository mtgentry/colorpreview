class AddFieldsToUser < ActiveRecord::Migration[5.2]
  def change
  	add_column :users, :date_click_modal, :datetime
  	add_column :users, :click_modal, :boolean, default: false
  end
end