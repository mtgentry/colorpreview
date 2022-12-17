class AddDefaultToColors < ActiveRecord::Migration[5.2]
  def change
    add_column :colors, :default, :boolean, default: false
  end
end


