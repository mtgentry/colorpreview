class SubscriptionsMailer < ApplicationMailer

  def payment_completed(user)
    @user     = user
    mail :to => user.email, :subject => "Color Supply License Keys"
  end

  def new_paid_user(user)
    @user     = user
    mail :to => user.email, :subject => "How can I improve Color Supply?"
  end

end