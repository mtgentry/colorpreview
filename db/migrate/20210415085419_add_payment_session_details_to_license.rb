class AddPaymentSessionDetailsToLicense < ActiveRecord::Migration[5.2]
  def change
  	add_reference :licenses, :payment_session, foreign_key: true
  end
end
