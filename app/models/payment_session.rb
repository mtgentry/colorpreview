class PaymentSession < ApplicationRecord
  enum state: [ :created, :paid ]

  belongs_to :user
  has_many :licenses


  def generate_licenses
    Array.new(self.plan_data['transform_quantity']['divide_by'].to_i).each_with_index do |_, i|      
      license = License.new(payment_session: self)
      license.generate_key()
      license.save()
    end
  end
end
