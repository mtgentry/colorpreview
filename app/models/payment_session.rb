# frozen_string_literal: true

class PaymentSession < ApplicationRecord
  enum state: %i[created paid]

  belongs_to :user
  has_many :licenses

  def generate_licenses
    Array.new(plan_data['transform_quantity']['divide_by'].to_i).each_with_index do |_, _i|
      license = License.new(payment_session: self)
      license.generate_key
      license.save
    end
  end
end
