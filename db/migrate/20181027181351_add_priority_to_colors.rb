class AddPriorityToColors < ActiveRecord::Migration[5.2]
  def change
    add_column :colors, :priority, :integer, default: 1
  end
end
