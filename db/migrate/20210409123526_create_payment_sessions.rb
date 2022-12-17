class CreatePaymentSessions < ActiveRecord::Migration[5.2]
  def change
    create_table :payment_sessions do |t|
      t.references :user, foreign_key: true
      t.jsonb :plan_data, default: {}
      t.string :stripe_checkout_session_id
      t.string :stripe_payment_intent_id
      t.string :stripe_event_id
      t.integer :state, default: 0

      t.timestamps
    end
  end
end
