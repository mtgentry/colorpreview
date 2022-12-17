class CreateLicenses < ActiveRecord::Migration[5.2]
  def change
    create_table :licenses do |t|
      t.references :user, foreign_key: true
      t.references :subscription, foreign_key: true
      t.string :key

      t.timestamps
    end
  end
end
