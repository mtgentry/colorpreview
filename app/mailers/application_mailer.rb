# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: "#{I18n.t('website_config.default_from_name')} <#{I18n.t('website_config.default_from_email')}>"
end
