class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  # mount_uploader :avatar, AvatarUploader
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  #validates :first_name, :last_name, presence: true
  #callbacks

  enum language: [:en, :jp]
  enum currency: [:usd, :yen]

  AVAILABLE_CURRENCY = [:usd, :yen]

  has_many :user_colors, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :colors, -> { includes(:user_colors).order('position') }, through: :user_colors
  has_one :subscription, -> { includes(:licenses) }, dependent: :destroy
  has_one :license, -> { includes(:subscription) }, dependent: :destroy
  has_one :payed_license, -> {includes(:subscription)}, class_name: 'License', dependent: :destroy
  has_many :shared_favorites
  has_many :payment_sessions
  has_many :visits, class_name: "Ahoy::Visit"
  has_many :events, class_name: "Ahoy::Event"

  after_create :set_default_colors, :create_favorites

  def get_shared_favorite
    SharedFavorite.where(user_id: self.id).last
  end

  def set_up_default_favorite
    default_favorite = self.favorites.new
    default_favorite.color = ["#f74703", "#e9eb2e", "#50b490", "#2e5ec0"]
    default_favorite.index = 1
    default_favorite.save
  end

  def full_name
    self.first_name + " " + self.last_name if self.first_name.present? && self.last_name.present?
  end

  def subscribe(plan_id, token, coupon)
    coupon = nil if coupon.eql?('undefined')
    stripe_subscription = SubscriptionService.new({
      email:   email,
      plan_id: plan_id,
      token:   token,
      customer_id: self.stripe_customer,
      coupon: coupon
    }).create_subscription
    if stripe_subscription
      subscription = Subscription.find_or_create_by(stripe_subscription_id: stripe_subscription.id)
      subscription.upsert_subscrption_for(self,stripe_subscription)
      self.update(stripe_customer: stripe_subscription.customer)
    end
  end

  def is_payed?
    !!self.try(:license).try(:subscription).try(:is_active?)
  end

  def is_buyer?
    self.try(:license).try(:payment_session).present?
  end

  def buy_plan?
    self.payment_sessions.present?
  end

  def plan_name
    if self.is_payed?
      s = self.license.subscription
      begin
        s.plan_data["nickname"] + " — $" +(s.plan_data["amount"] / 100).to_s + "/year"
      rescue
        s.plan_data["nickname"] + " — $" +(s.plan_data["unit_amount"] / 100).to_s + "/year"
      end
    elsif self.is_buyer? || buy_plan?
      d = self.is_buyer? ? self.license.payment_session : self.payment_sessions.last
      d.plan_data['nickname'] + " — $ " +(d.plan_data["unit_amount"] / 100).to_s + "/ " + d.plan_data["transform_quantity"]["divide_by"].to_s + " Licenses"
    else
      I18n.t("account.free_account")
    end
  end

  def is_org_admin?
    !!self.subscription
  end

  def is_org_member?
    !self.subscription
  end

  def org_admin
    self.license.subscription.user
  end

  def is_org_admin_ps?
    !!(self.payment_sessions.last)
  end

  def is_org_member_ps?
    !self.payment_sessions.last
  end

  def org_admin_ps
    self.license.payment_session.user
  end
  
  def cancel_subscription
    if SubscriptionService.new({subscription_id: self.subscription.stripe_subscription_id}).delete_subscription
      self.subscription.destroy
      self.set_default_colors()
    end
  end

  def update_subscription(plan_id)
    stripe_subscription = SubscriptionService.new({
      plan_id: plan_id,
      subscription_id: self.subscription.stripe_subscription_id}
      ).update_subscription
    if stripe_subscription
      self.subscription.upsert_subscrption_for(self,stripe_subscription)
    end
  end

  def activate_license(license)
    if license && !license.try(:user).try(:id)
      license.user = self
      license.save()
      if license.payment_session
        user = self
        user.fav_limit = 100
        if !license.payment_session.plan_data['transform_quantity']['divide_by'].eql?(2)
          active_others_color 
          user.fav_limit = 9999
        end
        user.save
      elsif license.subscription
        cond = begin 
          !license.subscription.plan_data['transform_usage']['divide_by'].eql?(2)
        rescue
          !license.subscription.plan_data['transform_quantity']['divide_by'].eql?(2)
        end
        
        active_others_color if cond
      end
      true
    else
      false
    end
  end

  def active_others_color
    selected_colors = colors.all
    other_colors = Color.all - selected_colors
    
    other_colors.each do |other_color|
      UserColor.create({ user_id: self.id, color_id: other_color.id})
    end
  end

  def set_default_colors
    colors = Color.where(default: true)
    self.colors = colors
    self.save()
  end

  def set_favorites_from_cookie(favorites_color)
    return if favorites_color.blank?
    JSON.parse(favorites_color).each_with_index do |fav, index|
      if !fav.blank?
        self.favorites.create(color: fav['colors'] || fav[:colors], index: index + 1)
      end
    end
  end

  def favorites_limit
    return self.favorites.count >= self.fav_limit
  end

  def set_user_as_admin_analytic
    user = self
    user.analytic_admin = true
    user.save
  end

  def create_favorites
    shared = SharedFavorite.find_by(ip_address: self.last_sign_in_ip.to_s)
    favorites = shared.favorites rescue []

    if !shared.blank?
      shared.update_columns(user_id: self.id, ip_address: nil)

      if !favorites.blank?
        favorites.each do |favorite|
          favorite.update_columns(user_id: self.id, last_pick_color_in_ip: nil)
        end
      end
    end
  end

  def get_stripe_customer(payment_intent_id)
    user = self

    if stripe_customer.blank?
      customer = Stripe::Customer.create({email: email, description: "One Time Payment for #{email}"})
      user.stripe_customer = customer.id
      user.save
    end

    # Attach Customer to Payment Intent (One Time Payment)
    Stripe::PaymentIntent.update(payment_intent_id,{customer: user.stripe_customer})

    user.stripe_customer
  end
end