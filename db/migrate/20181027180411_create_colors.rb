class CreateColors < ActiveRecord::Migration[5.2]
  def change
    create_table :colors do |t|
      t.string :alias
      t.string :name
      t.string :background
      t.string :color_1
      t.string :color_2
      t.string :color_3

      t.timestamps
    end
  end
end
