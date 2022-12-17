class CreatePaymentAttempts < ActiveRecord::Migration[5.2]
  def change
    create_table :payment_attempts do |t|
      t.string :email
      t.string :code
      t.string :type_error
      t.string :message
      t.timestamps
    end
  end
end
