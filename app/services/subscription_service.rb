require 'stripe'

class SubscriptionService
  def initialize(params)
    @email   = params[:email]
    @plan_id = params[:plan_id]
    @token   = params[:token]
    @subscription_id  = params[:subscription_id]
    @customer_id      = params[:customer_id]
    @coupon      = params[:coupon]
  end

  def create_subscription
    begin
      plan     = retrive_plan
      if @customer_id
        customer = retrive_customer
      else
        customer = create_customer
      end
      customer.subscriptions.create(:plan => plan.id, :coupon => @coupon)
    rescue
      false
    end
  end

  def update_card
    begin
      customer        = retrive_customer
      customer.source = @token
      customer.save()
    rescue
      false
    end
  end

  def create_customer
    Stripe::Customer.create(customer_attributes)
  end

  def delete_subscription
    begin
      subscription = retrive_subscription
      subscription.delete
    rescue
      false
    end
  end

  def update_subscription
    begin
      subscription = retrive_subscription
      plan         = retrive_plan
      subscription.plan = plan.id
      subscription.save
      subscription
    rescue
      false
    end
  end

  def charge_list
    if @customer_id.blank?
      subscription = retrive_subscription
      @customer_id = subscription.customer
    end
    retrive_charges
  end

  def retrive_customer
    Stripe::Customer.retrieve(@customer_id)
  end

  private

  attr_reader :plan_id, :token, :email, :subscription_id, :customer_id

  def retrive_plan
    Stripe::Plan.retrieve(plan_id)
  end

  def retrive_subscription
    Stripe::Subscription.retrieve(subscription_id)
  end

  def retrive_charges
    Stripe::Charge.list(:customer => customer_id).data
  end

  def customer_attributes
    {email: email,source: token, description: "Subscription for #{email}"}
  end
end
