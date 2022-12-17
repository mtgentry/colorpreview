class SubscriptionsController < ApplicationController
  require "stripe"

  before_action :validate_user_paid_plan, only: [:index, :payment_info]

  def index
    session[:promo_code] = params[:promo].eql?("vDOLkivN") ? params[:promo] : nil
    @plans = get_plans if @cond
  end

  def free
    @stripe_list = Stripe::Plan.all
    @plans = @stripe_list[:data].reverse.reject { |i| i.transform_usage != nil }
  end

  def create
    if current_user.present? && current_user.subscription.present?
      flash[:notice] = "You already subscribed"
      render js: "window.location.replace('#{account_index_path}');"
      return
    end
    subscription = params[:subscription]

    if subscription.present?
      if current_user
        @user = current_user
      else
        set_up_user_attributes
        if @user.save
          @user.set_up_default_favorite
          sign_in(@user)
          @user = @user
          fav = Favorite.where(last_pick_color_in_ip: request.remote_ip)

          if fav.present?
            @user.favorites += fav
          end
        else
          flash[:notice] = @user.errors.full_messages.to_sentence
          render js: "window.location.replace('#{payment_info_path(plan_id: subscription[:plan_id])}');"
          return
        end
      end
      @user.subscribe(subscription[:plan_id], subscription[:stripeToken], subscription[:coupon])
      SubscriptionsMailer.payment_completed(@user).deliver_now

      flash[:notice] = "Successfully created a subscription"
      render js: "window.location.replace('#{thank_you_subscriptions_path}');"
    else
      render :payment_info
    end
  end

  def destroy
    subscription = Subscription.find(params[:id])
    if subscription && current_user.id == subscription.user.id && current_user.cancel_subscription
      current_user.update(close_alert_active: true)
      flash[:notice] = "Successfully canceled the subscription"
    else
      flash[:notice] = "Can't cancel the subscription"
    end
    redirect_to account_index_path
  end

  def edit
    @plans = get_plans
  end

  def update
    plan_id = params[:plan_id]
    current_user.update_subscription(plan_id)
    flash[:notice] = "Successfully updated a subscription"
    redirect_to account_index_path
  end

  def update_card
    SubscriptionService.new(token: params['stripeToken'], customer_id: current_user.stripe_customer).update_card
    flash[:notice] = "Card number has been updated"
    redirect_to :back
  end

  def final_step
  end

  def keys
    if !current_user.is_org_admin? 
      flash[:notice] = "You haven't subscribed yet"
      redirect_to account_index_path
    end
    @licenses = current_user.subscription.licenses
  end

  def payment_info
    if params[:plan_id].present?
      if STRIPEPLANS[params[:plan_id]]
        params[:plan_id] = STRIPEPLANS[params[:plan_id]]
      end 

      if NEWSTRIPEPLANS[params[:plan_id]]
        params[:plan_id] = NEWSTRIPEPLANS[params[:plan_id]]
      end
          
      # @plan = Stripe::Plan.retrieve(params[:plan_id])
      begin 
        @plan = Stripe::Price.retrieve(params[:plan_id])

        if current_user
          @subscription = current_user.subscription.present? ? current_user.subscription : Subscription.new(user: current_user)
        else
          @subscription = Subscription.new
        end
      rescue
        flash[:notice] = "We didn't found your plan, please choose a plan."
        redirect_to pricing_path
      end
    else
      flash[:notice] = "You haven't chosen plan yet"
      redirect_to pricing_path
    end
  end

  private 

  def validate_user_paid_plan
    @cond = if current_user.present? && !(current_user.subscription.present?) && !(current_user.payment_sessions.present?)
      current_user.is_buyer? ? false : true
    else
      !current_user.present? ? true : false
    end

    if !@cond
      redirect_to account_index_path 
      flash[:notice] = "You already paid a plan."
    end
  end

  def get_plans
    # @stripe_list = Stripe::Plan.all
    @stripe_list = Stripe::Price.list({type: :one_time, active: true})
    @stripe_list[:data].reject { |i| i.transform_quantity == nil }.sort_by { |x| x['unit_amount'] }
  end

  def set_up_user_attributes
    user_attributes = params[:user_attributes]
    @user = User.new(
      # first_name: user_attributes[:first_name],
      # last_name: user_attributes[:last_name],
      email: user_attributes[:email],
      password: user_attributes[:password],
      last_sign_in_ip: request.remote_ip
      # password_confirmation: user_attributes[:confirm_password]
    )
  end

end