# frozen_string_literal: true

class SubscriptionsMailer < ApplicationMailer
  def payment_completed(user)
    @user = user
    mail to: user.email, subject: "#{I18n.t('website_config.app_name')} License Keys"
  end

  def new_paid_user(user)
    @user = user
    mail to: user.email, subject: "How can I improve #{I18n.t('website_config.app_name')}?"
  end
end
