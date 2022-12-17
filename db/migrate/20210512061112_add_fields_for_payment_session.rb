class AddFieldsForPaymentSession < ActiveRecord::Migration[5.2]
  def change
  	add_column :payment_sessions, :amount, :integer, default: 0
  	add_column :payment_sessions, :coupon_amount, :integer, default: 0
  	add_column :payment_sessions, :coupon, :jsonb, default: {}
  end
end
