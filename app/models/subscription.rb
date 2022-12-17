class Subscription < ApplicationRecord
  belongs_to :user
  has_many :licenses, dependent: :destroy 

  before_create :set_defaults
  after_create :generate_licenses
  after_update :update_licenses
  # Important, cancel Stripe subscription before delete the record
  before_destroy :cancel_subscription

  def set_defaults
    self.last_payment ||= Time.now
  end

  def is_active?
    if subscribed_till
     subscribed_till > Time.now 
    else
      false 
    end
  end

  def upsert_subscrption_for(user, stripe_subscription)
    self.update_attributes(
      name: stripe_subscription.plan.id,
      plan_data: stripe_subscription.plan,
      last_payment: DateTime.strptime(stripe_subscription.current_period_start.to_s,'%s'),
      subscribed_till: DateTime.strptime(stripe_subscription.current_period_end.to_s,'%s'),
      license_count: stripe_subscription.plan.transform_usage ? stripe_subscription.plan.transform_usage['divide_by'] : 2,
      user_id: user.id
    )
  end

  def cancel_subscription
    if SubscriptionService.new({subscription_id: self.stripe_subscription_id}).delete_subscription
      return true
    else
      return false 
    end
  end

  def generate_licenses
    Array.new(self.license_count.to_i).each_with_index do |_, i|      
      license = License.new(subscription: self)
      license.generate_key()
      license.save()
    end
  end

  def update_licenses
    current_license_count = self.licenses.count
    new_license_count = self.license_count.to_i
    if current_license_count <= new_license_count
      Array.new(new_license_count - current_license_count).each_with_index do |_, i|      
        license = License.new(subscription: self)
        license.generate_key()
        license.save()
      end
    else
      self.licenses.offset(new_license_count).destroy_all
    end 
  end
end