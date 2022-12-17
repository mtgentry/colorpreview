class RemoveColumnsFromColors < ActiveRecord::Migration[5.2]
  def change
    remove_column :colors, :background
    remove_column :colors, :color_1
    remove_column :colors, :color_2
    remove_column :colors, :color_3
  end
end
