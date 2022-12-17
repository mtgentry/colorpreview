class License < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :subscription, optional: true
  belongs_to :payment_session, optional: true

  default_scope { order('created_at ASC') }

  def generate_key
    loop do 
      self.key = SecureRandom.hex(4)[0...7].upcase
      break if License.where(key: self.key).count == 0
    end
  end

  def is_activated?
    !!self.user 
  end
end
