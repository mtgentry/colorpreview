class CreateSubscriptions < ActiveRecord::Migration[5.2]
  def change
    create_table :subscriptions do |t|
      t.string :name
      t.references :user, foreign_key: true
      t.datetime :last_payment
      t.string :stripe_subscription_id
      t.datetime :subscribed_till
      t.integer :license_count

      t.timestamps
    end
  end
end
