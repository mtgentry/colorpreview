# frozen_string_literal: true

class PaymentSessionController < ApplicationController
  def checkout
    if current_user
      @user = current_user
    else
      set_up_user_attributes
      if @user.save
        @user.set_up_default_favorite
        fav = Favorite.where(last_pick_color_in_ip: request.remote_ip)
        @user.favorites += fav if fav.present?
      else
        flash[:notice] = @user.errors.full_messages.to_sentence
        render js: "window.location.replace('#{payment_info_path(plan_id: params[:plan_id])}');"
        return
      end
    end

    # domain_path = if Rails.env.eql?("production")
    #   I18n.t('website_config.website_address')
    # else
    #   'http://localhost:3000/'
    # end

    # discounts = [{}]
    # cancel = ""
    # if session[:promo_code]
    #   discounts[0][:coupon] = session[:promo_code]
    #   cancel = "?promo="+session[:promo_code]
    # end
    # allow_promotion_code = true if !session[:promo_code].present?

    # success_url, cancel_url = [domain_path+'success', domain_path+'cancel'+cancel]

    # puts session[:promo_code]
    # session = Stripe::Checkout::Session.create({
    #   customer_email: @user.email,
    #   payment_method_types: ['card'],
    #   line_items: [{
    #     price: params[:plan_id],
    #     quantity: 1,
    #   }],
    #   mode: :payment,
    #   allow_promotion_codes: allow_promotion_code,
    #   discounts: discounts,
    #   success_url: success_url,
    #   cancel_url: cancel_url
    # })

    if current_user
      puts 'logged in'
      render json: { id: session.id }
    else
      puts 'logged out'
      sign_in(@user)

      render js: "$('#btn-buy-now').attr('data-sessionid', '#{session.id}');$('#btn-buy-now').click();"
    end
  end

  def checkout_webhook
    # line_items = Stripe::Checkout::Session.retrieve({id: params["data"]["object"]["id"], expand: ['line_items']})
    user = User.find_by(email: params[:email]) || current_user
    _customer = user.get_stripe_customer(params[:payment_id])
    payment = PaymentSession.find_or_initialize_by(stripe_payment_intent_id: params[:payment_id])
    notice = false

    if payment.new_record? && user
      plan = Stripe::Price.retrieve(params[:plan_id])
      plan_data = plan.to_h
      plan_data[:metadata] = plan.metadata.to_h
      plan_data[:transform_quantity] = plan.transform_quantity.to_h

      coupon = Stripe::Coupon.retrieve(params[:coupon]) if params[:coupon] && !params[:coupon].eql?('')
      paid_amount = params[:amount].to_i.eql?(0) ? params[:price].to_i : params[:amount].to_i

      payment.user_id = user.id
      payment.plan_data = plan_data
      payment.coupon = coupon.to_h
      payment.coupon_amount = params[:price].to_i - paid_amount
      payment.amount = params[:amount].to_i
      payment.state = 1

      if payment.save
        payment.generate_licenses
        sign_in(user) unless current_user
        notice = true
        SubscriptionsMailer.payment_completed(user).deliver_now
        SubscriptionsMailer.new_paid_user(user).deliver_later(wait: 1.hour)
      end
    end

    if notice
      flash[:notice] = 'Payment accepted.'
      result_url = success_path
    else
      flash[:alert] = 'Payment failed, please try again.'
      result_url = payment_info_path(plan_id: params[:plan_id])
    end

    redirect_to result_url
  end

  def success
    session[:promo_code] = nil
  end

  # def cancel
  #   flash[:alert] = 'Payment failed, please try again.'
  #   pricing_data = if params[:promo].present?
  #                    pricing_path(promo: params[:promo])
  #                  else
  #                    pricing_path
  #                  end

  #   redirect_to pricing_data
  # end

  def calculate_order_amount(item)
    item['amount'].to_i
  end

  def create_payment_intent
    data = JSON.parse(request.body.read)

    payment_intent = Stripe::PaymentIntent.create(
      amount: calculate_order_amount(data),
      currency: 'usd'
    )

    result = {
      clientSecret: payment_intent['client_secret'],
    }

    render json: result
  end

  private

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
